import { NextRequest, NextResponse } from 'next/server'

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = [
    '/sign-in', 
    '/api/auth/login',
    '/favicon.ico',
    '/_next',
    '/public'
  ]
  
  // Check if current path is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  )
  
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Static files and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') && !pathname.startsWith('/api/')
  ) {
    return NextResponse.next()
  }

  // Check for auth token
  const token = request.cookies.get('auth-token')?.value

  if (!token) {
    console.log(`🔒 No token found, redirecting to sign-in from: ${pathname}`)
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  try {
    const payload = parseJwt(token)
    
    if (!payload || !payload.userId || !payload.role) {
      console.log(`🔒 Invalid token payload, redirecting to sign-in from: ${pathname}`)
      // Clear invalid cookie
      const response = NextResponse.redirect(new URL('/sign-in', request.url))
      response.cookies.delete('auth-token')
      return response
    }

    // Check token expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      console.log(`🔒 Token expired, redirecting to sign-in from: ${pathname}`)
      const response = NextResponse.redirect(new URL('/sign-in', request.url))
      response.cookies.delete('auth-token')
      return response
    }
    
    // Add user info to headers for API routes
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', payload.userId)
    requestHeaders.set('x-user-role', payload.role)
    requestHeaders.set('x-user-email', payload.email)
    requestHeaders.set('x-user-name', `${payload.firstName} ${payload.lastName}`)

    // Role-based access control
    const userRole = payload.role.toUpperCase()

    // Define role-based route access
    const roleRoutes = {
      ADMIN: ['/admin', '/list', '/dashboard'],
      TEACHER: ['/teacher', '/dashboard'],
      PARENT: ['/parent', '/dashboard'], 
      STUDENT: ['/student', '/dashboard']
    }

    // Check if user has access to the route
    const hasAccess = userRole === 'ADMIN' || 
      roleRoutes[userRole as keyof typeof roleRoutes]?.some(route => 
        pathname.startsWith(route) || pathname === '/'
      )

    if (!hasAccess) {
      console.log(`🚫 Access denied for ${userRole} to ${pathname}`)
      const defaultRoute = getDefaultRouteForRole(userRole)
      return NextResponse.redirect(new URL(defaultRoute, request.url))
    }

    // Redirect root path to role-specific dashboard
    if (pathname === '/') {
      const defaultRoute = getDefaultRouteForRole(userRole)
      return NextResponse.redirect(new URL(defaultRoute, request.url))
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })

  } catch (error) {
    console.error('❌ Middleware error:', error)
    const response = NextResponse.redirect(new URL('/sign-in', request.url))
    response.cookies.delete('auth-token')
    return response
  }
}

function getDefaultRouteForRole(role: string): string {
  switch (role.toUpperCase()) {
    case 'ADMIN':
      return '/admin'
    case 'TEACHER':
      return '/teacher'
    case 'PARENT':
      return '/parent'
    case 'STUDENT':
      return '/student'
    default:
      return '/sign-in'
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
