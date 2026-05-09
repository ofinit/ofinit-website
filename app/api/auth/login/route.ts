import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db/prisma"

export async function POST(request: Request) {
  const formData = await request.formData()
  const email = String(formData.get("email") ?? "")
  const password = String(formData.get("password") ?? "")

  try {
    const user = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase().trim() } })
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.redirect(new URL("/login?error=invalid", request.url))
    }

    const cookieStore = await cookies()
    cookieStore.set("admin_authenticated", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })

    return NextResponse.redirect(new URL("/admin", request.url))
  } catch (e) {
    console.error("Login error:", e)
    return NextResponse.redirect(new URL("/login?error=invalid", request.url))
  }
}
