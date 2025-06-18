import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Fetch analytics data
    const [studentsCount, teachersCount, classesCount, totalAttendance, presentAttendance] = await Promise.all([
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.class.count(),
      prisma.attendance.count(),
      prisma.attendance.count({
        where: {
          present: true
        }
      })
    ]);

    // Calculate average attendance percentage
    const averageAttendance = totalAttendance > 0 
      ? Math.round((presentAttendance / totalAttendance) * 100)
      : 0;

    // Get recent activity (simplified)
    const recentActivity = [
      'New student John Doe registered',
      '5 assignments submitted today',
      'Math class attendance: 95%',
      'New announcement posted',
      'Parent meeting scheduled'
    ];

    const analyticsData = {
      totalStudents: studentsCount,
      totalTeachers: teachersCount,
      totalClasses: classesCount,
      averageAttendance,
      recentActivity,
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(analyticsData);

  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
