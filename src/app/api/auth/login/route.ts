import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Login API called');
    const body = await request.json();
    const { email, password } = body;
    console.log('📧 Login attempt for:', email);

    // Validate input
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format:', email);
      return NextResponse.json({ success: false, error: 'Invalid email format' }, { status: 400 });
    }

    console.log('🔍 Searching for user in database...');
    // Find user
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase().trim(),
      },
    });

    if (!user) {
      console.log('❌ User not found');
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    if (!user.isActive) {
      console.log('❌ Account deactivated');
      return NextResponse.json(
        { success: false, error: 'Account is deactivated' },
        { status: 403 }
      );
    }

    console.log('🔐 Verifying password...');
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password || '');
    if (!isValidPassword) {
      console.log('❌ Invalid password');
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    console.log('✅ Password verified, generating token...');
    // Generate token
    const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key-here';
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        schoolId: user.schoolId || undefined,
      },
      JWT_SECRET,
      {
        expiresIn: '7d',
        issuer: 'edulynx',
        audience: 'edulynx-users',
        algorithm: 'HS256',
      }
    );

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;

    console.log('✅ Login successful for:', email);
    const response = NextResponse.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
      message: 'Login successful',
    });

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
    return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 });
  }
}
