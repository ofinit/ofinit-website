"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db/prisma"
import { assertAdminAuthenticated } from "@/lib/auth/admin-session"
import type { PublicPageContent, PublicPageSlug } from "@/lib/public-pages/types"
import { getDefaultPublicPage } from "@/lib/public-pages/defaults"

type PublicPageAdminRow = {
  slug: PublicPageSlug
  title: string
  updatedAt: Date
}

export async function listPublicPagesForAdmin(): Promise<PublicPageAdminRow[]> {
  await assertAdminAuthenticated()
  const rows = await prisma.publicPage.findMany({ orderBy: { updatedAt: "desc" } })
  return rows.map((r) => ({ slug: r.slug as PublicPageSlug, title: r.title, updatedAt: r.updatedAt }))
}

export async function getPublicPageForAdmin(slug: PublicPageSlug): Promise<PublicPageContent> {
  await assertAdminAuthenticated()
  const row = await prisma.publicPage.findUnique({ where: { slug } })
  if (!row) return getDefaultPublicPage(slug)
  return { slug, title: row.title, bodyMd: row.bodyMd }
}

export async function savePublicPageForAdmin(slug: PublicPageSlug, formData: FormData) {
  await assertAdminAuthenticated()
  const title = String(formData.get("title") ?? "").trim()
  const bodyMd = String(formData.get("bodyMd") ?? "").trim()

  if (!title) return { success: false as const, error: "Title is required" }
  if (!bodyMd) return { success: false as const, error: "Body is required" }

  await prisma.publicPage.upsert({
    where: { slug },
    create: { slug, title, bodyMd },
    update: { title, bodyMd },
  })

  revalidatePath(`/${slug}`, "layout")
  revalidatePath("/admin/pages")

  return { success: true as const }
}

export async function deletePublicPageForAdmin(slug: PublicPageSlug) {
  await assertAdminAuthenticated()
  await prisma.publicPage.delete({ where: { slug } })
  revalidatePath("/admin/pages")
  revalidatePath(`/${slug}`, "layout")
  return { success: true as const }
}

