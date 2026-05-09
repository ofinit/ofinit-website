import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db/prisma"

const MIN_PASSWORD = 8

export async function POST(request: Request) {
  const formData = await request.formData()
  const token = String(formData.get("token") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const confirm = String(formData.get("confirm") ?? "")

  const baseLogin = new URL("/login", request.url)
  const baseReset = new URL("/login/reset-password", request.url)

  if (!token) {
    baseReset.searchParams.set("error", "missing_token")
    return NextResponse.redirect(baseReset)
  }

  if (password.length < MIN_PASSWORD) {
    baseReset.searchParams.set("token", token)
    baseReset.searchParams.set("error", "weak")
    return NextResponse.redirect(baseReset)
  }

  if (password !== confirm) {
    baseReset.searchParams.set("token", token)
    baseReset.searchParams.set("error", "mismatch")
    return NextResponse.redirect(baseReset)
  }

  try {
    const row = await prisma.adminPasswordResetToken.findUnique({ where: { token } })
    if (!row || row.expiresAt < new Date()) {
      baseReset.searchParams.set("error", "invalid")
      return NextResponse.redirect(baseReset)
    }

    const passwordHash = await bcrypt.hash(password, 10)
    await prisma.adminUser.update({
      where: { email: row.email },
      data: { passwordHash },
    })
    await prisma.adminPasswordResetToken.delete({ where: { id: row.id } })

    baseLogin.searchParams.set("reset", "success")
    return NextResponse.redirect(baseLogin)
  } catch (e) {
    console.error("[reset-password]", e)
    baseReset.searchParams.set("token", token)
    baseReset.searchParams.set("error", "server")
    return NextResponse.redirect(baseReset)
  }
}
