"use server"

import { revalidatePath } from "next/cache"
import { blogPosts, type BlogPost } from "@/lib/blog-data"

// In a real application, these would interact with a database
// For now, we'll simulate CRUD operations

export async function createBlogPost(formData: FormData) {
  try {
    const newPost: BlogPost = {
      id: Date.now().toString(),
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

    // In a real app, save to database
    blogPosts.push(newPost)

    revalidatePath("/blog")
    revalidatePath("/admin/blogs")

    return { success: true, id: newPost.id }
  } catch (error) {
    console.error("[v0] Error creating blog post:", error)
    return { success: false, error: "Failed to create blog post" }
  }
}

export async function updateBlogPost(id: string, formData: FormData) {
  try {
    const index = blogPosts.findIndex((post) => post.id === id)

    if (index === -1) {
      return { success: false, error: "Blog post not found" }
    }

    blogPosts[index] = {
      ...blogPosts[index],
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

    revalidatePath("/blog")
    revalidatePath(`/blog/${id}`)
    revalidatePath("/admin/blogs")

    return { success: true }
  } catch (error) {
    console.error("[v0] Error updating blog post:", error)
    return { success: false, error: "Failed to update blog post" }
  }
}

export async function deleteBlogPost(id: string) {
  try {
    const index = blogPosts.findIndex((post) => post.id === id)

    if (index === -1) {
      return { success: false, error: "Blog post not found" }
    }

    blogPosts.splice(index, 1)

    revalidatePath("/blog")
    revalidatePath("/admin/blogs")

    return { success: true }
  } catch (error) {
    console.error("[v0] Error deleting blog post:", error)
    return { success: false, error: "Failed to delete blog post" }
  }
}
