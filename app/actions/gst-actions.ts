"use server"

import { prisma } from "@/lib/db/prisma"
import { assertAdminAuthenticated } from "@/lib/auth/admin-session"
import type { GstInvoice, GstParty } from "@/lib/gst/invoice"

const GST_BUYERS_KEY = "gst_buyers"
const GST_HSN_KEY = "gst_hsn_list"
const GST_SUPPLIER_KEY = "gst_supplier"

async function getJsonSetting(key: string): Promise<unknown | null> {
  const row = await prisma.siteSetting.findUnique({ where: { key } })
  return row?.value ?? null
}

async function setJsonSetting(key: string, value: unknown) {
  await prisma.siteSetting.upsert({
    where: { key },
    create: { key, value: JSON.parse(JSON.stringify(value)) },
    update: { value: JSON.parse(JSON.stringify(value)) },
  })
}

export type GstWorkspace = {
  invoices: GstInvoice[]
  buyers: GstParty[]
  hsnList: string[]
  supplier: GstParty | null
}

export type GstWorkspaceLoadResult = { ok: true; data: GstWorkspace } | { ok: false; error: string }

function formatGstLoadError(e: unknown): string {
  if (e instanceof Error && e.message === "Unauthorized") {
    return "Your admin session is invalid or expired. Open /login and sign in again."
  }
  const text = e instanceof Error ? e.message : String(e)
  const lower = text.toLowerCase()
  if (!process.env.DATABASE_URL?.trim()) {
    return "DATABASE_URL is not set. Copy .env.example to .env in the project root, then restart npm run dev."
  }
  if (
    lower.includes("can't reach database") ||
    lower.includes("database server") ||
    lower.includes("econnrefused") ||
    lower.includes("p1001") ||
    lower.includes("prismaclientinitializationerror") ||
    lower.includes("server has gone away")
  ) {
    return "Cannot reach the database. For SQLite, ensure DATABASE_URL=file:./dev.db in .env and run: npx prisma db push"
  }
  if (lower.includes("does not exist") && lower.includes("database")) {
    return "Database does not exist or URL is wrong. Check DATABASE_URL in .env and run: npx prisma db push"
  }
  if (lower.includes("table") && (lower.includes("doesn't exist") || lower.includes("does not exist"))) {
    return "Tables are missing. Run: npx prisma db push (and npx prisma db seed if you want sample data)."
  }
  return text.length > 200 ? `${text.slice(0, 200)}…` : text
}

/** Loads GST workspace; returns errors instead of throwing so the UI can show a clear message. */
export async function loadGstWorkspace(): Promise<GstWorkspaceLoadResult> {
  try {
    await assertAdminAuthenticated()
    const [invoiceRows, buyersRaw, hsnRaw, supplierRaw] = await Promise.all([
      prisma.gstInvoiceRecord.findMany({ orderBy: { updatedAt: "desc" } }),
      getJsonSetting(GST_BUYERS_KEY),
      getJsonSetting(GST_HSN_KEY),
      getJsonSetting(GST_SUPPLIER_KEY),
    ])
    const invoices = invoiceRows.map((r) => r.payload as GstInvoice)
    const buyers = Array.isArray(buyersRaw) ? (buyersRaw as GstParty[]) : []
    const hsnList = Array.isArray(hsnRaw) ? (hsnRaw as string[]) : []
    const supplier = supplierRaw && typeof supplierRaw === "object" && supplierRaw !== null ? (supplierRaw as GstParty) : null
    return { ok: true, data: { invoices, buyers, hsnList, supplier } }
  } catch (e) {
    return { ok: false, error: formatGstLoadError(e) }
  }
}

export async function saveGstInvoice(invoice: GstInvoice) {
  await assertAdminAuthenticated()
  const payload = JSON.parse(JSON.stringify(invoice))
  await prisma.gstInvoiceRecord.upsert({
    where: { id: invoice.id },
    create: { id: invoice.id, payload },
    update: { payload },
  })
}

export async function deleteGstInvoice(id: string) {
  await assertAdminAuthenticated()
  try {
    await prisma.gstInvoiceRecord.delete({ where: { id } })
  } catch {
    /* already gone */
  }
}

export async function upsertGstBuyer(buyer: GstParty) {
  await assertAdminAuthenticated()
  const raw = await getJsonSetting(GST_BUYERS_KEY)
  let buyers: GstParty[] = Array.isArray(raw) ? (raw as GstParty[]) : []
  const key = (buyer.gstin || buyer.legalName).trim().toUpperCase()
  if (!key) return
  const idx = buyers.findIndex((b) => (b.gstin || b.legalName).trim().toUpperCase() === key)
  buyers = idx === -1 ? [buyer, ...buyers] : buyers.map((b, i) => (i === idx ? buyer : b))
  await setJsonSetting(GST_BUYERS_KEY, buyers)
}

export async function addGstHsn(value: string) {
  await assertAdminAuthenticated()
  const v = value.trim().toUpperCase()
  if (!v) return
  const raw = await getJsonSetting(GST_HSN_KEY)
  let list: string[] = Array.isArray(raw) ? (raw as string[]) : []
  if (list.some((x) => x.toUpperCase() === v)) return
  list = [v, ...list].slice(0, 200)
  await setJsonSetting(GST_HSN_KEY, list)
}

export async function loadSupplierProfileFromDb(): Promise<GstParty | null> {
  await assertAdminAuthenticated()
  const raw = await getJsonSetting(GST_SUPPLIER_KEY)
  return raw && typeof raw === "object" && raw !== null ? (raw as GstParty) : null
}

export async function saveSupplierProfileToDb(party: GstParty) {
  await assertAdminAuthenticated()
  await setJsonSetting(GST_SUPPLIER_KEY, party)
}
