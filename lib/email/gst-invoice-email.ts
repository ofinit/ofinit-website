import { computeInvoice, formatDateToDDMMYYYY } from "@/lib/gst/invoice"
import type { GstInvoice } from "@/lib/gst/invoice"
import { getSmtpFromAddress, isSmtpConfigured, sendMail } from "@/lib/email/smtp"

function fmtINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value)
}

function safeFilename(invoiceNo: string): string {
  return `Invoice-${invoiceNo.replace(/[^a-zA-Z0-9._-]+/g, "-")}.pdf`
}

export async function sendGstInvoiceEmail(params: {
  to: string
  invoice: GstInvoice
  pdfBuffer: Buffer
}): Promise<{ sent: boolean; error?: string }> {
  if (!isSmtpConfigured()) {
    return {
      sent: false,
      error: "SMTP is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS (and SMTP_FROM) in Coolify or .env.",
    }
  }

  const { invoice, pdfBuffer, to } = params
  const computed = computeInvoice(invoice)
  const supplier = invoice.supplier.legalName || "OfinIT"
  const buyer = invoice.buyer.legalName || "Customer"
  const total = fmtINR(computed.totals.grandTotal)
  const formattedDate = formatDateToDDMMYYYY(invoice.invoiceDate)

  const subject = `Tax invoice ${invoice.invoiceNo} from ${supplier}`
  const text = `Dear ${buyer},

Please find attached tax invoice ${invoice.invoiceNo} dated ${formattedDate}.

Grand total: ${total}

If you have any questions, reply to this email.

Regards,
${supplier}
`

  const html = `<p>Dear ${buyer},</p>
<p>Please find attached tax invoice <strong>${invoice.invoiceNo}</strong> dated ${formattedDate}.</p>
<p><strong>Grand total:</strong> ${total}</p>
<p>If you have any questions, reply to this email.</p>
<p>Regards,<br/>${supplier}</p>`

  const sent = await sendMail({
    to,
    subject,
    text,
    html,
    attachments: [
      {
        filename: safeFilename(invoice.invoiceNo),
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  })

  if (!sent) {
    return { sent: false, error: `Email could not be sent. Check SMTP settings (from: ${getSmtpFromAddress()}).` }
  }

  return { sent: true }
}
