"use client"

import { Turnstile } from "@marsidev/react-turnstile"

type Props = {
  siteKey: string | null
  onToken: (token: string | null) => void
}

/** Cloudflare Turnstile widget; siteKey from /api/public/turnstile-site-key or admin settings. */
export function SpamChallenge({ siteKey, onToken }: Props) {
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
