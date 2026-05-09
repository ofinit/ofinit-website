import { prisma } from "@/lib/db/prisma"
import { mergePublicSiteContent } from "./merge"
import type { PublicSiteContent } from "./types"
import { PUBLIC_SITE_SETTING_KEY } from "./types"

export async function loadPublicSiteContent(): Promise<PublicSiteContent> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key: PUBLIC_SITE_SETTING_KEY } })
    return mergePublicSiteContent(row?.value ?? null)
  } catch {
    const { getDefaultSiteContent } = await import("./defaults")
    return getDefaultSiteContent()
  }
}
