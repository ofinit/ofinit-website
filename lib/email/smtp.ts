export type SendMailInput = {
  to: string
  subject: string
  text: string
  html: string
  attachments?: Array<{
    filename: string
    content: Buffer
    contentType?: string
  }>
}

export function isSmtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST?.trim() && process.env.SMTP_USER?.trim() && process.env.SMTP_PASS?.trim())
}

export function getSmtpFromAddress(): string {
  return process.env.SMTP_FROM?.trim() || process.env.SMTP_USER?.trim() || "noreply@localhost"
}

export async function sendMail(input: SendMailInput): Promise<boolean> {
  const host = process.env.SMTP_HOST?.trim()
  const user = process.env.SMTP_USER?.trim()
  const pass = process.env.SMTP_PASS?.trim()
  if (!host || !user || !pass) {
    return false
  }

  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587

  try {
    const nodemailer = await import("nodemailer")
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    })
    await transporter.sendMail({
      from: getSmtpFromAddress(),
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
      attachments: input.attachments,
    })
    return true
  } catch (e) {
    console.error("[smtp] send failed", e)
    return false
  }
}
