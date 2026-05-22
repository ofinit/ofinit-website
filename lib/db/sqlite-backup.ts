import { copyFile, mkdir, readFile, stat, writeFile } from "fs/promises"
import path from "path"
import { prisma, resetPrismaClient } from "@/lib/db/prisma"
import { getSqliteDatabasePath } from "@/lib/db/sqlite-path"

const SQLITE_MAGIC = Buffer.from("SQLite format 3\0")

export function isValidSqliteFile(buffer: Buffer): boolean {
  return buffer.length >= 16 && buffer.subarray(0, 16).equals(SQLITE_MAGIC)
}

export async function checkpointSqliteWal(): Promise<void> {
  await prisma.$executeRawUnsafe("PRAGMA wal_checkpoint(FULL)")
}

export async function readDatabaseBackup(): Promise<{ buffer: Buffer; filename: string }> {
  const dbPath = getSqliteDatabasePath()
  await checkpointSqliteWal()
  const buffer = await readFile(dbPath)
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)
  return { buffer, filename: `ofinit-backup-${stamp}.db` }
}

export type DatabaseInfo = {
  path: string
  sizeBytes: number
  modifiedAt: string
}

export async function getDatabaseInfo(): Promise<DatabaseInfo> {
  const dbPath = getSqliteDatabasePath()
  const s = await stat(dbPath)
  return {
    path: dbPath,
    sizeBytes: s.size,
    modifiedAt: s.mtime.toISOString(),
  }
}

export async function restoreDatabaseFromBackup(uploaded: Buffer): Promise<void> {
  if (!isValidSqliteFile(uploaded)) {
    throw new Error("Invalid file: expected a SQLite database (.db)")
  }

  const dbPath = getSqliteDatabasePath()
  const dir = path.dirname(dbPath)
  await mkdir(dir, { recursive: true })

  await resetPrismaClient()

  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)
  const preRestorePath = `${dbPath}.pre-restore-${stamp}`

  try {
    const { access } = await import("fs/promises")
    await access(dbPath)
    await copyFile(dbPath, preRestorePath)
  } catch {
    // No existing database — first restore
  }

  await writeFile(dbPath, uploaded)
}
