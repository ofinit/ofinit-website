import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db/prisma"
import { redirectTo } from "@/lib/request-origin"

export async function POST(request: Request) {
  const formData = await request.formData()
  const email = String(formData.get("email") ?? "")
  const password = String(formData.get("password") ?? "")

  try {
    const user = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase().trim() } })
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return redirectTo(request, "/login?error=invalid")
    }

    const cookieStore = await cookies()
    cookieStore.set("admin_authenticated", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })

    return redirectTo(request, "/admin")
  } catch (e) {
    console.error("Login error:", e)
    return redirectTo(request, "/login?error=invalid")
  }
}
