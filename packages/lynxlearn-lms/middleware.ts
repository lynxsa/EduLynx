import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  // Allow public and auth paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/auth') ||
    pathname === '/'
  ) {
    return NextResponse.next();
  }

  // Get JWT token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If no token, redirect to sign in
  if (!token) {
    const signInUrl = new URL('/auth/signin', origin);
    return NextResponse.redirect(signInUrl);
  }

  // Role-based access
  if (pathname.startsWith('/teacher') && token.role !== 'TEACHER') {
    return NextResponse.redirect(new URL('/unauthorized', origin));
  }
  if (pathname.startsWith('/admin') && token.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/unauthorized', origin));
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/courses/:path*',
    '/achievements/:path*',
    '/ai-tutor/:path*',
    '/teacher/:path*',
    '/admin/:path*',
  ],
};
