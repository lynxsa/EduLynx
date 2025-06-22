import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'User ID is required',
        },
        { status: 400 }
      );
    }

    // Get parent profile
    const parent = await prisma.parent.findFirst({
      where: { userId },
      include: {
        students: {
          include: {
            class: true,
            grade: true,
          },
        },
      },
    });

    if (!parent) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parent not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: parent,
    });
  } catch (error) {
    console.error('Error fetching parent profile:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch parent profile',
      },
      { status: 500 }
    );
  }
}
