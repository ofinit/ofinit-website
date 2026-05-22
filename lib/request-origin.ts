/**
 * Public site origin for redirects behind reverse proxies (Coolify, etc.).
 * Avoids redirects to http://0.0.0.0:3000 when the app listens on 0.0.0.0 internally.
 */
export function getRequestOrigin(request: Request): string {
  // SITE_URL is read at runtime (Coolify env). NEXT_PUBLIC_* is often inlined at Docker build time.
  const fromEnv = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL
  if (fromEnv?.trim()) {
    return fromEnv.replace(/\/$/, "")
  }

  const forwardedHost =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("x-real-host") ||
    request.headers.get("x-original-host")
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https"
  if (forwardedHost) {
    const host = forwardedHost.split(",")[0]?.trim()
    if (host && !host.startsWith("0.0.0.0")) {
      return `${forwardedProto}://${host}`
    }
  }

  const host = request.headers.get("host")
  if (host && !host.startsWith("0.0.0.0")) {
    const proto = request.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https")
    return `${proto}://${host}`
  }

  const url = new URL(request.url)
  if (url.hostname !== "0.0.0.0" && url.hostname !== "127.0.0.1") {
    return url.origin
  }

  return "http://localhost:3000"
}

export function redirectTo(request: Request, path: string): Response {
  const origin = getRequestOrigin(request)
  return Response.redirect(`${origin}${path.startsWith("/") ? path : `/${path}`}`, 302)
}
