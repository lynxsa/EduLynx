import { NextRequest, NextResponse } from 'next/server';
import { calculateAttendancePercentage, calculateStudentAverageScore } from '@/lib/calculations';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId');

    if (!parentId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parent ID is required',
        },
        { status: 400 }
      );
    }

    // Get children for the parent
    const children = await prisma.student.findMany({
      where: { parentId },
      include: {
        class: true,
        grade: true,
        results: true,
        attendances: true,
      },
    });

    // Calculate metrics for each child
    const childrenWithMetrics = await Promise.all(
      children.map(async child => {
        const attendancePercent = await calculateAttendancePercentage(child.id);
        const avgScore = await calculateStudentAverageScore(child.id);

        return {
          ...child,
          attendancePercent,
          avgScore,
          notifications: Math.floor(Math.random() * 5), // Simulated for now
          status: 'Active',
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: childrenWithMetrics,
    });
  } catch (error) {
    console.error('Error fetching children data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch children data',
      },
      { status: 500 }
    );
  }
}
