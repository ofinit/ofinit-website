"use server"

import { prisma } from "@/lib/db/prisma"
import { assertAdminAuthenticated } from "@/lib/auth/admin-session"
import { revalidatePath } from "next/cache"

export const SEO_SETTINGS_KEY = "seo_settings"

export type SeoSettingsStored = {
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  googleAnalyticsId: string
  googleSearchConsole: string
}

const DEFAULT_SEO: SeoSettingsStored = {
  metaTitle: "OfinIT Solutions - Web, Software & Mobile App Development",
  metaDescription:
    "Leading technology company specializing in web development, software solutions, mobile apps, AI integration, and DevOps services.",
  metaKeywords: "web development, software development, mobile apps, AI integration, DevOps",
  googleAnalyticsId: "",
  googleSearchConsole: "",
}

const REVALIDATE_PATHS = [
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

function revalidateAll() {
  for (const path of REVALIDATE_PATHS) {
    try {
      revalidatePath(path, "layout")
    } catch (e) {
      console.error(`Failed to revalidate path: ${path}`, e)
    }
  }
}

export async function getSeoSettings(): Promise<SeoSettingsStored> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key: SEO_SETTINGS_KEY } })
    if (!row?.value || typeof row.value !== "object") return { ...DEFAULT_SEO }
    const o = row.value as Partial<SeoSettingsStored>
    return {
      metaTitle: typeof o.metaTitle === "string" ? o.metaTitle : DEFAULT_SEO.metaTitle,
      metaDescription: typeof o.metaDescription === "string" ? o.metaDescription : DEFAULT_SEO.metaDescription,
      metaKeywords: typeof o.metaKeywords === "string" ? o.metaKeywords : DEFAULT_SEO.metaKeywords,
      googleAnalyticsId: typeof o.googleAnalyticsId === "string" ? o.googleAnalyticsId : DEFAULT_SEO.googleAnalyticsId,
      googleSearchConsole:
        typeof o.googleSearchConsole === "string" ? o.googleSearchConsole : DEFAULT_SEO.googleSearchConsole,
    }
  } catch (error) {
    console.error("[getSeoSettings] Database error, returning defaults:", error)
    return { ...DEFAULT_SEO }
  }
}

export async function saveSeoSettings(
  input: SeoSettingsStored,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await assertAdminAuthenticated()
  } catch {
    return { ok: false, error: "Your session expired. Sign in again." }
  }

  try {
    const payload = JSON.parse(JSON.stringify(input)) as object
    await prisma.siteSetting.upsert({
      where: { key: SEO_SETTINGS_KEY },
      create: { key: SEO_SETTINGS_KEY, value: payload },
      update: { value: payload },
    })
    revalidateAll()
    return { ok: true }
  } catch (e) {
    console.error("[saveSeoSettings] Failed to save settings:", e)
    return { ok: false, error: "Could not save SEO settings. Try again." }
  }
}
