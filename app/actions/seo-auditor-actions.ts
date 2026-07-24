"use server"

import { prisma } from "@/lib/db/prisma"
import { assertAdminAuthenticated } from "@/lib/auth/admin-session"
import { getSeoSettings } from "./seo-actions"
import { STATIC_OVERWRITES, getLocationSEO } from "@/lib/seo/locations-data"
import crypto from "crypto"

const GSC_CREDENTIALS_KEY = "seo_google_gsc_credentials"
const GSC_PROPERTY_KEY = "seo_google_gsc_property"

export interface SeoPageReport {
  url: string
  type: "Home" | "Blog" | "Service" | "Legal" | "Location"
  title: string
  description: string
  keywords: string[]
  wordCount: number
  h1Count: number
  hasAltTags: boolean
  hasCanonical: boolean
  seoScore: number
  checklist: {
    label: string
    passed: boolean
    impact: "high" | "medium" | "low"
    message: string
  }[]
}

export interface GscKeywordRank {
  keyword: string
  clicks: number
  impressions: number
  ctr: number
  position: number
  pageUrl: string
}

// Strip HTML tags and markdown to count words accurately
function countWords(text: string): number {
  if (!text) return 0
  const cleanText = text
    .replace(/<[^>]*>/g, " ") // Strip HTML
    .replace(/[#*`_\[\]()\-+]/g, " ") // Strip markdown characters
    .trim()
  return cleanText ? cleanText.split(/\s+/).length : 0
}

// Estimate H1 tags from content
function countH1s(content: string, title?: string): number {
  let count = 0
  if (!content) return 0
  
  // Look for HTML h1 tags
  const htmlH1Matches = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)
  if (htmlH1Matches) {
    count += htmlH1Matches.length
  }
  
  // Look for markdown H1 tags (# Heading)
  const markdownH1Matches = content.match(/^#\s+.+$/gm)
  if (markdownH1Matches) {
    count += markdownH1Matches.length
  }

  // If no H1 found in body but title is rendered as H1 at the top of the page
  if (count === 0 && title) {
    count = 1
  }
  return count
}

// Generate the SEO Score and Checklist for a page
function auditPage(
  url: string,
  type: SeoPageReport["type"],
  title: string,
  description: string,
  keywords: string[],
  contentBody: string,
  hasCanonical: boolean
): SeoPageReport {
  const wordCount = countWords(contentBody)
  const h1Count = countH1s(contentBody, title)
  
  // Image Alts checks (check if there are any markdown images without alt, e.g. `![]()`)
  const hasAltTags = !contentBody.includes("![](") && !contentBody.includes("img src=") // Basic check
  
  const checklist: SeoPageReport["checklist"] = []
  let score = 0

  // 1. Meta Title (Max 30 points)
  if (!title || title.toLowerCase() === "service not found" || title.toLowerCase() === "post not found") {
    checklist.push({
      label: "Meta Title Presence",
      passed: false,
      impact: "high",
      message: "The page is missing a meta title tag."
    })
  } else {
    const titleLen = title.length
    if (titleLen >= 50 && titleLen <= 65) {
      score += 30
      checklist.push({
        label: "Meta Title Optimal Length",
        passed: true,
        impact: "low",
        message: `Perfect! Meta title is ${titleLen} characters (target: 50-65).`
      })
    } else if (titleLen >= 30 && titleLen <= 80) {
      score += 15
      checklist.push({
        label: "Meta Title Length Alert",
        passed: false,
        impact: "medium",
        message: `Title length is ${titleLen} characters. Adjust to 50-65 for best display in search results.`
      })
    } else {
      checklist.push({
        label: "Meta Title Too Short/Long",
        passed: false,
        impact: "high",
        message: `Title is too ${titleLen < 30 ? "short" : "long"} (${titleLen} chars). Keep it between 50-65 characters.`
      })
    }
  }

  // 2. Meta Description (Max 30 points)
  if (!description) {
    checklist.push({
      label: "Meta Description Presence",
      passed: false,
      impact: "high",
      message: "The page lacks a meta description. Search engines will display auto-generated snippets."
    })
  } else {
    const descLen = description.length
    if (descLen >= 120 && descLen <= 160) {
      score += 30
      checklist.push({
        label: "Meta Description Optimal Length",
        passed: true,
        impact: "low",
        message: `Perfect! Meta description is ${descLen} characters (target: 120-160).`
      })
    } else if (descLen >= 80 && descLen <= 200) {
      score += 15
      checklist.push({
        label: "Meta Description Length Alert",
        passed: false,
        impact: "medium",
        message: `Description is ${descLen} characters. Refine to 120-160 characters to prevent truncation.`
      })
    } else {
      checklist.push({
        label: "Meta Description Too Short/Long",
        passed: false,
        impact: "high",
        message: `Description is too ${descLen < 80 ? "short" : "long"} (${descLen} chars). Adjust to 120-160 characters.`
      })
    }
  }

  // 3. Heading Structure (Max 15 points)
  if (h1Count === 1) {
    score += 15
    checklist.push({
      label: "Single H1 Tag",
      passed: true,
      impact: "low",
      message: "Page has exactly one H1 tag."
    })
  } else if (h1Count === 0) {
    checklist.push({
      label: "Missing H1 Tag",
      passed: false,
      impact: "high",
      message: "No H1 tag detected. Ensure there is one H1 for the page title."
    })
  } else {
    checklist.push({
      label: "Multiple H1 Tags",
      passed: false,
      impact: "medium",
      message: `Detected ${h1Count} H1 tags. Use only one H1 per page for proper outline structure.`
    })
  }

  // 4. Content Word Count (Max 15 points)
  const targetWordCount = type === "Blog" ? 800 : type === "Service" ? 400 : 250
  if (wordCount >= targetWordCount) {
    score += 15
    checklist.push({
      label: "Content Length",
      passed: true,
      impact: "low",
      message: `Excellent! Page has ${wordCount} words (minimum target is ${targetWordCount}).`
    })
  } else {
    const points = Math.max(0, Math.floor((wordCount / targetWordCount) * 15))
    score += points
    checklist.push({
      label: "Thin Content Alert",
      passed: false,
      impact: "medium",
      message: `Only ${wordCount} words found. Add more detailed content to meet the ${targetWordCount}-word threshold.`
    })
  }

  // 5. Keyword Density & Alt attributes (Max 10 points total: 5 pts keywords, 5 pts alt tags)
  // Check if primary keywords are in title or description
  const keywordsInMeta = keywords.some(
    (kw) =>
      (title && title.toLowerCase().includes(kw.toLowerCase())) ||
      (description && description.toLowerCase().includes(kw.toLowerCase()))
  )

  if (keywords.length === 0) {
    checklist.push({
      label: "Target Keywords Defined",
      passed: false,
      impact: "medium",
      message: "Define target keywords for this page to track optimized keyword rankings."
    })
  } else if (keywordsInMeta) {
    score += 5
    checklist.push({
      label: "Target Keywords in Metadata",
      passed: true,
      impact: "low",
      message: "Target keywords are present in your meta title or description."
    })
  } else {
    checklist.push({
      label: "Target Keywords Missing in Meta",
      passed: false,
      impact: "medium",
      message: "Include your primary target keywords inside the meta title or description."
    })
  }

  if (hasAltTags) {
    score += 5
    checklist.push({
      label: "Image Accessibility (Alt Attributes)",
      passed: true,
      impact: "low",
      message: "Images on this page have descriptive alt tag attributes."
    })
  } else {
    checklist.push({
      label: "Missing Image Alt Tags",
      passed: false,
      impact: "low",
      message: "Some image elements are missing alt text. Add alt tags for better image search indexing."
    })
  }

  // Canonical checklist item
  if (hasCanonical) {
    checklist.push({
      label: "Canonical Tag Set",
      passed: true,
      impact: "low",
      message: "Canonical URL tag is explicitly specified."
    })
  }

  return {
    url,
    type,
    title,
    description,
    keywords,
    wordCount,
    h1Count,
    hasAltTags,
    hasCanonical,
    seoScore: Math.min(100, score),
    checklist
  }
}

// Get the main public pages of the website and run dynamic SEO audits on them
export async function getSeoPagesList(): Promise<SeoPageReport[]> {
  try {
    const reports: SeoPageReport[] = []
    
    // 1. Fetch site global settings for Home page
    const seoSettings = await getSeoSettings()
    reports.push(
      auditPage(
        "/",
        "Home",
        seoSettings.metaTitle,
        seoSettings.metaDescription,
        seoSettings.metaKeywords ? seoSettings.metaKeywords.split(",").map((k) => k.trim()) : [],
        "OfinIT Solutions provides high-quality software, web, and AI development services. We focus on building modern web systems, mobile applications, and scalable deployment pipelines. Our solutions empower companies globally to optimize their digital presence.",
        true
      )
    )

    // 2. Fetch Blog posts
    const blogs = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" }
    })
    for (const post of blogs) {
      const keywords = Array.isArray(post.metaKeywords)
        ? (post.metaKeywords as string[])
        : typeof post.metaKeywords === "string"
        ? (post.metaKeywords as string).split(",").map((k) => k.trim())
        : []

      reports.push(
        auditPage(
          `/blog/${post.slug}`,
          "Blog",
          post.metaTitle || post.title,
          post.metaDescription || post.excerpt,
          keywords,
          post.content,
          !!post.canonicalUrl
        )
      )
    }

    // 3. Fetch Services
    const services = await prisma.service.findMany({
      where: { published: true }
    })
    for (const svc of services) {
      reports.push(
        auditPage(
          `/services/${svc.slug}`,
          "Service",
          `${svc.name} | OfinIT Services`,
          svc.shortDescription,
          [svc.name, "OfinIT", "software development"],
          svc.bodyMd,
          true
        )
      )
    }

    // 4. Fetch Legal / Public Pages
    const publicPages = await prisma.publicPage.findMany()
    const TITLE_BY_SLUG: Record<string, string> = {
      "privacy-policy": "Privacy Policy",
      "terms-of-service": "Terms of Service",
      "cookie-policy": "Cookie Policy",
      careers: "Careers",
    }
    
    for (const page of publicPages) {
      reports.push(
        auditPage(
          `/${page.slug}`,
          "Legal",
          page.title || TITLE_BY_SLUG[page.slug] || page.slug,
          `OfinIT ${page.title || TITLE_BY_SLUG[page.slug]} page detailing company rules, terms, and policies.`,
          [],
          page.bodyMd,
          true
        )
      )
    }

    // Load custom SEO overrides for locations
    const customSettingsRecord = await prisma.siteSetting.findUnique({
      where: { key: "location_custom_seo_settings" }
    })
    const overrides = (customSettingsRecord?.value as Record<string, any>) || {}

    // 5. Fetch representative locations (STATIC_OVERWRITES)
    for (const loc of STATIC_OVERWRITES.slice(0, 8)) {
      const url = `/locations/${loc.slug}`
      const locSEO = getLocationSEO(loc.slug)
      
      const defaultTitle = locSEO?.title || `${loc.name} Web Development Services`
      const defaultDesc = locSEO?.description || `OfinIT is a premier custom software and Next.js web development agency servicing businesses in ${loc.name}.`
      const defaultKeywords = locSEO?.keywords || ["web development " + loc.name, "software company " + loc.name]
      
      const custom = overrides[url] || {}
      const title = custom.title || defaultTitle
      const description = custom.description || defaultDesc
      const keywords = custom.keywords || defaultKeywords

      reports.push(
        auditPage(
          url,
          "Location",
          title,
          description,
          keywords,
          `We provide standard UI/UX design, custom software engineering, mobile application building, and AI integration for companies in ${loc.name}. Our developers focus on creating super fast Core Web Vitals optimized sites.`,
          true
        )
      )
    }

    return reports
  } catch (error) {
    console.error("[getSeoPagesList] Error gathering pages for SEO audit:", error)
    return []
  }
}

// Credentials management actions
export async function getGoogleGscConfig(): Promise<{
  hasCredentials: boolean
  propertyUrl: string
  clientEmail?: string
}> {
  try {
    const creds = await prisma.siteSetting.findUnique({ where: { key: GSC_CREDENTIALS_KEY } })
    const prop = await prisma.siteSetting.findUnique({ where: { key: GSC_PROPERTY_KEY } })
    
    let clientEmail: string | undefined
    if (creds?.value && typeof creds.value === "string") {
      try {
        const parsed = JSON.parse(creds.value)
        clientEmail = parsed.client_email
      } catch {}
    }
    
    return {
      hasCredentials: !!creds?.value,
      propertyUrl: (prop?.value as string) || "https://ofinit.com",
      clientEmail
    }
  } catch {
    return { hasCredentials: false, propertyUrl: "https://ofinit.com" }
  }
}

export async function saveGoogleGscConfig(
  jsonCredentials: string,
  propertyUrl: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await assertAdminAuthenticated()
  } catch {
    return { ok: false, error: "Authentication failed. Please log in again." }
  }

  try {
    // Validate JSON structure
    if (jsonCredentials.trim()) {
      try {
        const parsed = JSON.parse(jsonCredentials)
        if (!parsed.client_email || !parsed.private_key) {
          return { ok: false, error: "JSON is missing 'client_email' or 'private_key'." }
        }
      } catch {
        return { ok: false, error: "Invalid JSON format. Please upload a valid Google Service Account key file." }
      }
    }

    // Save to Database
    await prisma.siteSetting.upsert({
      where: { key: GSC_CREDENTIALS_KEY },
      create: { key: GSC_CREDENTIALS_KEY, value: jsonCredentials.trim() },
      update: { value: jsonCredentials.trim() }
    })

    await prisma.siteSetting.upsert({
      where: { key: GSC_PROPERTY_KEY },
      create: { key: GSC_PROPERTY_KEY, value: propertyUrl.trim() },
      update: { value: propertyUrl.trim() }
    })

    return { ok: true }
  } catch (error) {
    console.error("[saveGoogleGscConfig] Error:", error)
    return { ok: false, error: "Failed to save configurations." }
  }
}

export async function disconnectGoogleGsc(): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await assertAdminAuthenticated()
  } catch {
    return { ok: false, error: "Authentication required." }
  }

  try {
    await prisma.siteSetting.deleteMany({
      where: {
        key: {
          in: [GSC_CREDENTIALS_KEY, GSC_PROPERTY_KEY]
        }
      }
    })
    return { ok: true }
  } catch (error) {
    console.error("[disconnectGoogleGsc] Error deleting keys:", error)
    return { ok: false, error: "Failed to disconnect Search Console." }
  }
}

// REST Client to request Search Console Data using native JWT sign
async function getSearchConsoleAccessToken(clientEmail: string, privateKey: string): Promise<string> {
  const tokenUri = "https://oauth2.googleapis.com/token"
  
  // Format token payload
  const header = { alg: "RS256", typ: "JWT" }
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    iss: clientEmail,
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
    aud: tokenUri,
    exp: now + 3600,
    iat: now
  }

  const base64UrlEncode = (str: string) => {
    return Buffer.from(str)
      .toString("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
  }

  const tokenHeader = base64UrlEncode(JSON.stringify(header))
  const tokenPayload = base64UrlEncode(JSON.stringify(payload))
  const signatureInput = `${tokenHeader}.${tokenPayload}`

  // Sign with private key
  const signer = crypto.createSign("RSA-SHA256")
  signer.update(signatureInput)
  signer.end()
  
  const signature = signer
    .sign(privateKey, "base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")

  const jwt = `${signatureInput}.${signature}`

  // Exchange for token
  const response = await fetch(tokenUri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Google OAuth failure: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  return data.access_token
}

// Fetch query rankings from GSC REST API (or fallback to simulated data if unconfigured/invalid)
export async function getSeoKeywordRankings(): Promise<{
  connected: boolean
  rankings: GscKeywordRank[]
  error?: string
}> {
  try {
    const creds = await prisma.siteSetting.findUnique({ where: { key: GSC_CREDENTIALS_KEY } })
    const prop = await prisma.siteSetting.findUnique({ where: { key: GSC_PROPERTY_KEY } })

    if (!creds?.value || typeof creds.value !== "string") {
      return { connected: false, rankings: getSimulatedRankings() }
    }

    const credentials = JSON.parse(creds.value)
    const propertyUrl = (prop?.value as string) || "https://ofinit.com"
    const siteParam = encodeURIComponent(propertyUrl)

    // Exchange Service Account credentials for access token
    const token = await getSearchConsoleAccessToken(credentials.client_email, credentials.private_key)

    // Query Search Analytics
    const now = new Date()
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const formatDate = (d: Date) => d.toISOString().split("T")[0]

    const gscUrl = `https://www.googleapis.com/webmasters/v3/sites/${siteParam}/searchAnalytics/query`
    const res = await fetch(gscUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        startDate: formatDate(thirtyDaysAgo),
        endDate: formatDate(now),
        dimensions: ["query", "page"],
        rowLimit: 100
      })
    })

    if (!res.ok) {
      const errorText = await res.text()
      return {
        connected: false,
        rankings: getSimulatedRankings(),
        error: `Search Console API error: ${res.status} - ${errorText}`
      }
    }

    const data = await res.json()
    if (!data.rows || !Array.isArray(data.rows)) {
      return { connected: true, rankings: [] }
    }

    const list: GscKeywordRank[] = data.rows.map((row: any) => {
      const [query, page] = row.keys
      // Map absolute URL to relative path
      let relativeUrl = page
      try {
        const u = new URL(page)
        relativeUrl = u.pathname
      } catch {}

      return {
        keyword: query,
        clicks: row.clicks || 0,
        impressions: row.impressions || 0,
        ctr: parseFloat(((row.ctr || 0) * 100).toFixed(2)),
        position: parseFloat((row.position || 0).toFixed(1)),
        pageUrl: relativeUrl
      }
    })

    return { connected: true, rankings: list }
  } catch (error: any) {
    console.error("[getSeoKeywordRankings] GSC ranking retrieval failed, using fallback simulation:", error)
    return {
      connected: false,
      rankings: getSimulatedRankings(),
      error: error?.message || "Internal ranking retrieval error."
    }
  }
}

// Generate realistic simulated data to represent actual SEO statistics when GSC API isn't set up yet
function getSimulatedRankings(): GscKeywordRank[] {
  const seed = [
    { keyword: "web development agency", clicks: 120, impressions: 980, position: 2.1, pageUrl: "/" },
    { keyword: "custom software company india", clicks: 88, impressions: 720, position: 3.4, pageUrl: "/" },
    { keyword: "Next.js development services", clicks: 145, impressions: 1220, position: 1.8, pageUrl: "/services/web-development" },
    { keyword: "AI integration consultants", clicks: 52, impressions: 450, position: 4.2, pageUrl: "/services/ai-integration" },
    { keyword: "offshore app developers", clicks: 61, impressions: 680, position: 6.7, pageUrl: "/services/mobile-app-development" },
    { keyword: "Next.js for business websites", clicks: 35, impressions: 210, position: 3.1, pageUrl: "/blog/nextjs-business-websites-performance-seo" },
    { keyword: "UI/UX studio Bangalore", clicks: 28, impressions: 380, position: 5.9, pageUrl: "/locations/bangalore" },
    { keyword: "cloud infrastructure DevOps", clicks: 42, impressions: 310, position: 4.8, pageUrl: "/services/devops-services" },
    { keyword: "best outsourcing web services", clicks: 19, impressions: 250, position: 8.2, pageUrl: "/" },
    { keyword: "software engineering Dubai", clicks: 14, impressions: 160, position: 7.5, pageUrl: "/locations/dubai" }
  ]

  // Add slight variations based on today's date so the simulator looks active
  const day = new Date().getDate()
  return seed.map((item, idx) => {
    const variationMultiplier = ((day + idx) % 5) - 2 // -2 to +2
    const clicks = Math.max(2, item.clicks + variationMultiplier * 3)
    const impressions = Math.max(10, item.impressions + variationMultiplier * 20)
    const position = Math.max(1.0, parseFloat((item.position + (variationMultiplier * 0.1)).toFixed(1)))
    const ctr = parseFloat(((clicks / impressions) * 100).toFixed(2))

    return {
      keyword: item.keyword,
      clicks,
      impressions,
      ctr,
      position,
      pageUrl: item.pageUrl
    }
  })
}

const GEMINI_API_KEY_KEY = "seo_gemini_api_key"

export async function getGeminiConfig(): Promise<{ hasGeminiKey: boolean }> {
  try {
    const creds = await prisma.siteSetting.findUnique({ where: { key: GEMINI_API_KEY_KEY } })
    return { hasGeminiKey: !!creds?.value }
  } catch {
    return { hasGeminiKey: false }
  }
}

export async function saveGeminiConfig(apiKey: string): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await assertAdminAuthenticated()
  } catch {
    return { ok: false, error: "Authentication failed. Log in again." }
  }

  try {
    await prisma.siteSetting.upsert({
      where: { key: GEMINI_API_KEY_KEY },
      create: { key: GEMINI_API_KEY_KEY, value: apiKey.trim() },
      update: { value: apiKey.trim() }
    })
    return { ok: true }
  } catch (e) {
    console.error("[saveGeminiConfig] Error:", e)
    return { ok: false, error: "Failed to save Gemini API key." }
  }
}

export async function disconnectGemini(): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await assertAdminAuthenticated()
  } catch {
    return { ok: false, error: "Authentication failed." }
  }

  try {
    await prisma.siteSetting.deleteMany({
      where: { key: GEMINI_API_KEY_KEY }
    })
    return { ok: true }
  } catch (error) {
    console.error("[disconnectGemini] Error:", error)
    return { ok: false, error: "Failed to disconnect Gemini." }
  }
}

function cleanJsonString(raw: string): string {
  return raw
    .replace(/^```json/i, "")
    .replace(/^```/i, "")
    .replace(/```$/, "")
    .trim()
}

export async function generateAiSeoFix(
  url: string,
  type: string
): Promise<{
  ok: true
  suggestions: {
    optimizedTitle: string
    optimizedDescription: string
    optimizedKeywords: string[]
    aiExplanation: string
  }
} | { ok: false; error: string }> {
  try {
    const creds = await prisma.siteSetting.findUnique({ where: { key: GEMINI_API_KEY_KEY } })
    if (!creds?.value || typeof creds.value !== "string") {
      return { ok: false, error: "api_key_missing" }
    }
    const apiKey = creds.value

    // Load contextual page content based on URL and type
    let pageTitle = ""
    let pageDescription = ""
    let pageKeywords: string[] = []
    let pageContent = ""

    if (type === "Home") {
      const seo = await getSeoSettings()
      pageTitle = seo.metaTitle
      pageDescription = seo.metaDescription
      pageKeywords = seo.metaKeywords ? seo.metaKeywords.split(",").map((k) => k.trim()) : []
      pageContent = "OfinIT Solutions - Web, Software, AI Development, mobile apps, and cloud operations. Leading developer agency."
    } else if (type === "Blog") {
      const slug = url.replace("/blog/", "")
      const post = await prisma.blogPost.findUnique({ where: { slug } })
      if (!post) return { ok: false, error: `Blog post not found for slug: ${slug}` }
      pageTitle = post.metaTitle || post.title
      pageDescription = post.metaDescription || post.excerpt
      pageKeywords = Array.isArray(post.metaKeywords) ? (post.metaKeywords as string[]) : []
      pageContent = post.content
    } else if (type === "Service") {
      const slug = url.replace("/services/", "")
      const svc = await prisma.service.findUnique({ where: { slug } })
      if (!svc) return { ok: false, error: `Service not found for slug: ${slug}` }
      pageTitle = `${svc.name} | OfinIT Services`
      pageDescription = svc.shortDescription
      pageKeywords = [svc.name, "OfinIT Services"]
      pageContent = svc.bodyMd
    } else if (type === "Legal") {
      const slug = url.replace("/", "")
      const page = await prisma.publicPage.findUnique({ where: { slug } })
      if (!page) return { ok: false, error: `Legal page not found for slug: ${slug}` }
      pageTitle = page.title
      pageDescription = `OfinIT page detailing terms, privacy, or company rules for ${page.title}`
      pageContent = page.bodyMd
    } else if (type === "Location") {
      const slug = url.replace("/locations/", "")
      const loc = STATIC_OVERWRITES.find(l => l.slug === slug)
      if (!loc) return { ok: false, error: `Location config not found for slug: ${slug}` }
      
      const locSEO = getLocationSEO(slug)
      
      const customSettingsRecord = await prisma.siteSetting.findUnique({
        where: { key: "location_custom_seo_settings" }
      })
      const overrides = (customSettingsRecord?.value as Record<string, any>) || {}
      const custom = overrides[url] || {}

      pageTitle = custom.title || locSEO?.title || `${loc.name} Web Development Services`
      pageDescription = custom.description || locSEO?.description || ""
      pageKeywords = custom.keywords || locSEO?.keywords || []
      pageContent = `We provide standard UI/UX design, custom software engineering, mobile application building, and AI integration for companies in ${loc.name}. Our developers focus on creating super fast Core Web Vitals optimized sites.`
    } else {
      return { ok: false, error: "Dynamic template landing pages must be customized in code config." }
    }

    const currentYear = new Date().getFullYear() // Dynamically retrieve current year (e.g. 2026)

    // Construct the prompt to optimize metadata using Gemini
    const prompt = `You are an expert SEO copywriter. Review the following metadata and content for a website page:
URL: ${url}
Type: ${type}
Current Meta Title: ${pageTitle}
Current Meta Description: ${pageDescription}
Current Keywords: ${pageKeywords.join(", ")}
Content Preview (body): ${pageContent.substring(0, 1500)}

IMPORTANT - Year Consistency Rule: 
- Check the page URL/slug. If the URL/slug contains a specific year (e.g., "2024" in /blog/...-2024), you MUST preserve and use that exact year (e.g., 2024) in the optimized meta title and description to maintain path consistency and avoid URL-to-metadata mismatches.
- If the page URL/slug does NOT specify a year, but the page content refers to generic yearly best practices (such as 2024 or 2025), you may update/upgrade those references to the current year (${currentYear}) to keep the metadata fresh.

Optimize the page's metadata for search engines and user CTR. Fix length constraints (Titles should be 50-65 chars; Descriptions should be 120-160 chars). Return target keywords relevant to the content body.

Provide your response as a valid JSON object only. Do NOT wrap it in markdown code blocks or add any comments.
JSON format:
{
  "optimizedTitle": "Optimal SEO Title (50-65 characters)",
  "optimizedDescription": "Compelling Meta Description (120-160 characters)",
  "optimizedKeywords": ["keyword1", "keyword2", "keyword3"],
  "aiExplanation": "A 2-sentence explanation of what was fixed and why this metadata is better."
}`

    // Call Gemini API using native fetch with robust fallback across active models and API versions
    const modelsToTry = [
      "gemini-3.5-flash",
      "gemini-3.6-flash",
      "gemini-3.5-flash-lite",
      "gemini-1.5-flash"
    ]
    const versionsToTry = ["v1", "v1beta"]
    
    let lastError = ""
    let suggestions: any = null

    for (const model of modelsToTry) {
      for (const version of versionsToTry) {
        try {
          const geminiUrl = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${apiKey}`
          console.log(`[generateAiSeoFix] Attempting query on Gemini API using ${version}/${model}`)
          
          const response = await fetch(geminiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }]
            })
          })

          if (response.ok) {
            const data = await response.json()
            const content = data.candidates?.[0]?.content?.parts?.[0]?.text
            if (content) {
              const cleaned = cleanJsonString(content)
              suggestions = JSON.parse(cleaned)
              console.log(`[generateAiSeoFix] Success! Used model ${model} via API version ${version}`)
              break
            }
          } else {
            const errText = await response.text()
            lastError = `${version}/${model} call failed: ${response.status} - ${errText}`
            console.warn(`[generateAiSeoFix] ${lastError}`)
          }
        } catch (err: any) {
          lastError = `${version}/${model} fetch exception: ${err.message || err}`
          console.warn(`[generateAiSeoFix] ${lastError}`)
        }
      }
      if (suggestions) break
    }

    if (!suggestions) {
      return { 
        ok: false, 
        error: `Gemini API query failed for all attempts. Last error: ${lastError}` 
      }
    }

    return {
      ok: true,
      suggestions: {
        optimizedTitle: suggestions.optimizedTitle || pageTitle,
        optimizedDescription: suggestions.optimizedDescription || pageDescription,
        optimizedKeywords: suggestions.optimizedKeywords || pageKeywords,
        aiExplanation: suggestions.aiExplanation || "Optimized metadata generated by Gemini AI."
      }
    }
  } catch (e: any) {
    console.error("[generateAiSeoFix] Error generating fixes:", e)
    return { ok: false, error: e?.message || "Internal error generating metadata fixes." }
  }
}

export async function applyAiSeoFix(
  url: string,
  type: string,
  title: string,
  description: string,
  keywords: string[],
  bypassAuthToken?: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const cronSecret = process.env.CRON_SECRET
  const isBypassed = cronSecret && bypassAuthToken === cronSecret

  if (!isBypassed) {
    try {
      await assertAdminAuthenticated()
    } catch {
      return { ok: false, error: "Authentication failed. Please log in again." }
    }
  }

  try {
    if (type === "Home") {
      const seo = await getSeoSettings()
      await prisma.siteSetting.upsert({
        where: { key: "seo_settings" },
        create: {
          key: "seo_settings",
          value: {
            ...seo,
            metaTitle: title,
            metaDescription: description,
            metaKeywords: keywords.join(", ")
          }
        },
        update: {
          value: {
            ...seo,
            metaTitle: title,
            metaDescription: description,
            metaKeywords: keywords.join(", ")
          }
        }
      })
    } else if (type === "Blog") {
      const slug = url.replace("/blog/", "")
      await prisma.blogPost.update({
        where: { slug },
        data: {
          metaTitle: title,
          metaDescription: description,
          metaKeywords: keywords
        }
      })
    } else if (type === "Service") {
      const slug = url.replace("/services/", "")
      await prisma.service.update({
        where: { slug },
        data: {
          name: title.replace(" | OfinIT Services", ""),
          shortDescription: description
        }
      })
    } else if (type === "Legal") {
      const slug = url.replace("/", "")
      await prisma.publicPage.update({
        where: { slug },
        data: {
          title: title
        }
      })
    } else if (type === "Location") {
      const customSettingsRecord = await prisma.siteSetting.findUnique({
        where: { key: "location_custom_seo_settings" }
      })
      const overrides = (customSettingsRecord?.value as Record<string, any>) || {}

      overrides[url] = {
        title,
        description,
        keywords
      }

      await prisma.siteSetting.upsert({
        where: { key: "location_custom_seo_settings" },
        create: {
          key: "location_custom_seo_settings",
          value: overrides
        },
        update: {
          value: overrides
        }
      })
    } else {
      return { ok: false, error: "Cannot apply optimizations to read-only template location paths." }
    }

    return { ok: true }
  } catch (error: any) {
    console.error("[applyAiSeoFix] DB Update failed:", error)
    return { ok: false, error: error?.message || "Failed to save optimizations to database." }
  }
}
