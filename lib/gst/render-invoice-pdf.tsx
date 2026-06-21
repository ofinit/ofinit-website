import React from "react"
import { renderToBuffer } from "@react-pdf/renderer"
import { InvoicePdfDocument } from "@/components/admin/invoice-pdf"
import type { GstInvoice } from "@/lib/gst/invoice"
import path from "path"
import fs from "fs"

function siteOrigin(): string {
  const u = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL
  return u?.trim() ? u.replace(/\/$/, "") : ""
}

function withAbsoluteLogo(invoice: GstInvoice): GstInvoice {
  const logo = invoice.supplier.logoUrl?.trim()
  if (!logo) {
    return invoice
  }

  // Keep default SVG logo as is (we'll render as text in InvoicePdfDocument)
  if (logo.includes("ofinit-invoice-logo.svg")) {
    return invoice
  }

  if (logo.startsWith("http") || logo.startsWith("data:")) {
    return invoice
  }

  const relativePath = logo.startsWith("/") ? logo : `/${logo}`
  const localPath = path.join(process.cwd(), "public", relativePath)
  if (fs.existsSync(localPath)) {
    return {
      ...invoice,
      supplier: { ...invoice.supplier, logoUrl: localPath },
    }
  }

  const origin = siteOrigin()
  if (!origin) return invoice
  return {
    ...invoice,
    supplier: { ...invoice.supplier, logoUrl: `${origin}${relativePath}` },
  }
}

export async function renderInvoicePdfBuffer(invoice: GstInvoice): Promise<Buffer> {
  const prepared = withAbsoluteLogo(invoice)
  const element = React.createElement(InvoicePdfDocument, { invoice: prepared })
  const buf = await renderToBuffer(element)
  return Buffer.from(buf)
}
