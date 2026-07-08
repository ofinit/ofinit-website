import type { BlogPost } from "@/lib/blog-data"
import { blogPosts as legacyBlogPosts } from "@/lib/blog-data"
import { getServiceSeoBlogPosts } from "@/lib/blog/service-seo-posts"
import { getSeoArticles } from "@/lib/blog/seo-articles"

/** All default/seed posts (legacy samples + service SEO articles + custom organic SEO articles). */
export function getAllSeedBlogPosts(): BlogPost[] {
  const legacyIds = new Set(legacyBlogPosts.map((p) => p.id))
  const servicePosts = getServiceSeoBlogPosts().filter((p) => !legacyIds.has(p.id))
  const seoArticles = getSeoArticles()
  return [...legacyBlogPosts, ...servicePosts, ...seoArticles]
}
