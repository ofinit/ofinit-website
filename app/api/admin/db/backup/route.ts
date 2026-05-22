import { NextResponse } from "next/server"
import { isAdminAuthenticated } from "@/lib/auth/admin-session"
import { readDatabaseBackup } from "@/lib/db/sqlite-backup"
import { isSqliteDatabaseUrl } from "@/lib/db/sqlite-path"

export const runtime = "nodejs"

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!isSqliteDatabaseUrl()) {
    return NextResponse.json({ error: "Backup is only supported for SQLite databases" }, { status: 400 })
  }

  try {
    const { buffer, filename } = await readDatabaseBackup()
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("[db-backup]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Backup failed" },
      { status: 500 },
    )
  }
}
