/**
 * Dashboard Calculation Utilities
 * Algorithms and formulas for calculating dashboard metrics
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface DashboardMetrics {
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  totalClasses: number;
  averageAttendance: number;
  overallPerformance: number;
  genderDistribution: {
    male: number;
    female: number;
  };
  gradeDistribution: {
    grade: number;
    count: number;
  }[];
  attendanceTrend: {
    date: string;
    attendance: number;
  }[];
  subjectPerformance: {
    subject: string;
    averageScore: number;
    totalStudents: number;
  }[];
  financialOverview: {
    totalIncome: number;
    totalExpenses: number;
    netBalance: number;
    monthlyTrend: {
      month: string;
      income: number;
      expenses: number;
    }[];
  };
  riskAssessment: {
    studentsAtRisk: number;
    lowAttendance: number;
    failingGrades: number;
    riskFactors: {
      factor: string;
      count: number;
      severity: 'low' | 'medium' | 'high';
    }[];
  };
  userActivity: {
    totalLogins: number;
    activeUsers: number;
    peakHour: string;
    loginTrend: {
      hour: string;
      logins: number;
    }[];
  };
}

/**
 * Calculate attendance percentage for a student
 */
export const calculateAttendancePercentage = async (studentId: string): Promise<number> => {
  const totalLessons = await prisma.attendance.count({
    where: { studentId },
  });

  if (totalLessons === 0) return 0;

  const presentLessons = await prisma.attendance.count({
    where: {
      studentId,
      present: true,
    },
  });

  return Math.round((presentLessons / totalLessons) * 100);
};

/**
 * Calculate average score for a student across all subjects
 */
export const calculateStudentAverageScore = async (studentId: string): Promise<number> => {
  const results = await prisma.result.findMany({
    where: { studentId },
    select: { score: true },
  });

  if (results.length === 0) return 0;

  const totalScore = results.reduce((sum, result) => sum + result.score, 0);
  return Math.round(totalScore / results.length);
};

/**
 * Calculate class average performance
 */
export const calculateClassAveragePerformance = async (classId: number): Promise<number> => {
  const students = await prisma.student.findMany({
    where: { classId },
    select: { id: true },
  });

  if (students.length === 0) return 0;

  const averages = await Promise.all(
    students.map(student => calculateStudentAverageScore(student.id))
  );

  const totalAverage = averages.reduce((sum, avg) => sum + avg, 0);
  return Math.round(totalAverage / averages.length);
};

/**
 * Calculate overall school performance metrics
 */
export const calculateSchoolPerformance = async (schoolId?: number): Promise<number> => {
  const whereClause = schoolId ? { schoolId } : {};

  const results = await prisma.result.findMany({
    where: {
      student: whereClause,
    },
    select: { score: true },
  });

  if (results.length === 0) return 0;

  const totalScore = results.reduce((sum, result) => sum + result.score, 0);
  return Math.round(totalScore / results.length);
};

/**
 * Calculate attendance trend over the last 30 days
 */
export const calculateAttendanceTrend = async (
  schoolId?: number
): Promise<{ date: string; attendance: number }[]> => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Get attendance data grouped by date
  const attendanceRecords = await prisma.attendance.findMany({
    where: {
      date: { gte: thirtyDaysAgo },
      ...(schoolId && {
        student: { schoolId },
      }),
    },
    select: {
      date: true,
      present: true,
    },
  });

  // Group by date and calculate attendance percentage
  const dateGroups = new Map<string, { total: number; present: number }>();

  attendanceRecords.forEach(record => {
    const dateStr = record.date.toISOString().split('T')[0];
    if (!dateGroups.has(dateStr)) {
      dateGroups.set(dateStr, { total: 0, present: 0 });
    }
    const group = dateGroups.get(dateStr)!;
    group.total++;
    if (record.present) group.present++;
  });

  return Array.from(dateGroups.entries()).map(([date, stats]) => ({
    date,
    attendance: stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0,
  }));
};

/**
 * Calculate subject performance statistics
 */
export const calculateSubjectPerformance = async (
  schoolId?: number
): Promise<
  {
    subject: string;
    averageScore: number;
    totalStudents: number;
  }[]
> => {
  const subjects = await prisma.subject.findMany();

  const results = await Promise.all(
    subjects.map(async subject => {
      // Get all results for this subject
      const subjectResults = await prisma.result.findMany({
        include: {
          student: true,
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
        where: {
          OR: [
            {
              exam: {
                lesson: {
                  subjectId: subject.id,
                },
              },
            },
            {
              assignment: {
                lesson: {
                  subjectId: subject.id,
                },
              },
            },
          ],
          ...(schoolId && {
            student: {
              schoolId,
            },
          }),
        },
      });

      const uniqueStudents = new Set<string>();
      const scores: number[] = [];

      subjectResults.forEach(result => {
        uniqueStudents.add(result.student.id);
        scores.push(result.score);
      });

      const averageScore =
        scores.length > 0
          ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
          : 0;

      return {
        subject: subject.name,
        averageScore,
        totalStudents: uniqueStudents.size,
      };
    })
  );

  return results;
};

/**
 * Calculate financial overview
 */
export const calculateFinancialOverview = async (): Promise<{
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  monthlyTrend: { month: string; income: number; expenses: number }[];
}> => {
  const financeEntries = await prisma.financeEntry.findMany({
    orderBy: { date: 'asc' },
  });

  const totalIncome = financeEntries
    .filter(entry => entry.type === 'Income')
    .reduce((sum, entry) => sum + entry.amount, 0);

  const totalExpenses = financeEntries
    .filter(entry => entry.type === 'Expense')
    .reduce((sum, entry) => sum + entry.amount, 0);

  // Group by month for trend analysis
  const monthlyData = new Map<string, { income: number; expenses: number }>();

  financeEntries.forEach(entry => {
    const month = entry.date.toISOString().substring(0, 7); // YYYY-MM format

    if (!monthlyData.has(month)) {
      monthlyData.set(month, { income: 0, expenses: 0 });
    }

    const data = monthlyData.get(month)!;
    if (entry.type === 'Income') {
      data.income += entry.amount;
    } else {
      data.expenses += entry.amount;
    }
  });

  const monthlyTrend = Array.from(monthlyData.entries())
    .map(([month, data]) => ({
      month,
      income: Math.round(data.income),
      expenses: Math.round(data.expenses),
    }))
    .slice(-12); // Last 12 months

  return {
    totalIncome: Math.round(totalIncome),
    totalExpenses: Math.round(totalExpenses),
    netBalance: Math.round(totalIncome - totalExpenses),
    monthlyTrend,
  };
};

/**
 * Calculate risk assessment metrics
 */
export const calculateRiskAssessment = async (
  schoolId?: number
): Promise<{
  studentsAtRisk: number;
  lowAttendance: number;
  failingGrades: number;
  riskFactors: { factor: string; count: number; severity: 'low' | 'medium' | 'high' }[];
}> => {
  const whereClause = schoolId ? { schoolId } : {};

  const students = await prisma.student.findMany({
    where: whereClause,
    include: {
      results: true,
      attendances: true,
    },
  });

  let studentsAtRisk = 0;
  let lowAttendance = 0;
  let failingGrades = 0;

  const riskFactors = {
    'Poor Attendance (<75%)': 0,
    'Failing Grades (<50%)': 0,
    'No Recent Submissions': 0,
    'Medical Concerns': 0,
  };

  for (const student of students) {
    const attendancePercentage = await calculateAttendancePercentage(student.id);
    const averageScore = await calculateStudentAverageScore(student.id);

    let isAtRisk = false;

    // Check attendance
    if (attendancePercentage < 75) {
      lowAttendance++;
      riskFactors['Poor Attendance (<75%)']++;
      isAtRisk = true;
    }

    // Check grades
    if (averageScore < 50) {
      failingGrades++;
      riskFactors['Failing Grades (<50%)']++;
      isAtRisk = true;
    }

    // Check recent submissions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSubmissions = await prisma.submission.count({
      where: {
        studentId: student.id,
        submittedAt: { gte: thirtyDaysAgo },
      },
    });

    if (recentSubmissions === 0) {
      riskFactors['No Recent Submissions']++;
      isAtRisk = true;
    }

    // Check medical concerns
    if (student.allergies || student.medicalInfo) {
      riskFactors['Medical Concerns']++;
    }

    if (isAtRisk) {
      studentsAtRisk++;
    }
  }

  return {
    studentsAtRisk,
    lowAttendance,
    failingGrades,
    riskFactors: Object.entries(riskFactors).map(([factor, count]) => ({
      factor,
      count,
      severity: count > 10 ? 'high' : count > 5 ? 'medium' : 'low',
    })),
  };
};

/**
 * Calculate user activity metrics
 */
export const calculateUserActivity = async (): Promise<{
  totalLogins: number;
  activeUsers: number;
  peakHour: string;
  loginTrend: { hour: string; logins: number }[];
}> => {
  // Note: This would require a login tracking table in a real implementation
  // For now, we'll simulate data based on user creation patterns

  const totalUsers = await prisma.user.count({
    where: { isActive: true },
  });

  const recentlyActive = await prisma.user.count({
    where: {
      isActive: true,
      updatedAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
      },
    },
  });

  // Simulate login trend data (in production, this would come from actual login logs)
  const loginTrend = Array.from({ length: 24 }, (_, i) => ({
    hour: i.toString().padStart(2, '0'),
    logins: Math.floor(Math.random() * 50) + 10, // Simulated data
  }));

  const peakHour = loginTrend.reduce((peak, current) =>
    current.logins > peak.logins ? current : peak
  );

  return {
    totalLogins: totalUsers * 3, // Simulate average logins
    activeUsers: recentlyActive,
    peakHour: `${peakHour.hour}:00`,
    loginTrend,
  };
};

/**
 * Get comprehensive dashboard metrics
 */
export const getDashboardMetrics = async (schoolId?: number): Promise<DashboardMetrics> => {
  const whereClause = schoolId ? { schoolId } : {};

  // Get basic counts
  const [totalStudents, totalTeachers, totalParents, totalClasses] = await Promise.all([
    prisma.student.count({ where: whereClause }),
    prisma.teacher.count({ where: whereClause }),
    prisma.parent.count({ where: whereClause }),
    prisma.class.count({ where: whereClause }),
  ]);

  // Get gender distribution
  const genderStats = await prisma.student.groupBy({
    by: ['sex'],
    where: whereClause,
    _count: { _all: true },
  });

  const genderDistribution = {
    male: genderStats.find(g => g.sex === 'MALE')?._count._all || 0,
    female: genderStats.find(g => g.sex === 'FEMALE')?._count._all || 0,
  };

  // Get grade distribution
  const gradeStats = await prisma.student.groupBy({
    by: ['gradeId'],
    where: whereClause,
    _count: { _all: true },
    orderBy: { gradeId: 'asc' },
  });

  const gradeDistribution = await Promise.all(
    gradeStats.map(async stat => {
      const grade = await prisma.grade.findUnique({
        where: { id: stat.gradeId || 0 },
      });
      return {
        grade: grade?.level || 0,
        count: stat._count._all,
      };
    })
  );

  // Calculate complex metrics
  const [
    averageAttendance,
    overallPerformance,
    attendanceTrend,
    subjectPerformance,
    financialOverview,
    riskAssessment,
    userActivity,
  ] = await Promise.all([
    calculateSchoolAttendanceAverage(schoolId),
    calculateSchoolPerformance(schoolId),
    calculateAttendanceTrend(schoolId),
    calculateSubjectPerformance(schoolId),
    calculateFinancialOverview(),
    calculateRiskAssessment(schoolId),
    calculateUserActivity(),
  ]);

  return {
    totalStudents,
    totalTeachers,
    totalParents,
    totalClasses,
    averageAttendance,
    overallPerformance,
    genderDistribution,
    gradeDistribution,
    attendanceTrend,
    subjectPerformance,
    financialOverview,
    riskAssessment,
    userActivity,
  };
};

/**
 * Calculate school-wide attendance average
 */
export const calculateSchoolAttendanceAverage = async (schoolId?: number): Promise<number> => {
  const whereClause = schoolId ? { student: { schoolId } } : {};

  const totalAttendanceRecords = await prisma.attendance.count({ where: whereClause });

  if (totalAttendanceRecords === 0) return 0;

  const presentRecords = await prisma.attendance.count({
    where: {
      ...whereClause,
      present: true,
    },
  });

  return Math.round((presentRecords / totalAttendanceRecords) * 100);
};

/**
 * Calculate detailed attendance trends for multiple students over a period
 */
export const calculateAttendanceTrends = async (
  students: any[],
  period: 'week' | 'month' | 'semester' = 'month'
): Promise<any[]> => {
  const endDate = new Date();
  const startDate = new Date();

  // Set date range based on period
  switch (period) {
    case 'week':
      startDate.setDate(endDate.getDate() - 7);
      break;
    case 'month':
      startDate.setDate(endDate.getDate() - 30);
      break;
    case 'semester':
      startDate.setDate(endDate.getDate() - 120);
      break;
  }

  const studentIds = students.map(s => s.id);

  // Get all attendance records for the students in the period
  const attendanceRecords = await prisma.attendance.findMany({
    where: {
      studentId: {
        in: studentIds,
      },
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      date: 'asc',
    },
  });

  // Group by date and calculate daily attendance percentages
  const attendanceByDate: { [key: string]: { present: number; total: number } } = {};

  attendanceRecords.forEach(record => {
    const dateKey = record.date.toISOString().split('T')[0];

    if (!attendanceByDate[dateKey]) {
      attendanceByDate[dateKey] = { present: 0, total: 0 };
    }

    attendanceByDate[dateKey].total++;
    if (record.present) {
      attendanceByDate[dateKey].present++;
    }
  });

  // Convert to chart data format
  return Object.entries(attendanceByDate)
    .map(([date, data]) => ({
      date,
      attendance: Math.round((data.present / data.total) * 100),
      present: data.present,
      total: data.total,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

/**
 * Calculate performance trends for multiple students over a period
 */
export const calculatePerformanceTrends = async (
  students: any[],
  period: 'week' | 'month' | 'semester' = 'month'
): Promise<any[]> => {
  const endDate = new Date();
  const startDate = new Date();

  // Set date range based on period
  switch (period) {
    case 'week':
      startDate.setDate(endDate.getDate() - 7);
      break;
    case 'month':
      startDate.setDate(endDate.getDate() - 30);
      break;
    case 'semester':
      startDate.setDate(endDate.getDate() - 120);
      break;
  }

  const studentIds = students.map(s => s.id);

  // Get all results for the students by querying exams and assignments separately
  const examResults = await prisma.result.findMany({
    where: {
      studentId: {
        in: studentIds,
      },
      exam: {
        startTime: {
          gte: startDate,
          lte: endDate,
        },
      },
    },
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
      student: true,
    },
    orderBy: {
      id: 'asc',
    },
  });

  const assignmentResults = await prisma.result.findMany({
    where: {
      studentId: {
        in: studentIds,
      },
      assignment: {
        dueDate: {
          gte: startDate,
          lte: endDate,
        },
      },
    },
    include: {
      assignment: {
        include: {
          lesson: {
            include: {
              subject: true,
            },
          },
        },
      },
      student: true,
    },
    orderBy: {
      id: 'asc',
    },
  });

  // Combine results and add dates
  const allResults = [
    ...examResults.map(r => ({
      ...r,
      date: r.exam?.startTime || new Date(),
      subjectName: r.exam?.lesson?.subject?.name || 'Unknown',
    })),
    ...assignmentResults.map(r => ({
      ...r,
      date: r.assignment?.dueDate || new Date(),
      subjectName: r.assignment?.lesson?.subject?.name || 'Unknown',
    })),
  ].sort((a, b) => a.date.getTime() - b.date.getTime());

  // Group by date and calculate daily average scores
  const performanceByDate: { [key: string]: { scores: number[]; subjects: Set<string> } } = {};

  allResults.forEach(result => {
    const dateKey = result.date.toISOString().split('T')[0];

    if (!performanceByDate[dateKey]) {
      performanceByDate[dateKey] = { scores: [], subjects: new Set() };
    }

    performanceByDate[dateKey].scores.push(result.score);
    performanceByDate[dateKey].subjects.add(result.subjectName);
  });

  // Convert to chart data format
  return Object.entries(performanceByDate)
    .map(([date, data]) => ({
      date,
      averageScore: Math.round(
        data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length
      ),
      totalAssessments: data.scores.length,
      subjectsCount: data.subjects.size,
      scores: data.scores,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

const calculationUtils = {
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
};

export default calculationUtils;
