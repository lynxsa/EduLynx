import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET: List all exams with role-based access
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role') as 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
    const userId = searchParams.get('userId');

    // **ROLE-BASED ACCESS**: Filter exams by user role
    if (role && userId) {
      console.log(`🔧 [Exams API] Fetching exams for ${role} ${userId}`);

      let exams;

      switch (role) {
        case 'ADMIN':
          exams = await prisma.exam.findMany({
            orderBy: { startTime: 'desc' },
            include: { lesson: { include: { subject: true, class: true, teacher: true } } },
          });
          break;

        case 'TEACHER':
          // Teacher sees exams for their lessons only
          const teacherLessons = await prisma.lesson.findMany({
            where: { teacherId: userId },
            select: { id: true },
          });

          const lessonIds = teacherLessons.map(lesson => lesson.id);

          exams = await prisma.exam.findMany({
            where: { lessonId: { in: lessonIds } },
            orderBy: { startTime: 'desc' },
            include: { lesson: { include: { subject: true, class: true, teacher: true } } },
          });
          break;

        case 'STUDENT':
          // Student sees exams for their class
          const student = await prisma.student.findUnique({
            where: { id: userId },
            include: { class: { include: { lessons: true } } },
          });

          if (!student?.class) {
            return NextResponse.json([]);
          }

          const studentLessonIds = student.class.lessons.map(lesson => lesson.id);

          exams = await prisma.exam.findMany({
            where: { lessonId: { in: studentLessonIds } },
            orderBy: { startTime: 'desc' },
            include: { lesson: { include: { subject: true, class: true, teacher: true } } },
          });
          break;

        case 'PARENT':
          // Parent sees exams for their children's classes
          const children = await prisma.student.findMany({
            where: { parentId: userId },
            include: { class: { include: { lessons: true } } },
          });

          const allLessonIds = children
            .flatMap(child => child.class?.lessons || [])
            .map(lesson => lesson.id);

          exams = await prisma.exam.findMany({
            where: { lessonId: { in: allLessonIds } },
            orderBy: { startTime: 'desc' },
            include: { lesson: { include: { subject: true, class: true, teacher: true } } },
          });
          break;

        default:
          exams = [];
      }

      console.log(`✅ [Exams API] ${role} ${userId} fetched ${exams.length} exams`);
      return NextResponse.json(exams);
    }

    // **ADMIN DASHBOARD**: Default to all exams for admin dashboard
    console.log('🔧 [Exams API] Fetching all exams for admin dashboard');
    const exams = await prisma.exam.findMany({
      orderBy: { startTime: 'desc' },
      include: { lesson: { include: { subject: true, class: true, teacher: true } } },
    });

    console.log(`✅ [Exams API] Fetched ${exams.length} exams`);
    return NextResponse.json(exams);
  } catch (error) {
    console.error('❌ [Exams API] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch exams' }, { status: 500 });
  }
}

// POST: Create a new exam
export async function POST(req: NextRequest): Promise<NextResponse> {
  const data = await req.json();
  const exam = await prisma.exam.create({
    data: {
      title: data.title,
      startTime: data.startTime,
      endTime: data.endTime,
      lessonId: data.lessonId,
    },
  });
  return NextResponse.json(exam);
}
