import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Free public endpoint (no key). Returns USD base rates.
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      // Cache on the server for 1 hour
      next: { revalidate: 60 * 60 },
    })
    if (!res.ok) throw new Error(`FX fetch failed: ${res.status}`)
    const data = (await res.json()) as any
    const inr = Number(data?.rates?.INR)
    if (!Number.isFinite(inr) || inr <= 0) throw new Error("Invalid INR rate")
    return NextResponse.json({ usdInr: inr, source: "open.er-api.com", fetchedAt: new Date().toISOString() })
  } catch {
    // Fallback: return a safe default (user can override in UI)
    return NextResponse.json({ usdInr: 83, source: "fallback", fetchedAt: new Date().toISOString() })
  }
}

