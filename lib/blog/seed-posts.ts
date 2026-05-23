import type { BlogPost } from "@/lib/blog-data"
import { blogPosts as legacyBlogPosts } from "@/lib/blog-data"
import { getServiceSeoBlogPosts } from "@/lib/blog/service-seo-posts"

/** All default/seed posts (legacy samples + service SEO articles). */
export function getAllSeedBlogPosts(): BlogPost[] {
  const legacyIds = new Set(legacyBlogPosts.map((p) => p.id))
  const servicePosts = getServiceSeoBlogPosts().filter((p) => !legacyIds.has(p.id))
  return [...legacyBlogPosts, ...servicePosts]
}
