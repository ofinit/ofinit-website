import { NextResponse } from "next/server"
import { isAdminAuthenticated } from "@/lib/auth/admin-session"
import { getDatabaseInfo } from "@/lib/db/sqlite-backup"
import { isSqliteDatabaseUrl } from "@/lib/db/sqlite-path"

export const runtime = "nodejs"

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!isSqliteDatabaseUrl()) {
    return NextResponse.json({ supported: false })
  }

  try {
    const info = await getDatabaseInfo()
    return NextResponse.json({ supported: true, ...info })
  } catch (error) {
    console.error("[db-info]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to read database info" },
      { status: 500 },
    )
  }
}
