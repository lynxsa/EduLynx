import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple middleware that doesn't use JWT verification to avoid edge runtime issues
// Authentication is handled by AuthContext on the frontend and API routes have their own auth
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow all routes for now - authentication is handled by AuthContext on the frontend
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
