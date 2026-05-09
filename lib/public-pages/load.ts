import { prisma } from "@/lib/db/prisma"
import type { PublicPageContent, PublicPageSlug } from "./types"
import { getDefaultPublicPage } from "./defaults"

export async function loadPublicPage(slug: PublicPageSlug): Promise<PublicPageContent> {
  try {
    const row = await prisma.publicPage.findUnique({ where: { slug } })
    if (!row) return getDefaultPublicPage(slug)
    return {
      slug,
      title: row.title,
      bodyMd: row.bodyMd,
    }
  } catch {
    return getDefaultPublicPage(slug)
  }
}

