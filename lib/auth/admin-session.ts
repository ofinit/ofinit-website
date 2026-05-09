import { cookies } from "next/headers"

export async function isAdminAuthenticated(): Promise<boolean> {
  const jar = await cookies()
  return jar.get("admin_authenticated")?.value === "true"
}

export async function assertAdminAuthenticated(): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized")
  }
}
