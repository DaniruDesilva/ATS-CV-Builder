const tracker = new Map<string, { count: number; expiresAt: number }>();
const MAX_TRACKER_ENTRIES = 5000;

function pruneExpired(now: number) {
  tracker.forEach((entry, key) => {
    if (entry.expiresAt <= now) {
      tracker.delete(key);
    }
  });
  // Evict oldest inserted keys if map still exceeds cap
  if (tracker.size >= MAX_TRACKER_ENTRIES) {
    let toRemove = tracker.size - MAX_TRACKER_ENTRIES + 1;
    for (const key of Array.from(tracker.keys())) {
      if (toRemove-- <= 0) break;
      tracker.delete(key);
    }
  }
}

/**
 * Extracts client IP safely from standard proxy headers.
 */
export function getClientIp(request: Request): string {
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }

  return 'unknown';
}

/**
 * Simple in-memory rate limiter helper for API routes.
 * Limits requests per IP or route identifier within a sliding time window.
 */
export function checkRateLimit(
  key: string,
  limit = 20,
  windowMs = 60 * 1000
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  const entry = tracker.get(key);

  if (!entry || entry.expiresAt <= now) {
    if (tracker.size >= MAX_TRACKER_ENTRIES) {
      pruneExpired(now);
    }
    tracker.set(key, { count: 1, expiresAt: now + windowMs });
    return {
      allowed: true,
      remaining: Math.max(0, limit - 1),
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.expiresAt - now) / 1000)),
    };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: Math.max(0, limit - entry.count),
    retryAfterSeconds: Math.max(1, Math.ceil((entry.expiresAt - now) / 1000)),
  };
}
