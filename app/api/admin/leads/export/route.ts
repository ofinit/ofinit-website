import { NextResponse } from "next/server"
import { isAdminAuthenticated } from "@/lib/auth/admin-session"
import { rowsToCsv } from "@/lib/csv"
import { formatLeadDate, loadAdminLeadsData } from "@/lib/leads/admin-leads"

export const runtime = "nodejs"

const HEADERS = ["Date", "Source", "Name", "Email", "Company", "Phone", "Message / notes"] as const

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { rows, pending } = await loadAdminLeadsData()
    const includePending = new URL(request.url).searchParams.get("pending") !== "0"

    const csvRows: string[][] = rows.map((lead) => [
      formatLeadDate(lead.at),
      lead.source,
      lead.name ?? "",
      lead.email,
      lead.company ?? "",
      lead.phone ?? "",
      lead.message ?? "",
    ])

    if (includePending && pending.length > 0) {
      for (const p of pending) {
        csvRows.push([
          formatLeadDate(p.requestedAt),
          "newsletter (pending)",
          "",
          p.email,
          "",
          "",
          `Awaiting confirmation; link expires ${formatLeadDate(p.tokenExpires)} UTC`,
        ])
      }
    }

    const csv = rowsToCsv([...HEADERS], csvRows)
    const stamp = new Date().toISOString().slice(0, 10)
    const filename = `ofinit-leads-${stamp}.csv`

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("[leads-export]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Export failed" },
      { status: 500 },
    )
  }
}
