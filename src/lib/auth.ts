import { NextRequest } from 'next/server';
import * as jwt from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;  
  firstName: string;
  lastName: string;
  schoolId?: number;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET not configured');
      return null;
    }
    
    const decoded = jwt.verify(token, jwtSecret, {
      algorithms: ['HS256'],
      issuer: 'edulynx',
      audience: 'edulynx-users'
    }) as TokenPayload;
    
    // Additional validation
    if (!decoded.userId || !decoded.email || !decoded.role) {
      console.error('Invalid token payload structure');
      return null;
    }
    
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.log('Token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.log('Invalid token');
    } else {
      console.error('Token verification failed:', error);
    }
    return null;
  }
}

export function getTokenFromRequest(request: Request): string | null {
  try {
    // Try to get token from cookie first (more secure)
    const cookies = request.headers.get('cookie');
    if (cookies) {
      const authCookie = cookies.split(';').find(c => c.trim().startsWith('auth-token='));
      if (authCookie) {
        const token = authCookie.split('=')[1];
        if (token && token !== 'undefined' && token !== 'null') {
          return token;
        }
      }
    }
    
    // Fallback to Authorization header
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      if (token && token !== 'undefined' && token !== 'null') {
        return token;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting token from request:', error);
    return null;
  }
}

export function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      Buffer.from(base64, 'base64')
        .toString('binary')
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

export function getRoleFromRequest(req: NextRequest): string | undefined {
  const sessionToken = req.cookies.get('__session')?.value;
  if (!sessionToken) return undefined;
  const payload = parseJwt(sessionToken);
  return payload?.role || payload?.publicMetadata?.role;
}
