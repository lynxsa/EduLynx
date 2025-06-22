import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { Teacher } from '@/types/models';

function toTeacherInterface(teacher: any): Teacher {
  return {
    ...teacher,
    createdAt: teacher.createdAt.toISOString(),
    birthday: teacher.birthday.toISOString(),
  };
}

// GET: List teachers with server-side pagination
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '15', 10);
  const skip = (page - 1) * limit;

  const [teachers, total] = await Promise.all([
    prisma.teacher.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        surname: true,
        email: true,
        phone: true,
        address: true,
        img: true,
        bloodType: true,
        sex: true,
        createdAt: true,
        birthday: true,
        classId: true,
        schoolId: true,
        userId: true,
      },
      orderBy: { name: 'asc' },
      skip,
      take: limit,
    }),
    prisma.teacher.count(),
  ]);
  const typedTeachers: Teacher[] = teachers.map(toTeacherInterface);
  return NextResponse.json({ data: typedTeachers, total });
}
