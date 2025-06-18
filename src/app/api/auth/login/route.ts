import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log('🔍 Login API called');
    const body = await request.json();
    const { email, password } = body;
    console.log('📧 Login attempt for:', email);

    // Input validation
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return NextResponse.json(
        { 
          success: false,
          error: 'Email and password are required' 
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format:', email);
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid email format' 
        },
        { status: 400 }
      );
    }

    console.log('🔍 Searching for user in database...');
    // Find user in database with optimized query
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase().trim()
      },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        schoolId: true
      }
    });

    console.log('🔍 User found:', !!user, user ? `(${user.role})` : '');
    
    if (!user) {
      console.log('❌ User not found for email:', email);
      // Add artificial delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 100));
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid email or password' 
        },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      console.log('❌ User account deactivated:', email);
      return NextResponse.json(
        { 
          success: false,
          error: 'Account is deactivated. Please contact administrator.' 
        },
        { status: 401 }
      );
    }

    console.log('🔐 Verifying password...');
    // Enhanced password verification
    let isPasswordValid = false;
    if (user.password) {
      try {
        // Check if password is hashed (bcrypt format)
        if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$') || user.password.startsWith('$2y$')) {
          isPasswordValid = await bcrypt.compare(password, user.password);
          console.log('🔐 Bcrypt password check:', isPasswordValid);
        } else {
          // Legacy plain text password (for backwards compatibility)
          isPasswordValid = user.password === password;
          console.log('🔐 Plain text password check:', isPasswordValid);
          
          // If plain text password matches, hash it for security
          if (isPasswordValid) {
            console.log('🔐 Upgrading plain text password to bcrypt...');
            const hashedPassword = await bcrypt.hash(password, 12);
            await prisma.user.update({
              where: { id: user.id },
              data: { password: hashedPassword }
            });
          }
        }
      } catch (error) {
        console.error('❌ Password verification error:', error);
        isPasswordValid = false;
      }
    }

    if (!isPasswordValid) {
      // Add artificial delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 100));
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid email or password' 
        },
        { status: 401 }
      );
    }

    // Generate JWT token with enhanced security
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET not configured');
      return NextResponse.json(
        { 
          success: false,
          error: 'Authentication configuration error' 
        },
        { status: 500 }
      );
    }
    
    const payload = { 
      userId: user.id, 
      email: user.email, 
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      schoolId: user.schoolId,
      iat: Math.floor(Date.now() / 1000)
    };
    
    const token = sign(payload, jwtSecret, { 
      expiresIn: '7d',
      algorithm: 'HS256',
      issuer: 'edulynx',
      audience: 'edulynx-users'
    });

    // Prepare response data
    const responseData = {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: `${user.firstName} ${user.lastName}`
      },
      redirectTo: getRedirectPath(user.role),
      timestamp: new Date().toISOString(),
      loginDuration: Date.now() - startTime
    };

    // Create response with secure HTTP-only cookie
    const response = NextResponse.json(responseData);

    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    // Log successful login (without sensitive data)
    console.log(`✅ Successful login: ${user.email} (${user.role}) - ${Date.now() - startTime}ms`);
    
    return response;

  } catch (error) {
    console.error('❌ Auth API Error:', error);
    
    // Return generic error to prevent information leakage
    return NextResponse.json(
      { 
        success: false,
        error: 'Authentication failed. Please try again.',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

function getRedirectPath(role: string): string {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "TEACHER":
      return "/teacher";
    case "PARENT":
      return "/parent";
    case "STUDENT":
      return "/student";
    default:
      return "/sign-in";
  }
}
