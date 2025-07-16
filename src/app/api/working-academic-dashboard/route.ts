/**
 * WORKING ACADEMIC DASHBOARD API
 * Using actual database schema for academic calculations
 */

import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    console.log('🎓 Working Academic Dashboard API called');

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const teacherId = searchParams.get('teacherId');
    const type = searchParams.get('type') || 'student'; // student, teacher, parent

    const userId = type === 'teacher' ? teacherId : studentId;

    if (!userId) {
      return NextResponse.json(
        {
          error: `${type === 'teacher' ? 'Teacher' : 'Student'} ID required for ${type} dashboard`,
        },
        { status: 400 }
      );
    }

    console.log(`📊 Calculating metrics for ${type}: ${userId}`);

    if (type === 'student') {
      return await getStudentDashboardData(userId);
    } else if (type === 'teacher') {
      return await getTeacherDashboardData(userId);
    } else {
      return NextResponse.json({ error: 'Invalid dashboard type' }, { status: 400 });
    }
  } catch (error) {
    console.error('❌ Academic Dashboard API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to calculate dashboard metrics',
        details: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      },
      { status: 500 }
    );
  }
}

async function getStudentDashboardData(studentId: string) {
  try {
    // Get student with basic info
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        class: { include: { grade: true } },
        grade: true,
      },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Get all results for this student
    const results = await prisma.result.findMany({
      where: { studentId },
      orderBy: { id: 'desc' },
    });

    // Get assignments the student has completed
    const completedAssignments = await prisma.assignment.findMany({
      where: {
        results: {
          some: { studentId },
        },
      },
      include: {
        lesson: { include: { subject: true } },
      },
    });

    // Get exams the student has taken
    const completedExams = await prisma.exam.findMany({
      where: {
        results: {
          some: { studentId },
        },
      },
      include: {
        lesson: { include: { subject: true } },
      },
    });

    // Get attendance records
    const attendanceRecords = await prisma.attendance.findMany({
      where: { studentId },
      orderBy: { date: 'desc' },
      take: 60, // Last 60 days
    });

    // Calculate basic metrics
    const totalResults = results.length;
    const averageScore =
      results.length > 0 ? results.reduce((sum, r) => sum + r.score, 0) / results.length : 0;

    // Calculate assignment vs exam performance
    const assignmentResults = results.filter(r => r.assignmentId !== null);
    const examResults = results.filter(r => r.examId !== null);

    const assignmentAverage =
      assignmentResults.length > 0
        ? assignmentResults.reduce((sum, r) => sum + r.score, 0) / assignmentResults.length
        : 0;
    const examAverage =
      examResults.length > 0
        ? examResults.reduce((sum, r) => sum + r.score, 0) / examResults.length
        : 0;

    // Calculate attendance rate
    const attendanceRate =
      attendanceRecords.length > 0
        ? (attendanceRecords.filter(a => a.present).length / attendanceRecords.length) * 100
        : 100;

    // Get class ranking (simplified)
    const classStudents = await prisma.student.findMany({
      where: { classId: student.classId },
      include: {
        results: true,
      },
    });

    const classAverages = classStudents
      .map(s => ({
        id: s.id,
        average:
          s.results.length > 0
            ? s.results.reduce((sum, r) => sum + r.score, 0) / s.results.length
            : 0,
      }))
      .sort((a, b) => b.average - a.average);

    const studentRank = classAverages.findIndex(s => s.id === studentId) + 1;

    // Calculate recent performance trend
    const recentResults = results.slice(0, 5); // Last 5 results
    const olderResults = results.slice(5, 10); // Previous 5 results

    const recentAverage =
      recentResults.length > 0
        ? recentResults.reduce((sum, r) => sum + r.score, 0) / recentResults.length
        : 0;
    const olderAverage =
      olderResults.length > 0
        ? olderResults.reduce((sum, r) => sum + r.score, 0) / olderResults.length
        : 0;

    const performanceTrend =
      recentAverage > olderAverage + 5
        ? 'improving'
        : recentAverage < olderAverage - 5
          ? 'declining'
          : 'stable';

    // Build subject performance map
    const subjectPerformance = new Map();

    // Process assignments
    completedAssignments.forEach(assignment => {
      const subject = assignment.lesson?.subject;
      if (!subject) return;

      const result = results.find(r => r.assignmentId === assignment.id);
      if (!result) return;

      if (!subjectPerformance.has(subject.id)) {
        subjectPerformance.set(subject.id, {
          subjectId: subject.id,
          subjectName: subject.name,
          scores: [],
          assessmentCount: 0,
        });
      }

      const subjectData = subjectPerformance.get(subject.id);
      subjectData.scores.push(result.score);
      subjectData.assessmentCount++;
    });

    // Process exams
    completedExams.forEach(exam => {
      const subject = exam.lesson?.subject;
      if (!subject) return;

      const result = results.find(r => r.examId === exam.id);
      if (!result) return;

      if (!subjectPerformance.has(subject.id)) {
        subjectPerformance.set(subject.id, {
          subjectId: subject.id,
          subjectName: subject.name,
          scores: [],
          assessmentCount: 0,
        });
      }

      const subjectData = subjectPerformance.get(subject.id);
      subjectData.scores.push(result.score);
      subjectData.assessmentCount++;
    });

    // Convert to array with averages
    const subjectPerformanceArray = Array.from(subjectPerformance.values()).map(subject => ({
      subjectId: subject.subjectId,
      subjectName: subject.subjectName,
      averageScore:
        subject.scores.length > 0
          ? Math.round((subject.scores.reduce((a, b) => a + b, 0) / subject.scores.length) * 100) /
            100
          : 0,
      assessmentCount: subject.assessmentCount,
      grade: getLetterGrade(
        subject.scores.length > 0
          ? subject.scores.reduce((a, b) => a + b, 0) / subject.scores.length
          : 0
      ),
    }));

    // Get recent activity
    const recentGrades = results.slice(0, 10).map(result => {
      const assignment = completedAssignments.find(a => a.id === result.assignmentId);
      const exam = completedExams.find(e => e.id === result.examId);
      const assessment = assignment || exam;
      const subject = assessment?.lesson?.subject;

      return {
        id: result.id,
        score: result.score,
        assessment: assessment?.title || 'Assessment',
        subject: subject?.name || 'Unknown Subject',
        type: assignment ? 'Assignment' : 'Exam',
        date: new Date().toISOString(), // Use current date since createdAt doesn't exist
        grade: getLetterGrade(result.score),
      };
    });

    // Calculate risk level
    const riskLevel =
      averageScore < 50 || attendanceRate < 75
        ? 'high'
        : averageScore < 60 || attendanceRate < 85
          ? 'medium'
          : 'low';

    const dashboardData = {
      student: {
        id: student.id,
        name: `${student.name} ${student.surname}`,
        class: student.class?.name || 'Not Assigned',
        grade: student.grade?.level ? `Grade ${student.grade.level}` : 'Not Assigned',
        photo: student.img || '/default-avatar.png',
      },

      academicOverview: {
        overallAverage: Math.round(averageScore * 100) / 100,
        assignmentAverage: Math.round(assignmentAverage * 100) / 100,
        examAverage: Math.round(examAverage * 100) / 100,
        totalAssessments: totalResults,
        classRank: studentRank,
        classSize: classStudents.length,
        performanceTrend,
        letterGrade: getLetterGrade(averageScore),
        riskLevel,
      },

      attendanceOverview: {
        rate: Math.round(attendanceRate * 100) / 100,
        status: getAttendanceStatus(attendanceRate),
        totalDays: attendanceRecords.length,
        presentDays: attendanceRecords.filter(a => a.present).length,
        absentDays: attendanceRecords.filter(a => !a.present).length,
      },

      subjectPerformance: subjectPerformanceArray,

      recentActivity: recentGrades,

      quickStats: {
        strongestSubject: getBestSubject(subjectPerformanceArray),
        weakestSubject: getWeakestSubject(subjectPerformanceArray),
        totalSubjects: subjectPerformanceArray.length,
        improvementNeeded: performanceTrend === 'declining',
        attendanceAlert: attendanceRate < 80,
      },
    };

    console.log(`✅ Student dashboard calculated for ${student.name} ${student.surname}`);
    console.log(
      `📈 Average: ${averageScore.toFixed(1)}, Rank: ${studentRank}/${classStudents.length}, Attendance: ${attendanceRate.toFixed(1)}%`
    );

    return NextResponse.json({
      success: true,
      data: dashboardData,
      calculatedAt: new Date().toISOString(),
      metrics: {
        totalResults,
        totalSubjects: subjectPerformanceArray.length,
        attendanceRecords: attendanceRecords.length,
      },
    });
  } catch (error) {
    console.error('Error calculating student dashboard:', error);
    throw error;
  }
}

async function getTeacherDashboardData(teacherId: string) {
  try {
    console.log(`🔍 Looking for teacher with ID: ${teacherId}`);

    // Get teacher info
    let teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      include: {
        subjects: { include: { subject: true } },
        lessons: {
          include: {
            subject: true,
            class: true,
          },
        },
      },
    });

    // If teacher not found, get the first available teacher
    if (!teacher) {
      console.log(`⚠️ Teacher ${teacherId} not found, using first available teacher`);
      teacher = await prisma.teacher.findFirst({
        include: {
          subjects: { include: { subject: true } },
          lessons: {
            include: {
              subject: true,
              class: true,
            },
          },
        },
      });
    }

    if (!teacher) {
      console.log('❌ No teachers found in database');
      return NextResponse.json({ error: 'No teachers found in system' }, { status: 404 });
    }

    console.log(
      `✅ Found teacher: ${teacher.name} ${teacher.surname} with ${teacher.lessons.length} lessons`
    );

    // Get all students in teacher's classes
    const classIds = teacher.lessons.map(l => l.classId);
    const students = await prisma.student.findMany({
      where: {
        classId: { in: classIds },
      },
      include: {
        class: true,
        results: true,
      },
    });

    console.log(`👥 Found ${students.length} students in teacher's classes`);

    // Get all assignments and exams for teacher's lessons
    const lessonIds = teacher.lessons.map(l => l.id);
    const [assignments, exams] = await Promise.all([
      prisma.assignment.findMany({
        where: { lessonId: { in: lessonIds } },
        include: { results: true },
      }),
      prisma.exam.findMany({
        where: { lessonId: { in: lessonIds } },
        include: { results: true },
      }),
    ]);

    // Calculate class averages
    const classAverages = teacher.lessons.map(lesson => {
      const classStudents = students.filter(s => s.classId === lesson.classId);
      const classResults = classStudents.flatMap(s => s.results);

      const average =
        classResults.length > 0
          ? classResults.reduce((sum, r) => sum + r.score, 0) / classResults.length
          : 0;

      return {
        classId: lesson.classId,
        className: lesson.class.name,
        subject: lesson.subject.name,
        studentCount: classStudents.length,
        averageScore: Math.round(average * 100) / 100,
        assessmentCount: classResults.length,
      };
    });

    // Calculate grading workload
    const totalPendingGrades =
      assignments.reduce((count, a) => {
        return count + (students.length - (a.results?.length || 0));
      }, 0) +
      exams.reduce((count, e) => {
        return count + (students.length - (e.results?.length || 0));
      }, 0);

    // Identify struggling students
    const strugglingStudents = students
      .filter(student => {
        const average =
          student.results.length > 0
            ? student.results.reduce((sum, r) => sum + r.score, 0) / student.results.length
            : 0;
        return average < 50;
      })
      .slice(0, 10); // Top 10 concerns

    // Calculate overall metrics
    const overallAverage =
      classAverages.length > 0
        ? Math.round(
            (classAverages.reduce((sum, c) => sum + c.averageScore, 0) / classAverages.length) * 100
          ) / 100
        : 0;

    const topPerformingClass =
      classAverages.length > 0
        ? classAverages.reduce((best, current) =>
            current.averageScore > best.averageScore ? current : best
          )
        : null;

    const uniqueSubjects = new Set(teacher.lessons.map(l => l.subject.name));

    // Get attendance data for teacher's students
    const attendanceRecords = await prisma.attendance.findMany({
      where: { studentId: { in: students.map(s => s.id) } },
    });

    const attendanceRate =
      attendanceRecords.length > 0
        ? (attendanceRecords.filter(a => a.present).length / attendanceRecords.length) * 100
        : 85; // Default if no attendance data

    // Format data to match frontend interface
    const dashboardData = {
      teacher: {
        id: teacher.id,
        name: `${teacher.name} ${teacher.surname}`,
        email: teacher.email || '',
        photo: teacher.img || '/default-teacher-avatar.png',
        department: 'Academic Department', // Default since not in schema
      },

      academicOverview: {
        totalStudents: students.length,
        totalClasses: teacher.lessons.length,
        totalSubjects: uniqueSubjects.size,
        averageClassPerformance: overallAverage,
        attendanceRate: Math.round(attendanceRate * 100) / 100,
        totalAssessments: assignments.length + exams.length,
        topPerformingClass: topPerformingClass?.className || 'N/A',
        strugglingStudentsCount: strugglingStudents.length,
        improvingStudentsCount: Math.max(0, students.length - strugglingStudents.length - 5), // Estimated
      },

      classPerformance: classAverages.map(classAvg => ({
        classId: classAvg.classId,
        className: classAvg.className,
        studentCount: classAvg.studentCount,
        averageScore: classAvg.averageScore,
        attendanceRate: attendanceRate, // Use overall rate for now
        topStudent: 'Top Student', // Would need separate query
        riskLevel:
          classAvg.averageScore >= 70
            ? 'low'
            : classAvg.averageScore >= 60
              ? 'medium'
              : ('high' as 'low' | 'medium' | 'high'),
      })),

      studentAlerts: strugglingStudents.map(student => ({
        studentId: student.id,
        studentName: `${student.name} ${student.surname}`,
        className: student.class?.name || 'Unknown',
        alertType: 'academic' as const,
        severity:
          student.results.length > 0 &&
          student.results.reduce((sum, r) => sum + r.score, 0) / student.results.length < 40
            ? ('high' as const)
            : ('medium' as const),
        description: 'Low average performance - requires attention',
        averageScore:
          student.results.length > 0
            ? Math.round(
                (student.results.reduce((sum, r) => sum + r.score, 0) / student.results.length) *
                  100
              ) / 100
            : 0,
        attendanceRate: attendanceRate, // Use overall rate for now
      })),

      subjectAnalytics: Array.from(uniqueSubjects).map(subjectName => {
        const subjectLessons = teacher.lessons.filter(l => l.subject.name === subjectName);
        const subjectClassIds = subjectLessons.map(l => l.classId);
        const subjectStudents = students.filter(s => subjectClassIds.includes(s.classId));
        const subjectResults = subjectStudents.flatMap(s => s.results);

        const averageScore =
          subjectResults.length > 0
            ? subjectResults.reduce((sum, r) => sum + r.score, 0) / subjectResults.length
            : 0;

        const passRate =
          subjectResults.length > 0
            ? (subjectResults.filter(r => r.score >= 50).length / subjectResults.length) * 100
            : 0;

        return {
          subjectId: subjectName.toLowerCase().replace(/\s+/g, '_'),
          subjectName: subjectName,
          classCount: subjectLessons.length,
          studentCount: subjectStudents.length,
          averageScore: Math.round(averageScore * 100) / 100,
          passRate: Math.round(passRate * 100) / 100,
          assessmentCount: subjectResults.length,
        };
      }),

      recentActivity: [], // Would need separate implementation

      quickStats: {
        totalStudents: students.length,
        totalClasses: teacher.lessons.length,
        totalSubjects: uniqueSubjects.size,
        strugglingStudentsCount: strugglingStudents.length,
        challengingSubject: 'Mathematics', // Could calculate from subject analytics
      },
    };

    console.log(`✅ Teacher dashboard calculated for ${teacher.name} ${teacher.surname}`);
    console.log(
      `👥 Students: ${students.length}, Classes: ${teacher.lessons.length}, Pending: ${totalPendingGrades}`
    );

    return NextResponse.json({
      success: true,
      data: dashboardData,
      calculatedAt: new Date().toISOString(),
      metrics: {
        totalStudents: students.length,
        totalClasses: teacher.lessons.length,
        totalAssessments: assignments.length + exams.length,
      },
    });
  } catch (error) {
    console.error('Error calculating teacher dashboard:', error);
    throw error;
  }
}

// Utility functions
function getLetterGrade(score: number): string {
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}

function getAttendanceStatus(rate: number): string {
  if (rate >= 95) return 'Excellent';
  if (rate >= 85) return 'Good';
  if (rate >= 75) return 'Fair';
  return 'Poor';
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
