import type { BlogPost as BlogPostRow } from "@prisma/client"
import type { BlogPost } from "@/lib/blog-data"

export function blogRowToPost(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category,
    author: row.author as BlogPost["author"],
    publishedAt: row.publishedAt,
    readTime: row.readTime,
    image: row.image,
    imageAlt: row.imageAlt,
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
    metaKeywords: row.metaKeywords as string[],
    ogTitle: row.ogTitle ?? undefined,
    ogDescription: row.ogDescription ?? undefined,
    ogImage: row.ogImage ?? undefined,
    twitterTitle: row.twitterTitle ?? undefined,
    twitterDescription: row.twitterDescription ?? undefined,
    twitterImage: row.twitterImage ?? undefined,
    canonicalUrl: row.canonicalUrl ?? undefined,
    featured: row.featured,
    status: row.status as BlogPost["status"],
    createdAt: row.createdAt.toISOString(),
  }
}
