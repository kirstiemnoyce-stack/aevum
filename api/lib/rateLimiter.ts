// ===================================================================
// RATE LIMITER — Simple in-memory rate limiting per user
// ===================================================================
// For production with multiple servers, use Redis instead.
// This is sufficient for a single-server deployment.
// ===================================================================

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 60 seconds
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}, 60000);

export interface RateLimitConfig {
  windowMs: number;   // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

export const DEFAULT_LIMITS: Record<string, RateLimitConfig> = {
  // AI chat — 30 messages per 10 minutes
  ai_chat: { windowMs: 10 * 60 * 1000, maxRequests: 30 },
  // Image generation — 5 per 10 minutes
  image_generate: { windowMs: 10 * 60 * 1000, maxRequests: 5 },
  // Check-ins — 10 per hour
  checkin: { windowMs: 60 * 60 * 1000, maxRequests: 10 },
  // Partner actions — 20 per hour
  partner: { windowMs: 60 * 60 * 1000, maxRequests: 20 },
  // General API — 100 per 10 minutes
  default: { windowMs: 10 * 60 * 1000, maxRequests: 100 },
};

export function checkRateLimit(
  userId: number,
  action: string,
  config?: RateLimitConfig,
): { allowed: boolean; remaining: number; resetAt: number } {
  const key = `${userId}:${action}`;
  const limit = config || DEFAULT_LIMITS[action] || DEFAULT_LIMITS.default;
  const now = Date.now();

  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    // New window
    const resetAt = now + limit.windowMs;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit.maxRequests - 1, resetAt };
  }

  if (entry.count >= limit.maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { allowed: true, remaining: limit.maxRequests - entry.count, resetAt: entry.resetAt };
}

export function getRateLimitStatus(
  userId: number,
  action: string,
): { remaining: number; resetAt: number; limit: number } {
  const key = `${userId}:${action}`;
  const limit = DEFAULT_LIMITS[action] || DEFAULT_LIMITS.default;
  const entry = store.get(key);
  const now = Date.now();

  if (!entry || entry.resetAt <= now) {
    return { remaining: limit.maxRequests, resetAt: now + limit.windowMs, limit: limit.maxRequests };
  }

  return { remaining: Math.max(0, limit.maxRequests - entry.count), resetAt: entry.resetAt, limit: limit.maxRequests };
}
