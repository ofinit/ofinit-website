import { prisma } from "@/lib/db/prisma"
import { blogRowToPost } from "@/lib/blog/map-from-db"
import { enrichBlogPost } from "@/lib/blog/enrich-post"
import { getAllSeedBlogPosts } from "@/lib/blog/seed-posts"
import type { BlogPost } from "@/lib/blog-data"

function enrichSeedPosts(posts: BlogPost[]): BlogPost[] {
  return posts.map(enrichBlogPost)
}

export async function getPublishedBlogPostsForPublic(): Promise<BlogPost[]> {
  try {
    const rows = await prisma.blogPost.findMany({
      where: { status: "published" },
      orderBy: { createdAt: "desc" },
    })
    if (rows.length > 0) {
      return rows.map((row) => enrichBlogPost(blogRowToPost(row)))
    }
  } catch {
    // fall through to seed content
  }
  return enrichSeedPosts(getAllSeedBlogPosts().filter((p) => p.status === "published"))
}

export async function getPublishedBlogPostById(id: string): Promise<BlogPost | null> {
  try {
    const row = await prisma.blogPost.findFirst({
      where: { id, status: "published" },
    })
    if (row) return enrichBlogPost(blogRowToPost(row))
  } catch {
    // fall through
  }
  const seed = getAllSeedBlogPosts().find((p) => p.id === id && p.status === "published")
  return seed ? enrichBlogPost(seed) : null
}

export async function getPublishedBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const row = await prisma.blogPost.findFirst({
      where: { slug, status: "published" },
    })
    if (row) return enrichBlogPost(blogRowToPost(row))
  } catch {
    // fall through
  }
  const seed = getAllSeedBlogPosts().find((p) => p.slug === slug && p.status === "published")
  return seed ? enrichBlogPost(seed) : null
}

export async function getAllBlogCategoriesFromPosts(): Promise<string[]> {
  try {
    const rows = await prisma.blogPost.findMany({
      where: { status: "published" },
      select: { category: true },
      distinct: ["category"],
    })
    if (rows.length > 0) {
      return rows.map((r) => r.category)
    }
  } catch {
    // fall through
  }
  const posts = await getPublishedBlogPostsForPublic()
  return [...new Set(posts.map((p) => p.category))]
}
