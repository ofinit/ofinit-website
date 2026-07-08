import type { MetadataRoute } from "next"
import { loadPublishedServices } from "@/lib/services/load"
import { getPublishedBlogPostsForPublic } from "@/lib/blog/queries"
import { getAllLocationSlugs } from "@/lib/seo/locations-data"

const SITE_URL = "https://ofinit.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()

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

  // 3. Dynamic Services
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

  // 5. Dynamic Locations SEO Landing Pages
  let locationsPages: MetadataRoute.Sitemap = []
  try {
    const slugs = getAllLocationSlugs()
    locationsPages = slugs.map((slug) => ({
      url: `${SITE_URL}/locations/${slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  } catch {
    // Fail-safe
  }

  return [...staticPages, ...policyPages, ...servicesPages, ...blogPages, ...locationsPages]
}
