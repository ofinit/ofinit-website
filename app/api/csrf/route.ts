import { NextResponse, NextRequest } from "next/server"
import { createCsrfToken, CSRF_COOKIE, csrfCookieOptions } from "@/lib/csrf-public"
import { getGroupedLocations } from "@/lib/seo/locations-data"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get("debug") === "1") {
    const { international, states, cities } = getGroupedLocations()
    return NextResponse.json({
      intlCount: international.length,
      statesCount: states.length,
      citiesCount: cities.length,
      statesList: states.map(s => s.name),
    })
  }

  const token = createCsrfToken()
  const res = NextResponse.json({ csrfToken: token })
  res.cookies.set(CSRF_COOKIE, token, csrfCookieOptions())
  return res
}
