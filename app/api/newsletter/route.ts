import { randomBytes } from "crypto"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { newsletterSchema } from "@/lib/validations/leads"
import { getClientIp } from "@/lib/request-ip"
import { NEWSLETTER_RATE, rateLimitAllow } from "@/lib/rate-limit"
import { verifyTurnstileToken } from "@/lib/turnstile"
import { verifyPublicCsrf } from "@/lib/csrf-public"
import { sendNewsletterConfirmationEmail } from "@/lib/email/newsletter-confirm"

const TOKEN_TTL_MS = 48 * 60 * 60 * 1000

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export async function POST(request: Request) {
  try {
    const json = (await request.json()) as Record<string, unknown>
    if (typeof json._gotcha === "string" && json._gotcha.trim() !== "") {
      return NextResponse.json({ ok: true })
    }

    if (!verifyPublicCsrf(request)) {
      return NextResponse.json({ error: "Invalid security token. Please refresh the page." }, { status: 403 })
    }

    const ip = getClientIp(request)
    const limitKey = `newsletter:${ip}`
    if (!rateLimitAllow(limitKey, NEWSLETTER_RATE.max, NEWSLETTER_RATE.windowMs)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
    }

    const turnstileToken = typeof json.turnstileToken === "string" ? json.turnstileToken : undefined
    if (!(await verifyTurnstileToken(turnstileToken, ip))) {
      return NextResponse.json({ error: "Could not verify submission. Please refresh and try again." }, { status: 400 })
    }

    const parsed = newsletterSchema.safeParse(json)
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors
      return NextResponse.json({ error: "Validation failed", fieldErrors }, { status: 400 })
    }

    const email = normalizeEmail(parsed.data.email)

    const existing = await prisma.newsletterSubscription.findUnique({
      where: { email },
    })

    if (existing?.confirmedAt) {
      return NextResponse.json({ ok: true, alreadySubscribed: true })
    }

    const confirmToken = randomBytes(32).toString("hex")
    const tokenExpires = new Date(Date.now() + TOKEN_TTL_MS)

    await prisma.newsletterSubscription.upsert({
      where: { email },
      create: { email, confirmToken, tokenExpires },
      update: { confirmToken, tokenExpires },
    })

    const sent = await sendNewsletterConfirmationEmail(email, confirmToken)

    if (!sent) {
      await prisma.newsletterSubscription.deleteMany({ where: { email, confirmedAt: null } })
      return NextResponse.json(
        { error: "We could not send the confirmation email. Try again later or contact us directly." },
        { status: 503 },
      )
    }

    return NextResponse.json({ ok: true, pendingConfirmation: true })
  } catch (e) {
    console.error("[api/newsletter]", e)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
