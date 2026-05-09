import { randomBytes, timingSafeEqual } from "crypto"
import { CSRF_HEADER } from "./csrf-constants"

export const CSRF_COOKIE = "public_csrf"
export { CSRF_HEADER }

function safeEqual(a: string, b: string): boolean {
  try {
    const ba = Buffer.from(a, "utf8")
    const bb = Buffer.from(b, "utf8")
    if (ba.length !== bb.length) return false
    return timingSafeEqual(ba, bb)
  } catch {
    return false
  }
}

export function createCsrfToken(): string {
  return randomBytes(32).toString("hex")
}

/** Verify double-submit: cookie and header must match (non-empty). */
export function verifyPublicCsrf(request: Request): boolean {
  const rawCookie = request.headers.get("cookie") ?? ""
  const match = rawCookie.match(new RegExp(`(?:^|;\\s*)${CSRF_COOKIE}=([^;]+)`))
  const cookieToken = match?.[1] ? decodeURIComponent(match[1].trim()) : ""
  const headerToken = request.headers.get(CSRF_HEADER)?.trim() ?? ""

  if (!cookieToken || !headerToken || cookieToken.length < 32 || headerToken.length < 32) {
    return false
  }
  return safeEqual(cookieToken, headerToken)
}

export function csrfCookieOptions(): {
  httpOnly: boolean
  secure: boolean
  sameSite: "lax"
  path: string
  maxAge: number
} {
  return {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 4,
  }
}
