"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { SpamChallenge } from "@/components/spam-challenge"
import { usePublicCsrf } from "@/hooks/use-public-csrf"
import { useTurnstileSiteKey } from "@/hooks/use-turnstile-site-key"

type BlogNewsletterFormProps = {
  variant?: "default" | "compact"
}

export function BlogNewsletterForm({ variant = "default" }: BlogNewsletterFormProps) {
  const compact = variant === "compact"
  const { token: csrfToken, ready: csrfReady, getFetchInit } = usePublicCsrf()
  const { siteKey: turnstileSiteKey, configured: turnstileConfigured, loading: turnstileLoading } =
    useTurnstileSiteKey()
  const [pending, setPending] = useState(false)
  const [consent, setConsent] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [turnstileKey, setTurnstileKey] = useState(0)

  const challengeReady = !turnstileConfigured || Boolean(turnstileToken?.trim())
  const hasCsrfToken = Boolean(csrfToken?.trim())
  const canSubmit = csrfReady && hasCsrfToken && challengeReady

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!hasCsrfToken) {
      toast.error("Loading security token… please wait a moment and try again.")
      return
    }
    const form = e.currentTarget
    const fd = new FormData(form)
    const payload = {
      email: String(fd.get("email") ?? ""),
      consent,
      _gotcha: String(fd.get("_gotcha") ?? ""),
      ...(turnstileToken ? { turnstileToken } : {}),
    }

    setPending(true)
    try {
      const res = await fetch("/api/newsletter", getFetchInit(payload))
      const data = (await res.json()) as {
        ok?: boolean
        error?: string
        alreadySubscribed?: boolean
        pendingConfirmation?: boolean
        fieldErrors?: { email?: string[]; consent?: string[] }
      }

      if (!res.ok) {
        const emailErr = data.fieldErrors?.email?.[0]
        const consentErr = data.fieldErrors?.consent?.[0]
        toast.error(emailErr || consentErr || data.error || "Could not subscribe.")
        return
      }

      if (data.alreadySubscribed) {
        toast.success("You're already subscribed — thanks for reading.")
      } else {
        toast.success("Check your email and click the link to confirm your subscription.")
      }
      form.reset()
      setConsent(false)
      setTurnstileToken(null)
      setTurnstileKey((k) => k + 1)
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setPending(false)
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={compact ? "space-y-3 text-left" : "space-y-4 max-w-md mx-auto text-left"}
    >
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="absolute opacity-0 pointer-events-none h-0 w-0" aria-hidden />

      <div key={turnstileKey} className="flex justify-center">
        <SpamChallenge siteKey={turnstileSiteKey} onToken={setTurnstileToken} />
      </div>

      <div className={compact ? "space-y-2" : "flex flex-col sm:flex-row gap-2"}>
        <Input
          name="email"
          type="email"
          required
          placeholder="you@company.com"
          autoComplete="email"
          disabled={pending}
          className={compact ? "w-full" : "flex-1"}
        />
        <Button type="submit" disabled={pending || turnstileLoading || !canSubmit} className={compact ? "w-full" : undefined}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : compact ? "Subscribe now" : "Subscribe"}
        </Button>
      </div>

      <div className="flex items-start gap-3">
        <Checkbox id="newsletter-consent" checked={consent} onCheckedChange={(v) => setConsent(v === true)} disabled={pending} />
        <Label htmlFor="newsletter-consent" className="text-sm font-normal leading-snug cursor-pointer text-muted-foreground">
          I agree to receive occasional emails with articles and updates. Unsubscribe anytime. *
        </Label>
      </div>
    </form>
  )
}
