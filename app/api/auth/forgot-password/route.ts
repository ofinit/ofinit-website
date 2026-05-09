import { NextResponse } from "next/server"
import { randomBytes } from "crypto"
import { prisma } from "@/lib/db/prisma"
import { sendAdminPasswordResetEmail } from "@/lib/email/admin-password-reset"

const ONE_HOUR_MS = 60 * 60 * 1000

function makeToken(): string {
  return randomBytes(32).toString("hex")
}

export async function POST(request: Request) {
  const formData = await request.formData()
  const emailRaw = String(formData.get("email") ?? "").toLowerCase().trim()

  const redirectBase = new URL("/login/forgot-password", request.url)

  if (!emailRaw) {
    redirectBase.searchParams.set("error", "missing")
    return NextResponse.redirect(redirectBase)
  }

  try {
    const user = await prisma.adminUser.findUnique({ where: { email: emailRaw } })

    // Always same response to avoid email enumeration
    if (user) {
      await prisma.adminPasswordResetToken.deleteMany({ where: { email: emailRaw } })
      const token = makeToken()
      const expiresAt = new Date(Date.now() + ONE_HOUR_MS)
      await prisma.adminPasswordResetToken.create({
        data: { token, email: emailRaw, expiresAt },
      })
      const sent = await sendAdminPasswordResetEmail(emailRaw, token)
      if (!sent && process.env.NODE_ENV === "production") {
        console.error("[forgot-password] email failed in production for", emailRaw)
      }
    }

    redirectBase.searchParams.set("sent", "1")
    return NextResponse.redirect(redirectBase)
  } catch (e) {
    console.error("[forgot-password]", e)
    redirectBase.searchParams.set("error", "server")
    return NextResponse.redirect(redirectBase)
  }
}
