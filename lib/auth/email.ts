const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function normalizeAdminEmail(raw: string): string {
  return raw.trim().toLowerCase()
}

export function isValidAdminEmail(email: string): boolean {
  return EMAIL_RE.test(email)
}
