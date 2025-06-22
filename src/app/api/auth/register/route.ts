import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, verifyPassword, generateToken } from '@/lib/auth';
import { validateUser } from '@/lib/validation';
import {
  createResponse,
  createErrorResponse,
  createValidationErrorResponse,
} from '@/lib/api-utils';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, role, schoolId } = body;

    // Validate input
    const validation = validateUser(body);
    if (!validation.isValid) {
      return createValidationErrorResponse(validation.errors);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return createErrorResponse('User with this email already exists', 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role as any,
        schoolId: schoolId || null,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        schoolId: true,
        isActive: true,
        createdAt: true,
      },
    });

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      schoolId: user.schoolId || undefined,
    });

    // Create response with token
    const response = createResponse(
      {
        user,
        token,
      },
      'User registered successfully'
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
    console.error('Registration error:', error);
    return createErrorResponse('Registration failed', 500);
  }
}
