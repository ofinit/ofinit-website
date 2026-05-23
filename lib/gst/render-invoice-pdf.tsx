import React from "react"
import { renderToBuffer } from "@react-pdf/renderer"
import { InvoicePdfDocument } from "@/components/admin/invoice-pdf"
import type { GstInvoice } from "@/lib/gst/invoice"

function siteOrigin(): string {
  const u = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL
  return u?.trim() ? u.replace(/\/$/, "") : ""
}

function withAbsoluteLogo(invoice: GstInvoice): GstInvoice {
  const logo = invoice.supplier.logoUrl?.trim()
  if (!logo || logo.startsWith("http") || logo.startsWith("data:")) {
    return invoice
  }
  const origin = siteOrigin()
  if (!origin) return invoice
  const path = logo.startsWith("/") ? logo : `/${logo}`
  return {
    ...invoice,
    supplier: { ...invoice.supplier, logoUrl: `${origin}${path}` },
  }
}

export async function renderInvoicePdfBuffer(invoice: GstInvoice): Promise<Buffer> {
  const prepared = withAbsoluteLogo(invoice)
  const element = React.createElement(InvoicePdfDocument, { invoice: prepared })
  const buf = await renderToBuffer(element)
  return Buffer.from(buf)
}
