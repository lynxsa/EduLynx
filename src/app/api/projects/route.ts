import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        subject: true,
        class: true,
        teacher: {
          select: {
            id: true,
            name: true,
            surname: true,
          },
        },
        students: {
          select: {
            id: true,
            name: true,
            surname: true,
          },
        },
        _count: {
          select: {
            students: true,
          },
        },
      },
      orderBy: {
        dueDate: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      type,
      status,
      startDate,
      dueDate,
      subjectId,
      classId,
      teacherId,
      requirements,
      resources,
    } = body;

    const project = await prisma.project.create({
      data: {
        title,
        description,
        type,
        status: status || 'PLANNING',
        startDate: new Date(startDate),
        dueDate: new Date(dueDate),
        subjectId: subjectId ? parseInt(subjectId) : null,
        classId: classId ? parseInt(classId) : null,
        teacherId,
        requirements: requirements ? JSON.stringify(requirements) : null,
        resources: resources ? JSON.stringify(resources) : null,
      },
      include: {
        subject: true,
        class: true,
        teacher: {
          select: {
            id: true,
            name: true,
            surname: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
