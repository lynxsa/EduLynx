import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const classId = parseInt(params.id);

    // Fetch class timetable with all lessons
    const classData = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        lessons: {
          include: {
            subject: true,
            teacher: {
              select: {
                id: true,
                name: true,
                surname: true,
                email: true,
              },
            },
          },
          orderBy: [{ day: 'asc' }, { startTime: 'asc' }],
        },
        grade: true,
        supervisor: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true,
          },
        },
        students: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true,
          },
        },
      },
    });

    if (!classData) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    // Group lessons by day for timetable view
    const timetable = classData.lessons.reduce((acc: any, lesson: any) => {
      const day = lesson.day;
      if (!acc[day]) acc[day] = [];
      acc[day].push({
        id: lesson.id,
        name: lesson.name,
        startTime: lesson.startTime.toISOString(),
        endTime: lesson.endTime.toISOString(),
        subject: lesson.subject,
        teacher: lesson.teacher,
      });
      return acc;
    }, {});

    // Calculate class statistics
    const totalLessons = classData.lessons.length;
    const totalStudents = classData.students.length;
    const subjectsCount = new Set(classData.lessons.map((l: any) => l.subjectId)).size;
    const teachersCount = new Set(classData.lessons.map((l: any) => l.teacherId)).size;

    const response = {
      class: {
        id: classData.id,
        name: classData.name,
        capacity: classData.capacity,
        roomNumber: classData.roomNumber,
        grade: classData.grade,
        supervisor: classData.supervisor,
        createdAt: classData.createdAt.toISOString(),
        updatedAt: classData.updatedAt.toISOString(),
      },
      timetable,
      students: classData.students,
      statistics: {
        totalLessons,
        totalStudents,
        subjectsCount,
        teachersCount,
        capacityUsed: Math.round((totalStudents / classData.capacity) * 100),
      },
      lessons: classData.lessons.map((lesson: any) => ({
        ...lesson,
        startTime: lesson.startTime.toISOString(),
        endTime: lesson.endTime.toISOString(),
        createdAt: lesson.createdAt.toISOString(),
        updatedAt: lesson.updatedAt.toISOString(),
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching class timetable:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
