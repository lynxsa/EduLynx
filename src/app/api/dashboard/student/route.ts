import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    if (!studentId) {
      return NextResponse.json({ error: 'Missing studentId' }, { status: 400 });
    }

    // Student metrics
    const [
      totalAssignments,
      totalExams,
      attendanceCount,
      totalResults,
      student
    ] = await Promise.all([
      prisma.assignment.count({ where: { lesson: { class: { students: { some: { id: studentId } } } } } }),
      prisma.exam.count({ where: { lesson: { class: { students: { some: { id: studentId } } } } } }),
      prisma.attendance.count({ where: { studentId, present: true } }),
      prisma.result.count({ where: { studentId } }),
      prisma.student.findUnique({ where: { id: studentId }, include: { class: true, grade: true } })
    ]);

    // Attendance percentage
    const totalAttendance = await prisma.attendance.count({ where: { studentId } });
    const attendancePercentage = totalAttendance > 0 ? Math.round((attendanceCount / totalAttendance) * 100) : 0;

    // Upcoming assignments (next 7 days)
    const upcomingAssignments = await prisma.assignment.findMany({
      where: {
        lesson: { class: { students: { some: { id: studentId } } } },
        dueDate: { gte: new Date(), lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
      },
      orderBy: { dueDate: 'asc' },
      include: { lesson: { include: { subject: true } } }
    });

    // Recent results (last 3)
    const recentResults = await prisma.result.findMany({
      where: { studentId },
      orderBy: { id: 'desc' },
      take: 3,
      include: { assignment: true }
    });

    return NextResponse.json({
      metrics: {
        totalAssignments,
        totalExams,
        attendancePercentage,
        totalResults,
        className: student?.class?.name || ''
      },
      upcomingAssignments,
      recentResults,
      student
    });
  } catch (error) {
    console.error('Student Dashboard API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch student dashboard data' },
      { status: 500 }
    );
  }
}
