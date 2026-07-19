/**
 * One-time migration: rename the invoice sequence.
 * - Change INV/2026-27/0009 -> INV/2026-27/0008
 * - Change INV/2026-27/0010 -> INV/2026-27/0009
 *
 * Run with:  npx tsx scripts/rename-invoices.ts
 */

import { PrismaClient } from "@prisma/client"
import type { GstInvoice } from "../lib/gst/invoice"

const prisma = new PrismaClient()

async function main() {
  const rows = await prisma.gstInvoiceRecord.findMany()
  console.log(`Found ${rows.length} invoice record(s) in database.`)

  const invoices = rows.map((r) => r.payload as GstInvoice)
  const has0008 = invoices.some((inv) => inv.invoiceNo === "INV/2026-27/0008")

  if (has0008) {
    console.log("INV/2026-27/0008 already exists. No sequence renaming needed.")
    return
  }

  let updatedCount = 0

  for (const row of rows) {
    const inv = row.payload as GstInvoice
    const oldNo = inv.invoiceNo
    let newNo = oldNo

    if (oldNo === "INV/2026-27/0009") {
      newNo = "INV/2026-27/0008"
    } else if (oldNo === "INV/2026-27/0010") {
      newNo = "INV/2026-27/0009"
    }

    if (newNo !== oldNo) {
      const updated: GstInvoice = {
        ...inv,
        invoiceNo: newNo,
        updatedAt: new Date().toISOString(),
      }

      await prisma.gstInvoiceRecord.update({
        where: { id: row.id },
        data: { payload: JSON.parse(JSON.stringify(updated)) },
      })

      console.log(`Renamed: ${oldNo} -> ${newNo}`)
      updatedCount++
    }
  }

  console.log(`Done. Successfully renamed ${updatedCount} invoice(s).`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
