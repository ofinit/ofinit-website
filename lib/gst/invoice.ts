export type GstInvoiceType = "B2B" | "B2C"

export type GstBankDetails = {
  accountName: string
  bankName: string
  accountNo: string
  branch: string
  ifsc: string
}

export type GstParty = {
  legalName: string
  tradeName?: string
  /** Client email — used when sending invoice PDF */
  email?: string
  /** Phone / Tel number */
  tel?: string
  /** Company website URL */
  website?: string
  /** Public or data URL; shown on invoice header for supplier */
  logoUrl?: string
  addressLine1: string
  addressLine2?: string
  city: string
  country: string
  state: string
  stateCode: string // 2-digit (as string) GST state code, e.g. "30"
  pinCode: string
  gstin?: string // optional; if present invoice is treated as B2B
  pan?: string
  bankDetails?: GstBankDetails
}

export type GstInvoiceItem = {
  id: string
  description: string
  hsnSac?: string
  qty: number
  unit?: string
  unitPrice: number
  discount: number
  gstRate: number // percent, e.g. 18
}

export type GstInvoice = {
  id: string
  invoiceNo: string
  invoiceDate: string // ISO date (yyyy-mm-dd)
  invoiceType: GstInvoiceType
  currency: "INR"
  pricingCurrency: "INR" | "USD"
  fxUsdInr: number // USD -> INR rate used when pricingCurrency=USD
  supplier: GstParty
  buyer: GstParty
  placeOfSupplyStateCode: string
  placeOfSupplyState: string
  items: GstInvoiceItem[]
  notes?: string
  createdAt: string // ISO timestamp
  updatedAt: string // ISO timestamp
}

export type GstTaxBreakup = {
  taxableValue: number
  cgstRate: number
  cgstAmount: number
  sgstRate: number
  sgstAmount: number
  igstRate: number
  igstAmount: number
  lineTotal: number
}

export type GstInvoiceTotals = {
  taxableValue: number
  cgstAmount: number
  sgstAmount: number
  igstAmount: number
  totalTax: number
  invoiceTotal: number
  roundedOff: number
  grandTotal: number
}

export type GstInvoiceComputedItem = GstInvoiceItem & {
  taxableValue: number
  unitPriceInr: number
  discountInr: number
  unitPriceUsd?: number
  discountUsd?: number
  tax: GstTaxBreakup
}

export type GstInvoiceComputed = {
  supplyType: "INTRA_STATE" | "INTER_STATE"
  items: GstInvoiceComputedItem[]
  totals: GstInvoiceTotals
}

export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function normalizeStateCode(code: string): string {
  const trimmed = code.trim()
  if (/^\d{2}$/.test(trimmed)) return trimmed
  if (/^\d{1}$/.test(trimmed)) return `0${trimmed}`
  return trimmed
}

export function isValidGstin(gstin: string): boolean {
  // Basic structural check: 15 chars, e.g. 27AAAAA0000A1Z5
  // Does not attempt to fully validate checksum.
  const normalized = gstin.trim().toUpperCase()
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(normalized)
}

export function getSupplyType(params: { supplierStateCode: string; placeOfSupplyStateCode: string }) {
  const supplier = normalizeStateCode(params.supplierStateCode)
  const pos = normalizeStateCode(params.placeOfSupplyStateCode)
  return supplier === pos ? ("INTRA_STATE" as const) : ("INTER_STATE" as const)
}

function computeLineTax(params: { taxableValue: number; gstRate: number; supplyType: "INTRA_STATE" | "INTER_STATE" }) {
  const rate = params.gstRate || 0
  const taxable = params.taxableValue

  if (params.supplyType === "INTRA_STATE") {
    const halfRate = rate / 2
    const cgst = round2((taxable * halfRate) / 100)
    const sgst = round2((taxable * halfRate) / 100)
    const lineTotal = round2(taxable + cgst + sgst)
    return {
      taxableValue: taxable,
      cgstRate: halfRate,
      cgstAmount: cgst,
      sgstRate: halfRate,
      sgstAmount: sgst,
      igstRate: 0,
      igstAmount: 0,
      lineTotal,
    } satisfies GstTaxBreakup
  }

  const igst = round2((taxable * rate) / 100)
  const lineTotal = round2(taxable + igst)
  return {
    taxableValue: taxable,
    cgstRate: 0,
    cgstAmount: 0,
    sgstRate: 0,
    sgstAmount: 0,
    igstRate: rate,
    igstAmount: igst,
    lineTotal,
  } satisfies GstTaxBreakup
}

export function computeInvoice(invoice: GstInvoice): GstInvoiceComputed {
  const supplyType = getSupplyType({
    supplierStateCode: invoice.supplier.stateCode,
    placeOfSupplyStateCode: invoice.placeOfSupplyStateCode,
  })

  const computedItems: GstInvoiceComputedItem[] = invoice.items.map((item) => {
    const qty = Number.isFinite(item.qty) ? item.qty : 0
    const unitPrice = Number.isFinite(item.unitPrice) ? item.unitPrice : 0
    const discount = Number.isFinite(item.discount) ? item.discount : 0
    const fx = Number.isFinite(invoice.fxUsdInr) && invoice.fxUsdInr > 0 ? invoice.fxUsdInr : 83
    const unitPriceInr = invoice.pricingCurrency === "USD" ? unitPrice * fx : unitPrice
    const discountInr = invoice.pricingCurrency === "USD" ? discount * fx : discount

    const gross = qty * unitPriceInr
    const taxableValue = round2(Math.max(0, gross - discountInr))
    const tax = computeLineTax({ taxableValue, gstRate: item.gstRate, supplyType })

    return {
      ...item,
      taxableValue,
      unitPriceInr: round2(unitPriceInr),
      discountInr: round2(discountInr),
      unitPriceUsd: invoice.pricingCurrency === "USD" ? unitPrice : undefined,
      discountUsd: invoice.pricingCurrency === "USD" ? discount : undefined,
      tax,
    }
  })

  const taxableValue = round2(computedItems.reduce((sum, i) => sum + i.taxableValue, 0))
  const cgstAmount = round2(computedItems.reduce((sum, i) => sum + i.tax.cgstAmount, 0))
  const sgstAmount = round2(computedItems.reduce((sum, i) => sum + i.tax.sgstAmount, 0))
  const igstAmount = round2(computedItems.reduce((sum, i) => sum + i.tax.igstAmount, 0))
  const invoiceTotal = round2(taxableValue + cgstAmount + sgstAmount + igstAmount)

  // Common practice: round to nearest rupee for grand total.
  const grandTotal = Math.round(invoiceTotal)
  const roundedOff = round2(grandTotal - invoiceTotal)

  return {
    supplyType,
    items: computedItems,
    totals: {
      taxableValue,
      cgstAmount,
      sgstAmount,
      igstAmount,
      totalTax: round2(cgstAmount + sgstAmount + igstAmount),
      invoiceTotal,
      roundedOff,
      grandTotal,
    },
  }
}

export function formatDateToDDMMYYYY(dateStr: string | undefined | null): string {
  if (!dateStr) return ""
  const clean = dateStr.trim()
  if (!clean) return ""

  const parts = clean.split("-")
  if (parts.length === 3 && parts[0].length === 4) {
    const [yyyy, mm, dd] = parts
    return `${dd}/${mm}/${yyyy}`
  }

  const partsSlash = clean.split("/")
  if (partsSlash.length === 3 && partsSlash[2].length === 4) {
    return clean
  }

  try {
    const d = new Date(clean)
    if (!isNaN(d.getTime())) {
      const dd = String(d.getDate()).padStart(2, "0")
      const mm = String(d.getMonth() + 1).padStart(2, "0")
      const yyyy = d.getFullYear()
      return `${dd}/${mm}/${yyyy}`
    }
  } catch {
    // Ignore
  }

  return dateStr
}

export function parseDDMMYYYYToYYYYMMDD(dateStr: string | undefined | null): string {
  if (!dateStr) return ""
  const clean = dateStr.trim()
  if (!clean) return ""

  const parts = clean.split("/")
  if (parts.length === 3 && parts[2].length === 4) {
    const [dd, mm, yyyy] = parts
    return `${yyyy}-${mm}-${dd}`
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
    return clean
  }

  return dateStr
}



