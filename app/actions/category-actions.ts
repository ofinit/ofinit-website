"use server"

import { revalidatePath } from "next/cache"
import { categories, type Category } from "@/lib/categories-data"

export async function getCategories() {
  return {
    success: true,
    categories: categories,
  }
}

export async function createCategory(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const description = formData.get("description") as string

    if (!name) {
      return { success: false, error: "Category name is required" }
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const newCategory: Category = {
      id: String(categories.length + 1),
      name,
      slug,
      description,
      createdAt: new Date().toISOString(),
    }

    categories.push(newCategory)

    revalidatePath("/admin/categories")
    revalidatePath("/admin/blogs")

    return { success: true, category: newCategory }
  } catch (error) {
    console.error("[v0] Error creating category:", error)
    return { success: false, error: "Failed to create category" }
  }
}

export async function updateCategory(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const description = formData.get("description") as string

    if (!name) {
      return { success: false, error: "Category name is required" }
    }

    const categoryIndex = categories.findIndex((cat) => cat.id === id)

    if (categoryIndex === -1) {
      return { success: false, error: "Category not found" }
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    categories[categoryIndex] = {
      ...categories[categoryIndex],
      name,
      slug,
      description,
    }

    revalidatePath("/admin/categories")
    revalidatePath("/admin/blogs")

    return { success: true, category: categories[categoryIndex] }
  } catch (error) {
    console.error("[v0] Error updating category:", error)
    return { success: false, error: "Failed to update category" }
  }
}

export async function deleteCategory(id: string) {
  try {
    const categoryIndex = categories.findIndex((cat) => cat.id === id)

    if (categoryIndex === -1) {
      return { success: false, error: "Category not found" }
    }

    categories.splice(categoryIndex, 1)

    revalidatePath("/admin/categories")
    revalidatePath("/admin/blogs")

    return { success: true }
  } catch (error) {
    console.error("[v0] Error deleting category:", error)
    return { success: false, error: "Failed to delete category" }
  }
}
