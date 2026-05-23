import { cookies } from "next/headers"
import { redirectTo } from "@/lib/request-origin"

export async function GET(request: Request) {
  const cookieStore = await cookies()
  cookieStore.delete("admin_authenticated")
  cookieStore.delete("admin_email")

  return redirectTo(request, "/login")
}
