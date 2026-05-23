/** Normalize markdown so headings and lists parse reliably (blank lines around blocks). */
export function normalizeMarkdown(md: string): string {
  let s = md.replace(/\r\n/g, "\n").trim()
  if (!s) return s

  // Blank line before ATX headings (except at start)
  s = s.replace(/([^\n])\n(#{1,6} )/g, "$1\n\n$2")

  // Blank line after heading line when next line is body text (not another heading/list)
  s = s.replace(/(#{1,6} [^\n]+)\n(?![\n#\-*0-9])/g, "$1\n\n")

  // Normalize list blocks: ensure blank line before a list
  s = s.replace(/([^\n])\n([\-*] )/g, "$1\n\n$2")

  // Collapse 3+ newlines to 2
  s = s.replace(/\n{3,}/g, "\n\n")

  return s
}
