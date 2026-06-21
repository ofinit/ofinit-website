/**
 * One-time migration: fix place of supply on existing invoices.
 * For every saved invoice where placeOfSupplyStateCode != buyer.stateCode,
 * update it to match the buyer's state (which is the correct GST rule for B2C/B2B).
 *
 * Run with:  npx tsx scripts/fix-invoice-pos.ts
 */

import { PrismaClient } from "@prisma/client"
import type { GstInvoice } from "../lib/gst/invoice"
import { normalizeStateCode } from "../lib/gst/invoice"
import { getIndiaStateNameByCode } from "../lib/gst/india-states"

const prisma = new PrismaClient()

async function main() {
  const rows = await prisma.gstInvoiceRecord.findMany()
  console.log(`Found ${rows.length} invoice(s) to check.`)

  let fixed = 0
  for (const row of rows) {
    const inv = row.payload as GstInvoice
    const buyerCode = normalizeStateCode(inv.buyer?.stateCode || "")
    const buyerName = buyerCode ? getIndiaStateNameByCode(buyerCode) : null

    if (!buyerCode || !buyerName) {
      console.log(`  SKIP  ${inv.invoiceNo} — buyer state code missing or unknown (${inv.buyer?.stateCode})`)
      continue
    }

    const currentPosCode = normalizeStateCode(inv.placeOfSupplyStateCode || "")
    if (currentPosCode === buyerCode && inv.placeOfSupplyState === buyerName) {
      console.log(`  OK    ${inv.invoiceNo} — POS already correct (${buyerName} ${buyerCode})`)
      continue
    }

    const updated: GstInvoice = {
      ...inv,
      placeOfSupplyStateCode: buyerCode,
      placeOfSupplyState: buyerName,
      updatedAt: new Date().toISOString(),
    }

    await prisma.gstInvoiceRecord.update({
      where: { id: row.id },
      data: { payload: JSON.parse(JSON.stringify(updated)) },
    })

    console.log(
      `  FIXED ${inv.invoiceNo} — POS changed from "${inv.placeOfSupplyState} (${inv.placeOfSupplyStateCode})" → "${buyerName} (${buyerCode})"`
    )
    fixed++
  }

  console.log(`\nDone. Fixed ${fixed} of ${rows.length} invoice(s).`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
