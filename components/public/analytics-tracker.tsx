"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export function AnalyticsTracker() {
  const pathname = usePathname()
  const lastPathname = useRef<string | null>(null)

  useEffect(() => {
    // Avoid double tracking in development React StrictMode if pathname hasn't changed
    if (lastPathname.current === pathname) return
    lastPathname.current = pathname

    // Run track ping
    const track = async () => {
      try {
        await fetch("/api/analytics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: pathname,
            referrer: document.referrer || "",
          }),
        })
      } catch {
        // Fail silently to not impact user experience
      }
    }

    // Schedule slightly after load to prioritize core page content load speeds
    const timer = setTimeout(track, 1000)
    return () => clearTimeout(timer)
  }, [pathname])

  return null
}
