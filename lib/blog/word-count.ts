export function countWordsFromHtml(html: string): number {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
  if (!text) return 0
  return text.split(" ").filter(Boolean).length
}

export function readTimeFromWordCount(words: number): string {
  const minutes = Math.max(5, Math.ceil(words / 200))
  return `${minutes} min read`
}
