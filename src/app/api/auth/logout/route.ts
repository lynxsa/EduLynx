import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Clear the auth cookie
    const response = NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
    
    response.cookies.set({
      name: 'auth-token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0 // Expire immediately
    });

    return response;
  } catch (error) {
    console.error('Logout API Error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
