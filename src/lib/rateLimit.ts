const tracker = new Map<string, { count: number; expiresAt: number }>();

/**
 * Simple in-memory rate limiter helper for API routes.
 * Limits requests per IP or identifier within a sliding time window.
 */
export function checkRateLimit(ip: string, limit = 20, windowMs = 60 * 1000): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = tracker.get(ip);

  if (!entry || entry.expiresAt < now) {
    tracker.set(ip, { count: 1, expiresAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count };
}
