import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, getTokenFromRequest } from './lib/auth';

const PUBLIC_ROUTES = ['/sign-in', '/sign-up', '/api/auth/login', '/api/auth/logout'];

function getRoleFromToken(req: NextRequest): string | undefined {
  const token = getTokenFromRequest(req);
  if (!token) return undefined;
  
  const payload = verifyToken(token);
  return payload?.role;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Allow public routes
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const role = getRoleFromToken(req);

  // Redirect '/' to role dashboard
  if (pathname === '/') {
    switch (role) {
      case 'ADMIN':
        return NextResponse.redirect(new URL('/admin', req.url));
      case 'TEACHER':
        return NextResponse.redirect(new URL('/teacher', req.url));
      case 'STUDENT':
        return NextResponse.redirect(new URL('/student', req.url));
      case 'PARENT':
        return NextResponse.redirect(new URL('/parent', req.url));
      default:
        return NextResponse.redirect(new URL('/sign-in', req.url));
    }
  }

  // If no role (no valid token), redirect to sign-in
  if (!role) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // Role-based route protection
  if (pathname.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }
  if (pathname.startsWith('/teacher') && role !== 'TEACHER') {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }
  if (pathname.startsWith('/student') && role !== 'STUDENT') {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }
  if (pathname.startsWith('/parent') && role !== 'PARENT') {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
