/**
 * ENHANCED STUDENT DASHBOARD API
 * Advanced academic calculations and metrics for students
 */

import {
  calculateAttendanceRate,
  calculateStudentGPA,
  calculateStudentRanking,
  getStudentPerformanceTrend,
} from '@/lib/enhanced-academic-calculations';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    console.log('🎓 Enhanced Student Dashboard API called');

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID required' }, { status: 400 });
    }

    console.log(`📊 Calculating advanced metrics for student: ${studentId}`);

    // Get basic student information
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        class: { include: { grade: true, subject: true } },
        grade: true,
        results: {
          include: {
            assignment: { include: { lesson: { include: { subject: true } } } },
            exam: { include: { lesson: { include: { subject: true } } } },
          },
          orderBy: { createdAt: 'desc' },
          take: 20, // Recent results for quick display
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Calculate academic metrics in parallel
    const [
      currentGPA,
      termGPA,
      yearGPA,
      ranking,
      monthlyAttendance,
      termAttendance,
      yearAttendance,
      performanceTrend,
    ] = await Promise.all([
      calculateStudentGPA(studentId, 'current_term'),
      calculateStudentGPA(studentId, 'current_term'),
      calculateStudentGPA(studentId, 'academic_year'),
      calculateStudentRanking(studentId),
      calculateAttendanceRate(studentId, 'month'),
      calculateAttendanceRate(studentId, 'term'),
      calculateAttendanceRate(studentId, 'year'),
      getStudentPerformanceTrend(studentId),
    ]);

    // Get subject-wise performance
    const subjectPerformance = await getSubjectWisePerformance(studentId);

    // Get recent assignments and deadlines
    const [recentGrades, upcomingDeadlines] = await Promise.all([
      getRecentGrades(studentId),
      getUpcomingDeadlines(studentId),
    ]);

    // Calculate assignment completion rate
    const completionStats = await getAssignmentCompletionStats(studentId);

    // Get performance comparison data
    const performanceComparison = await getPerformanceComparison(studentId);

    // Calculate risk indicators
    const riskLevel = calculateRiskLevel(
      currentGPA,
      termAttendance,
      completionStats.completionRate
    );

    // Build comprehensive dashboard data
    const dashboardData = {
      // Student Information
      student: {
        id: student.id,
        name: `${student.name} ${student.surname}`,
        class: student.class?.name || 'Not Assigned',
        grade: student.grade?.level ? `Grade ${student.grade.level}` : 'Not Assigned',
        photo: student.img || '/default-avatar.png',
      },

      // Academic Performance
      academicOverview: {
        currentGPA: Math.round(currentGPA * 100) / 100,
        termGPA: Math.round(termGPA * 100) / 100,
        yearGPA: Math.round(yearGPA * 100) / 100,
        classRank: ranking.classRank,
        gradeRank: ranking.gradeRank,
        classSize: ranking.classSize,
        gradeSize: ranking.gradeSize,
        performanceTrend,
        riskLevel,
      },

      // Attendance Metrics
      attendanceOverview: {
        monthly: Math.round(monthlyAttendance * 100) / 100,
        term: Math.round(termAttendance * 100) / 100,
        yearly: Math.round(yearAttendance * 100) / 100,
        status: getAttendanceStatus(termAttendance),
        trend: getAttendanceTrend(studentId),
      },

      // Assignment & Assessment Data
      assessmentData: {
        completionRate: Math.round(completionStats.completionRate * 100) / 100,
        totalAssignments: completionStats.totalAssignments,
        completedAssignments: completionStats.completedAssignments,
        pendingAssignments: completionStats.pendingAssignments,
        averageScore: Math.round(completionStats.averageScore * 100) / 100,
      },

      // Subject Performance
      subjectPerformance,

      // Recent Activity
      recentActivity: {
        recentGrades: recentGrades.slice(0, 10),
        upcomingDeadlines: upcomingDeadlines.slice(0, 5),
      },

      // Performance Comparison
      performanceComparison,

      // Quick Stats for Cards
      quickStats: {
        totalSubjects: subjectPerformance.length,
        strongestSubject: getBestSubject(subjectPerformance),
        weakestSubject: getWeakestSubject(subjectPerformance),
        improvementNeeded: performanceTrend === 'declining',
        attendanceAlert: termAttendance < 80,
        assignmentAlert: completionStats.completionRate < 70,
      },
    };

    console.log(`✅ Enhanced dashboard data calculated for ${student.name} ${student.surname}`);
    console.log(
      `📈 GPA: ${currentGPA}, Rank: ${ranking.classRank}/${ranking.classSize}, Attendance: ${termAttendance}%`
    );

    return NextResponse.json({
      success: true,
      data: dashboardData,
      calculatedAt: new Date().toISOString(),
      metrics: {
        totalCalculations: 8,
        dataPoints: student.results.length,
        processingTime: `${Date.now()}ms`,
      },
    });
  } catch (error) {
    console.error('❌ Enhanced Student Dashboard API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to calculate enhanced dashboard metrics',
        details: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      },
      { status: 500 }
    );
  }
}

// Helper functions for detailed calculations

async function getSubjectWisePerformance(studentId: string) {
  try {
    const results = await prisma.result.findMany({
      where: { studentId },
      include: {
        assignment: { include: { lesson: { include: { subject: true } } } },
        exam: { include: { lesson: { include: { subject: true } } } },
      },
    });

    const subjectMap = new Map();

    results.forEach(result => {
      const subject = result.assignment?.lesson?.subject || result.exam?.lesson?.subject;
      if (!subject) return;

      if (!subjectMap.has(subject.id)) {
        subjectMap.set(subject.id, {
          subjectId: subject.id,
          subjectName: subject.name,
          scores: [],
          totalAssessments: 0,
        });
      }

      const subjectData = subjectMap.get(subject.id);
      const scorePercentage = (result.score / 100) * 100; // Assuming max score context
      subjectData.scores.push(scorePercentage);
      subjectData.totalAssessments++;
    });

    return Array.from(subjectMap.values()).map(subject => ({
      subjectId: subject.subjectId,
      subjectName: subject.subjectName,
      averageScore:
        subject.scores.length > 0
          ? Math.round((subject.scores.reduce((a, b) => a + b, 0) / subject.scores.length) * 100) /
            100
          : 0,
      totalAssessments: subject.totalAssessments,
      grade: getLetterGrade(
        subject.scores.length > 0
          ? subject.scores.reduce((a, b) => a + b, 0) / subject.scores.length
          : 0
      ),
      trend: calculateSubjectTrend(subject.scores),
    }));
  } catch (error) {
    console.error('Error calculating subject performance:', error);
    return [];
  }
}

async function getRecentGrades(studentId: string) {
  try {
    const results = await prisma.result.findMany({
      where: { studentId },
      include: {
        assignment: { include: { lesson: { include: { subject: true } } } },
        exam: { include: { lesson: { include: { subject: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      take: 15,
    });

    return results.map(result => {
      const subject = result.assignment?.lesson?.subject || result.exam?.lesson?.subject;
      const assessment = result.assignment || result.exam;

      return {
        id: result.id,
        subject: subject?.name || 'Unknown Subject',
        assessment: assessment?.title || 'Assessment',
        score: result.score,
        maxScore: 100, // Default assumption
        percentage: Math.round((result.score / 100) * 100),
        grade: getLetterGrade((result.score / 100) * 100),
        date: result.createdAt.toISOString(),
        type: result.assignment ? 'Assignment' : 'Exam',
      };
    });
  } catch (error) {
    console.error('Error getting recent grades:', error);
    return [];
  }
}

async function getUpcomingDeadlines(studentId: string) {
  try {
    // This is a simplified version - in reality, you'd need to check class enrollments
    const assignments = await prisma.assignment.findMany({
      where: {
        dueDate: { gte: new Date() },
      },
      include: {
        lesson: { include: { subject: true } },
      },
      orderBy: { dueDate: 'asc' },
      take: 10,
    });

    return assignments.map(assignment => ({
      id: assignment.id,
      title: assignment.title,
      subject: assignment.lesson?.subject?.name || 'Unknown Subject',
      dueDate: assignment.dueDate.toISOString(),
      daysUntilDue: Math.ceil((assignment.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      priority: getDuePriority(assignment.dueDate),
    }));
  } catch (error) {
    console.error('Error getting upcoming deadlines:', error);
    return [];
  }
}

async function getAssignmentCompletionStats(studentId: string) {
  try {
    const [completedCount, totalAssignments] = await Promise.all([
      prisma.result.count({
        where: {
          studentId,
          assignmentId: { not: null },
        },
      }),
      prisma.assignment.count(), // Simplified - should check class enrollment
    ]);

    const averageScore = await prisma.result.aggregate({
      where: {
        studentId,
        assignmentId: { not: null },
      },
      _avg: { score: true },
    });

    return {
      totalAssignments,
      completedAssignments: completedCount,
      pendingAssignments: totalAssignments - completedCount,
      completionRate: totalAssignments > 0 ? (completedCount / totalAssignments) * 100 : 100,
      averageScore: averageScore._avg.score || 0,
    };
  } catch (error) {
    console.error('Error calculating completion stats:', error);
    return {
      totalAssignments: 0,
      completedAssignments: 0,
      pendingAssignments: 0,
      completionRate: 100,
      averageScore: 0,
    };
  }
}

async function getPerformanceComparison(studentId: string) {
  try {
    // Get class average for comparison
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { class: true },
    });

    if (!student?.class) return null;

    // Simplified class average calculation
    const classResults = await prisma.result.findMany({
      where: {
        student: { classId: student.classId },
      },
    });

    const classAverage =
      classResults.length > 0
        ? classResults.reduce((sum, result) => sum + result.score, 0) / classResults.length
        : 0;

    const studentResults = await prisma.result.findMany({
      where: { studentId },
    });

    const studentAverage =
      studentResults.length > 0
        ? studentResults.reduce((sum, result) => sum + result.score, 0) / studentResults.length
        : 0;

    return {
      studentAverage: Math.round(studentAverage * 100) / 100,
      classAverage: Math.round(classAverage * 100) / 100,
      difference: Math.round((studentAverage - classAverage) * 100) / 100,
      performanceLevel:
        studentAverage > classAverage
          ? 'Above Average'
          : studentAverage === classAverage
            ? 'Average'
            : 'Below Average',
    };
  } catch (error) {
    console.error('Error calculating performance comparison:', error);
    return null;
  }
}

// Utility functions

function calculateRiskLevel(
  gpa: number,
  attendance: number,
  completion: number
): 'low' | 'medium' | 'high' {
  if (gpa < 50 || attendance < 70 || completion < 60) return 'high';
  if (gpa < 60 || attendance < 80 || completion < 80) return 'medium';
  return 'low';
}

function getAttendanceStatus(rate: number): string {
  if (rate >= 95) return 'Excellent';
  if (rate >= 85) return 'Good';
  if (rate >= 75) return 'Fair';
  return 'Poor';
}

function getLetterGrade(percentage: number): string {
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
}

function getBestSubject(subjects: any[]): string {
  if (subjects.length === 0) return 'N/A';
  const best = subjects.reduce((a, b) => (a.averageScore > b.averageScore ? a : b));
  return best.subjectName;
}

function getWeakestSubject(subjects: any[]): string {
  if (subjects.length === 0) return 'N/A';
  const weakest = subjects.reduce((a, b) => (a.averageScore < b.averageScore ? a : b));
  return weakest.subjectName;
}

function calculateSubjectTrend(scores: number[]): 'improving' | 'declining' | 'stable' {
  if (scores.length < 3) return 'stable';

  const recent = scores.slice(-3);
  const older = scores.slice(0, scores.length - 3);

  if (older.length === 0) return 'stable';

  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;

  const difference = recentAvg - olderAvg;

  if (difference > 5) return 'improving';
  if (difference < -5) return 'declining';
  return 'stable';
}

function getDuePriority(dueDate: Date): 'high' | 'medium' | 'low' {
  const daysUntil = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  if (daysUntil <= 2) return 'high';
  if (daysUntil <= 7) return 'medium';
  return 'low';
}

async function getAttendanceTrend(studentId: string) {
  // Simplified trend calculation
  return 'stable'; // TODO: Implement proper trend analysis
}
