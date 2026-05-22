import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db/prisma"
import { getRequestOrigin } from "@/lib/request-origin"

const MIN_PASSWORD = 8

export async function POST(request: Request) {
  const formData = await request.formData()
  const token = String(formData.get("token") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const confirm = String(formData.get("confirm") ?? "")

  const origin = getRequestOrigin(request)
  const baseLogin = new URL("/login", origin)
  const baseReset = new URL("/login/reset-password", origin)

  if (!token) {
    baseReset.searchParams.set("error", "missing_token")
    return Response.redirect(baseReset.toString(), 302)
  }

  if (password.length < MIN_PASSWORD) {
    baseReset.searchParams.set("token", token)
    baseReset.searchParams.set("error", "weak")
    return Response.redirect(baseReset.toString(), 302)
  }

  if (password !== confirm) {
    baseReset.searchParams.set("token", token)
    baseReset.searchParams.set("error", "mismatch")
    return Response.redirect(baseReset.toString(), 302)
  }

  try {
    const row = await prisma.adminPasswordResetToken.findUnique({ where: { token } })
    if (!row || row.expiresAt < new Date()) {
      baseReset.searchParams.set("error", "invalid")
      return Response.redirect(baseReset.toString(), 302)
    }

    const passwordHash = await bcrypt.hash(password, 10)
    await prisma.adminUser.update({
      where: { email: row.email },
      data: { passwordHash },
    })
    await prisma.adminPasswordResetToken.delete({ where: { id: row.id } })

    baseLogin.searchParams.set("reset", "success")
    return Response.redirect(baseLogin.toString(), 302)
  } catch (e) {
    console.error("[reset-password]", e)
    baseReset.searchParams.set("token", token)
    baseReset.searchParams.set("error", "server")
    return Response.redirect(baseReset.toString(), 302)
  }
}
