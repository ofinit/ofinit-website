"use server"

import { revalidatePath } from "next/cache"
import { randomUUID } from "crypto"
import { prisma } from "@/lib/db/prisma"
import { assertAdminAuthenticated } from "@/lib/auth/admin-session"
import { serviceSlugFromName } from "@/lib/services/slug"

export type AdminService = {
  id: string
  slug: string
  name: string
  shortDescription: string
  bodyMd: string
  logoUrl: string | null
  published: boolean
  sortOrder: number
  updatedAt: string
}

function rowToAdminService(row: {
  id: string
  slug: string
  name: string
  shortDescription: string
  bodyMd: string
  logoUrl: string | null
  published: boolean
  sortOrder: number
  updatedAt: Date
}): AdminService {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDescription: row.shortDescription,
    bodyMd: row.bodyMd,
    logoUrl: row.logoUrl,
    published: row.published,
    sortOrder: row.sortOrder,
    updatedAt: row.updatedAt.toISOString(),
  }
}

export async function listServicesForAdmin(): Promise<AdminService[]> {
  await assertAdminAuthenticated()
  const rows = await prisma.service.findMany({ orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }] })
  return rows.map(rowToAdminService)
}

export async function getServiceByIdForAdmin(id: string): Promise<AdminService | null> {
  await assertAdminAuthenticated()
  const row = await prisma.service.findUnique({ where: { id } })
  return row ? rowToAdminService(row) : null
}

export async function createServiceForAdmin(formData: FormData) {
  await assertAdminAuthenticated()
  const name = String(formData.get("name") ?? "").trim()
  const slugRaw = String(formData.get("slug") ?? "").trim()
  const shortDescription = String(formData.get("shortDescription") ?? "").trim()
  const bodyMd = String(formData.get("bodyMd") ?? "").trim()
  const logoUrl = String(formData.get("logoUrl") ?? "").trim()
  const published = String(formData.get("published") ?? "") === "on"
  const sortOrder = Number(formData.get("sortOrder") ?? "0") || 0

  if (!name) return { success: false as const, error: "Name is required" }
  if (!shortDescription) return { success: false as const, error: "Short description is required" }
  if (!bodyMd) return { success: false as const, error: "Body is required" }

  const slug = slugRaw ? serviceSlugFromName(slugRaw) : serviceSlugFromName(name)
  const id = randomUUID()

  try {
    await prisma.service.create({
      data: {
        id,
        slug,
        name,
        shortDescription,
        bodyMd,
        logoUrl: logoUrl || null,
        published,
        sortOrder,
      },
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    if (msg.toLowerCase().includes("unique") || msg.toLowerCase().includes("constraint")) {
      return { success: false as const, error: "Slug already exists. Choose a different one." }
    }
    return { success: false as const, error: "Failed to create service" }
  }

  revalidatePath("/admin/services")
  revalidatePath("/services")
  revalidatePath(`/services/${slug}`, "layout")

  return { success: true as const, id }
}

export async function updateServiceForAdmin(id: string, formData: FormData) {
  await assertAdminAuthenticated()
  const name = String(formData.get("name") ?? "").trim()
  const slugRaw = String(formData.get("slug") ?? "").trim()
  const shortDescription = String(formData.get("shortDescription") ?? "").trim()
  const bodyMd = String(formData.get("bodyMd") ?? "").trim()
  const logoUrl = String(formData.get("logoUrl") ?? "").trim()
  const published = String(formData.get("published") ?? "") === "on"
  const sortOrder = Number(formData.get("sortOrder") ?? "0") || 0

  if (!name) return { success: false as const, error: "Name is required" }
  if (!shortDescription) return { success: false as const, error: "Short description is required" }
  if (!bodyMd) return { success: false as const, error: "Body is required" }

  const slug = slugRaw ? serviceSlugFromName(slugRaw) : serviceSlugFromName(name)

  const existing = await prisma.service.findUnique({ where: { id } })
  if (!existing) return { success: false as const, error: "Service not found" }

  try {
    await prisma.service.update({
      where: { id },
      data: {
        slug,
        name,
        shortDescription,
        bodyMd,
        logoUrl: logoUrl || null,
        published,
        sortOrder,
      },
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    if (msg.toLowerCase().includes("unique") || msg.toLowerCase().includes("constraint")) {
      return { success: false as const, error: "Slug already exists. Choose a different one." }
    }
    return { success: false as const, error: "Failed to update service" }
  }

  revalidatePath("/admin/services")
  revalidatePath("/services")
  revalidatePath(`/services/${existing.slug}`, "layout")
  revalidatePath(`/services/${slug}`, "layout")

  return { success: true as const }
}

export async function deleteServiceForAdmin(id: string) {
  await assertAdminAuthenticated()
  const existing = await prisma.service.findUnique({ where: { id } })
  if (!existing) return { success: false as const, error: "Service not found" }

  await prisma.service.delete({ where: { id } })
  revalidatePath("/admin/services")
  revalidatePath("/services")
  revalidatePath(`/services/${existing.slug}`, "layout")
  return { success: true as const }
}

