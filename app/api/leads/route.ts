import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { contactLeadSchema } from "@/lib/validations/leads"

export async function POST(request: Request) {
  try {
    const json = (await request.json()) as Record<string, unknown>
    if (typeof json._gotcha === "string" && json._gotcha.trim() !== "") {
      return NextResponse.json({ ok: true })
    }

    const parsed = contactLeadSchema.safeParse(json)
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors
      return NextResponse.json({ error: "Validation failed", fieldErrors }, { status: 400 })
    }

    const { name, email, company, phone, message } = parsed.data

    await prisma.leadSubmission.create({
      data: {
        source: "contact",
        name,
        email,
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
