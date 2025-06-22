import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get all subjects with their lessons and assignments
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
        teachers: {
          include: {
            teacher: true,
          },
        },
      },
    });

    const subjectScores = subjects.map(subject => {
      const allResults = subject.lessons.flatMap(lesson =>
        lesson.assignments.flatMap(assignment => assignment.results)
      );
      const totalScore = allResults.reduce((sum, result) => sum + (result.score || 0), 0);
      const averageScore = allResults.length > 0 ? totalScore / allResults.length : 0;

      return {
        id: subject.id,
        name: subject.name,
        averageScore: Math.round(averageScore * 100) / 100, // Round to 2 decimal places
        studentCount: 0, // We'll calculate this differently or remove this field
        totalAssignments: subject.lessons.reduce(
          (sum, lesson) => sum + lesson.assignments.length,
          0
        ),
        completedAssignments: allResults.length,
      };
    });

    const overallAverage =
      subjectScores.length > 0
        ? subjectScores.reduce((sum, subject) => sum + subject.averageScore, 0) /
          subjectScores.length
        : 0;

    return NextResponse.json({
      subjects: subjectScores,
      overallAverage: Math.round(overallAverage * 100) / 100,
    });
  } catch (error) {
    console.error('Error fetching subject scores:', error);
    return NextResponse.json({ error: 'Failed to fetch subject scores' }, { status: 500 });
  }
}
