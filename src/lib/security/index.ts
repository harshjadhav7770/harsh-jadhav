interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

/**
 * In-memory sliding rate limiter per IP address
 */
export function checkRateLimit(
  ip: string,
  key: string,
  limit: number = 5,
  windowSeconds: number = 60
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const mapKey = `${key}:${ip}`;
  const record = rateLimitMap.get(mapKey);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(mapKey, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { success: true, remaining: limit - 1, resetAt: now + windowSeconds * 1000 };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count += 1;
  return { success: true, remaining: limit - record.count, resetAt: record.resetAt };
}

/**
 * Sanitize basic input strings against common XSS injections
 */
export function sanitizeString(input: string): string {
  if (!input) return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}
