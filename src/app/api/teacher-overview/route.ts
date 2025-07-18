import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');

    if (!teacherId) {
      return NextResponse.json({ error: 'Teacher ID is required' }, { status: 400 });
    }

    console.log(`📊 Fetching teacher overview for: ${teacherId}`);

    // Get teacher with proper user relation
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      include: {
        user: true,
        lessons: {
          include: {
            subject: true,
            class: {
              include: {
                students: true,
                grade: true,
              },
            },
          },
        },
      },
    });

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    // Get all students in teacher's classes
    const classIds = [...new Set(teacher.lessons.map(l => l.classId))];
    const students = await prisma.student.findMany({
      where: {
        classId: { in: classIds },
      },
      include: {
        class: true,
        grade: true,
        results: true,
        attendances: true,
      },
    });

    // Get all assignments and exams for teacher's lessons
    const lessonIds = teacher.lessons.map(l => l.id);
    const [assignments, exams, attendanceRecords] = await Promise.all([
      prisma.assignment.findMany({
        where: { lessonId: { in: lessonIds } },
        include: {
          results: true,
          lesson: {
            include: {
              subject: true,
              class: true,
            },
          },
        },
      }),
      prisma.exam.findMany({
        where: { lessonId: { in: lessonIds } },
        include: {
          results: true,
          lesson: {
            include: {
              subject: true,
              class: true,
            },
          },
        },
      }),
      prisma.attendance.findMany({
        where: { studentId: { in: students.map(s => s.id) } },
        include: {
          student: true,
          lesson: {
            include: {
              subject: true,
              class: true,
            },
          },
        },
      }),
    ]);

    // Calculate overview metrics
    const totalStudents = students.length;
    const totalClasses = [...new Set(teacher.lessons.map(l => l.classId))].length;
    const totalSubjects = [...new Set(teacher.lessons.map(l => l.subject.name))].length;
    const totalAssignments = assignments.length;
    const totalExams = exams.length;
    const totalLessons = teacher.lessons.length;

    // Calculate results metrics
    const allResults = students.flatMap(s => s.results);
    const averageScore =
      allResults.length > 0
        ? allResults.reduce((sum, r) => sum + r.score, 0) / allResults.length
        : 0;

    // Calculate attendance metrics
    const attendanceRate =
      attendanceRecords.length > 0
        ? (attendanceRecords.filter(a => a.present).length / attendanceRecords.length) * 100
        : 0;

    // Calculate class performance
    const classPerformance = classIds.map(classId => {
      const classStudents = students.filter(s => s.classId === classId);
      const classResults = classStudents.flatMap(s => s.results);
      const classAttendance = attendanceRecords.filter(a =>
        classStudents.some(s => s.id === a.studentId)
      );

      const classAverage =
        classResults.length > 0
          ? classResults.reduce((sum, r) => sum + r.score, 0) / classResults.length
          : 0;

      const classAttendanceRate =
        classAttendance.length > 0
          ? (classAttendance.filter(a => a.present).length / classAttendance.length) * 100
          : 0;

      const className = classStudents[0]?.class?.name || 'Unknown Class';

      return {
        classId,
        className,
        studentCount: classStudents.length,
        averageScore: Math.round(classAverage * 100) / 100,
        attendanceRate: Math.round(classAttendanceRate * 100) / 100,
        totalResults: classResults.length,
        subjects: [
          ...new Set(teacher.lessons.filter(l => l.classId === classId).map(l => l.subject.name)),
        ],
      };
    });

    // Find struggling students (< 50% average)
    const strugglingStudents = students.filter(student => {
      const studentAverage =
        student.results.length > 0
          ? student.results.reduce((sum, r) => sum + r.score, 0) / student.results.length
          : 0;
      return studentAverage < 50;
    });

    // Find improving students (trend upward - simplified)
    const improvingStudents = students.filter(student => {
      const recentResults = student.results.slice(-5);
      const olderResults = student.results.slice(0, -5);

      if (recentResults.length === 0 || olderResults.length === 0) return false;

      const recentAverage =
        recentResults.reduce((sum, r) => sum + r.score, 0) / recentResults.length;
      const olderAverage = olderResults.reduce((sum, r) => sum + r.score, 0) / olderResults.length;

      return recentAverage > olderAverage;
    });

    // Subject analytics
    const subjectAnalytics = [...new Set(teacher.lessons.map(l => l.subject.name))].map(
      subjectName => {
        const subjectLessons = teacher.lessons.filter(l => l.subject.name === subjectName);
        const subjectClassIds = subjectLessons.map(l => l.classId);
        const subjectStudents = students.filter(s => subjectClassIds.includes(s.classId));
        const subjectResults = subjectStudents.flatMap(s => s.results);

        const subjectAssignments = assignments.filter(a => a.lesson.subject.name === subjectName);
        const subjectExams = exams.filter(e => e.lesson.subject.name === subjectName);

        const subjectAverage =
          subjectResults.length > 0
            ? subjectResults.reduce((sum, r) => sum + r.score, 0) / subjectResults.length
            : 0;

        const passRate =
          subjectResults.length > 0
            ? (subjectResults.filter(r => r.score >= 50).length / subjectResults.length) * 100
            : 0;

        return {
          subjectName,
          studentCount: subjectStudents.length,
          classCount: [...new Set(subjectClassIds)].length,
          averageScore: Math.round(subjectAverage * 100) / 100,
          passRate: Math.round(passRate * 100) / 100,
          totalAssignments: subjectAssignments.length,
          totalExams: subjectExams.length,
          totalAssessments: subjectAssignments.length + subjectExams.length,
          lessonsCount: subjectLessons.length,
        };
      }
    );

    // Recent activity (last 10 results)
    const recentResults = allResults
      .sort((a, b) => b.id - a.id)
      .slice(0, 10)
      .map(result => {
        const student = students.find(s => s.results.includes(result));
        const assignment = assignments.find(a => a.results.includes(result));
        const exam = exams.find(e => e.results.includes(result));
        const assessment = assignment || exam;

        return {
          id: result.id,
          studentName: student ? `${student.name} ${student.surname}` : 'Unknown',
          score: result.score,
          assessment: assessment?.title || 'Assessment',
          subject: assignment?.lesson?.subject?.name || exam?.lesson?.subject?.name || 'Unknown',
          className: assignment?.lesson?.class?.name || exam?.lesson?.class?.name || 'Unknown',
          type: assignment ? 'Assignment' : 'Exam',
          date: new Date().toISOString(),
        };
      });

    // Create overview data structure
    const overviewData = {
      teacherInfo: {
        id: teacher.id,
        name: `${teacher.name} ${teacher.surname}`,
        email: teacher.email,
        userId: teacher.userId,
      },

      totals: {
        students: totalStudents,
        classes: totalClasses,
        subjects: totalSubjects,
        lessons: totalLessons,
        assignments: totalAssignments,
        exams: totalExams,
        totalAssessments: totalAssignments + totalExams,
        strugglingStudents: strugglingStudents.length,
        improvingStudents: improvingStudents.length,
        attendanceRecords: attendanceRecords.length,
      },

      averages: {
        overallScore: Math.round(averageScore * 100) / 100,
        attendanceRate: Math.round(attendanceRate * 100) / 100,
        classSize: totalClasses > 0 ? Math.round(totalStudents / totalClasses) : 0,
      },

      performance: {
        topPerformingClass:
          classPerformance.length > 0
            ? classPerformance.reduce((best, current) =>
                current.averageScore > best.averageScore ? current : best
              ).className
            : 'N/A',
        bestSubject:
          subjectAnalytics.length > 0
            ? subjectAnalytics.reduce((best, current) =>
                current.averageScore > best.averageScore ? current : best
              ).subjectName
            : 'N/A',
        worstSubject:
          subjectAnalytics.length > 0
            ? subjectAnalytics.reduce((worst, current) =>
                current.averageScore < worst.averageScore ? current : worst
              ).subjectName
            : 'N/A',
      },

      classPerformance,
      subjectAnalytics,
      recentActivity: recentResults,
      strugglingStudents: strugglingStudents.slice(0, 10).map(s => ({
        id: s.id,
        name: `${s.name} ${s.surname}`,
        className: s.class?.name || 'Unknown',
        averageScore:
          s.results.length > 0
            ? Math.round(
                (s.results.reduce((sum, r) => sum + r.score, 0) / s.results.length) * 100
              ) / 100
            : 0,
      })),
    };

    console.log(`✅ Teacher overview calculated for ${teacher.name} ${teacher.surname}`);
    console.log(
      `📊 Totals: ${totalStudents} students, ${totalClasses} classes, ${totalSubjects} subjects`
    );

    return NextResponse.json({
      success: true,
      data: overviewData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Error fetching teacher overview:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch teacher overview',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
