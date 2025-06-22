import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser || currentUser.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the teacher record using the user ID
    const teacher = await prisma.teacher.findUnique({
      where: { userId: currentUser.userId },
      include: {
        subjects: { include: { subject: true } },
        class: true,
      },
    });

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    // Fetch teacher metrics
    const [
      totalAssignments,
      totalExams,
      totalStudents,
      attendanceCount,
      totalSubjects,
      totalClasses,
    ] = await Promise.all([
      prisma.assignment.count({ where: { lesson: { teacherId: teacher.id } } }),
      prisma.exam.count({ where: { lesson: { teacherId: teacher.id } } }),
      prisma.student.count({
        where: { class: { teachers: { some: { id: teacher.id } } } },
      }),
      prisma.attendance.count({
        where: { lesson: { teacherId: teacher.id }, present: true },
      }),
      prisma.subjectToTeacher.count({ where: { teacherId: teacher.id } }),
      prisma.class.count({ where: { teachers: { some: { id: teacher.id } } } }),
    ]);

    // Attendance percentage (for this teacher's lessons)
    const totalAttendance = await prisma.attendance.count({
      where: { lesson: { teacherId: teacher.id } },
    });
    const attendancePercentage =
      totalAttendance > 0 ? Math.round((attendanceCount / totalAttendance) * 100) : 0;

    // Upcoming lessons (next 7 days)
    const upcomingLessons = await prisma.lesson.findMany({
      where: {
        teacherId: teacher.id,
        startTime: {
          gte: new Date(),
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { startTime: 'asc' },
      include: { class: true, subject: true },
    });

    // Fetch subject-specific performance data for "Teacher by Subject" chart
    const subjectPerformance = await Promise.all(
      teacher.subjects.map(async subjectTeacher => {
        const subject = subjectTeacher.subject;

        // Get all results for this teacher's subject
        const results = await prisma.result.findMany({
          where: {
            OR: [
              {
                exam: {
                  lesson: { teacherId: teacher.id, subjectId: subject.id },
                },
              },
              {
                assignment: {
                  lesson: { teacherId: teacher.id, subjectId: subject.id },
                },
              },
            ],
          },
          select: { score: true },
        });

        // Calculate average score for this subject
        const avgScore =
          results.length > 0
            ? Math.round(
                results.reduce((sum, result) => sum + (result.score || 0), 0) / results.length
              )
            : 0;

        // Get student count for this subject
        const studentCount = await prisma.student.count({
          where: {
            class: {
              lessons: {
                some: {
                  teacherId: teacher.id,
                  subjectId: subject.id,
                },
              },
            },
          },
        });

        // Get assignment/exam count for this subject
        const assessmentCount = await prisma.lesson.count({
          where: {
            teacherId: teacher.id,
            subjectId: subject.id,
            OR: [{ assignments: { some: {} } }, { exams: { some: {} } }],
          },
        });

        return {
          subjectName: subject.name,
          averageScore: avgScore,
          studentCount,
          assessmentCount,
          passRate: avgScore >= 60 ? Math.min(95, avgScore + 10) : Math.max(40, avgScore - 5), // Mock pass rate calculation
        };
      })
    );

    // Fetch students in teacher's classes with health info
    const students = await prisma.student.findMany({
      where: { class: { teachers: { some: { id: teacher.id } } } },
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
        grade: { select: { level: true } },
      },
    });

    // Enhanced metrics calculation
    const allResults = await prisma.result.findMany({
      where: {
        OR: [
          { exam: { lesson: { teacherId: teacher.id } } },
          { assignment: { lesson: { teacherId: teacher.id } } },
        ],
      },
      select: { score: true },
    });

    const classAverage =
      allResults.length > 0
        ? Math.round(
            allResults.reduce((sum, result) => sum + (result.score || 0), 0) / allResults.length
          )
        : 0;

    const dashboardData = {
      myClasses: totalClasses,
      myStudents: totalStudents,
      pendingGrades: Math.floor(totalExams * 0.3), // Approximate pending grades
      classAverage,
      totalAssignments,
      totalExams,
      attendancePercentage,
      totalSubjects,
      upcomingLessons,
      students,
      subjectPerformance, // New: detailed subject performance data
      teacherInfo: {
        name: teacher.name,
        surname: teacher.surname,
        email: teacher.email,
        subjects: teacher.subjects.map(st => st.subject.name),
      },
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Teacher Dashboard API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch teacher dashboard data' }, { status: 500 });
  }
}
