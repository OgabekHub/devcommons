import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In-memory rate limiting with TTL-based cleanup
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_MAX = 100; // requests per window
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds
const CLEANUP_INTERVAL = 5 * 60 * 1000; // Clean up every 5 minutes
const MAX_MAP_SIZE = 10_000; // Maximum entries to prevent memory exhaustion

// Periodic cleanup of expired entries to prevent memory leaks
let lastCleanup = Date.now();

function cleanupExpiredEntries() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, record] of rateLimitMap) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}

function checkRateLimit(identifier: string): boolean {
  cleanupExpiredEntries();

  // Safety valve: if map grows too large, clear it
  if (rateLimitMap.size > MAX_MAP_SIZE) {
    rateLimitMap.clear();
  }

  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

function getIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // Trust only the LAST IP in the chain (set by the closest reverse proxy)
    const ips = forwarded.split(',').map(ip => ip.trim());
    return ips[ips.length - 1] || 'unknown';
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip rate limiting for static assets
  if (path.startsWith('/_next') || path.startsWith('/static') || path.includes('.')) {
    return intlMiddleware(request);
  }

  const identifier = getIdentifier(request);

  // Apply rate limiting to all paths (including API and auth routes)
  if (!checkRateLimit(identifier)) {
    // For API routes, return JSON
    if (path.startsWith('/api')) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
    // For page routes, return a simple HTML response
    return new NextResponse(
      '<html><body style="display:flex;align-items:center;justify-content:center;min-height:100vh;background:#0A0A0A;color:#fff;font-family:sans-serif"><h1>429 — Too Many Requests</h1></body></html>',
      { status: 429, headers: { 'Content-Type': 'text/html' } }
    );
  }

  // API and auth routes don't need i18n middleware
  if (path.startsWith('/api') || path.startsWith('/auth')) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all routes except static files
  matcher: ['/((?!_next|.*\\..*).*)']
};
