"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { isTurnstileConfigured, SpamChallenge } from "@/components/spam-challenge"
import { usePublicCsrf } from "@/hooks/use-public-csrf"

type FieldErrors = Partial<Record<"name" | "email" | "company" | "phone" | "message" | "consent", string[]>>

export function ContactLeadForm() {
  const { token: csrfToken, ready: csrfReady, getFetchInit } = usePublicCsrf()
  const [pending, setPending] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [consent, setConsent] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [turnstileKey, setTurnstileKey] = useState(0)

  const needChallenge = isTurnstileConfigured()
  const challengeReady = !needChallenge || Boolean(turnstileToken?.trim())
  const csrfOk = Boolean(csrfToken?.trim())

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!csrfOk) {
      toast.error("Loading security token… please wait a moment and try again.")
      return
    }
    setErrors({})
    const form = e.currentTarget
    const fd = new FormData(form)
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      company: String(fd.get("company") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      message: String(fd.get("message") ?? ""),
      consent,
      _gotcha: String(fd.get("_gotcha") ?? ""),
      ...(turnstileToken ? { turnstileToken } : {}),
    }

    setPending(true)
    try {
      const res = await fetch("/api/leads", getFetchInit(payload))
      const data = (await res.json()) as { ok?: boolean; error?: string; fieldErrors?: FieldErrors }

      if (!res.ok) {
        if (data.fieldErrors) {
          setErrors(data.fieldErrors)
          toast.error("Please check the highlighted fields.")
        } else {
          toast.error(data.error || "Could not send your message.")
        }
        return
      }

      toast.success("Thanks — we'll get back to you within one business day.")
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
    <form onSubmit={onSubmit} className="space-y-5">
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="absolute opacity-0 pointer-events-none h-0 w-0" aria-hidden />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lead-name">Name *</Label>
          <Input id="lead-name" name="name" required autoComplete="name" disabled={pending} aria-invalid={!!errors.name?.length} />
          {errors.name?.[0] ? <p className="text-sm text-destructive">{errors.name[0]}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lead-email">Work email *</Label>
          <Input
            id="lead-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            disabled={pending}
            aria-invalid={!!errors.email?.length}
          />
          {errors.email?.[0] ? <p className="text-sm text-destructive">{errors.email[0]}</p> : null}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lead-company">Company</Label>
          <Input id="lead-company" name="company" autoComplete="organization" disabled={pending} />
          {errors.company?.[0] ? <p className="text-sm text-destructive">{errors.company[0]}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lead-phone">Phone</Label>
          <Input id="lead-phone" name="phone" type="tel" autoComplete="tel" disabled={pending} />
          {errors.phone?.[0] ? <p className="text-sm text-destructive">{errors.phone[0]}</p> : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="lead-message">Project / goals *</Label>
        <Textarea
          id="lead-message"
          name="message"
          required
          rows={5}
          placeholder="Briefly describe what you need — timeline and budget help us respond faster."
          disabled={pending}
          aria-invalid={!!errors.message?.length}
        />
        {errors.message?.[0] ? <p className="text-sm text-destructive">{errors.message[0]}</p> : null}
      </div>

      <div className="flex items-start gap-3">
        <Checkbox
          id="lead-consent"
          checked={consent}
          onCheckedChange={(v) => setConsent(v === true)}
          disabled={pending}
          aria-invalid={!!errors.consent?.length}
        />
        <Label htmlFor="lead-consent" className="text-sm font-normal leading-snug cursor-pointer text-muted-foreground">
          I agree that OfinIT may store and use these details to respond to my inquiry. *
        </Label>
      </div>
      {errors.consent?.[0] ? <p className="text-sm text-destructive -mt-2">{errors.consent[0]}</p> : null}

      <div key={turnstileKey}>
        <SpamChallenge onToken={setTurnstileToken} />
      </div>
      {needChallenge ? (
        <p className="text-xs text-muted-foreground">
          Complete the verification above to enable submit (spam protection).
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        className="min-w-[160px]"
        disabled={pending || !challengeReady || !csrfReady || !csrfOk}
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          "Send message"
        )}
      </Button>
    </form>
  )
}
