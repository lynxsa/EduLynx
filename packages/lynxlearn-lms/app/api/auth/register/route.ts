// Registration API Route for LynxLearn LMS
import { NextRequest, NextResponse } from 'next/server';

// Mock user database - in production, this would be a real database
const users = [
  {
    id: '1',
    email: 'student@demo.lynxlearn.com',
    password: 'Demo123!', // In production, this would be hashed
    firstName: 'Demo',
    lastName: 'Student',
    name: 'Demo Student',
    role: 'student',
    grade: 'Grade 12',
    school: 'Demo High School',
    province: 'Gauteng',
    enrolledCourses: ['1', '2', '3'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'teacher@demo.lynxlearn.com',
    password: 'Demo123!',
    firstName: 'Demo',
    lastName: 'Teacher',
    name: 'Demo Teacher',
    role: 'teacher',
    school: 'Demo High School',
    province: 'Gauteng',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'admin@demo.lynxlearn.com',
    password: 'Demo123!',
    firstName: 'Demo',
    lastName: 'Admin',
    name: 'Demo Admin',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
];

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  grade: string;
  school: string;
  province: string;
  agreeToTerms: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const data: RegisterData = await request.json();

    // Validate required fields
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'password',
      'grade',
      'school',
      'province',
    ];
    for (const field of requiredFields) {
      if (!data[field as keyof RegisterData]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    // Validate email format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(data.password)) {
      return NextResponse.json(
        {
          error:
            'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
        },
        { status: 400 }
      );
    }

    // Check if passwords match
    if (data.password !== data.confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email.toLowerCase() === data.email.toLowerCase());
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Check terms agreement
    if (!data.agreeToTerms) {
      return NextResponse.json(
        { error: 'You must agree to the terms and conditions' },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = {
      id: (users.length + 1).toString(),
      email: data.email.toLowerCase(),
      password: data.password, // In production, hash this password
      firstName: data.firstName,
      lastName: data.lastName,
      name: `${data.firstName} ${data.lastName}`,
      role: 'student',
      grade: data.grade,
      school: data.school,
      province: data.province,
      enrolledCourses: [], // New users start with no enrolled courses
      createdAt: new Date().toISOString(),
    };

    // Add to users array (in production, save to database)
    users.push(newUser);

    // Return success response (don't include password)
    const { password, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      message: 'Account created successfully',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET method to check if email exists
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());

    return NextResponse.json({
      exists: !!existingUser,
    });
  } catch (error) {
    console.error('Email check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
