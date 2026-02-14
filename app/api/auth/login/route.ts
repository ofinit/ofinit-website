import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  const formData = await request.formData()
  const email = formData.get("email")
  const password = formData.get("password")

  // Simple authentication check (replace with your actual logic)
  if (email === "admin@ofinit.com" && password === "admin123") {
    // Set authentication cookie
    const cookieStore = await cookies()
    cookieStore.set("admin_authenticated", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.redirect(new URL("/admin", request.url))
  }

  return NextResponse.redirect(new URL("/login?error=invalid", request.url))
}
