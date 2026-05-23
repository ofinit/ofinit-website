import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { adminSessionCookieOptions } from "@/lib/auth/admin-session"
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
    const session = adminSessionCookieOptions()
    cookieStore.set("admin_authenticated", "true", session)
    cookieStore.set("admin_email", user.email, session)

    return redirectTo(request, "/admin")
  } catch (e) {
    console.error("Login error:", e)
    return redirectTo(request, "/login?error=invalid")
  }
}
