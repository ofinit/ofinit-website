/** Best-effort client IP for rate limiting behind proxies (Coolify, Cloudflare, nginx). */
export function getClientIp(request: Request): string {
  const cf = request.headers.get("cf-connecting-ip")
  if (cf?.trim()) return cf.trim()

  const realIp = request.headers.get("x-real-ip")
  if (realIp?.trim()) return realIp.trim()

  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded?.trim()) {
    return forwarded.split(",")[0]?.trim() ?? "unknown"
  }

  return "unknown"
}
