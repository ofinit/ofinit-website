import { NextResponse } from "next/server"
import { getTurnstileSiteKeyPublic } from "@/lib/turnstile/config"

export const runtime = "nodejs"

/** Public site key for the Turnstile widget (safe to expose; paired with server-side secret). */
export async function GET() {
  const siteKey = await getTurnstileSiteKeyPublic()
  return NextResponse.json(
    { configured: Boolean(siteKey), siteKey },
    { headers: { "Cache-Control": "no-store" } },
  )
}
