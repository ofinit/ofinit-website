import { type NextRequest, NextResponse } from "next/server"
import { renderInvoicePdfBuffer } from "@/lib/gst/render-invoice-pdf"
import type { GstInvoice } from "@/lib/gst/invoice"

export async function POST(request: NextRequest) {
  try {
    const invoice = (await request.json()) as GstInvoice
    const buffer = await renderInvoicePdfBuffer(invoice)

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Invoice-${invoice.invoiceNo}.pdf"`,
      },
    })
  } catch (error) {
    console.error("[PDF Download Error]", error)
    return NextResponse.json({ error: "Failed to render PDF" }, { status: 500 })
  }
}
