/** Combine footer address lines for a single admin text field. */
export function joinContactAddress(line1: string, line2: string): string {
  const a = line1.trim()
  const b = line2.trim()
  if (!b) return a
  if (!a) return b
  return `${a}\n${b}`
}

/** Split a single address field into two footer lines. */
export function splitContactAddress(address: string): { line1: string; line2: string } {
  const trimmed = address.trim()
  if (!trimmed) return { line1: "", line2: "" }

  const byNewline = trimmed.split(/\n+/).map((s) => s.trim()).filter(Boolean)
  if (byNewline.length >= 2) {
    return { line1: byNewline[0], line2: byNewline.slice(1).join(", ") }
  }

  const byComma = trimmed.split(",").map((s) => s.trim()).filter(Boolean)
  if (byComma.length >= 2) {
    return { line1: byComma[0], line2: byComma.slice(1).join(", ") }
  }

  return { line1: trimmed, line2: "" }
}
