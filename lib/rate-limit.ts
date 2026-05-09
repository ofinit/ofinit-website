/**
 * Fixed-window in-memory rate limiter per server instance.
 * For multi-instance / serverless clusters, use Redis (e.g. Upstash) instead.
 */
type Bucket = { count: number; resetAt: number }

const store = new Map<string, Bucket>()

const MAX_ENTRIES = 50_000

function pruneIfNeeded() {
  if (store.size <= MAX_ENTRIES) return
  const now = Date.now()
  for (const [key, b] of store) {
    if (now >= b.resetAt) store.delete(key)
  }
}

/**
 * @returns true if request is allowed, false if rate limited
 */
export function rateLimitAllow(key: string, max: number, windowMs: number): boolean {
  pruneIfNeeded()
  const now = Date.now()
  let b = store.get(key)

  if (!b || now >= b.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (b.count >= max) return false

  b.count += 1
  return true
}

/** Defaults tuned for public lead endpoints */
export const LEADS_RATE = { max: 8, windowMs: 15 * 60 * 1000 } as const
export const NEWSLETTER_RATE = { max: 10, windowMs: 15 * 60 * 1000 } as const
