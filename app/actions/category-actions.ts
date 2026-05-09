"use server"

import { revalidatePath } from "next/cache"
import { randomUUID } from "crypto"
import { prisma } from "@/lib/db/prisma"
import type { Category } from "@/lib/categories-data"

function rowToCategory(row: { id: string; name: string; slug: string; description: string | null; createdAt: Date }): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? undefined,
    createdAt: row.createdAt.toISOString(),
  }
}

export async function getCategories() {
  const rows = await prisma.category.findMany({ orderBy: { createdAt: "asc" } })
  return {
    success: true as const,
    categories: rows.map(rowToCategory),
  }
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const row = await prisma.category.findUnique({ where: { id } })
  return row ? rowToCategory(row) : null
}

export async function createCategory(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const description = (formData.get("description") as string) || ""

    if (!name) {
      return { success: false as const, error: "Category name is required" }
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const id = randomUUID()
    const row = await prisma.category.create({
      data: {
        id,
        name,
        slug,
        description: description || null,
      },
    })

    revalidatePath("/admin/categories")
    revalidatePath("/admin/blogs")

    return { success: true as const, category: rowToCategory(row) }
  } catch (error) {
    console.error("Error creating category:", error)
    return { success: false as const, error: "Failed to create category" }
  }
}

export async function updateCategory(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const description = (formData.get("description") as string) || ""

    if (!name) {
      return { success: false as const, error: "Category name is required" }
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const row = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description: description || null,
      },
    })

    revalidatePath("/admin/categories")
    revalidatePath("/admin/blogs")

    return { success: true as const, category: rowToCategory(row) }
  } catch {
    return { success: false as const, error: "Failed to update category" }
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({ where: { id } })

    revalidatePath("/admin/categories")
    revalidatePath("/admin/blogs")

    return { success: true as const }
  } catch {
    return { success: false as const, error: "Failed to delete category" }
  }
}
