"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db/prisma"
import { assertAdminAuthenticated } from "@/lib/auth/admin-session"
import { mergePublicSiteContent } from "@/lib/site-content/merge"
import type { PublicSiteContent } from "@/lib/site-content/types"
import { PUBLIC_SITE_SETTING_KEY } from "@/lib/site-content/types"

export async function getSiteContentForAdmin(): Promise<PublicSiteContent> {
  await assertAdminAuthenticated()
  const row = await prisma.siteSetting.findUnique({ where: { key: PUBLIC_SITE_SETTING_KEY } })
  return mergePublicSiteContent(row?.value ?? null)
}

export async function saveSiteContent(content: PublicSiteContent) {
  await assertAdminAuthenticated()
  const payload = JSON.parse(JSON.stringify(content)) as object
  await prisma.siteSetting.upsert({
    where: { key: PUBLIC_SITE_SETTING_KEY },
    create: { key: PUBLIC_SITE_SETTING_KEY, value: payload },
    update: { value: payload },
  })
  revalidatePath("/", "layout")
  revalidatePath("/blog", "layout")
  revalidatePath("/case-studies", "layout")
  revalidatePath("/cancel-refund-policy", "layout")
  return { success: true as const }
}
