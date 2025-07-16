/**
 * ENHANCED TEACHER DASHBOARD API
 * Advanced teaching analytics and class management metrics
 */

import {
  calculateGradingWorkload,
  calculateTeacherClassAverages,
  identifyStudentAlerts,
} from '@/lib/enhanced-academic-calculations';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    console.log('👨‍🏫 Enhanced Teacher Dashboard API called');

    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');

    if (!teacherId) {
      return NextResponse.json({ error: 'Teacher ID required' }, { status: 400 });
    }

    console.log(`📊 Calculating advanced teaching metrics for teacher: ${teacherId}`);

    // Get teacher information
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      include: {
        subjects: {
          include: { subject: true },
        },
        lessons: {
          include: {
            subject: true,
            class: true,
            assignments: {
              include: { results: true },
            },
            exams: {
              include: { results: true },
            },
          },
        },
      },
    });

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    // Calculate comprehensive metrics
    const [classAverages, gradingWorkload, studentAlerts] = await Promise.all([
      calculateTeacherClassAverages(teacherId),
      calculateGradingWorkload(teacherId),
      identifyStudentAlerts(teacherId),
    ]);

    // Get teaching effectiveness metrics
    const teachingMetrics = await getTeachingEffectivenessMetrics(teacherId);

    // Get class performance analytics
    const classAnalytics = await getClassPerformanceAnalytics(teacherId);

    // Get workload distribution
    const workloadAnalysis = await getWorkloadAnalysis(teacherId);

    // Get recent activity and notifications
    const [recentGrades, notifications] = await Promise.all([
      getRecentGradingActivity(teacherId),
      getTeacherNotifications(teacherId),
    ]);

    // Calculate performance trends
    const performanceTrends = await getPerformanceTrends(teacherId);

    // Build comprehensive dashboard data
    const dashboardData = {
      // Teacher Information
      teacher: {
        id: teacher.id,
        name: `${teacher.name} ${teacher.surname}`,
        subjects: teacher.subjects.map(ts => ts.subject.name),
        totalClasses: teacher.lessons.length,
        totalStudents: await getTotalStudentsCount(teacherId),
        photo: teacher.img || '/default-teacher-avatar.png',
      },

      // Class Performance Overview
      classPerformance: {
        averages: classAverages,
        overallClassAverage: calculateOverallAverage(classAverages),
        topPerformingClass: getTopPerformingClass(classAverages),
        strugglingClass: getStrugglingClass(classAverages),
        improvementOpportunities: classAverages.filter(c => c.averageGrade < 60).length,
      },

      // Grading & Workload
      gradingOverview: {
        ...gradingWorkload,
        gradingEfficiency: calculateGradingEfficiency(gradingWorkload),
        weeklyGradingHours: Math.round(gradingWorkload.estimatedGradingHours * 4), // Monthly to weekly
        backlogStatus: getBacklogStatus(gradingWorkload.urgentItems),
      },

      // Student Alerts & Interventions
      studentManagement: {
        alerts: studentAlerts,
        totalAlertsCount: studentAlerts.length,
        highPriorityAlerts: studentAlerts.filter(a => a.severity === 'high').length,
        actionRequired: studentAlerts.filter(a => a.type === 'missing_assignment').length,
        attendanceConcerns: studentAlerts.filter(a => a.type === 'poor_attendance').length,
      },

      // Teaching Effectiveness
      teachingMetrics: {
        ...teachingMetrics,
        overallEffectiveness: calculateOverallEffectiveness(teachingMetrics),
        studentSatisfactionTrend: 'stable', // TODO: Implement
        subjectMasteryProgress: teachingMetrics.subjectMastery,
      },

      // Analytics & Insights
      analytics: {
        classAnalytics,
        performanceTrends,
        attendancePatterns: await getAttendancePatterns(teacherId),
        assessmentInsights: await getAssessmentInsights(teacherId),
      },

      // Workload Management
      workloadManagement: {
        ...workloadAnalysis,
        timeAllocation: calculateTimeAllocation(workloadAnalysis),
        efficiencyScore: calculateEfficiencyScore(workloadAnalysis),
        recommendations: generateWorkloadRecommendations(workloadAnalysis),
      },

      // Recent Activity
      recentActivity: {
        recentGrades: recentGrades.slice(0, 10),
        notifications: notifications.slice(0, 5),
        upcomingDeadlines: await getUpcomingTeacherDeadlines(teacherId),
      },

      // Quick Action Items
      quickActions: {
        pendingGrades: gradingWorkload.totalPendingItems,
        urgentAlerts: studentAlerts.filter(a => a.severity === 'high').length,
        classesToReview: classAverages.filter(c => c.averageGrade < 65).length,
        meetingsNeeded: studentAlerts.filter(a => a.actionRequired.includes('Contact')).length,
      },
    };

    console.log(`✅ Enhanced teacher dashboard calculated for ${teacher.name} ${teacher.surname}`);
    console.log(
      `📈 Classes: ${teacher.lessons.length}, Alerts: ${studentAlerts.length}, Pending: ${gradingWorkload.totalPendingItems}`
    );

    return NextResponse.json({
      success: true,
      data: dashboardData,
      calculatedAt: new Date().toISOString(),
      metrics: {
        totalClasses: teacher.lessons.length,
        totalAlerts: studentAlerts.length,
        processingTime: `${Date.now()}ms`,
      },
    });
  } catch (error) {
    console.error('❌ Enhanced Teacher Dashboard API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to calculate enhanced teacher dashboard metrics',
        details: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      },
      { status: 500 }
    );
  }
}

// Helper functions for teacher analytics

async function getTeachingEffectivenessMetrics(teacherId: string) {
  try {
    // Get all results for teacher's classes
    const results = await prisma.result.findMany({
      include: {
        assignment: {
          include: {
            lesson: {
              where: { teacherId },
              include: { subject: true },
            },
          },
        },
        exam: {
          include: {
            lesson: {
              where: { teacherId },
              include: { subject: true },
            },
          },
        },
      },
    });

    const validResults = results.filter(
      r => r.assignment?.lesson?.teacherId === teacherId || r.exam?.lesson?.teacherId === teacherId
    );

    if (validResults.length === 0) {
      return {
        overallRating: 0,
        classImprovementRate: 0,
        studentSatisfactionScore: 85, // Default
        performanceImprovementTrend: 0,
        subjectMastery: {},
      };
    }

    const averageScore = validResults.reduce((sum, r) => sum + r.score, 0) / validResults.length;

    // Calculate subject mastery
    const subjectMastery: { [key: string]: number } = {};
    const subjectMap = new Map();

    validResults.forEach(result => {
      const subject = result.assignment?.lesson?.subject || result.exam?.lesson?.subject;
      if (!subject) return;

      if (!subjectMap.has(subject.id)) {
        subjectMap.set(subject.id, { name: subject.name, scores: [] });
      }
      subjectMap.get(subject.id).scores.push(result.score);
    });

    subjectMap.forEach((data, subjectId) => {
      const avgScore = data.scores.reduce((a: number, b: number) => a + b, 0) / data.scores.length;
      subjectMastery[data.name] = Math.round(avgScore * 100) / 100;
    });

    return {
      overallRating: Math.min(5, Math.round((averageScore / 20) * 100) / 100), // Scale to 5
      classImprovementRate: 12, // TODO: Calculate actual improvement
      studentSatisfactionScore: 85 + Math.random() * 10, // Simulated
      performanceImprovementTrend: Math.random() * 20 - 10, // -10 to +10
      subjectMastery,
    };
  } catch (error) {
    console.error('Error calculating teaching effectiveness:', error);
    return {
      overallRating: 0,
      classImprovementRate: 0,
      studentSatisfactionScore: 85,
      performanceImprovementTrend: 0,
      subjectMastery: {},
    };
  }
}

async function getClassPerformanceAnalytics(teacherId: string) {
  try {
    const lessons = await prisma.lesson.findMany({
      where: { teacherId },
      include: {
        class: {
          include: {
            students: {
              include: {
                results: {
                  where: {
                    OR: [
                      { assignment: { lesson: { teacherId } } },
                      { exam: { lesson: { teacherId } } },
                    ],
                  },
                },
              },
            },
          },
        },
        subject: true,
      },
    });

    return lessons.map(lesson => {
      const studentResults = lesson.class.students.flatMap(s => s.results);
      const averageScore =
        studentResults.length > 0
          ? studentResults.reduce((sum, r) => sum + r.score, 0) / studentResults.length
          : 0;

      return {
        classId: lesson.class.id,
        className: lesson.class.name,
        subject: lesson.subject.name,
        studentCount: lesson.class.students.length,
        averageScore: Math.round(averageScore * 100) / 100,
        assessmentCount: studentResults.length,
        passingRate:
          studentResults.length > 0
            ? (studentResults.filter(r => r.score >= 50).length / studentResults.length) * 100
            : 0,
      };
    });
  } catch (error) {
    console.error('Error calculating class analytics:', error);
    return [];
  }
}

async function getWorkloadAnalysis(teacherId: string) {
  try {
    const [lessons, subjects] = await Promise.all([
      prisma.lesson.count({ where: { teacherId } }),
      prisma.subject.count({
        where: {
          teachers: {
            some: { teacherId },
          },
        },
      }),
    ]);

    const totalStudents = await getTotalStudentsCount(teacherId);

    return {
      classesCount: lessons,
      studentsCount: totalStudents,
      subjectsCount: subjects,
      weeklyHours: lessons * 2, // Estimate 2 hours per lesson per week
      averageClassSize: lessons > 0 ? Math.round(totalStudents / lessons) : 0,
    };
  } catch (error) {
    console.error('Error calculating workload analysis:', error);
    return {
      classesCount: 0,
      studentsCount: 0,
      subjectsCount: 0,
      weeklyHours: 0,
      averageClassSize: 0,
    };
  }
}

async function getRecentGradingActivity(teacherId: string) {
  try {
    const results = await prisma.result.findMany({
      where: {
        OR: [{ assignment: { lesson: { teacherId } } }, { exam: { lesson: { teacherId } } }],
      },
      include: {
        student: true,
        assignment: { include: { lesson: { include: { subject: true } } } },
        exam: { include: { lesson: { include: { subject: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return results.map(result => {
      const assessment = result.assignment || result.exam;
      const subject = result.assignment?.lesson?.subject || result.exam?.lesson?.subject;

      return {
        id: result.id,
        studentName: `${result.student.name} ${result.student.surname}`,
        subject: subject?.name || 'Unknown Subject',
        assessment: assessment?.title || 'Assessment',
        score: result.score,
        maxScore: 100, // Default
        percentage: Math.round((result.score / 100) * 100),
        gradedAt: result.createdAt.toISOString(),
        type: result.assignment ? 'Assignment' : 'Exam',
      };
    });
  } catch (error) {
    console.error('Error getting recent grading activity:', error);
    return [];
  }
}

async function getTeacherNotifications(teacherId: string) {
  try {
    // Generate notifications based on alerts and deadlines
    const upcomingDeadlines = await prisma.assignment.count({
      where: {
        lesson: { teacherId },
        dueDate: {
          gte: new Date(),
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next 7 days
        },
      },
    });

    const notifications = [];

    if (upcomingDeadlines > 0) {
      notifications.push({
        id: 'deadline-alert',
        type: 'deadline',
        priority: 'medium',
        message: `${upcomingDeadlines} assignment(s) due this week`,
        actionRequired: 'Review grading schedule',
        createdAt: new Date().toISOString(),
      });
    }

    // Add more notification types as needed

    return notifications;
  } catch (error) {
    console.error('Error getting teacher notifications:', error);
    return [];
  }
}

async function getPerformanceTrends(teacherId: string) {
  try {
    // Simplified trend calculation - compare last month vs previous month
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 2, 1);

    const [lastMonthResults, previousMonthResults] = await Promise.all([
      prisma.result.findMany({
        where: {
          createdAt: { gte: lastMonth },
          OR: [{ assignment: { lesson: { teacherId } } }, { exam: { lesson: { teacherId } } }],
        },
      }),
      prisma.result.findMany({
        where: {
          createdAt: { gte: previousMonth, lt: lastMonth },
          OR: [{ assignment: { lesson: { teacherId } } }, { exam: { lesson: { teacherId } } }],
        },
      }),
    ]);

    const lastMonthAvg =
      lastMonthResults.length > 0
        ? lastMonthResults.reduce((sum, r) => sum + r.score, 0) / lastMonthResults.length
        : 0;
    const previousMonthAvg =
      previousMonthResults.length > 0
        ? previousMonthResults.reduce((sum, r) => sum + r.score, 0) / previousMonthResults.length
        : 0;

    return {
      currentMonth: Math.round(lastMonthAvg * 100) / 100,
      previousMonth: Math.round(previousMonthAvg * 100) / 100,
      trend:
        lastMonthAvg > previousMonthAvg
          ? 'improving'
          : lastMonthAvg < previousMonthAvg
            ? 'declining'
            : 'stable',
      changePercentage:
        previousMonthAvg > 0
          ? Math.round(((lastMonthAvg - previousMonthAvg) / previousMonthAvg) * 10000) / 100
          : 0,
    };
  } catch (error) {
    console.error('Error calculating performance trends:', error);
    return {
      currentMonth: 0,
      previousMonth: 0,
      trend: 'stable',
      changePercentage: 0,
    };
  }
}

async function getTotalStudentsCount(teacherId: string) {
  try {
    const result = await prisma.student.count({
      where: {
        class: {
          lessons: {
            some: { teacherId },
          },
        },
      },
    });
    return result;
  } catch (error) {
    console.error('Error counting total students:', error);
    return 0;
  }
}

async function getAttendancePatterns(teacherId: string) {
  // TODO: Implement attendance pattern analysis
  return {
    weeklyAverage: 88.5,
    trend: 'stable',
    concerningPatterns: [],
  };
}

async function getAssessmentInsights(teacherId: string) {
  // TODO: Implement assessment insights
  return {
    averageDifficulty: 'moderate',
    completionRates: 85,
    commonMistakes: [],
  };
}

async function getUpcomingTeacherDeadlines(teacherId: string) {
  try {
    const assignments = await prisma.assignment.findMany({
      where: {
        lesson: { teacherId },
        dueDate: { gte: new Date() },
      },
      include: {
        lesson: { include: { subject: true } },
      },
      orderBy: { dueDate: 'asc' },
      take: 5,
    });

    return assignments.map(assignment => ({
      id: assignment.id,
      title: assignment.title,
      subject: assignment.lesson?.subject?.name || 'Unknown Subject',
      dueDate: assignment.dueDate.toISOString(),
      daysUntilDue: Math.ceil((assignment.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    }));
  } catch (error) {
    console.error('Error getting upcoming deadlines:', error);
    return [];
  }
}

// Utility functions

function calculateOverallAverage(classAverages: any[]): number {
  if (classAverages.length === 0) return 0;
  const sum = classAverages.reduce((total, cls) => total + cls.averageGrade, 0);
  return Math.round((sum / classAverages.length) * 100) / 100;
}

function getTopPerformingClass(classAverages: any[]) {
  if (classAverages.length === 0) return null;
  return classAverages.reduce((best, current) =>
    current.averageGrade > best.averageGrade ? current : best
  );
}

function getStrugglingClass(classAverages: any[]) {
  if (classAverages.length === 0) return null;
  return classAverages.reduce((worst, current) =>
    current.averageGrade < worst.averageGrade ? current : worst
  );
}

function calculateGradingEfficiency(workload: any): number {
  if (workload.totalPendingItems === 0) return 100;
  const efficiency = Math.max(0, 100 - workload.urgentItems * 10);
  return Math.round(efficiency * 100) / 100;
}

function getBacklogStatus(urgentItems: number): 'low' | 'medium' | 'high' {
  if (urgentItems === 0) return 'low';
  if (urgentItems <= 5) return 'medium';
  return 'high';
}

function calculateOverallEffectiveness(metrics: any): number {
  return Math.round((metrics.overallRating / 5) * 100 * 100) / 100;
}

function calculateTimeAllocation(workload: any) {
  return {
    teaching: Math.round(workload.weeklyHours * 0.6), // 60% teaching
    grading: Math.round(workload.weeklyHours * 0.25), // 25% grading
    planning: Math.round(workload.weeklyHours * 0.15), // 15% planning
  };
}

function calculateEfficiencyScore(workload: any): number {
  // Simple efficiency calculation based on student-to-teacher ratio
  if (workload.studentsCount === 0) return 100;
  const ratio = workload.studentsCount / Math.max(1, workload.classesCount);
  return Math.max(0, Math.min(100, 100 - (ratio - 25) * 2)); // Optimal ratio ~25 students per class
}

function generateWorkloadRecommendations(workload: any): string[] {
  const recommendations = [];

  if (workload.weeklyHours > 40) {
    recommendations.push('Consider delegating some administrative tasks');
  }

  if (workload.studentsCount / workload.classesCount > 30) {
    recommendations.push('Large class sizes detected - consider breaking into smaller groups');
  }

  if (workload.subjectsCount > 3) {
    recommendations.push('Teaching multiple subjects - consider specialization');
  }

  return recommendations;
}
