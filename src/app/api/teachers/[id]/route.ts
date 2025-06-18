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

// GET: Get teacher by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  const teacher = await prisma.teacher.findUnique({
    where: { id: params.id },
    include: {
      class: {
        include: {
          grade: true,
          students: {
            select: {
              id: true,
              name: true,
              surname: true,
              email: true,
            }
          }
        }
      },
      subjects: {
        include: {
          subject: true
        }
      },
      lessons: {
        include: {
          subject: true,
          class: {
            include: {
              grade: true
            }
          }
        },
        orderBy: {
          startTime: 'asc'
        }
      },
      supervised: {
        include: {
          grade: true,
          students: {
            select: {
              id: true,
              name: true,
              surname: true,
            }
          }
        }
      },
      school: true,
    },
  });
  
  if (!teacher) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Calculate teaching statistics
  const totalLessons = teacher.lessons?.length || 0;
  const totalSubjects = teacher.subjects?.length || 0;
  const totalStudents = teacher.class?.students?.length || 0;
  const totalSupervisedClasses = teacher.supervised?.length || 0;
  const totalSupervisedStudents = teacher.supervised?.reduce((total: number, classItem: any) => 
    total + (classItem.students?.length || 0), 0) || 0;

  // Group lessons by day for timetable
  const timetable = teacher.lessons?.reduce((acc: any, lesson: any) => {
    const day = lesson.day;
    if (!acc[day]) acc[day] = [];
    acc[day].push({
      ...lesson,
      startTime: lesson.startTime.toISOString(),
      endTime: lesson.endTime.toISOString(),
      createdAt: lesson.createdAt.toISOString(),
      updatedAt: lesson.updatedAt.toISOString(),
    });
    return acc;
  }, {}) || {};

  // Enhanced teacher data
  const enhancedTeacher = {
    ...toTeacherInterface(teacher),
    statistics: {
      totalLessons,
      totalSubjects,
      totalStudents,
      totalSupervisedClasses,
      totalSupervisedStudents,
    },
    timetable,
    subjects: teacher.subjects?.map((st: any) => st.subject) || [],
    lessons: teacher.lessons?.map((lesson: any) => ({
      ...lesson,
      startTime: lesson.startTime.toISOString(),
      endTime: lesson.endTime.toISOString(),
      createdAt: lesson.createdAt.toISOString(),
      updatedAt: lesson.updatedAt.toISOString(),
    })) || [],
  };

  return NextResponse.json(enhancedTeacher);
}

// PUT: Update teacher by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  const data = await req.json();
  const teacher = await prisma.teacher.update({
    where: { id: params.id },
    data: {
      username: data.username,
      name: data.name,
      surname: data.surname,
      email: data.email,
      phone: data.phone,
      address: data.address,
      img: data.img || null,
      bloodType: data.bloodType,
      sex: data.sex,
      birthday: data.birthday,
      classId: data.classId,
      schoolId: data.schoolId,
    },
  });
  return NextResponse.json(toTeacherInterface(teacher));
}

// DELETE: Delete teacher by ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  await prisma.teacher.delete({
    where: { id: params.id },
  });
  return NextResponse.json({ success: true });
}
