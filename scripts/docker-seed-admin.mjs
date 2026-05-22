/**
 * Minimal admin seed for production Docker (no tsx). Creates/updates admin@ofinit.com.
 */
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const password = process.env.SEED_ADMIN_PASSWORD || "admin123"
  const passwordHash = await bcrypt.hash(password, 10)
  await prisma.adminUser.upsert({
    where: { email: "admin@ofinit.com" },
    create: {
      email: "admin@ofinit.com",
      passwordHash,
    },
    update: { passwordHash },
  })
  console.log("[seed] Admin user ready: admin@ofinit.com")
}

main()
  .catch((e) => {
    console.error("[seed] Failed:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
