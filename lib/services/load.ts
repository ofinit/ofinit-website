import { prisma } from "@/lib/db/prisma"
import { getDefaultServices } from "./defaults"
import { resolveServiceBodyMd } from "./default-bodies"

export type ServicePublic = {
  slug: string
  name: string
  shortDescription: string
  bodyMd: string
  logoUrl: string | null
}

export async function loadPublishedServices(): Promise<ServicePublic[]> {
  try {
    const rows = await prisma.service.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    })
    if (rows.length) {
      return rows.map((r) => ({
        slug: r.slug,
        name: r.name,
        shortDescription: r.shortDescription,
        bodyMd: resolveServiceBodyMd(r.bodyMd, r.slug, r.shortDescription),
        logoUrl: r.logoUrl ?? null,
      }))
    }
  } catch {
    // ignore; fallback below
  }

  return getDefaultServices().map((s) => ({
    slug: s.slug,
    name: s.name,
    shortDescription: s.shortDescription,
    bodyMd: resolveServiceBodyMd(s.bodyMd, s.slug, s.shortDescription),
    logoUrl: null,
  }))
}

export async function loadServiceBySlug(slug: string): Promise<ServicePublic | null> {
  try {
    const row = await prisma.service.findFirst({ where: { slug, published: true } })
    if (row) {
      return {
        slug: row.slug,
        name: row.name,
        shortDescription: row.shortDescription,
        bodyMd: resolveServiceBodyMd(row.bodyMd, row.slug, row.shortDescription),
        logoUrl: row.logoUrl ?? null,
      }
    }
  } catch {
    // ignore; fallback below
  }

  const def = getDefaultServices().find((s) => s.slug === slug)
  if (!def) return null
  return {
    slug: def.slug,
    name: def.name,
    shortDescription: def.shortDescription,
    bodyMd: resolveServiceBodyMd(def.bodyMd, def.slug, def.shortDescription),
    logoUrl: null,
  }
}

