import type { BlogPost } from "@/lib/blog-data"
import { blogPostCanonicalUrl } from "@/lib/blog/paths"
import { getExpandedSectionsForSlug } from "@/lib/blog/expanded-sections"
import { countWordsFromHtml, readTimeFromWordCount } from "@/lib/blog/word-count"
import { resolveBlogImageUrl } from "@/lib/blog/resolve-image"

const MIN_SEO_WORDS = 900

/** Trim and normalize whitespace in stored HTML bodies. */
export function normalizeBlogHtml(content: string): string {
  return content
    .trim()
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
}

function looksLikeHtml(content: string): boolean {
  return /<(?:p|h[1-6]|ul|ol|li|div|blockquote)\b/i.test(content)
}

/** Plain text or loose line breaks → paragraph HTML for legacy admin entries. */
export function plainTextToBlogHtml(text: string): string {
  const trimmed = text.trim()
  if (!trimmed) return ""
  if (looksLikeHtml(trimmed)) return normalizeBlogHtml(trimmed)

  return trimmed
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      if (/^#{1,6}\s/.test(block)) {
        const level = block.match(/^(#+)/)?.[1].length ?? 2
        const tag = `h${Math.min(6, Math.max(2, level))}`
        return `<${tag}>${block.replace(/^#+\s*/, "")}</${tag}>`
      }
      if (block.startsWith("- ") || block.startsWith("* ")) {
        const items = block
          .split(/\n/)
          .map((line) => line.replace(/^[-*]\s+/, "").trim())
          .filter(Boolean)
        return `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`
      }
      return `<p>${block.replace(/\n/g, "<br />")}</p>`
    })
    .join("\n")
}

export function resolveBlogContent(slug: string, storedContent: string): string {
  let html = plainTextToBlogHtml(storedContent)
  const supplemental = getExpandedSectionsForSlug(slug)
  if (supplemental && countWordsFromHtml(html) < MIN_SEO_WORDS) {
    html = `${html}\n${supplemental}`
  }
  return html
}

export function enrichBlogPost(post: BlogPost): BlogPost {
  const content = resolveBlogContent(post.slug, post.content)
  const words = countWordsFromHtml(content)
  const image = resolveBlogImageUrl(post.slug, post.image)
  return {
    ...post,
    content,
    image,
    ogImage: post.ogImage?.trim() || image,
    twitterImage: post.twitterImage?.trim() || image,
    readTime: readTimeFromWordCount(words),
    canonicalUrl: post.canonicalUrl?.trim() || blogPostCanonicalUrl(post),
  }
}
