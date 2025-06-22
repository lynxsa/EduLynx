import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      message: 'API is working',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    console.error('Test API Error:', error);
    return NextResponse.json(
      { error: 'API test failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
