import { prisma } from "@/lib/db/prisma"
import { blogRowToPost } from "@/lib/blog/map-from-db"
import { getAllSeedBlogPosts } from "@/lib/blog/seed-posts"
import type { BlogPost } from "@/lib/blog-data"

export async function getPublishedBlogPostsForPublic(): Promise<BlogPost[]> {
  try {
    const rows = await prisma.blogPost.findMany({
      where: { status: "published" },
      orderBy: { createdAt: "desc" },
    })
    if (rows.length > 0) {
      return rows.map(blogRowToPost)
    }
  } catch {
    // fall through to seed content
  }
  return getAllSeedBlogPosts().filter((p) => p.status === "published")
}

export async function getPublishedBlogPostById(id: string): Promise<BlogPost | null> {
  try {
    const row = await prisma.blogPost.findFirst({
      where: { id, status: "published" },
    })
    if (row) return blogRowToPost(row)
  } catch {
    // fall through
  }
  return getAllSeedBlogPosts().find((p) => p.id === id && p.status === "published") ?? null
}

export async function getAllBlogCategoriesFromPosts(): Promise<string[]> {
  const rows = await prisma.blogPost.findMany({
    where: { status: "published" },
    select: { category: true },
    distinct: ["category"],
  })
  return rows.map((r) => r.category)
}
