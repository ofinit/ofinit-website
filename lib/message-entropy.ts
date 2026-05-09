/**
 * Reject low-effort / repetitive spam text (same char repeated, very low diversity).
 * Does not replace Turnstile; complements it for contact messages.
 */
export function contactMessageEntropyOk(message: string): boolean {
  const s = message.trim()
  if (s.length < 10) return false

  const chars = s.replace(/\s+/g, "")
  if (chars.length < 8) return false

  const counts = new Map<string, number>()
  for (const c of chars) {
    counts.set(c, (counts.get(c) ?? 0) + 1)
  }

  const maxFreq = Math.max(...counts.values())
  if (maxFreq / chars.length > 0.72) return false

  // Normalized Shannon entropy (0–1); very low = "aaaa" or keyboard mashing patterns
  let h = 0
  for (const n of counts.values()) {
    const p = n / chars.length
    h -= p * Math.log2(p)
  }
  const maxH = Math.log2(counts.size || 1)
  const normalized = maxH > 0 ? h / maxH : 0
  if (normalized < 0.35 && chars.length > 40) return false

  return true
}
