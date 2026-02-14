import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get("admin_authenticated")?.value === "true"
  const isLoginPage = request.nextUrl.pathname === "/login"
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")

  // Redirect to login if accessing admin without authentication
  if (isAdminRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirect to admin if already authenticated and trying to access login
  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
}
