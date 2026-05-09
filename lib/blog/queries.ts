import { prisma } from "@/lib/db/prisma"
import { blogRowToPost } from "@/lib/blog/map-from-db"
import type { BlogPost } from "@/lib/blog-data"

export async function getPublishedBlogPostsForPublic(): Promise<BlogPost[]> {
  const rows = await prisma.blogPost.findMany({
    where: { status: "published" },
    orderBy: { createdAt: "desc" },
  })
  return rows.map(blogRowToPost)
}

export async function getPublishedBlogPostById(id: string): Promise<BlogPost | null> {
  const row = await prisma.blogPost.findFirst({
    where: { id, status: "published" },
  })
  return row ? blogRowToPost(row) : null
}

export async function getAllBlogCategoriesFromPosts(): Promise<string[]> {
  const rows = await prisma.blogPost.findMany({
    where: { status: "published" },
    select: { category: true },
    distinct: ["category"],
  })
  return rows.map((r) => r.category)
}
