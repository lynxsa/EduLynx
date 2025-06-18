import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: List all lessons with full info
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const teacherId = searchParams.get('teacherId');
  const studentId = searchParams.get('studentId');

  let where: any = {};
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
      return NextResponse.json({ data: [] });
    }
  }

  const lessons = await prisma.lesson.findMany({
    where,
    orderBy: { startTime: 'asc' },
    include: {
      subject: true,
      class: true,
      teacher: true,
    },
  });
  // Format for BigCalendar: { title, start, end, ... }
  const events = lessons.map(lesson => ({
    id: lesson.id,
    title: `${lesson.subject?.name || 'Lesson'} (${lesson.class?.name || ''})`,
    start: lesson.startTime,
    end: lesson.endTime,
    subject: lesson.subject,
    class: lesson.class,
    teacher: lesson.teacher,
  }));
  return NextResponse.json({ data: events });
}
