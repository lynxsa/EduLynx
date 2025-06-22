import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get daily registration stats for the last 7 days
    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const count = await prisma.student.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      dailyStats.push({
        date: date.toISOString().split('T')[0],
        count,
      });
    }

    // Get this week's total
    const thisWeekTotal = await prisma.student.count({
      where: {
        createdAt: {
          gte: oneWeekAgo,
        },
      },
    });

    // Get previous week's total
    const previousWeekTotal = await prisma.student.count({
      where: {
        createdAt: {
          gte: twoWeeksAgo,
          lt: oneWeekAgo,
        },
      },
    });

    // Get this month's total
    const monthlyTotal = await prisma.student.count({
      where: {
        createdAt: {
          gte: oneMonthAgo,
        },
      },
    });

    return NextResponse.json({
      dailyStats,
      thisWeekTotal,
      previousWeekTotal,
      monthlyTotal,
    });
  } catch (error) {
    console.error('Error fetching registration data:', error);
    return NextResponse.json({ error: 'Failed to fetch registration data' }, { status: 500 });
  }
}
