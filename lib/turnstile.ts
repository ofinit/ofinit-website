/**
 * Optional Cloudflare Turnstile verification.
 * Set TURNSTILE_SECRET_KEY in env; send `turnstileToken` from the client widget.
 * @see https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */
export async function verifyTurnstileToken(token: string | undefined, remoteip?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true

  if (!token?.trim()) return false

  try {
    const body = new URLSearchParams()
    body.set("secret", secret)
    body.set("response", token.trim())
    if (remoteip && remoteip !== "unknown") body.set("remoteip", remoteip)

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
    })

    const data = (await res.json()) as { success?: boolean }
    return data.success === true
  } catch {
    return false
  }
}
