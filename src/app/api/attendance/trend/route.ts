import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get attendance trend for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get raw attendance data grouped by date
    const attendanceData = await prisma.attendance.findMany({
      where: {
        date: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        date: true,
        present: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Group by date and calculate percentages
    const dailyStats = new Map<string, { present: number; total: number }>();

    attendanceData.forEach(record => {
      const dateStr = record.date.toISOString().split('T')[0];
      const existing = dailyStats.get(dateStr) || { present: 0, total: 0 };

      existing.total += 1;
      if (record.present) {
        existing.present += 1;
      }

      dailyStats.set(dateStr, existing);
    });

    // Convert to array format for charts
    const trend = Array.from(dailyStats.entries()).map(([date, stats]) => ({
      date,
      percentage: stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0,
      present: stats.present,
      total: stats.total,
    }));

    return NextResponse.json({ trend });
  } catch (error) {
    console.error('Attendance Trend API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch attendance trend' }, { status: 500 });
  }
}
