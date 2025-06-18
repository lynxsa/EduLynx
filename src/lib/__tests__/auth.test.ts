import { verifyToken, getTokenFromRequest } from '../auth'
import * as jwt from 'jsonwebtoken'

// Mock jsonwebtoken
jest.mock('jsonwebtoken')

describe('Auth utilities', () => {
  describe('verifyToken', () => {
    it('should return payload for valid token', () => {
      const mockPayload = {
        userId: '1',
        email: 'test@example.com',
        role: 'admin',
        firstName: 'John',
        lastName: 'Doe'
      }

      ;(jwt.verify as jest.Mock).mockReturnValue(mockPayload)

      const result = verifyToken('valid-token')
      
      expect(result).toEqual(mockPayload)
      expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'fallback-secret')
    })

    it('should return null for invalid token', () => {
      ;(jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token')
      })

      const result = verifyToken('invalid-token')
      
      expect(result).toBeNull()
    })

    it('should use environment JWT_SECRET when available', () => {
      const originalEnv = process.env.JWT_SECRET
      process.env.JWT_SECRET = 'test-secret'

      const mockPayload = {
        userId: '1',
        email: 'test@example.com',
        role: 'admin',
        firstName: 'John',
        lastName: 'Doe'
      }

      ;(jwt.verify as jest.Mock).mockReturnValue(mockPayload)

      verifyToken('valid-token')
      
      expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'test-secret')
      
      // Restore original env
      process.env.JWT_SECRET = originalEnv
    })
  })

  describe('getTokenFromRequest', () => {
    it('should extract token from cookie header', () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockImplementation((headerName) => {
            if (headerName === 'cookie') {
              return 'auth-token=test-token; other-cookie=value'
            }
            return null
          })
        }
      } as unknown as Request

      const result = getTokenFromRequest(mockRequest)
      
      expect(result).toBe('test-token')
    })

    it('should extract token from Authorization header', () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockImplementation((headerName) => {
            if (headerName === 'cookie') return null
            if (headerName === 'authorization') return 'Bearer test-token'
            return null
          })
        }
      } as unknown as Request

      const result = getTokenFromRequest(mockRequest)
      
      expect(result).toBe('test-token')
    })

    it('should return null when no token is found', () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue(null)
        }
      } as unknown as Request

      const result = getTokenFromRequest(mockRequest)
      
      expect(result).toBeNull()
    })

    it('should prefer cookie over authorization header', () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockImplementation((headerName) => {
            if (headerName === 'cookie') return 'auth-token=cookie-token'
            if (headerName === 'authorization') return 'Bearer bearer-token'
            return null
          })
        }
      } as unknown as Request

      const result = getTokenFromRequest(mockRequest)
      
      expect(result).toBe('cookie-token')
    })
  })
})
