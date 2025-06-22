import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, generateToken } from '@/lib/auth';
import { createResponse, createErrorResponse } from '@/lib/api-utils';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Login API called');
    const body = await request.json();
    const { email, password } = body;
    console.log('📧 Login attempt for:', email);

    // Validate input
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return createErrorResponse('Email and password are required', 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format:', email);
      return createErrorResponse('Invalid email format', 400);
    }

    console.log('🔍 Searching for user in database...');
    // Find user
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase().trim(),
      },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        role: true,
        schoolId: true,
        isActive: true,
      },
    });

    if (!user) {
      console.log('❌ User not found');
      return createErrorResponse('Invalid credentials', 401);
    }

    if (!user.isActive) {
      console.log('❌ Account deactivated');
      return createErrorResponse('Account is deactivated', 403);
    }

    console.log('🔐 Verifying password...');
    // Verify password
    const isValidPassword = await verifyPassword(password, user.password || '');
    if (!isValidPassword) {
      console.log('❌ Invalid password');
      return createErrorResponse('Invalid credentials', 401);
    }

    console.log('✅ Password verified, generating token...');
    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      schoolId: user.schoolId || undefined,
    });

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;

    console.log('✅ Login successful for:', email);
    const response = createResponse(
      {
        user: userWithoutPassword,
        token,
      },
      'Login successful'
    );

    // Set cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('❌ Login error:', error);
    return createErrorResponse('Login failed', 500);
  }
}
