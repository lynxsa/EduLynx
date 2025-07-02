// Authentication API Routes for LynxLearn LMS
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Mock user database - in production, this would be a real database
const users = [
  {
    id: '1',
    email: 'student@demo.lynxlearn.com',
    password: 'Demo123!', // In production, this would be hashed
    name: 'Demo Student',
    role: 'student',
    enrolledCourses: ['1', '2', '3'],
  },
  {
    id: '2',
    email: 'teacher@demo.lynxlearn.com',
    password: 'Demo123!',
    name: 'Demo Teacher',
    role: 'teacher',
  },
  {
    id: '3',
    email: 'admin@demo.lynxlearn.com',
    password: 'Demo123!',
    name: 'Demo Admin',
    role: 'admin',
  },
];

export async function POST(request: NextRequest) {
  try {
    const { email, password, action } = await request.json();

    if (action === 'login') {
      // Find user
      const user = users.find(u => u.email === email && u.password === password);

      if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      // Create session token (in production, use proper JWT)
      const sessionToken = Buffer.from(
        JSON.stringify({
          userId: user.id,
          email: user.email,
          role: user.role,
          exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        })
      ).toString('base64');

      // Set session cookie
      const response = NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          enrolledCourses: user.enrolledCourses || [],
        },
      });

      response.cookies.set('session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      });

      return response;
    }

    if (action === 'register') {
      // Check if user already exists
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
      }

      // Create new user (in production, hash password and save to database)
      const newUser = {
        id: (users.length + 1).toString(),
        email,
        password, // In production, hash this
        name: email.split('@')[0], // Extract name from email
        role: 'student',
        enrolledCourses: [],
      };

      users.push(newUser);

      // Create session
      const sessionToken = Buffer.from(
        JSON.stringify({
          userId: newUser.id,
          email: newUser.email,
          role: newUser.role,
          exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
        })
      ).toString('base64');

      const response = NextResponse.json({
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          enrolledCourses: newUser.enrolledCourses,
        },
      });

      response.cookies.set('session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });

      return response;
    }

    if (action === 'logout') {
      const response = NextResponse.json({ success: true });
      response.cookies.delete('session');
      return response;
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false });
    }

    // Decode session token
    const sessionData = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString());

    // Check if token is expired
    if (Date.now() > sessionData.exp) {
      const response = NextResponse.json({ authenticated: false });
      response.cookies.delete('session');
      return response;
    }

    // Find user
    const user = users.find(u => u.id === sessionData.userId);
    if (!user) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        enrolledCourses: user.enrolledCourses || [],
      },
    });
  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json({ authenticated: false });
  }
}
