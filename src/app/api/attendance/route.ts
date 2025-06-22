import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Get overall attendance statistics
    const totalRecords = await prisma.attendance.count();
    const presentRecords = await prisma.attendance.count({
      where: { present: true },
    });

    const attendanceRate = totalRecords > 0 ? (presentRecords / totalRecords) * 100 : 0;

    // Get today's attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayTotal = await prisma.attendance.count({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const todayPresent = await prisma.attendance.count({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
        present: true,
      },
    });

    const todayRate = todayTotal > 0 ? (todayPresent / todayTotal) * 100 : 0;

    return NextResponse.json({
      overall: {
        rate: Math.round(attendanceRate * 10) / 10,
        total: totalRecords,
        present: presentRecords,
      },
      today: {
        rate: Math.round(todayRate * 10) / 10,
        total: todayTotal,
        present: todayPresent,
      },
    });
  } catch (error) {
    console.error('Attendance API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch attendance data' }, { status: 500 });
  }
}

// Add POST (teacher only)
export async function POST(req: NextRequest): Promise<NextResponse> {
  // TODO: Add proper authentication check
  // const role = getRoleFromRequest(req);
  // if (role !== 'TEACHER') {
  //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  // }
  const data = await req.json();
  try {
    const attendance = await prisma.attendance.create({ data });
    return NextResponse.json(attendance, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to create attendance', details: e instanceof Error ? e.message : e },
      { status: 400 }
    );
  }
}
