import { NextResponse } from "next/server"
import { createCsrfToken, CSRF_COOKIE, csrfCookieOptions } from "@/lib/csrf-public"

export async function GET() {
  const token = createCsrfToken()
  const res = NextResponse.json({ csrfToken: token })
  res.cookies.set(CSRF_COOKIE, token, csrfCookieOptions())
  return res
}
