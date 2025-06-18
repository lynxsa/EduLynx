/**
 * @jest-environment jsdom
 */
import { verifyToken, getTokenFromRequest, parseJwt } from '@/lib/auth';
import * as jwt from 'jsonwebtoken';

// Mock jsonwebtoken
jest.mock('jsonwebtoken');

describe('Auth Utilities', () => {
  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJyb2xlIjoiYWRtaW4iLCJmaXJzdE5hbWUiOiJKb2huIiwibGFzdE5hbWUiOiJEb2UifQ.signature';
  
  const mockPayload = {
    userId: '123',
    email: 'test@test.com',
    role: 'admin',
    firstName: 'John',
    lastName: 'Doe'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  describe('verifyToken', () => {
    it('returns payload for valid token', () => {
      (jwt.verify as jest.Mock).mockReturnValue(mockPayload);

      const result = verifyToken(mockToken);

      expect(result).toEqual(mockPayload);
      expect(jwt.verify).toHaveBeenCalledWith(mockToken, 'test-secret');
    });

    it('returns null for invalid token', () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = verifyToken('invalid-token');

      expect(result).toBeNull();
    });

    it('uses fallback secret when JWT_SECRET is not set', () => {
      delete process.env.JWT_SECRET;
      (jwt.verify as jest.Mock).mockReturnValue(mockPayload);

      verifyToken(mockToken);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, 'fallback-secret');
    });
  });

  describe('getTokenFromRequest', () => {
    it('extracts token from cookie', () => {
      const mockRequest = {
        headers: {
          get: jest.fn((name: string) => 
            name === 'cookie' ? 'auth-token=test-token; other=value' : null
          )
        }
      } as any;

      const result = getTokenFromRequest(mockRequest);

      expect(result).toBe('test-token');
    });

    it('extracts token from Authorization header', () => {
      const mockRequest = {
        headers: {
          get: jest.fn((name: string) => 
            name === 'authorization' ? 'Bearer test-token' : null
          )
        }
      } as any;

      const result = getTokenFromRequest(mockRequest);

      expect(result).toBe('test-token');
    });

    it('returns null when no token found', () => {
      const mockRequest = {
        headers: {
          get: jest.fn(() => null)
        }
      } as any;

      const result = getTokenFromRequest(mockRequest);

      expect(result).toBeNull();
    });

    it('prioritizes cookie over authorization header', () => {
      const mockRequest = {
        headers: {
          get: jest.fn((name: string) => {
            if (name === 'cookie') return 'auth-token=cookie-token';
            if (name === 'authorization') return 'Bearer header-token';
            return null;
          })
        }
      } as any;

      const result = getTokenFromRequest(mockRequest);

      expect(result).toBe('cookie-token');
    });
  });

  describe('parseJwt', () => {
    it('parses valid JWT token', () => {
      // Create a valid JWT token for testing
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify(mockPayload));
      const signature = 'mock-signature';
      const token = `${header}.${payload}.${signature}`;

      const result = parseJwt(token);

      expect(result).toEqual(mockPayload);
    });

    it('returns null for invalid token format', () => {
      const result = parseJwt('invalid-token');

      expect(result).toBeNull();
    });

    it('returns null for malformed JWT', () => {
      const result = parseJwt('header.invalid-payload.signature');

      expect(result).toBeNull();
    });
  });
});
