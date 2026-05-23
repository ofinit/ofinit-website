/** Escape a cell for RFC 4180 CSV. */
export function csvCell(value: string | number | null | undefined): string {
  const text = value == null ? "" : String(value)
  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

export function rowsToCsv(headers: string[], rows: string[][]): string {
  const lines = [headers.map(csvCell).join(",")]
  for (const row of rows) {
    lines.push(row.map(csvCell).join(","))
  }
  return `${lines.join("\r\n")}\r\n`
}
