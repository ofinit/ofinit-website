import type { BlogPost } from "@/lib/blog-data"

/** Public SEO-friendly blog URL (always slug, never numeric id). */
export function blogPostHref(post: Pick<BlogPost, "slug">): string {
  return `/blog/${post.slug}`
}

export function blogPostCanonicalUrl(post: Pick<BlogPost, "slug">, siteOrigin = "https://ofinit.com"): string {
  return `${siteOrigin}${blogPostHref(post)}`
}
