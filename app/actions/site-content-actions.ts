"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db/prisma"
import { assertAdminAuthenticated } from "@/lib/auth/admin-session"
import { joinContactAddress, splitContactAddress } from "@/lib/site-content/address"
import { mergePublicSiteContent } from "@/lib/site-content/merge"
import type { PublicSiteContent } from "@/lib/site-content/types"
import { PUBLIC_SITE_SETTING_KEY } from "@/lib/site-content/types"

export type PublicContactSettings = {
  contactEmail: string
  contactPhone: string
  contactAddress: string
}

const REVALIDATE_LAYOUT_PATHS = [
  "/",
  "/blog",
  "/case-studies",
  "/cancel-refund-policy",
  "/privacy-policy",
  "/terms-of-service",
  "/cookie-policy",
  "/careers",
  "/services",
] as const

function revalidatePublicLayouts() {
  for (const path of REVALIDATE_LAYOUT_PATHS) {
    revalidatePath(path, "layout")
  }
}

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
  revalidatePublicLayouts()
  return { success: true as const }
}

/** Contact fields shown in Settings → General (same data as footer on the public site). */
export async function getPublicContactSettings(): Promise<PublicContactSettings> {
  await assertAdminAuthenticated()
  const content = await getSiteContentForAdmin()
  return {
    contactEmail: content.footer.contactEmail,
    contactPhone: content.footer.contactPhone,
    contactAddress: joinContactAddress(content.footer.contactAddressLine1, content.footer.contactAddressLine2),
  }
}

export async function savePublicContactSettings(
  input: PublicContactSettings,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await assertAdminAuthenticated()
    const content = await getSiteContentForAdmin()
    const { line1, line2 } = splitContactAddress(input.contactAddress)

    const next: PublicSiteContent = {
      ...content,
      footer: {
        ...content.footer,
        contactEmail: input.contactEmail.trim(),
        contactPhone: input.contactPhone.trim(),
        contactAddressLine1: line1,
        contactAddressLine2: line2,
      },
    }

    await saveSiteContent(mergePublicSiteContent(next))
    return { ok: true }
  } catch (e) {
    console.error("[savePublicContactSettings]", e)
    return { ok: false, error: "Could not save contact details. Try again." }
  }
}
