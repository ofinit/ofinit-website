import path from "path"

const PRISMA_SCHEMA_DIR = path.join(process.cwd(), "prisma")

/** Resolve SQLite file path from DATABASE_URL (Prisma-relative paths are from prisma/). */
export function getSqliteDatabasePath(): string {
  const url = process.env.DATABASE_URL
  if (!url?.startsWith("file:")) {
    throw new Error("Database backup is only available for SQLite (file: DATABASE_URL)")
  }

  let filePath = url.slice("file:".length)
  const queryIndex = filePath.indexOf("?")
  if (queryIndex >= 0) filePath = filePath.slice(0, queryIndex)

  if (path.isAbsolute(filePath)) {
    return path.normalize(filePath)
  }

  return path.normalize(path.join(PRISMA_SCHEMA_DIR, filePath.replace(/^\.\//, "")))
}

export function isSqliteDatabaseUrl(): boolean {
  return process.env.DATABASE_URL?.startsWith("file:") ?? false
}
