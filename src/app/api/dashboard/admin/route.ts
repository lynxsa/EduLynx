import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { startOfMonth, endOfMonth, subMonths, format, startOfWeek, endOfWeek, addDays } from 'date-fns';

async function getStudentAvgScore(studentId: string) {
  const results = await prisma.result.findMany({ where: { studentId } });
  if (!results.length) return null;
  const avg = results.reduce((sum, r) => sum + r.score, 0) / results.length;
  return avg;
}

export async function GET() {
  try {
    // Fetch real counts from the database
    const [
      totalStudents,
      totalTeachers,
      totalParents,
      totalClasses,
      totalAnnouncements,
      totalEvents,
      totalMedicalRecords
    ] = await Promise.all([
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.parent.count(),
      prisma.class.count(),
      prisma.announcement.count(),
      prisma.event.count(),
      prisma.medicalRecord.count(),
    ]);

    // Example: Attendance percentage (last week)
    const totalAttendance = await prisma.attendance.count();
    const presentAttendance = await prisma.attendance.count({ where: { present: true } });
    const attendancePercentage = totalAttendance > 0 ? Math.round((presentAttendance / totalAttendance) * 100) : 0;

    // Example: Recent students (last 30 days)
    const recentStudents = await prisma.student.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });
    const previousStudents = totalStudents - recentStudents;

    // --- Attendance breakdown for the last 7 days (for AttendanceChart) ---
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const attendanceByDay = [];
    for (let i = 0; i < 5; i++) { // School days: Mon-Fri
      const day = addDays(weekStart, i);
      const present = await prisma.attendance.count({ where: { date: day, present: true } });
      const absent = await prisma.attendance.count({ where: { date: day, present: false } });
      attendanceByDay.push({
        day: format(day, 'EEE'),
        present,
        absent
      });
    }

    // --- Student count per month for the last 6 months (for CountChart) ---
    const studentCountByMonth = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(startOfMonth(today), i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      const count = await prisma.student.count({
        where: {
          createdAt: {
            gte: monthStart,
            lte: monthEnd
          }
        }
      });
      studentCountByMonth.push({
        month: format(monthDate, 'MMM'),
        students: count
      });
    }

    // --- Finance data aggregated by month for the last 6 months (for FinanceChart) ---
    const financeByMonth = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(startOfMonth(today), i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      const income = await prisma.financeEntry.aggregate({
        _sum: { amount: true },
        where: {
          type: 'Income',
          date: { gte: monthStart, lte: monthEnd }
        }
      });
      const expense = await prisma.financeEntry.aggregate({
        _sum: { amount: true },
        where: {
          type: 'Expense',
          date: { gte: monthStart, lte: monthEnd }
        }
      });
      financeByMonth.push({
        month: format(monthDate, 'MMM'),
        income: income._sum.amount || 0,
        expense: expense._sum.amount || 0
      });
    }

    // --- Gender counts for StudentGenderPieChart ---
    const maleCount = await prisma.student.count({ where: { gender: 'Male' } });
    const femaleCount = await prisma.student.count({ where: { gender: 'Female' } });

    // Fetch all students with health/medical info for admin overview
    const students = await prisma.student.findMany({
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

    // Finance summary for admin dashboard
    const totalIncome = await prisma.financeEntry.aggregate({
      _sum: { amount: true },
      where: { type: 'Income' }
    });
    const totalExpense = await prisma.financeEntry.aggregate({
      _sum: { amount: true },
      where: { type: 'Expense' }
    });
    const recentEntries = await prisma.financeEntry.findMany({
      orderBy: { date: 'desc' },
      take: 5
    });

    // Calculate pass rate: % of students with avg score >= 50%
    const studentResults = await prisma.student.findMany({
      select: {
        id: true,
        results: { select: { score: true } }
      }
    });
    const passing = studentResults.filter(s => {
      if (!s.results.length) return false;
      const avg = s.results.reduce((sum, r) => sum + r.score, 0) / s.results.length;
      return avg >= 50;
    }).length;
    const passRate = totalStudents > 0 ? Math.round((passing / totalStudents) * 100) : 0;

    // --- Gender Pass Rates ---
    const maleStudentsList = await prisma.student.findMany({ where: { gender: 'Male' }, select: { id: true } });
    let malePassing = 0;
    for (const s of maleStudentsList) {
      const avg = await getStudentAvgScore(s.id);
      if (avg !== null && avg >= 50) malePassing++;
    }
    const femaleStudentsList = await prisma.student.findMany({ where: { gender: 'Female' }, select: { id: true } });
    let femalePassing = 0;
    for (const s of femaleStudentsList) {
      const avg = await getStudentAvgScore(s.id);
      if (avg !== null && avg >= 50) femalePassing++;
    }
    const malePassRate = maleCount > 0 ? Math.round((malePassing / maleCount) * 100) : 0;
    const femalePassRate = femaleCount > 0 ? Math.round((femalePassing / femaleCount) * 100) : 0;

    // --- Projected Pass Rate ---
    const weights = { Assignment: 1, Quiz: 2, 'Mid-Term': 5, Final: 10 };
    const allStudentsList = await prisma.student.findMany({ select: { id: true } });
    let projectedPassing = 0;
    for (const s of allStudentsList) {
      const results = await prisma.result.findMany({
        where: { studentId: s.id },
        include: { assignment: true, exam: true }
      });
      if (!results.length) continue;
      let weightedSum = 0;
      let totalWeight = 0;
      for (const r of results) {
        let type: keyof typeof weights = 'Assignment';
        if (r.exam) {
          if (r.exam.title.toLowerCase().includes('mid')) type = 'Mid-Term';
          else if (r.exam.title.toLowerCase().includes('final')) type = 'Final';
          else if (r.exam.title.toLowerCase().includes('quiz')) type = 'Quiz';
          else type = 'Assignment';
        } else if (r.assignment) {
          if (r.assignment.title.toLowerCase().includes('quiz')) type = 'Quiz';
        }
        const w = weights[type] || 1;
        weightedSum += r.score * w;
        totalWeight += w;
      }
      const projected = totalWeight > 0 ? weightedSum / totalWeight : 0;
      if (projected >= 50) projectedPassing++;
    }
    const projectedPassRate = totalStudents > 0 ? Math.round((projectedPassing / totalStudents) * 100) : 0;

    // --- Pass Rate per Subject ---
    // For each subject, calculate % of students with avg >= 50 in that subject
    const subjects = await prisma.subject.findMany({ select: { id: true, name: true } });
    const passRatePerSubject = [];
    for (const subject of subjects) {
      // Get all lessons for this subject
      const lessons = await prisma.lesson.findMany({ where: { subjectId: subject.id }, select: { id: true } });
      const lessonIds = lessons.map(l => l.id);
      // Get all results for assignments/exams in these lessons
      const results = await prisma.result.findMany({
        where: {
          OR: [
            { assignment: { lessonId: { in: lessonIds } } },
            { exam: { lessonId: { in: lessonIds } } }
          ]
        },
        select: { studentId: true, score: true }
      });
      // Group by student
      const studentScores: { [studentId: string]: number[] } = {};
      results.forEach(r => {
        if (!studentScores[r.studentId]) studentScores[r.studentId] = [];
        studentScores[r.studentId].push(r.score);
      });
      const total = Object.keys(studentScores).length;
      const passing = Object.values(studentScores).filter(scores => {
        const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length;
        return avg >= 50;
      }).length;
      passRatePerSubject.push({
        subject: subject.name,
        passRate: total > 0 ? Math.round((passing / total) * 100) : 0
      });
    }

    // Example: Events and Announcements (latest 2)
    const events = await prisma.event.findMany({
      orderBy: { startTime: 'asc' },
      take: 2
    });
    const announcements = await prisma.announcement.findMany({
      orderBy: { date: 'desc' },
      take: 2
    });

    // --- Top Classes by Performance ---
    const classes = await prisma.class.findMany({ 
      select: { 
        id: true, 
        name: true,
        students: {
          select: {
            id: true,
            results: { select: { score: true } }
          }
        }
      } 
    });
    const topClasses = classes.map(cls => {
      let totalScore = 0;
      let totalResults = 0;
      cls.students.forEach(student => {
        student.results.forEach(result => {
          totalScore += result.score;
          totalResults++;
        });
      });
      const avgScore = totalResults > 0 ? totalScore / totalResults : 0;
      return {
        class: cls.name,
        avgScore: Math.round(avgScore),
        studentCount: cls.students.length
      };
    }).sort((a, b) => b.avgScore - a.avgScore).slice(0, 5);

    // --- Mock behavior and disciplinary data (to be replaced with real models) ---
    const behaviorIncidents = Math.floor(Math.random() * 20) + 5; // Mock positive behavior reports
    const disciplinaryCases = Math.floor(Math.random() * 8) + 1; // Mock disciplinary cases

    // --- Additional metrics for enhanced dashboard ---
    const totalSubjects = await prisma.subject.count();
    const totalExams = await prisma.exam.count();
    const totalAssignments = await prisma.assignment.count();
    const totalResults = await prisma.result.count();

    // --- Mock Projects Data ---
    const totalProjects = 8;
    const activeProjects = 3;
    const completedProjects = 4;
    const plannedProjects = 1;

    // --- Top Achievers Data ---
    const topAchievers = await prisma.student.findMany({
      select: {
        id: true,
        name: true,
        surname: true,
        grade: { select: { level: true } },
        results: { select: { score: true } }
      },
      take: 10
    });

    const achieversWithAverage = topAchievers.map(student => {
      const avgScore = student.results.length > 0 
        ? student.results.reduce((sum, r) => sum + r.score, 0) / student.results.length 
        : 0;
      return {
        id: student.id,
        name: student.name,
        surname: student.surname,
        grade: student.grade?.level || 'Unknown',
        averageScore: avgScore
      };
    }).sort((a, b) => b.averageScore - a.averageScore).slice(0, 5);

    // Add rank to achievers
    const rankedAchievers = achieversWithAverage.map((achiever, index) => ({
      ...achiever,
      rank: index + 1
    }));

    return NextResponse.json({
      metrics: {
        totalStudents,
        totalTeachers,
        totalParents,
        totalClasses,
        totalSubjects,
        totalAnnouncements,
        totalEvents,
        totalExams,
        totalAssignments,
        totalResults,
        attendancePercentage,
        recentStudents,
        previousStudents,
        totalIncome: totalIncome._sum.amount || 0,
        totalExpense: totalExpense._sum.amount || 0,
        passRate,
        malePassRate,
        femalePassRate,
        projectedPassRate,
        totalMedicalRecords,
        behaviorIncidents,
        disciplinaryCases,
        totalProjects,
        activeProjects,
        completedProjects,
        plannedProjects,
      },
      chartData: studentCountByMonth,
      financeChart: financeByMonth,
      attendanceByDay,
      genderCounts: { male: maleCount, female: femaleCount },
      events: events,
      announcements: announcements,
      students,
      recentEntries,
      passRatePerSubject,
      topClasses,
      topAchievers: rankedAchievers
    });
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
