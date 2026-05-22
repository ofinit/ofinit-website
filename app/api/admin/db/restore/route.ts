import { NextResponse } from "next/server"
import { isAdminAuthenticated } from "@/lib/auth/admin-session"
import { restoreDatabaseFromBackup } from "@/lib/db/sqlite-backup"
import { isSqliteDatabaseUrl } from "@/lib/db/sqlite-path"

export const runtime = "nodejs"

const MAX_BYTES = 50 * 1024 * 1024

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!isSqliteDatabaseUrl()) {
    return NextResponse.json({ error: "Restore is only supported for SQLite databases" }, { status: 400 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No backup file provided" }, { status: 400 })
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Backup file is too large (max 50 MB)" }, { status: 400 })
    }

    const name = file.name.toLowerCase()
    if (!name.endsWith(".db") && !name.endsWith(".sqlite") && !name.endsWith(".sqlite3")) {
      return NextResponse.json({ error: "File must be a .db, .sqlite, or .sqlite3 backup" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    await restoreDatabaseFromBackup(buffer)

    return NextResponse.json({
      ok: true,
      message: "Database restored. Refresh the admin panel; restart the container if data looks stale.",
    })
  } catch (error) {
    console.error("[db-restore]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Restore failed" },
      { status: 500 },
    )
  }
}
