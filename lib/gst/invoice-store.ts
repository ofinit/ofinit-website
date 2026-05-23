import type { GstInvoice, GstInvoiceItem, GstInvoiceType, GstParty } from "@/lib/gst/invoice"
import { getDefaultGstSupplier, mergeGstSupplierWithDefaults } from "@/lib/gst/supplier-defaults"

export function createId(): string {
  return `inv_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

export function getFinancialYearLabel(date: Date): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const startYear = month >= 4 ? year : year - 1
  const endYearShort = String((startYear + 1) % 100).padStart(2, "0")
  return `${startYear}-${endYearShort}`
}

function parseInvoiceNoSeq(invoiceNo: string): { fy: string; seq: number } | null {
  const trimmed = invoiceNo.trim()
  const m = /^INV\/(\d{4}-\d{2})\/(\d{4,})$/.exec(trimmed)
  if (!m) return null
  const fy = m[1]
  const seq = Number(m[2])
  if (!Number.isFinite(seq) || seq <= 0) return null
  return { fy, seq }
}

function getNextSeqForFy(invoices: GstInvoice[], fy: string): number {
  let max = 0
  for (const inv of invoices) {
    const parsed = parseInvoiceNoSeq(inv.invoiceNo)
    if (parsed && parsed.fy === fy) max = Math.max(max, parsed.seq)
  }
  return max + 1
}

export function nextInvoiceNo(now = new Date(), invoices: GstInvoice[] = []): string {
  const fy = getFinancialYearLabel(now)
  const next = getNextSeqForFy(invoices, fy)
  return `INV/${fy}/${String(next).padStart(4, "0")}`
}

const defaultSupplier = (): GstParty => getDefaultGstSupplier()

export function createBlankInvoice(params?: {
  now?: Date
  invoiceType?: GstInvoiceType
  supplier?: GstParty | null
  existingInvoices?: GstInvoice[]
}): GstInvoice {
  const now = params?.now ?? new Date()
  const invoiceType = params?.invoiceType ?? "B2B"
  const today = now.toISOString().slice(0, 10)
  const id = createId()
  const existingInvoices = params?.existingInvoices ?? []
  const supplier = mergeGstSupplierWithDefaults(params?.supplier ?? defaultSupplier())

  const buyer: GstParty = {
    legalName: "",
    addressLine1: "",
    city: "",
    country: "India",
    state: "",
    stateCode: "",
    pinCode: "",
    gstin: "",
  }

  const item: GstInvoiceItem = {
    id: createId(),
    description: "",
    hsnSac: "",
    qty: 1,
    unit: "Nos",
    unitPrice: 0,
    discount: 0,
    gstRate: 18,
  }

  return {
    id,
    invoiceNo: nextInvoiceNo(now, existingInvoices),
    invoiceDate: today,
    invoiceType,
    currency: "INR",
    pricingCurrency: "INR",
    fxUsdInr: 83,
    supplier,
    buyer,
    placeOfSupplyStateCode: supplier.stateCode,
    placeOfSupplyState: supplier.state,
    items: [item],
    notes: "",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  }
}
