import type { MetadataRoute } from "next"
import { loadPublishedServices } from "@/lib/services/load"
import { getPublishedBlogPostsForPublic } from "@/lib/blog/queries"
import { getAllLocationSlugs } from "@/lib/seo/locations-data"

const SITE_URL = "https://ofinit.com"
const CHUNK_SIZE = 6000 // Split 15,200 locations so each sitemap holds up to ~42,000 URLs

export async function generateSitemaps() {
  const slugs = getAllLocationSlugs()
  const sitemapsCount = Math.ceil(slugs.length / CHUNK_SIZE)
  
  const sitemaps = []
  for (let i = 0; i < sitemapsCount; i++) {
    sitemaps.push({ id: i })
  }
  return sitemaps
}

export default async function sitemap({ id = 0 }: { id?: number } = {}): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()
  const slugs = getAllLocationSlugs()
  const servicesList = ["ui-ux-design", "web-development", "software-development", "mobile-app-development", "ai-integration", "devops-services"]

  // SITEMAP ID 0: Core pages + first chunk of locations
  if (id === 0) {
    // 1. Static Core Pages
    const staticPages = [
      { url: `${SITE_URL}`, lastModified, changeFrequency: "daily" as const, priority: 1.0 },
      { url: `${SITE_URL}/case-studies`, lastModified, changeFrequency: "weekly" as const, priority: 0.8 },
      { url: `${SITE_URL}/careers`, lastModified, changeFrequency: "monthly" as const, priority: 0.5 },
      { url: `${SITE_URL}/blog`, lastModified, changeFrequency: "daily" as const, priority: 0.8 },
      { url: `${SITE_URL}/locations`, lastModified, changeFrequency: "weekly" as const, priority: 0.8 },
    ]

    // 2. Policy Pages
    const policySlugs = ["privacy-policy", "terms-of-service", "cookie-policy", "cancel-refund-policy"]
    const policyPages = policySlugs.map((slug) => ({
      url: `${SITE_URL}/${slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    }))

    // 3. Dynamic Services (Home line services)
    let servicesPages: MetadataRoute.Sitemap = []
    try {
      const services = await loadPublishedServices()
      servicesPages = services.map((s) => ({
        url: `${SITE_URL}/services/${s.slug}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }))
    } catch {
      // Fail-safe
    }

    // 4. Dynamic Blog Posts
    let blogPages: MetadataRoute.Sitemap = []
    try {
      const blogPosts = await getPublishedBlogPostsForPublic()
      blogPages = blogPosts.map((post) => ({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: post.createdAt ? new Date(post.createdAt) : lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }))
    } catch {
      // Fail-safe
    }

    // 5. Locations: First Chunk (0 to CHUNK_SIZE)
    const chunkSlugs = slugs.slice(0, CHUNK_SIZE)
    const locationsPages: MetadataRoute.Sitemap = []

    for (const slug of chunkSlugs) {
      // Location root page
      locationsPages.push({
        url: `${SITE_URL}/locations/${slug}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })
      // Location service matrix pages (6 services)
      for (const service of servicesList) {
        locationsPages.push({
          url: `${SITE_URL}/locations/${slug}/${service}`,
          lastModified,
          changeFrequency: "weekly" as const,
          priority: 0.6,
        })
      }
    }

    return [...staticPages, ...policyPages, ...servicesPages, ...blogPages, ...locationsPages]
  }

  // SITEMAP ID > 0: Dynamic location chunk mapping
  const start = id * CHUNK_SIZE
  const end = start + CHUNK_SIZE
  const chunkSlugs = slugs.slice(start, end)
  const locationsPages: MetadataRoute.Sitemap = []

  for (const slug of chunkSlugs) {
    // Location root page
    locationsPages.push({
      url: `${SITE_URL}/locations/${slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })
    // Location service matrix pages
    for (const service of servicesList) {
      locationsPages.push({
        url: `${SITE_URL}/locations/${slug}/${service}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })
    }
  }

  return locationsPages
}
