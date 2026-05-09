"use client"

import { useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"

export function BlogNewsletterToast() {
  const sp = useSearchParams()
  const router = useRouter()
  const handled = useRef(false)

  useEffect(() => {
    const n = sp.get("newsletter")
    if (!n || (n !== "confirmed" && n !== "invalid")) return
    if (handled.current) return
    handled.current = true

    if (n === "confirmed") {
      toast.success("Your subscription is confirmed. Welcome!")
    } else {
      toast.error("This confirmation link is invalid or has expired.")
    }

    router.replace("/blog", { scroll: false })
  }, [sp, router])

  return null
}
