"use server"

import { revalidatePath } from "next/cache"
import { randomUUID } from "crypto"
import { prisma } from "@/lib/db/prisma"
import type { BlogPost } from "@/lib/blog-data"
import { blogRowToPost } from "@/lib/blog/map-from-db"

function formToBlogPayload(formData: FormData, id: string): Omit<BlogPost, "createdAt"> {
  return {
    id,
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    excerpt: formData.get("excerpt") as string,
    content: formData.get("content") as string,
    category: formData.get("category") as string,
    author: {
      name: formData.get("authorName") as string,
      role: formData.get("authorRole") as string,
      avatar: (formData.get("authorAvatar") as string) || "/author-writing.png",
    },
    publishedAt: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    readTime: formData.get("readTime") as string,
    image: formData.get("image") as string,
    imageAlt: formData.get("imageAlt") as string,
    metaTitle: formData.get("metaTitle") as string,
    metaDescription: formData.get("metaDescription") as string,
    metaKeywords: (formData.get("metaKeywords") as string).split(",").map((k) => k.trim()),
    ogTitle: (formData.get("ogTitle") as string) || undefined,
    ogDescription: (formData.get("ogDescription") as string) || undefined,
    ogImage: (formData.get("ogImage") as string) || undefined,
    twitterTitle: (formData.get("twitterTitle") as string) || undefined,
    twitterDescription: (formData.get("twitterDescription") as string) || undefined,
    twitterImage: (formData.get("twitterImage") as string) || undefined,
    canonicalUrl: (formData.get("canonicalUrl") as string) || undefined,
    featured: formData.get("featured") === "on",
    status: formData.get("status") as "draft" | "published",
  }
}

export async function createBlogPost(formData: FormData) {
  try {
    const id = randomUUID()
    const post = formToBlogPayload(formData, id)

    await prisma.blogPost.create({
      data: {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        author: post.author,
        publishedAt: post.publishedAt,
        readTime: post.readTime,
        image: post.image,
        imageAlt: post.imageAlt,
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        metaKeywords: post.metaKeywords,
        ogTitle: post.ogTitle ?? null,
        ogDescription: post.ogDescription ?? null,
        ogImage: post.ogImage ?? null,
        twitterTitle: post.twitterTitle ?? null,
        twitterDescription: post.twitterDescription ?? null,
        twitterImage: post.twitterImage ?? null,
        canonicalUrl: post.canonicalUrl ?? null,
        featured: post.featured,
        status: post.status,
      },
    })

    revalidatePath("/blog")
    revalidatePath("/admin/blogs")

    return { success: true, id: post.id }
  } catch (error) {
    console.error("Error creating blog post:", error)
    return { success: false, error: "Failed to create blog post" }
  }
}

export async function updateBlogPost(id: string, formData: FormData) {
  try {
    const existing = await prisma.blogPost.findUnique({ where: { id } })
    if (!existing) {
      return { success: false, error: "Blog post not found" }
    }

    const post = formToBlogPayload(formData, id)
    await prisma.blogPost.update({
      where: { id },
      data: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        author: post.author,
        publishedAt: existing.publishedAt,
        readTime: post.readTime,
        image: post.image,
        imageAlt: post.imageAlt,
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        metaKeywords: post.metaKeywords,
        ogTitle: post.ogTitle ?? null,
        ogDescription: post.ogDescription ?? null,
        ogImage: post.ogImage ?? null,
        twitterTitle: post.twitterTitle ?? null,
        twitterDescription: post.twitterDescription ?? null,
        twitterImage: post.twitterImage ?? null,
        canonicalUrl: post.canonicalUrl ?? null,
        featured: post.featured,
        status: post.status,
      },
    })

    revalidatePath("/blog")
    revalidatePath(`/blog/${post.slug}`)
    revalidatePath("/admin/blogs")

    return { success: true }
  } catch (error) {
    console.error("Error updating blog post:", error)
    return { success: false, error: "Failed to update blog post" }
  }
}

export async function deleteBlogPost(id: string) {
  try {
    const existing = await prisma.blogPost.findUnique({ where: { id } })
    if (!existing) {
      return { success: false, error: "Blog post not found" }
    }

    await prisma.blogPost.delete({ where: { id } })

    revalidatePath("/blog")
    revalidatePath(`/blog/${existing.slug}`)
    revalidatePath("/admin/blogs")

    return { success: true }
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return { success: false, error: "Failed to delete blog post" }
  }
}

export async function getBlogPostByIdForAdmin(id: string): Promise<BlogPost | null> {
  const row = await prisma.blogPost.findUnique({ where: { id } })
  return row ? blogRowToPost(row) : null
}

export async function listBlogPostsForAdmin(): Promise<BlogPost[]> {
  const rows = await prisma.blogPost.findMany({ orderBy: { updatedAt: "desc" } })
  return rows.map(blogRowToPost)
}
