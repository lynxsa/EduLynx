import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get basic student counts
    const totalStudents = await prisma.student.count();

    // Get students by gender
    const genderDistribution = await prisma.student.groupBy({
      by: ['sex'],
      _count: {
        _all: true,
      },
    });

    // Format the data
    const formattedGenderDistribution = genderDistribution.map(item => ({
      gender: item.sex,
      count: item._count._all,
    }));

    // Get grade distribution with gender breakdown
    const gradeDistribution = await prisma.grade.findMany({
      include: {
        students: {
          select: {
            sex: true,
          },
        },
      },
    });

    // Format grade distribution with gender breakdown
    const formattedGradeDistribution = gradeDistribution.map(grade => {
      const maleCount = grade.students.filter(s => s.sex === 'MALE').length;
      const femaleCount = grade.students.filter(s => s.sex === 'FEMALE').length;

      return {
        grade: `${grade.level}`,
        total: grade.students.length,
        male: maleCount,
        female: femaleCount,
      };
    });

    // Simple grade distribution for backward compatibility
    const simpleGradeDistribution = gradeDistribution.map(grade => ({
      grade: `Grade ${grade.level}`,
      count: grade.students.length,
    }));

    // Calculate active students (those with recent attendance)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeStudents = await prisma.student.count({
      where: {
        attendances: {
          some: {
            date: {
              gte: thirtyDaysAgo,
            },
          },
        },
      },
    });

    const stats = {
      total: totalStudents,
      active: activeStudents,
      enrolled: totalStudents, // Assuming all students in DB are enrolled
      genderDistribution: formattedGenderDistribution,
      gradeDistribution: simpleGradeDistribution,
      gradeDistributionDetailed: formattedGradeDistribution,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Student Stats API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch student statistics' }, { status: 500 });
  }
}
