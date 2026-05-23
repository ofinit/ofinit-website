import { prisma } from "@/lib/db/prisma"

export const TURNSTILE_SETTINGS_KEY = "turnstile_settings"

export type TurnstileSettingsStored = {
  enabled: boolean
  siteKey: string
  secretKey: string
}

export type TurnstileSettingsResolved = {
  enabled: boolean
  siteKey: string
  secretKey: string
  source: "database" | "environment" | "none"
}

const EMPTY: TurnstileSettingsStored = {
  enabled: false,
  siteKey: "",
  secretKey: "",
}

function fromEnv(): TurnstileSettingsStored | null {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? ""
  const secretKey = process.env.TURNSTILE_SECRET_KEY?.trim() ?? ""
  if (!siteKey && !secretKey) return null
  return {
    enabled: Boolean(secretKey),
    siteKey,
    secretKey,
  }
}

function parseStored(raw: unknown): TurnstileSettingsStored {
  if (!raw || typeof raw !== "object") return { ...EMPTY }
  const o = raw as Partial<TurnstileSettingsStored>
  return {
    enabled: o.enabled === true,
    siteKey: typeof o.siteKey === "string" ? o.siteKey.trim() : "",
    secretKey: typeof o.secretKey === "string" ? o.secretKey.trim() : "",
  }
}

export async function loadTurnstileSettingsFromDb(): Promise<TurnstileSettingsStored> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key: TURNSTILE_SETTINGS_KEY } })
    return parseStored(row?.value ?? null)
  } catch {
    return { ...EMPTY }
  }
}

export async function saveTurnstileSettingsToDb(settings: TurnstileSettingsStored): Promise<void> {
  const payload = JSON.parse(JSON.stringify(settings)) as object
  await prisma.siteSetting.upsert({
    where: { key: TURNSTILE_SETTINGS_KEY },
    create: { key: TURNSTILE_SETTINGS_KEY, value: payload },
    update: { value: payload },
  })
}

/** Effective config: admin DB settings override env when site + secret are present in DB. */
export async function resolveTurnstileSettings(): Promise<TurnstileSettingsResolved> {
  const db = await loadTurnstileSettingsFromDb()
  const hasDbKeys = Boolean(db.siteKey && db.secretKey)

  if (hasDbKeys) {
    return {
      enabled: db.enabled,
      siteKey: db.siteKey,
      secretKey: db.secretKey,
      source: "database",
    }
  }

  const env = fromEnv()
  if (env?.siteKey && env.secretKey) {
    return {
      enabled: env.enabled,
      siteKey: env.siteKey,
      secretKey: env.secretKey,
      source: "environment",
    }
  }

  return { enabled: false, siteKey: "", secretKey: "", source: "none" }
}

export async function getTurnstileSecretKey(): Promise<string | null> {
  const cfg = await resolveTurnstileSettings()
  if (!cfg.enabled || !cfg.secretKey) return null
  return cfg.secretKey
}

export async function getTurnstileSiteKeyPublic(): Promise<string | null> {
  const cfg = await resolveTurnstileSettings()
  if (!cfg.enabled || !cfg.siteKey) return null
  return cfg.siteKey
}

export async function isTurnstileVerificationRequired(): Promise<boolean> {
  const secret = await getTurnstileSecretKey()
  return Boolean(secret)
}

export function maskTurnstileSecret(secret: string): string {
  const s = secret.trim()
  if (!s) return ""
  if (s.length <= 10) return "••••••••"
  return `${s.slice(0, 8)}…${s.slice(-4)}`
}
