import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET: List all lessons with full info
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get('teacherId');
    const studentId = searchParams.get('studentId');
    const classId = searchParams.get('classId');

    const where: any = {};

    if (teacherId) {
      where.teacherId = teacherId;
    }

    if (studentId) {
      // Find the student's classId
      const student = await prisma.student.findUnique({ where: { id: studentId } });
      if (student && student.classId) {
        where.classId = student.classId;
      } else {
        // If no class, return empty
        return NextResponse.json({
          success: true,
          lessons: [],
          count: 0,
        });
      }
    }

    if (classId) {
      where.classId = parseInt(classId);
    }

    const lessons = await prisma.lesson.findMany({
      where,
      orderBy: [{ day: 'asc' }, { startTime: 'asc' }],
      include: {
        subject: {
          select: {
            id: true,
            name: true,
          },
        },
        class: {
          select: {
            id: true,
            name: true,
            roomNumber: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
            surname: true,
          },
        },
      },
    });

    console.log(`✅ [Lessons API] Fetched ${lessons.length} lessons`);

    // Format for BigCalendar compatibility
    const events = lessons.map(lesson => ({
      id: lesson.id,
      title: `${lesson.subject?.name || 'Lesson'} (${lesson.class?.name || ''})`,
      start: lesson.startTime,
      end: lesson.endTime,
      subject: lesson.subject,
      class: lesson.class,
      teacher: lesson.teacher,
    }));

    return NextResponse.json({
      success: true,
      lessons,
      events, // For BigCalendar compatibility
      count: lessons.length,
      data: events, // For backwards compatibility
    });
  } catch (error) {
    console.error('❌ [Lessons API] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch lessons',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
