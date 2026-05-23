/**
 * Minimal admin seed for production Docker (no tsx). Creates/updates admin@ofinit.com.
 */
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@ofinit.com").trim().toLowerCase()
  const password = process.env.SEED_ADMIN_PASSWORD || "admin123"
  const passwordHash = await bcrypt.hash(password, 10)
  await prisma.adminUser.upsert({
    where: { email },
    create: { email, passwordHash },
    update: { passwordHash },
  })
  console.log(`[seed] Admin user ready: ${email}`)
}

main()
  .catch((e) => {
    console.error("[seed] Failed:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
