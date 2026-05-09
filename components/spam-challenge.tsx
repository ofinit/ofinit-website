"use client"

import { Turnstile } from "@marsidev/react-turnstile"

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

type Props = {
  onToken: (token: string | null) => void
}

/** Cloudflare Turnstile (optional). Set NEXT_PUBLIC_TURNSTILE_SITE_KEY + TURNSTILE_SECRET_KEY in production. */
export function SpamChallenge({ onToken }: Props) {
  if (!siteKey) return null

  return (
    <div className="flex justify-center sm:justify-start">
      <Turnstile
        siteKey={siteKey}
        onSuccess={(t) => onToken(t)}
        onExpire={() => onToken(null)}
        options={{ theme: "light", size: "normal" }}
      />
    </div>
  )
}

export function isTurnstileConfigured(): boolean {
  return Boolean(siteKey)
}
