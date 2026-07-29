import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_MAX = 100; // requests per window
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds

function checkRateLimit(identifier: string): boolean {
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
  // Use IP address or session ID as identifier
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
  return ip || 'unknown';
}

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const identifier = getIdentifier(request);

  // Skip rate limiting for static assets and API routes that don't need it
  const path = request.nextUrl.pathname;
  if (path.startsWith('/_next') || path.startsWith('/static') || path.includes('.')) {
    return intlMiddleware(request);
  }

  // Apply rate limiting
  if (!checkRateLimit(identifier)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  return intlMiddleware(request);
}

export const config = {
  // Skip all paths that should not be internationalized.
  // This skips the folders "api", "_next", "auth" (OAuth callback) and all files with an extension (e.g. favicon.ico)
  matcher: ['/((?!api|_next|auth|.*\\..*).*)']
};
