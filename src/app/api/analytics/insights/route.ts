import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get data by class
    const classesByStudentCount = await prisma.class.findMany({
      include: {
        _count: {
          select: {
            students: true,
          },
        },
      },
      orderBy: {
        students: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    const byClass = classesByStudentCount.map((cls: any) => ({
      name: cls.name,
      studentCount: cls._count.students,
    }));

    // Get data by subject (average scores from lessons and assignments)
    const subjects = await prisma.subject.findMany({
      include: {
        lessons: {
          include: {
            assignments: {
              include: {
                results: true,
              },
            },
          },
        },
      },
    });

    const bySubject = subjects
      .map((subject: any) => {
        const allResults = subject.lessons.flatMap((lesson: any) =>
          lesson.assignments.flatMap((assignment: any) => assignment.results)
        );
        const averageScore =
          allResults.length > 0
            ? allResults.reduce((sum: number, result: any) => sum + (result.score || 0), 0) /
              allResults.length
            : 0;

        return {
          name: subject.name,
          averageScore: Math.round(averageScore * 100) / 100,
        };
      })
      .slice(0, 8);

    // Get data by gender
    const genderDistribution = await prisma.student.groupBy({
      by: ['gender'],
      _count: {
        id: true,
      },
    });

    const byGender = genderDistribution.map((item: any) => ({
      name: item.gender || 'Not specified',
      count: item._count.id,
    }));

    // Mock grade progress data (would be calculated from historical data)
    const gradeProgress = [
      { month: 'Jan', averageScore: 75 },
      { month: 'Feb', averageScore: 77 },
      { month: 'Mar', averageScore: 79 },
      { month: 'Apr', averageScore: 76 },
      { month: 'May', averageScore: 81 },
      { month: 'Jun', averageScore: 83 },
    ];

    // Calculate summary
    const totalStudents = await prisma.student.count();
    const overallAverageScore =
      bySubject.length > 0
        ? bySubject.reduce((sum: number, subject: any) => sum + subject.averageScore, 0) /
          bySubject.length
        : 0;

    const insights = {
      byClass,
      bySubject,
      byGender,
      gradeProgress,
      summary: {
        totalRecords: totalStudents,
        averagePerformance: Math.round(overallAverageScore),
      },
    };

    return NextResponse.json(insights);
  } catch (error) {
    console.error('Error fetching insights data:', error);
    return NextResponse.json({ error: 'Failed to fetch insights data' }, { status: 500 });
  }
}
