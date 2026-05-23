/** Paths referenced in seed data that are not shipped in /public. */
const LEGACY_MISSING_IMAGES = new Set([
  "/placeholder.jpg",
  "/placeholder.svg",
  "/ai-business-integration-dashboard.jpg",
  "/mobile-app-development-architecture.jpg",
  "/professional-woman-diverse.png",
  "/professional-man.jpg",
  "/author-writing.png",
])

/** Generated SVG cover route (see app/blog/covers/[slug]/route.ts). */
export function blogCoverUrl(slug: string): string {
  return `/blog/covers/${encodeURIComponent(slug)}`
}

/**
 * Use admin uploads and external URLs as-is; otherwise serve auto-generated cover art.
 */
export function resolveBlogImageUrl(slug: string, image?: string | null): string {
  const trimmed = image?.trim() ?? ""
  if (!trimmed) return blogCoverUrl(slug)
  if (trimmed.startsWith("/uploads/")) return trimmed
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed
  if (trimmed.startsWith("/blog/covers/")) return trimmed
  if (LEGACY_MISSING_IMAGES.has(trimmed)) return blogCoverUrl(slug)
  return blogCoverUrl(slug)
}
