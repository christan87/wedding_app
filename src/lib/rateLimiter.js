import { LRUCache } from 'lru-cache';

/**
 * Creates a rate limiter that tracks requests per IP address.
 *
 * Uses an in-memory LRU cache — state is per serverless instance, which is
 * appropriate for a low-traffic app where preventing abuse within a single
 * instance is sufficient.
 *
 * @param {number} max        - Max requests allowed within the window
 * @param {number} windowMs   - Time window in milliseconds (default: 15 minutes)
 * @returns {Function} check(ip) → { success: boolean, remaining: number }
 */
export function createRateLimiter({ max, windowMs = 15 * 60 * 1000 }) {
  const cache = new LRUCache({
    max: 500,       // track at most 500 unique IPs at once
    ttl: windowMs,  // entries expire after the window
  });

  return function check(ip) {
    const key = String(ip);
    const count = (cache.get(key) ?? 0) + 1;
    cache.set(key, count);
    return {
      success: count <= max,
      remaining: Math.max(0, max - count),
    };
  };
}

/**
 * Extracts the real client IP from a Next.js API request, handling
 * proxies and Netlify's forwarded headers.
 *
 * @param {import('http').IncomingMessage} req
 * @returns {string}
 */
export function getIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return String(forwarded).split(',')[0].trim();
  }
  return req.socket?.remoteAddress ?? 'unknown';
}
