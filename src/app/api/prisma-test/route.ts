import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Prisma connection...');
    const prisma = new PrismaClient();

    // Test database connection
    const userCount = await prisma.user.count();
    console.log('User count:', userCount);

    await prisma.$disconnect();

    return NextResponse.json({
      message: 'Prisma is working',
      userCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Prisma test error:', error);
    return NextResponse.json(
      {
        error: 'Prisma test failed',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
