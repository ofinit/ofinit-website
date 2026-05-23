import { cookies } from "next/headers"

const ADMIN_AUTH_COOKIE = "admin_authenticated"
const ADMIN_EMAIL_COOKIE = "admin_email"

export async function isAdminAuthenticated(): Promise<boolean> {
  const jar = await cookies()
  return jar.get(ADMIN_AUTH_COOKIE)?.value === "true"
}

export async function getAdminSessionEmail(): Promise<string | null> {
  const jar = await cookies()
  const email = jar.get(ADMIN_EMAIL_COOKIE)?.value?.trim().toLowerCase()
  return email || null
}

export async function assertAdminAuthenticated(): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized")
  }
}

export function adminSessionCookieOptions(maxAge = 60 * 60 * 24 * 7) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge,
    path: "/",
  }
}

export { ADMIN_AUTH_COOKIE, ADMIN_EMAIL_COOKIE }
