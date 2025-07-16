import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET: List all events with role-based access
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role') as 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
    const userId = searchParams.get('userId');

    // **ROLE-BASED ACCESS**: Filter events by user role
    if (role && userId) {
      console.log(`🔧 [Events API] Fetching events for ${role} ${userId}`);

      let events;

      switch (role) {
        case 'ADMIN':
          events = await prisma.event.findMany({
            orderBy: { startTime: 'desc' },
            include: {
              class: {
                include: {
                  grade: true,
                },
              },
            },
          });
          break;

        case 'TEACHER':
          // Teacher sees events for their classes only
          const teacherLessons = await prisma.lesson.findMany({
            where: { teacherId: userId },
            select: { classId: true },
          });

          const classIds = Array.from(new Set(teacherLessons.map(lesson => lesson.classId)));

          events = await prisma.event.findMany({
            where: { classId: { in: classIds } },
            orderBy: { startTime: 'desc' },
            include: {
              class: {
                include: {
                  grade: true,
                },
              },
            },
          });
          break;

        case 'STUDENT':
          // Student sees events for their class
          const student = await prisma.student.findUnique({
            where: { id: userId },
            select: { classId: true },
          });

          if (!student?.classId) {
            return NextResponse.json([]);
          }

          events = await prisma.event.findMany({
            where: { classId: student.classId },
            orderBy: { startTime: 'desc' },
            include: {
              class: {
                include: {
                  grade: true,
                },
              },
            },
          });
          break;

        case 'PARENT':
          // Parent sees events for their children's classes
          const children = await prisma.student.findMany({
            where: { parentId: userId },
            select: { classId: true },
          });

          const parentClassIds = Array.from(
            new Set(children.map(child => child.classId).filter(Boolean))
          );

          events = await prisma.event.findMany({
            where: { classId: { in: parentClassIds } },
            orderBy: { startTime: 'desc' },
            include: {
              class: {
                include: {
                  grade: true,
                },
              },
            },
          });
          break;

        default:
          events = [];
      }

      console.log(`✅ [Events API] ${role} ${userId} fetched ${events.length} events`);
      return NextResponse.json(events);
    }

    // **ADMIN DASHBOARD**: Default to all events for admin dashboard
    console.log('🔧 [Events API] Fetching all events for admin dashboard');
    const events = await prisma.event.findMany({
      orderBy: { startTime: 'desc' },
      include: {
        class: {
          include: {
            grade: true,
          },
        },
      },
    });

    console.log(`✅ [Events API] Fetched ${events.length} events`);
    return NextResponse.json(events);
  } catch (error) {
    console.error('❌ [Events API] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

// POST: Create a new event
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const data = await req.json();
    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        classId: data.classId,
      },
      include: {
        class: {
          include: {
            grade: true,
          },
        },
      },
    });

    console.log(`✅ [Events API] Created event: ${event.title}`);
    return NextResponse.json(event);
  } catch (error) {
    console.error('❌ [Events API] Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
