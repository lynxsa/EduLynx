import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    // Search across multiple tables
    const [students, teachers, parents, classes, subjects, assignments] = await Promise.all([
      prisma.student.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { surname: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 5,
        select: {
          id: true,
          name: true,
          surname: true,
          email: true,
        },
      }),

      prisma.teacher.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { surname: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 5,
        select: {
          id: true,
          name: true,
          surname: true,
          email: true,
        },
      }),

      prisma.parent.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { surname: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 5,
        select: {
          id: true,
          name: true,
          surname: true,
          email: true,
        },
      }),

      prisma.class.findMany({
        where: {
          name: { contains: query, mode: 'insensitive' },
        },
        take: 5,
        select: {
          id: true,
          name: true,
          grade: true,
        },
      }),

      prisma.subject.findMany({
        where: {
          name: { contains: query, mode: 'insensitive' },
        },
        take: 5,
        select: {
          id: true,
          name: true,
        },
      }),

      prisma.assignment.findMany({
        where: {
          title: { contains: query, mode: 'insensitive' },
        },
        take: 5,
        select: {
          id: true,
          title: true,
          dueDate: true,
        },
      }),
    ]);

    // Format results
    const results = [
      ...students.map(student => ({
        type: 'student',
        id: student.id,
        name: `${student.name} ${student.surname}`,
        subtitle: student.email,
        href: `/list/students/${student.id}`,
      })),
      ...teachers.map(teacher => ({
        type: 'teacher',
        id: teacher.id,
        name: `${teacher.name} ${teacher.surname}`,
        subtitle: teacher.email,
        href: `/list/teachers/${teacher.id}`,
      })),
      ...parents.map(parent => ({
        type: 'parent',
        id: parent.id,
        name: `${parent.name} ${parent.surname}`,
        subtitle: parent.email,
        href: `/list/parents/${parent.id}`,
      })),
      ...classes.map(cls => ({
        type: 'class',
        id: cls.id,
        name: cls.name,
        subtitle: `Grade ${cls.grade}`,
        href: `/list/classes/${cls.id}`,
      })),
      ...subjects.map(subject => ({
        type: 'subject',
        id: subject.id,
        name: subject.name,
        subtitle: 'Subject',
        href: `/list/subjects/${subject.id}`,
      })),
      ...assignments.map(assignment => ({
        type: 'assignment',
        id: assignment.id,
        name: assignment.title,
        subtitle: `Due: ${assignment.dueDate?.toLocaleDateString() || 'No due date'}`,
        href: `/list/assignments/${assignment.id}`,
      })),
    ];

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
