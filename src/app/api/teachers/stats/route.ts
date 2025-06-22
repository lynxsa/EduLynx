import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get total teacher count
    const totalTeachers = await prisma.teacher.count();

    // Get teachers with recent activity (taught a lesson in the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeTeachers = await prisma.teacher.count({
      where: {
        lessons: {
          some: {
            createdAt: {
              gte: thirtyDaysAgo,
            },
          },
        },
      },
    });

    // Get subject distribution
    const subjectDistribution = await prisma.subject.findMany({
      include: {
        _count: {
          select: {
            teachers: true,
          },
        },
      },
    });

    const formattedSubjectDistribution = subjectDistribution.map(subject => ({
      subject: subject.name,
      count: subject._count.teachers,
    }));

    // Get teachers by employment status if available
    const employmentDistribution = await prisma.teacher.groupBy({
      by: ['employmentStatus'],
      _count: {
        _all: true,
      },
      where: {
        employmentStatus: {
          not: null,
        },
      },
    });

    const formattedEmploymentDistribution = employmentDistribution.map(item => ({
      status: item.employmentStatus || 'Unknown',
      count: item._count._all,
    }));

    const stats = {
      total: totalTeachers,
      active: activeTeachers,
      subjectDistribution: formattedSubjectDistribution,
      employmentDistribution: formattedEmploymentDistribution,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Teacher Stats API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch teacher statistics' }, { status: 500 });
  }
}
