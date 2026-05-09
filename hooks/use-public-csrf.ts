"use client"

import { useCallback, useEffect, useState } from "react"
import { CSRF_HEADER } from "@/lib/csrf-constants"

type State = { token: string | null; ready: boolean }

/**
 * Fetches CSRF token (sets cookie + returns token). Include in public POST JSON routes.
 */
export function usePublicCsrf(): State & { getFetchInit: (body: object) => RequestInit } {
  const [token, setToken] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/csrf", { credentials: "include" })
        const data = (await res.json()) as { csrfToken?: string }
        if (!cancelled && data.csrfToken) setToken(data.csrfToken)
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setReady(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const getFetchInit = useCallback(
    (body: object): RequestInit => ({
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { [CSRF_HEADER]: token } : {}),
      },
      body: JSON.stringify(body),
    }),
    [token],
  )

  return { token, ready, getFetchInit }
}
