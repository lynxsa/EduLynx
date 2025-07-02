// Forgot Password API Route for LynxLearn LMS
import { NextRequest, NextResponse } from 'next/server';

// Mock user database - in production, this would be a real database
const users = [
  {
    id: '1',
    email: 'student@demo.lynxlearn.com',
    firstName: 'Demo',
    lastName: 'Student',
    name: 'Demo Student',
  },
  {
    id: '2',
    email: 'teacher@demo.lynxlearn.com',
    firstName: 'Demo',
    lastName: 'Teacher',
    name: 'Demo Teacher',
  },
  {
    id: '3',
    email: 'admin@demo.lynxlearn.com',
    firstName: 'Demo',
    lastName: 'Admin',
    name: 'Demo Admin',
  },
];

// Mock password reset tokens storage (in production, use database or Redis)
const passwordResetTokens = new Map<
  string,
  {
    email: string;
    token: string;
    expiresAt: Date;
  }
>();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Check if user exists
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    // Always return success to prevent email enumeration attacks
    // In production, only send email if user exists
    if (user) {
      // Generate reset token
      const resetToken = generateResetToken();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

      // Store reset token (in production, save to database)
      passwordResetTokens.set(resetToken, {
        email: user.email,
        token: resetToken,
        expiresAt,
      });

      // In production, send email with reset link
      console.log(
        `Password reset link for ${user.email}: /auth/reset-password?token=${resetToken}`
      );

      // Simulate email sending (in production, use actual email service)
      await simulateEmailSending(user.email, resetToken);
    }

    // Always return success response
    return NextResponse.json({
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Verify reset token
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Reset token is required' }, { status: 400 });
    }

    const resetData = passwordResetTokens.get(token);

    if (!resetData) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }

    if (new Date() > resetData.expiresAt) {
      // Clean up expired token
      passwordResetTokens.delete(token);
      return NextResponse.json({ error: 'Reset token has expired' }, { status: 400 });
    }

    return NextResponse.json({
      valid: true,
      email: resetData.email,
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to generate secure reset token
function generateResetToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Simulate email sending (in production, use actual email service like SendGrid, AWS SES, etc.)
async function simulateEmailSending(email: string, token: string): Promise<void> {
  return new Promise(resolve => {
    // Simulate email sending delay
    setTimeout(() => {
      console.log(`📧 Password reset email sent to: ${email}`);
      console.log(
        `🔗 Reset link: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005'}/auth/reset-password?token=${token}`
      );
      resolve();
    }, 1000);
  });
}
