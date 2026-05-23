"use client"

import { useEffect, useState } from "react"

type TurnstilePublicConfig = {
  configured: boolean
  siteKey: string | null
  loading: boolean
}

export function useTurnstileSiteKey(): TurnstilePublicConfig {
  const [siteKey, setSiteKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/public/turnstile-site-key", { cache: "no-store" })
        const data = (await res.json()) as { siteKey?: string | null; configured?: boolean }
        if (!cancelled) {
          setSiteKey(data.configured && data.siteKey ? data.siteKey : null)
        }
      } catch {
        if (!cancelled) setSiteKey(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return { configured: Boolean(siteKey), siteKey, loading }
}
