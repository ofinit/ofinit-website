import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

function createPrismaClient(): PrismaClient {
  return new PrismaClient()
}

function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient()
  }
  return globalForPrisma.prisma
}

/** Lazy singleton so restore can recreate the client after replacing the DB file. */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient()
    const value = (client as unknown as Record<string | symbol, unknown>)[prop]
    if (typeof value === "function") {
      return (value as (...args: unknown[]) => unknown).bind(client)
    }
    return value
  },
})

/** Disconnect and drop singleton (required before replacing the SQLite file). */
export async function resetPrismaClient(): Promise<void> {
  if (globalForPrisma.prisma) {
    await globalForPrisma.prisma.$disconnect()
  }
  globalForPrisma.prisma = undefined
}
