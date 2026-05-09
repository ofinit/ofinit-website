/**
 * Sends newsletter double opt-in link. Requires SMTP_* env vars when NODE_ENV=production
 * (optional in development — falls back to console log).
 */
function siteOrigin(): string {
  const u = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL
  if (u?.trim()) return u.replace(/\/$/, "")
  return "http://localhost:3000"
}

export async function sendNewsletterConfirmationEmail(toEmail: string, token: string): Promise<boolean> {
  const confirmUrl = `${siteOrigin()}/api/newsletter/confirm?token=${encodeURIComponent(token)}`
  const subject = "Confirm your OfinIT blog subscription"
  const text = `Thanks for subscribing to the OfinIT blog.\n\nConfirm your email by opening this link (expires in 48 hours):\n${confirmUrl}\n\nIf you did not request this, you can ignore this message.\n`
  const html = `<p>Thanks for subscribing to the OfinIT blog.</p><p><a href="${confirmUrl}">Confirm your email</a> (link expires in 48 hours).</p><p>If you did not request this, you can ignore this message.</p>`

  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@localhost"

  if (!host || !user || !pass) {
    console.warn("[newsletter-email] SMTP not configured. Confirmation URL:", confirmUrl)
    // Without SMTP, only succeed in development (use logged URL). Production requires SMTP_*.
    return process.env.NODE_ENV !== "production"
  }

  try {
    const nodemailer = await import("nodemailer")
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    })
    await transporter.sendMail({
      from,
      to: toEmail,
      subject,
      text,
      html,
    })
    return true
  } catch (e) {
    console.error("[newsletter-email] send failed", e)
    return false
  }
}
