import { calculateAttendancePercentage, calculateStudentAverageScore } from '@/lib/calculations';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const studentId = url.searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: 'Student ID is required' },
        { status: 400 }
      );
    }

    // Get student data with related information
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        class: {
          include: {
            grade: true,
          },
        },
        parent: true,
        studentSubjects: {
          include: {
            subject: true,
          },
        },
        results: {
          include: {
            exam: {
              include: {
                lesson: {
                  include: {
                    subject: true,
                  },
                },
              },
            },
            assignment: {
              include: {
                lesson: {
                  include: {
                    subject: true,
                  },
                },
              },
            },
          },
          orderBy: { id: 'desc' },
          take: 10,
        },
        attendance: {
          include: {
            lesson: {
              include: {
                subject: true,
              },
            },
          },
          orderBy: { id: 'desc' },
          take: 20,
        },
      },
    });

    if (!student) {
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    }

    // Calculate attendance percentage
    const attendancePercentage = await calculateAttendancePercentage(studentId);

    // Calculate average score
    const averageScore = await calculateStudentAverageScore(studentId);

    // Get upcoming assignments (mock data for now - can be enhanced with actual assignment due dates)
    const upcomingAssignments = await prisma.assignment.findMany({
      where: {
        lesson: {
          classId: student.classId,
        },
        dueDate: {
          gte: new Date(),
        },
      },
      include: {
        lesson: {
          include: {
            subject: true,
          },
        },
      },
      orderBy: { dueDate: 'asc' },
      take: 5,
    });

    // Get upcoming exams
    const upcomingExams = await prisma.exam.findMany({
      where: {
        lesson: {
          classId: student.classId,
        },
        startTime: {
          gte: new Date(),
        },
      },
      include: {
        lesson: {
          include: {
            subject: true,
          },
        },
      },
      orderBy: { startTime: 'asc' },
      take: 5,
    });

    // Calculate subject performance
    const subjectPerformance = await Promise.all(
      student.studentSubjects.map(async ss => {
        const subjectResults = student.results.filter(
          r =>
            r.exam?.lesson?.subjectId === ss.subjectId ||
            r.assignment?.lesson?.subjectId === ss.subjectId
        );

        const averageScore =
          subjectResults.length > 0
            ? subjectResults.reduce((sum, result) => sum + result.score, 0) / subjectResults.length
            : 0;

        return {
          subject: ss.subject.name,
          averageScore: Math.round(averageScore),
          totalAssessments: subjectResults.length,
          grade:
            averageScore >= 80
              ? 'A'
              : averageScore >= 70
                ? 'B'
                : averageScore >= 60
                  ? 'C'
                  : averageScore >= 50
                    ? 'D'
                    : 'F',
        };
      })
    );

    // Determine CAPS level based on grade
    const gradeLevel = student.class.grade.level;
    const capsLevel = gradeLevel <= 9 ? 'Senior Phase' : 'Further Education and Training Phase';

    const dashboardData = {
      success: true,
      data: {
        studentInfo: {
          name: `${student.name} ${student.surname}`,
          id: student.id,
          class: student.class.name,
          grade: student.class.grade.level,
          capsLevel,
          email: student.email,
          phone: student.phone,
          parentName: student.parent?.name,
          parentEmail: student.parent?.email,
          subjects: student.studentSubjects.map(ss => ss.subject.name),
        },
        performance: {
          averageScore: Math.round(averageScore),
          attendancePercentage: Math.round(attendancePercentage),
          totalAssessments: student.results.length,
          subjectPerformance,
        },
        upcomingAssignments: upcomingAssignments.map(assignment => ({
          id: assignment.id,
          title: assignment.title,
          subject: assignment.lesson.subject.name,
          dueDate: assignment.dueDate,
          status: 'pending',
        })),
        upcomingExams: upcomingExams.map(exam => ({
          id: exam.id,
          title: exam.title,
          subject: exam.lesson.subject.name,
          dateTime: exam.startTime,
          duration: '2 hours', // Can be calculated from startTime and endTime
        })),
        recentResults: student.results.slice(0, 5).map(result => ({
          id: result.id,
          subject: result.exam?.lesson?.subject?.name || result.assignment?.lesson?.subject?.name,
          assessmentType: result.exam ? 'Exam' : 'Assignment',
          score: result.score,
          grade:
            result.score >= 80
              ? 'A'
              : result.score >= 70
                ? 'B'
                : result.score >= 60
                  ? 'C'
                  : result.score >= 50
                    ? 'D'
                    : 'F',
          date: result.exam?.startTime || result.assignment?.dueDate,
        })),
        attendanceHistory: student.attendance.slice(0, 10).map(att => ({
          id: att.id,
          subject: att.lesson.subject.name,
          date: att.lesson.startTime,
          present: att.present,
          status: att.present ? 'Present' : 'Absent',
        })),
      },
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Student dashboard API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    return NextResponse.json({
      success: true,
      message: 'Student data updated successfully',
      data: body,
    });
  } catch (error) {
    console.error('Student dashboard POST error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
