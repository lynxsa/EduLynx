import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import {
  calculateAttendancePercentage,
  calculateStudentAverageScore,
  calculateClassAveragePerformance,
  calculateSchoolPerformance,
  calculateAttendanceTrend,
  calculateSubjectPerformance,
  calculateFinancialOverview,
  calculateRiskAssessment,
  calculateUserActivity,
  getDashboardMetrics,
  calculateAttendanceTrends,
  calculatePerformanceTrends,
} from '@/lib/calculations';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const period = url.searchParams.get('period') || 'month'; // week, month, semester
    const schoolId = url.searchParams.get('schoolId');

    // Get school-specific data if schoolId is provided
    const whereClause = schoolId ? { schoolId: parseInt(schoolId) } : {};

    // Get total counts
    const totalStudents = await prisma.student.count({ where: whereClause });
    const totalTeachers = await prisma.teacher.count({ where: whereClause });
    const totalParents = await prisma.parent.count();
    const totalClasses = await prisma.class.count({ where: whereClause });
    const totalSubjects = await prisma.subject.count();
    const totalGrades = await prisma.grade.count({ where: whereClause });

    // Get gender distribution
    const genderDistribution = await Promise.all([
      prisma.student.count({ where: { ...whereClause, sex: 'MALE' } }),
      prisma.student.count({ where: { ...whereClause, sex: 'FEMALE' } }),
    ]);

    // Get grade distribution
    const gradeDistribution = await prisma.grade.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            students: true,
          },
        },
      },
    });

    // Get recent activities (enrollments, results, etc.)
    const recentStudents = await prisma.student.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        grade: true,
        class: true,
      },
    });

    const recentResults = await prisma.result.findMany({
      take: 10,
      include: {
        student: {
          include: {
            grade: true,
            class: true,
          },
        },
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
    });

    // Calculate school performance metrics
    const schoolPerformance = await calculateSchoolPerformance();

    // Calculate overall attendance percentage for all students
    const totalAttendanceRecords = await prisma.attendance.count();
    const presentRecords = await prisma.attendance.count({
      where: { present: true },
    });
    const averageAttendance =
      totalAttendanceRecords > 0 ? (presentRecords / totalAttendanceRecords) * 100 : 0;

    // Get all students for attendance and performance trends
    const allStudents = await prisma.student.findMany({
      where: whereClause,
      take: 100, // Limit for performance
    });

    // Calculate trends
    const attendanceTrendData = await calculateAttendanceTrends(
      allStudents,
      period as 'week' | 'month' | 'semester'
    );
    const performanceTrends = await calculatePerformanceTrends(
      allStudents,
      period as 'week' | 'month' | 'semester'
    );

    // Subject performance
    const subjectPerformance = await calculateSubjectPerformance();

    // Risk assessment
    const riskAssessment = await calculateRiskAssessment();

    // Financial overview
    const financialOverview = await calculateFinancialOverview();

    // User activity
    const userActivity = await calculateUserActivity();

    // Get upcoming events
    const upcomingEvents = await prisma.event.findMany({
      where: {
        startTime: {
          gte: new Date(),
          lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Next 30 days
        },
      },
      orderBy: {
        startTime: 'asc',
      },
      take: 10,
    });

    // Get recent announcements
    const announcements = await prisma.announcement.findMany({
      where: {
        date: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
      include: {
        class: true,
      },
      orderBy: {
        date: 'desc',
      },
      take: 5,
    });

    // System health metrics
    const systemHealth = {
      activeUsers: totalStudents + totalTeachers + totalParents,
      systemLoad: Math.round(Math.random() * 100), // Simulated
      uptime: Math.round(Math.random() * 100), // Simulated
      errors: Math.floor(Math.random() * 10), // Simulated
      lastBackup: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
    };

    // Performance analytics
    const performanceAnalytics = {
      overallGPA: schoolPerformance,
      attendanceRate: averageAttendance,
      passRate: Math.round((schoolPerformance / 100) * 100),
      improvementRate: Math.round(Math.random() * 20 + 80), // Simulated
    };

    // Top performing students
    const topStudents = await prisma.student.findMany({
      include: {
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
        },
        grade: true,
        class: true,
      },
      take: 10,
    });

    // Calculate average scores for top students
    const topStudentsWithScores = topStudents
      .map(student => {
        const totalScore = student.results.reduce((sum, result) => sum + result.score, 0);
        const averageScore = student.results.length > 0 ? totalScore / student.results.length : 0;

        return {
          id: student.id,
          name: student.name,
          surname: student.surname,
          grade: student.grade?.level,
          class: student.class?.name,
          averageScore: Math.round(averageScore),
          totalAssessments: student.results.length,
        };
      })
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 5);

    return NextResponse.json({
      success: true,
      data: {
        metrics: {
          totalStudents,
          totalTeachers,
          totalParents,
          totalClasses,
          totalSubjects,
          totalGrades,
          averageAttendance,
          schoolPerformance: schoolPerformance,
        },
        analytics: {
          genderDistribution: {
            male: genderDistribution[0],
            female: genderDistribution[1],
          },
          gradeDistribution: gradeDistribution.map(grade => ({
            grade: grade.level,
            count: grade._count.students,
          })),
          performanceAnalytics,
          systemHealth,
        },
        trends: {
          attendanceTrendData,
          performanceTrends,
          subjectPerformance,
          riskAssessment,
          financialOverview,
          userActivity,
        },
        activities: {
          recentStudents: recentStudents.map(student => ({
            id: student.id,
            name: `${student.name} ${student.surname}`,
            grade: student.grade?.level,
            class: student.class?.name,
            enrolledAt: student.createdAt,
          })),
          recentResults: recentResults.map(result => ({
            id: result.id,
            studentName: `${result.student.name} ${result.student.surname}`,
            subject:
              result.exam?.lesson?.subject?.name ||
              result.assignment?.lesson?.subject?.name ||
              'Unknown',
            score: result.score,
            type: result.exam ? 'Exam' : 'Assignment',
            grade: result.student.grade?.level,
            class: result.student.class?.name,
          })),
          topStudents: topStudentsWithScores,
        },
        upcomingEvents: upcomingEvents.map(event => ({
          id: event.id,
          title: event.title,
          description: event.description,
          startTime: event.startTime,
          endTime: event.endTime,
          classId: event.classId,
        })),
        announcements: announcements.map(announcement => ({
          id: announcement.id,
          title: announcement.title,
          description: announcement.description,
          date: announcement.date,
          className: announcement.class?.name || 'School-wide',
        })),
        period,
      },
    });
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch admin dashboard data',
      },
      { status: 500 }
    );
  }
}
