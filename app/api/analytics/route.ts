import { NextRequest, NextResponse } from "next/server"
import { trackPageView } from "@/lib/analytics/tracker"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, referrer } = body

    if (!url) {
      return NextResponse.json({ error: "Missing URL parameter" }, { status: 400 })
    }

    // Capture User Agent and IP address
    const userAgent = request.headers.get("user-agent") || ""
    const ip = request.headers.get("x-forwarded-for") || request.ip || "127.0.0.1"

    // Execute tracking asynchronously so the client is not blocked
    trackPageView(url, referrer, ip, userAgent)

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
