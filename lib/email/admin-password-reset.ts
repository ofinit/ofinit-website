/**
 * Sends admin password reset link. Uses SMTP_* env vars when set (required in production to send).
 */
function siteOrigin(): string {
  const u = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL
  if (u?.trim()) return u.replace(/\/$/, "")
  return "http://localhost:3000"
}

export async function sendAdminPasswordResetEmail(toEmail: string, token: string): Promise<boolean> {
  const resetUrl = `${siteOrigin()}/login/reset-password?token=${encodeURIComponent(token)}`
  const subject = "Reset your OfinIT admin password"
  const text = `You requested a password reset for the OfinIT admin panel.\n\nOpen this link within one hour:\n${resetUrl}\n\nIf you did not request this, ignore this email.\n`
  const html = `<p>You requested a password reset for the OfinIT admin panel.</p><p><a href="${resetUrl}">Set a new password</a> (link expires in one hour).</p><p>If you did not request this, you can ignore this message.</p>`

  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@localhost"

  if (!host || !user || !pass) {
    console.warn("[admin-password-reset] SMTP not configured. Reset URL:", resetUrl)
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
    console.error("[admin-password-reset] send failed", e)
    return false
  }
}
