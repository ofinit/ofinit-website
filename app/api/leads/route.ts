import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { contactLeadSchema } from "@/lib/validations/leads"
import { getClientIp } from "@/lib/request-ip"
import { LEADS_RATE, rateLimitAllow } from "@/lib/rate-limit"
import { verifyTurnstileToken } from "@/lib/turnstile"
import { verifyPublicCsrf } from "@/lib/csrf-public"

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
    const limitKey = `leads:${ip}`
    if (!rateLimitAllow(limitKey, LEADS_RATE.max, LEADS_RATE.windowMs)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
    }

    const turnstileToken = typeof json.turnstileToken === "string" ? json.turnstileToken : undefined
    if (!(await verifyTurnstileToken(turnstileToken, ip))) {
      return NextResponse.json({ error: "Could not verify submission. Please refresh and try again." }, { status: 400 })
    }

    const parsed = contactLeadSchema.safeParse(json)
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors
      return NextResponse.json({ error: "Validation failed", fieldErrors }, { status: 400 })
    }

    const { name, email, company, phone, message } = parsed.data
    const emailNorm = email.trim().toLowerCase()

    await prisma.leadSubmission.create({
      data: {
        source: "contact",
        name,
        email: emailNorm,
        company: company?.trim() || null,
        phone: phone?.trim() || null,
        message,
        consent: true,
        pageUrl: request.headers.get("referer")?.slice(0, 2000) ?? null,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("[api/leads]", e)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
