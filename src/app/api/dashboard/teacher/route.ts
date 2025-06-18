import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');
    if (!teacherId) {
      return NextResponse.json({ error: 'Missing teacherId' }, { status: 400 });
    }

    // Fetch teacher metrics
    const [
      totalAssignments,
      totalExams,
      totalStudents,
      attendanceCount,
      totalSubjects,
      totalClasses
    ] = await Promise.all([
      prisma.assignment.count({ where: { lesson: { teacherId } } }),
      prisma.exam.count({ where: { lesson: { teacherId } } }),
      prisma.student.count({ where: { class: { teachers: { some: { id: teacherId } } } } }),
      prisma.attendance.count({ where: { lesson: { teacherId }, present: true } }),
      prisma.subjectToTeacher.count({ where: { teacherId } }),
      prisma.class.count({ where: { teachers: { some: { id: teacherId } } } })
    ]);

    // Attendance percentage (for this teacher's lessons)
    const totalAttendance = await prisma.attendance.count({ where: { lesson: { teacherId } } });
    const attendancePercentage = totalAttendance > 0 ? Math.round((attendanceCount / totalAttendance) * 100) : 0;

    // Upcoming lessons (next 7 days)
    const upcomingLessons = await prisma.lesson.findMany({
      where: {
        teacherId,
        startTime: { gte: new Date(), lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
      },
      orderBy: { startTime: 'asc' },
      include: { class: true, subject: true }
    });

    // Teacher info
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      include: { subjects: { include: { subject: true } }, class: true }
    });

    // Fetch students in teacher's classes with health info
    const students = await prisma.student.findMany({
      where: { class: { teachers: { some: { id: teacherId } } } },
      select: {
        id: true,
        name: true,
        surname: true,
        gender: true,
        bloodType: true,
        allergies: true,
        medicalInfo: true,
        specialNeeds: true,
        emergencyContactName: true,
        emergencyContactPhone: true,
        status: true,
        class: { select: { name: true } },
        grade: { select: { level: true } }
      }
    });

    return NextResponse.json({
      metrics: {
        totalAssignments,
        totalExams,
        totalStudents,
        attendancePercentage,
        totalSubjects,
        totalClasses
      },
      upcomingLessons,
      teacher,
      students // Add students with health info
    });
  } catch (error) {
    console.error('Teacher Dashboard API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teacher dashboard data' },
      { status: 500 }
    );
  }
}
