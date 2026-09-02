/**
 * Rate limiter for API routes.
 *
 * Upstash Redis (REST) sozlangan bo'lsa — barcha serverless instansiyalar
 * uchun UMUMIY hisoblagich (production'da to'g'ri ishlaydi). Sozlanmagan
 * bo'lsa in-memory fallback (dev / bitta instansiya uchun yetarli).
 *
 * Env: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Periodic cleanup of expired entries to prevent memory leaks
const CLEANUP_INTERVAL = 60_000; // 1 minute
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function ensureCleanup() {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore) {
      if (now > entry.resetAt) {
        rateLimitStore.delete(key);
      }
    }
    // Stop cleanup if store is empty
    if (rateLimitStore.size === 0 && cleanupTimer) {
      clearInterval(cleanupTimer);
      cleanupTimer = null;
    }
  }, CLEANUP_INTERVAL);
  // Allow process to exit even if timer is active
  if (cleanupTimer && typeof cleanupTimer === "object" && "unref" in cleanupTimer) {
    cleanupTimer.unref();
  }
}

interface RateLimitOptions {
  /** Maximum number of requests in the window */
  maxRequests: number;
  /** Time window in seconds */
  windowSeconds: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const upstashConfigured = Boolean(upstashUrl && upstashToken);

/**
 * Fixed-window hisoblagich Upstash REST pipeline orqali:
 * INCR + EXPIRE(NX) + TTL — bitta HTTP so'rov, qo'shimcha dependency yo'q.
 * Xato bo'lsa null qaytaradi (chaqiruvchi in-memory'ga tushadi).
 */
async function checkUpstash(
  key: string,
  options: RateLimitOptions
): Promise<RateLimitResult | null> {
  try {
    const res = await fetch(`${upstashUrl}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${upstashToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, String(options.windowSeconds), "NX"],
        ["TTL", key],
      ]),
      // Rate-limit tekshiruvi javobni cho'zmasligi kerak
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) return null;
    const data: Array<{ result?: number; error?: string }> = await res.json();
    const count = data[0]?.result;
    const ttl = data[2]?.result;
    if (typeof count !== "number") return null;
    const resetAt =
      Date.now() + (typeof ttl === "number" && ttl > 0 ? ttl : options.windowSeconds) * 1000;
    return {
      allowed: count <= options.maxRequests,
      remaining: Math.max(0, options.maxRequests - count),
      resetAt,
    };
  } catch {
    return null;
  }
}

function checkMemory(key: string, options: RateLimitOptions): RateLimitResult {
  ensureCleanup();
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    // New window
    const resetAt = now + options.windowSeconds * 1000;
    rateLimitStore.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: options.maxRequests - 1, resetAt };
  }

  if (entry.count >= options.maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: options.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Check rate limit for a given identifier (e.g., IP address or user ID).
 */
export async function checkRateLimit(
  identifier: string,
  prefix: string,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const key = `rl:${prefix}:${identifier}`;

  if (upstashConfigured) {
    const result = await checkUpstash(key, options);
    if (result) return result;
    // Upstash vaqtincha ishlamasa — in-memory bilan davom etamiz
  }

  return checkMemory(key, options);
}

/**
 * Extract client IP from request headers.
 * Only trusts the first hop from x-forwarded-for to prevent spoofing.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // Only trust the LAST IP (set by the reverse proxy closest to us)
    const ips = forwarded.split(",").map((ip) => ip.trim());
    return ips[ips.length - 1] || "unknown";
  }
  return "unknown";
}
