import { NextRequest, NextResponse } from "next/server"
import { loadPublishedServices } from "@/lib/services/load"
import { getPublishedBlogPostsForPublic } from "@/lib/blog/queries"
import { getAllLocationSlugs } from "@/lib/seo/locations-data"

const SITE_URL = "https://ofinit.com"
const CHUNK_SIZE = 6000

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id: idStr } = await params
  const id = parseInt(idStr, 10)
  
  if (isNaN(id)) {
    return new NextResponse("Not Found", { status: 404 })
  }

  const slugs = getAllLocationSlugs()
  const servicesList = ["ui-ux-design", "web-development", "software-development", "mobile-app-development", "ai-integration", "devops-services"]
  const lastModified = new Date().toISOString()

  let urls: { loc: string; lastmod: string; changefreq: string; priority: string }[] = []

  if (id === 0) {
    // 1. Core pages
    const staticUrls = [
      "",
      "/case-studies",
      "/careers",
      "/blog",
      "/locations",
      "/privacy-policy",
      "/terms-of-service",
      "/cookie-policy",
      "/cancel-refund-policy",
    ]
    for (const url of staticUrls) {
      urls.push({
        loc: `${SITE_URL}${url}`,
        lastmod: lastModified,
        changefreq: url === "" || url === "/blog" ? "daily" : "weekly",
        priority: url === "" ? "1.0" : "0.8",
      })
    }

    // 2. Services
    try {
      const services = await loadPublishedServices()
      for (const s of services) {
        urls.push({
          loc: `${SITE_URL}/services/${s.slug}`,
          lastmod: lastModified,
          changefreq: "weekly",
          priority: "0.8",
        })
      }
    } catch {
      // Fail-safe
    }

    // 3. Blog posts
    try {
      const blogPosts = await getPublishedBlogPostsForPublic()
      for (const post of blogPosts) {
        urls.push({
          loc: `${SITE_URL}/blog/${post.slug}`,
          lastmod: post.createdAt ? new Date(post.createdAt).toISOString() : lastModified,
          changefreq: "monthly",
          priority: "0.7",
        })
      }
    } catch {
      // Fail-safe
    }
  }

  // 4. Locations chunk
  const start = id * CHUNK_SIZE
  const end = start + CHUNK_SIZE
  const chunkSlugs = slugs.slice(start, end)

  if (chunkSlugs.length === 0 && id > 0) {
    return new NextResponse("Not Found", { status: 404 })
  }

  for (const slug of chunkSlugs) {
    urls.push({
      loc: `${SITE_URL}/locations/${slug}`,
      lastmod: lastModified,
      changefreq: "weekly",
      priority: "0.6",
    })
    for (const service of servicesList) {
      urls.push({
        loc: `${SITE_URL}/locations/${slug}/${service}`,
        lastmod: lastModified,
        changefreq: "weekly",
        priority: "0.6",
      })
    }
  }

  const xmlParts = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`
  ]

  for (const u of urls) {
    xmlParts.push(`  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`)
  }

  xmlParts.push("</urlset>")
  const xml = xmlParts.join("\n")

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  })
}
