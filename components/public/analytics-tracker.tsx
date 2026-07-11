"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import Script from "next/script"

export function AnalyticsTracker() {
  const pathname = usePathname()
  const lastPathname = useRef<string | null>(null)

  useEffect(() => {
    // Exclude admin and login pages from custom analytics tracking
    if (pathname.startsWith("/admin") || pathname.startsWith("/login")) return

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

export function GoogleAnalyticsTracker({ googleAnalyticsId }: { googleAnalyticsId: string }) {
  const pathname = usePathname()

  if (!googleAnalyticsId) return null
  
  // Exclude admin and login pages from Google Analytics tracking
  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${googleAnalyticsId}');
        `}
      </Script>
    </>
  )
}
