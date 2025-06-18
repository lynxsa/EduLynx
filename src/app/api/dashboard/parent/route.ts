import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId');
    if (!parentId) {
      return NextResponse.json({ error: 'Missing parentId' }, { status: 400 });
    }

    // Get all children for this parent, include health info
    const children = await prisma.student.findMany({
      where: { parentId },
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
    const childIds = children.map(child => child.id);

    // Calculate overall attendance for all children
    let totalAttendance = 0;
    let presentAttendance = 0;
    if (childIds.length > 0) {
      totalAttendance = await prisma.attendance.count({ where: { studentId: { in: childIds } } });
      presentAttendance = await prisma.attendance.count({ where: { studentId: { in: childIds }, present: true } });
    }
    const overallAttendance = totalAttendance > 0 ? Math.round((presentAttendance / totalAttendance) * 100) : 0;

    // Total results for all children
    const totalResults = await prisma.result.count({ where: { studentId: { in: childIds } } });

    // Notifications (stub: count all announcements)
    const notifications = await prisma.announcement.count();

    // Upcoming events (next 14 days)
    const upcomingEvents = await prisma.event.findMany({
      where: { startTime: { gte: new Date(), lte: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) } },
      orderBy: { startTime: 'asc' },
      take: 2
    });

    // Parent info
    const parent = await prisma.parent.findUnique({ where: { id: parentId } });

    return NextResponse.json({
      metrics: {
        totalChildren: children.length,
        notifications,
        overallAttendance,
        totalResults
      },
      children,
      upcomingEvents,
      parent
    });
  } catch (error) {
    console.error('Parent Dashboard API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch parent dashboard data' },
      { status: 500 }
    );
  }
}
