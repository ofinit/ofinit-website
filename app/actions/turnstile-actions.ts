"use server"

import { assertAdminAuthenticated } from "@/lib/auth/admin-session"
import {
  loadTurnstileSettingsFromDb,
  maskTurnstileSecret,
  resolveTurnstileSettings,
  saveTurnstileSettingsToDb,
  type TurnstileSettingsStored,
} from "@/lib/turnstile/config"

export type TurnstileAdminView = {
  enabled: boolean
  siteKey: string
  secretKeyMasked: string
  hasSecretKey: boolean
  activeSource: "database" | "environment" | "none"
  envSiteKeyPresent: boolean
  envSecretPresent: boolean
}

export type TurnstileSaveInput = {
  enabled: boolean
  siteKey: string
  secretKey: string
  clearSecret?: boolean
}

export type TurnstileActionResult = { ok: true } | { ok: false; error: string }

export async function getTurnstileSettingsForAdmin(): Promise<TurnstileAdminView> {
  await assertAdminAuthenticated()
  const db = await loadTurnstileSettingsFromDb()
  const resolved = await resolveTurnstileSettings()

  const envSiteKeyPresent = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim())
  const envSecretPresent = Boolean(process.env.TURNSTILE_SECRET_KEY?.trim())

  return {
    enabled: db.enabled,
    siteKey: db.siteKey || (resolved.source === "environment" ? resolved.siteKey : ""),
    secretKeyMasked: db.secretKey ? maskTurnstileSecret(db.secretKey) : "",
    hasSecretKey: Boolean(db.secretKey),
    activeSource: resolved.source,
    envSiteKeyPresent,
    envSecretPresent,
  }
}

export async function saveTurnstileSettings(input: TurnstileSaveInput): Promise<TurnstileActionResult> {
  try {
    await assertAdminAuthenticated()
  } catch {
    return { ok: false, error: "Your session expired. Sign in again." }
  }

  const siteKey = input.siteKey.trim()
  const newSecret = input.secretKey.trim()
  const existing = await loadTurnstileSettingsFromDb()

  if (input.enabled) {
    if (!siteKey) {
      return { ok: false, error: "Site key is required when Turnstile is enabled." }
    }
    const secret = input.clearSecret ? "" : newSecret || existing.secretKey
    if (!secret) {
      return { ok: false, error: "Secret key is required when Turnstile is enabled (paste a new key or keep the existing one)." }
    }
    if (!siteKey.startsWith("0x")) {
      return { ok: false, error: "Site key usually starts with 0x. Check you copied the Site key, not the Secret key." }
    }
  }

  const next: TurnstileSettingsStored = {
    enabled: input.enabled,
    siteKey,
    secretKey: input.clearSecret ? "" : newSecret || existing.secretKey,
  }

  if (input.enabled && !next.secretKey) {
    return { ok: false, error: "Secret key is required when Turnstile is enabled." }
  }

  try {
    await saveTurnstileSettingsToDb(next)
    return { ok: true }
  } catch (e) {
    console.error("[saveTurnstileSettings]", e)
    return { ok: false, error: "Could not save Turnstile settings." }
  }
}
