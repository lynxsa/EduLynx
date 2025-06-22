import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const period = url.searchParams.get('period') || 'semester';

    // Calculate overall GPA from actual results
    const allResults = await prisma.result.findMany({
      select: { score: true },
    });

    const overallGPA =
      allResults.length > 0
        ? allResults.reduce((sum, result) => sum + result.score, 0) / allResults.length / 25 // Convert to 4.0 scale
        : 0;

    // Calculate pass rate (scores >= 60)
    const passingResults = allResults.filter(result => result.score >= 60);
    const passRate = allResults.length > 0 ? (passingResults.length / allResults.length) * 100 : 0;

    // Calculate attendance rate
    const totalAttendanceRecords = await prisma.attendance.count();
    const presentRecords = await prisma.attendance.count({
      where: { present: true },
    });
    const attendanceRate =
      totalAttendanceRecords > 0 ? (presentRecords / totalAttendanceRecords) * 100 : 0;

    // Get subject performance
    const subjectPerformance = await prisma.subject.findMany({
      include: {
        lessons: {
          include: {
            exams: {
              include: {
                results: true,
              },
            },
            assignments: {
              include: {
                results: true,
              },
            },
          },
        },
        teachers: {
          include: {
            teacher: {
              include: {
                class: {
                  include: {
                    students: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const subjectData = subjectPerformance.map(subject => {
      const allSubjectResults: number[] = [];
      let studentCount = 0;

      // Collect all results for this subject
      subject.lessons.forEach(lesson => {
        lesson.exams.forEach(exam => {
          exam.results.forEach(result => {
            allSubjectResults.push(result.score);
          });
        });
        lesson.assignments.forEach(assignment => {
          assignment.results.forEach(result => {
            allSubjectResults.push(result.score);
          });
        });
      });

      // Count unique students from teachers' classes
      const uniqueStudents = new Set();
      subject.teachers.forEach(teacherSubject => {
        if (teacherSubject.teacher.class) {
          teacherSubject.teacher.class.students.forEach(student => {
            uniqueStudents.add(student.id);
          });
        }
      });
      studentCount = uniqueStudents.size;

      const average =
        allSubjectResults.length > 0
          ? allSubjectResults.reduce((sum, score) => sum + score, 0) / allSubjectResults.length
          : 0;

      // Simple trend calculation (mock for now, can be enhanced)
      const trend = Math.random() > 0.5 ? 'up' : 'down';

      return {
        subject: subject.name,
        average: Math.round(average * 10) / 10,
        trend,
        students: studentCount,
      };
    });

    // Calculate grade distribution from actual results
    const gradeDistribution = [
      {
        grade: 'A (80-100%)',
        count: allResults.filter(r => r.score >= 80).length,
        percentage:
          allResults.length > 0
            ? (allResults.filter(r => r.score >= 80).length / allResults.length) * 100
            : 0,
      },
      {
        grade: 'B (70-79%)',
        count: allResults.filter(r => r.score >= 70 && r.score < 80).length,
        percentage:
          allResults.length > 0
            ? (allResults.filter(r => r.score >= 70 && r.score < 80).length / allResults.length) *
              100
            : 0,
      },
      {
        grade: 'C (60-69%)',
        count: allResults.filter(r => r.score >= 60 && r.score < 70).length,
        percentage:
          allResults.length > 0
            ? (allResults.filter(r => r.score >= 60 && r.score < 70).length / allResults.length) *
              100
            : 0,
      },
      {
        grade: 'D (50-59%)',
        count: allResults.filter(r => r.score >= 50 && r.score < 60).length,
        percentage:
          allResults.length > 0
            ? (allResults.filter(r => r.score >= 50 && r.score < 60).length / allResults.length) *
              100
            : 0,
      },
      {
        grade: 'F (0-49%)',
        count: allResults.filter(r => r.score < 50).length,
        percentage:
          allResults.length > 0
            ? (allResults.filter(r => r.score < 50).length / allResults.length) * 100
            : 0,
      },
    ];

    // Get top performing students
    const studentsWithScores = await prisma.student.findMany({
      include: {
        results: true,
        grade: true,
        class: true,
      },
    });

    const topPerformers = studentsWithScores
      .map(student => {
        const totalScore = student.results.reduce((sum, result) => sum + result.score, 0);
        const averageScore = student.results.length > 0 ? totalScore / student.results.length : 0;
        const gpa = averageScore / 25; // Convert to 4.0 scale

        return {
          name: `${student.name} ${student.surname}`,
          grade: student.class?.name || `Grade ${student.grade?.level}`,
          gpa: Math.round(gpa * 100) / 100,
          subjects: student.results.length,
        };
      })
      .filter(student => student.gpa > 0)
      .sort((a, b) => b.gpa - a.gpa)
      .slice(0, 5);

    // Get class performance
    const classes = await prisma.class.findMany({
      include: {
        students: {
          include: {
            results: true,
            attendances: true,
          },
        },
      },
    });

    const classPerformance = classes.map(classItem => {
      const students = classItem.students;
      const totalResults = students.flatMap(student => student.results);
      const average =
        totalResults.length > 0
          ? totalResults.reduce((sum, result) => sum + result.score, 0) / totalResults.length
          : 0;

      // Calculate attendance for this class
      const totalAttendance = students.flatMap(student => student.attendances);
      const presentAttendance = totalAttendance.filter(att => att.present);
      const attendancePercent =
        totalAttendance.length > 0 ? (presentAttendance.length / totalAttendance.length) * 100 : 0;

      return {
        class: classItem.name,
        students: students.length,
        average: Math.round(average * 10) / 10,
        attendance: Math.round(attendancePercent * 10) / 10,
      };
    });

    const performanceData = {
      overallGPA: Math.round(overallGPA * 100) / 100,
      passRate: Math.round(passRate * 10) / 10,
      attendanceRate: Math.round(attendanceRate * 10) / 10,
      subjectPerformance: subjectData,
      gradeDistribution,
      topPerformers,
      classPerformance,
      totalStudents: await prisma.student.count(),
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: performanceData,
    });
  } catch (error) {
    console.error('Performance API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch performance data',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
