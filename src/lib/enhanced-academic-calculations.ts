/**
 * ENHANCED ACADEMIC CALCULATIONS LIBRARY
 * Advanced calculation functions for live dashboard metrics
 *
 * This library provides comprehensive academic analytics including:
 * - Student GPA and performance metrics
 * - Teacher workload and effectiveness analytics
 * - Class performance and ranking systems
 * - Attendance patterns and trend analysis
 * - Subject-wise performance comparisons
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ==================== INTERFACES ====================

export interface StudentAcademicMetrics {
  gpa: number;
  classRank: number;
  gradeRank: number;
  attendanceRate: number;
  assignmentCompletionRate: number;
  performanceTrend: 'improving' | 'declining' | 'stable';
  subjectPerformance: SubjectPerformance[];
  upcomingDeadlines: Assignment[];
  recentGrades: Grade[];
  courseProgress: { [subject: string]: number };
  achievements: Achievement[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface TeacherAcademicMetrics {
  classAverages: ClassAverage[];
  gradingWorkload: GradingWorkload;
  studentAlerts: StudentAlert[];
  teachingEffectiveness: TeachingEffectiveness;
  subjectAnalytics: SubjectAnalytics[];
  attendanceOverview: AttendanceOverview;
  performanceComparison: PerformanceComparison;
  workloadDistribution: WorkloadDistribution;
}

export interface SubjectPerformance {
  subjectId: string;
  subjectName: string;
  currentGrade: number;
  averageScore: number;
  trend: 'up' | 'down' | 'stable';
  lastAssessment: Date;
  nextDeadline: Date;
  completionRate: number;
}

export interface ClassAverage {
  classId: string;
  className: string;
  subject: string;
  averageGrade: number;
  studentCount: number;
  attendanceRate: number;
  performanceTrend: 'up' | 'down' | 'stable';
  topPerformers: string[];
  strugglingStudents: string[];
}

export interface StudentAlert {
  studentId: string;
  studentName: string;
  type: 'low_grade' | 'poor_attendance' | 'missing_assignment' | 'performance_decline';
  severity: 'high' | 'medium' | 'low';
  description: string;
  actionRequired: string;
  dueDate?: Date;
}

export interface TeachingEffectiveness {
  overallRating: number;
  classImprovementRate: number;
  studentSatisfactionScore: number;
  performanceImprovementTrend: number;
  subjectMastery: { [subject: string]: number };
}

// ==================== STUDENT CALCULATIONS ====================

/**
 * Calculate comprehensive GPA for a student
 */
export async function calculateStudentGPA(
  studentId: string,
  period?: 'current_term' | 'academic_year' | 'all_time'
): Promise<number> {
  try {
    const whereClause: any = { studentId };

    if (period === 'current_term') {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      whereClause.gradedAt = { gte: threeMonthsAgo };
    } else if (period === 'academic_year') {
      const academicYearStart = new Date();
      academicYearStart.setMonth(1); // February start for South African academic year
      whereClause.gradedAt = { gte: academicYearStart };
    }

    const results = await prisma.result.findMany({
      where: whereClause,
      include: {
        assignment: { include: { subject: true } },
        exam: { include: { subject: true } },
      },
    });

    if (results.length === 0) return 0;

    // Calculate weighted average based on assessment type
    let totalWeightedScore = 0;
    let totalWeight = 0;

    for (const result of results) {
      const weight = result.assignment
        ? result.assignment.weightage || 10 // Assignments typically 10% each
        : 25; // Exams typically 25% each

      const scorePercentage = (result.score / result.maxScore) * 100;
      totalWeightedScore += scorePercentage * weight;
      totalWeight += weight;
    }

    const gpa = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
    return Math.round(gpa * 100) / 100; // Round to 2 decimal places
  } catch (error) {
    console.error('Error calculating student GPA:', error);
    return 0;
  }
}

/**
 * Calculate student's rank within class and grade
 */
export async function calculateStudentRanking(
  studentId: string
): Promise<{ classRank: number; gradeRank: number; classSize: number; gradeSize: number }> {
  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { class: true, grade: true },
    });

    if (!student) return { classRank: 0, gradeRank: 0, classSize: 0, gradeSize: 0 };

    // Get all students in the same class
    const classStudents = await prisma.student.findMany({
      where: { classId: student.classId },
      include: {
        results: {
          where: {
            gradedAt: {
              gte: new Date(new Date().getFullYear(), 1, 1), // Academic year
            },
          },
        },
      },
    });

    // Get all students in the same grade
    const gradeStudents = await prisma.student.findMany({
      where: { gradeId: student.gradeId },
      include: {
        results: {
          where: {
            gradedAt: {
              gte: new Date(new Date().getFullYear(), 1, 1), // Academic year
            },
          },
        },
      },
    });

    // Calculate GPA for each student and rank
    const calculateAverage = (results: any[]) => {
      if (results.length === 0) return 0;
      const total = results.reduce(
        (sum, result) => sum + (result.score / result.maxScore) * 100,
        0
      );
      return total / results.length;
    };

    const classRankings = classStudents
      .map(s => ({ id: s.id, average: calculateAverage(s.results) }))
      .sort((a, b) => b.average - a.average);

    const gradeRankings = gradeStudents
      .map(s => ({ id: s.id, average: calculateAverage(s.results) }))
      .sort((a, b) => b.average - a.average);

    const classRank = classRankings.findIndex(s => s.id === studentId) + 1;
    const gradeRank = gradeRankings.findIndex(s => s.id === studentId) + 1;

    return {
      classRank,
      gradeRank,
      classSize: classStudents.length,
      gradeSize: gradeStudents.length,
    };
  } catch (error) {
    console.error('Error calculating student ranking:', error);
    return { classRank: 0, gradeRank: 0, classSize: 0, gradeSize: 0 };
  }
}

/**
 * Calculate attendance rate for a student
 */
export async function calculateAttendanceRate(
  studentId: string,
  period: 'week' | 'month' | 'term' | 'year' = 'month'
): Promise<number> {
  try {
    const now = new Date();
    const startDate = new Date();

    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'term':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        studentId,
        date: { gte: startDate },
      },
    });

    if (attendanceRecords.length === 0) return 0;

    const presentDays = attendanceRecords.filter(record => record.present).length;
    const attendanceRate = (presentDays / attendanceRecords.length) * 100;

    return Math.round(attendanceRate * 100) / 100;
  } catch (error) {
    console.error('Error calculating attendance rate:', error);
    return 0;
  }
}

/**
 * Determine student's performance trend
 */
export async function getStudentPerformanceTrend(
  studentId: string
): Promise<'improving' | 'declining' | 'stable'> {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const results = await prisma.result.findMany({
      where: {
        studentId,
        gradedAt: { gte: sixMonthsAgo },
      },
      orderBy: { gradedAt: 'asc' },
    });

    if (results.length < 4) return 'stable'; // Need minimum data points

    // Calculate average for first half vs second half
    const midpoint = Math.floor(results.length / 2);
    const firstHalf = results.slice(0, midpoint);
    const secondHalf = results.slice(midpoint);

    const firstHalfAvg =
      firstHalf.reduce((sum, r) => sum + (r.score / r.maxScore) * 100, 0) / firstHalf.length;
    const secondHalfAvg =
      secondHalf.reduce((sum, r) => sum + (r.score / r.maxScore) * 100, 0) / secondHalf.length;

    const difference = secondHalfAvg - firstHalfAvg;

    if (difference > 5) return 'improving';
    if (difference < -5) return 'declining';
    return 'stable';
  } catch (error) {
    console.error('Error calculating performance trend:', error);
    return 'stable';
  }
}

/**
 * Get comprehensive student metrics
 */
export async function getStudentAcademicMetrics(
  studentId: string
): Promise<StudentAcademicMetrics> {
  try {
    const [gpa, ranking, attendanceRate, performanceTrend] = await Promise.all([
      calculateStudentGPA(studentId, 'current_term'),
      calculateStudentRanking(studentId),
      calculateAttendanceRate(studentId, 'term'),
      getStudentPerformanceTrend(studentId),
    ]);

    // Get subject performance
    const subjectPerformance = await getStudentSubjectPerformance(studentId);

    // Get upcoming deadlines
    const upcomingDeadlines = await getUpcomingDeadlines(studentId);

    // Get recent grades
    const recentGrades = await getRecentGrades(studentId);

    // Calculate assignment completion rate
    const completionRate = await calculateAssignmentCompletionRate(studentId);

    // Determine risk level
    const riskLevel = determineRiskLevel(gpa, attendanceRate, completionRate);

    return {
      gpa,
      classRank: ranking.classRank,
      gradeRank: ranking.gradeRank,
      attendanceRate,
      assignmentCompletionRate: completionRate,
      performanceTrend,
      subjectPerformance,
      upcomingDeadlines,
      recentGrades,
      courseProgress: {}, // TODO: Implement course progress calculation
      achievements: [], // TODO: Implement achievements system
      riskLevel,
    };
  } catch (error) {
    console.error('Error getting student academic metrics:', error);
    throw error;
  }
}

// ==================== TEACHER CALCULATIONS ====================

/**
 * Calculate class averages for all teacher's classes
 */
export async function calculateTeacherClassAverages(teacherId: string): Promise<ClassAverage[]> {
  try {
    // Get teacher's classes and subjects
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      include: {
        subjects: {
          include: { subject: true },
        },
      },
    });

    if (!teacher) return [];

    const classAverages: ClassAverage[] = [];

    for (const teacherSubject of teacher.subjects) {
      // Get all classes for this subject (simplified - in reality would be more complex)
      const classes = await prisma.class.findMany({
        include: {
          students: {
            include: {
              results: {
                where: {
                  OR: [
                    { assignment: { subjectId: teacherSubject.subjectId } },
                    { exam: { subjectId: teacherSubject.subjectId } },
                  ],
                },
              },
            },
          },
        },
      });

      for (const cls of classes) {
        const studentResults = cls.students.flatMap(student => student.results);
        if (studentResults.length === 0) continue;

        const averageGrade =
          studentResults.reduce((sum, result) => sum + (result.score / result.maxScore) * 100, 0) /
          studentResults.length;

        // Calculate attendance rate for this class
        const attendanceRate = await calculateClassAttendanceRate(cls.id);

        classAverages.push({
          classId: cls.id,
          className: cls.name,
          subject: teacherSubject.subject.name,
          averageGrade: Math.round(averageGrade * 100) / 100,
          studentCount: cls.students.length,
          attendanceRate,
          performanceTrend: 'stable', // TODO: Implement trend calculation
          topPerformers: [], // TODO: Implement top performers identification
          strugglingStudents: [], // TODO: Implement struggling students identification
        });
      }
    }

    return classAverages;
  } catch (error) {
    console.error('Error calculating teacher class averages:', error);
    return [];
  }
}

/**
 * Calculate teacher's grading workload
 */
export async function calculateGradingWorkload(teacherId: string): Promise<GradingWorkload> {
  try {
    const pendingAssignments = await prisma.assignment.findMany({
      where: {
        subject: {
          teachers: {
            some: { teacherId },
          },
        },
        dueDate: { lte: new Date() },
      },
      include: {
        results: true,
        subject: true,
      },
    });

    const pendingExams = await prisma.exam.findMany({
      where: {
        subject: {
          teachers: {
            some: { teacherId },
          },
        },
        date: { lte: new Date() },
      },
      include: {
        results: true,
        subject: true,
      },
    });

    // Calculate pending grading items
    const pendingGradingCount =
      pendingAssignments.reduce((count, assignment) => {
        return count + (assignment.results?.length || 0);
      }, 0) +
      pendingExams.reduce((count, exam) => {
        return count + (exam.results?.length || 0);
      }, 0);

    // Estimate grading time (5 minutes per assignment, 10 minutes per exam)
    const estimatedHours = (pendingAssignments.length * 5 + pendingExams.length * 10) / 60;

    return {
      pendingAssignments: pendingAssignments.length,
      pendingExams: pendingExams.length,
      totalPendingItems: pendingGradingCount,
      estimatedGradingHours: Math.round(estimatedHours * 100) / 100,
      urgentItems: pendingAssignments.filter(a => {
        const daysSinceDue = (Date.now() - a.dueDate.getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceDue > 3;
      }).length,
    };
  } catch (error) {
    console.error('Error calculating grading workload:', error);
    return {
      pendingAssignments: 0,
      pendingExams: 0,
      totalPendingItems: 0,
      estimatedGradingHours: 0,
      urgentItems: 0,
    };
  }
}

/**
 * Identify students requiring attention
 */
export async function identifyStudentAlerts(teacherId: string): Promise<StudentAlert[]> {
  try {
    const alerts: StudentAlert[] = [];

    // Get all students taught by this teacher
    const students = await prisma.student.findMany({
      include: {
        results: {
          include: {
            assignment: { include: { subject: true } },
            exam: { include: { subject: true } },
          },
        },
        attendance: {
          where: {
            date: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            },
          },
        },
      },
    });

    for (const student of students) {
      const studentName = `${student.name} ${student.surname}`;

      // Check for low grades
      const recentResults = student.results.filter(
        r => r.gradedAt && r.gradedAt >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      );

      if (recentResults.length > 0) {
        const averageScore =
          recentResults.reduce((sum, r) => sum + (r.score / r.maxScore) * 100, 0) /
          recentResults.length;

        if (averageScore < 50) {
          alerts.push({
            studentId: student.id,
            studentName,
            type: 'low_grade',
            severity: averageScore < 35 ? 'high' : 'medium',
            description: `Average score of ${Math.round(averageScore)}% in recent assessments`,
            actionRequired: 'Schedule remedial support session',
          });
        }
      }

      // Check attendance
      const attendanceRate =
        student.attendance.length > 0
          ? (student.attendance.filter(a => a.present).length / student.attendance.length) * 100
          : 100;

      if (attendanceRate < 80) {
        alerts.push({
          studentId: student.id,
          studentName,
          type: 'poor_attendance',
          severity: attendanceRate < 60 ? 'high' : attendanceRate < 70 ? 'medium' : 'low',
          description: `Attendance rate of ${Math.round(attendanceRate)}% in the last 30 days`,
          actionRequired: 'Contact parents and discuss attendance issues',
        });
      }

      // Check for missing assignments (simplified)
      // TODO: Implement more sophisticated missing assignment detection
    }

    return alerts.slice(0, 20); // Limit to top 20 alerts
  } catch (error) {
    console.error('Error identifying student alerts:', error);
    return [];
  }
}

// ==================== HELPER FUNCTIONS ====================

async function getStudentSubjectPerformance(studentId: string): Promise<SubjectPerformance[]> {
  // TODO: Implement subject performance calculation
  return [];
}

async function getUpcomingDeadlines(studentId: string): Promise<Assignment[]> {
  // TODO: Implement upcoming deadlines retrieval
  return [];
}

async function getRecentGrades(studentId: string): Promise<Grade[]> {
  // TODO: Implement recent grades retrieval
  return [];
}

async function calculateAssignmentCompletionRate(studentId: string): Promise<number> {
  // TODO: Implement assignment completion rate calculation
  return 100;
}

async function calculateClassAttendanceRate(classId: string): Promise<number> {
  // TODO: Implement class attendance rate calculation
  return 85;
}

function determineRiskLevel(
  gpa: number,
  attendanceRate: number,
  completionRate: number
): 'low' | 'medium' | 'high' {
  if (gpa < 50 || attendanceRate < 70 || completionRate < 60) return 'high';
  if (gpa < 60 || attendanceRate < 80 || completionRate < 80) return 'medium';
  return 'low';
}

// ==================== TYPE DEFINITIONS ====================

interface Assignment {
  id: string;
  title: string;
  dueDate: Date;
  subject: string;
}

interface Grade {
  id: string;
  subject: string;
  score: number;
  maxScore: number;
  date: Date;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  earnedDate: Date;
}

interface GradingWorkload {
  pendingAssignments: number;
  pendingExams: number;
  totalPendingItems: number;
  estimatedGradingHours: number;
  urgentItems: number;
}

interface AttendanceOverview {
  overallRate: number;
  trends: { date: string; rate: number }[];
  classComparison: { className: string; rate: number }[];
}

interface PerformanceComparison {
  subjectRankings: { subject: string; rank: number; totalTeachers: number }[];
  improvementMetrics: { period: string; improvement: number }[];
}

interface WorkloadDistribution {
  classesCount: number;
  studentsCount: number;
  subjectsCount: number;
  weeklyHours: number;
}

interface SubjectAnalytics {
  subjectId: string;
  subjectName: string;
  averageScore: number;
  studentCount: number;
  passRate: number;
  improvementRate: number;
}
