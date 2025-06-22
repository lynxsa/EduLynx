import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { Class } from '@/types/models';

function toClassInterface(classItem: any): Class {
  return {
    ...classItem,
    createdAt: classItem.createdAt.toISOString(),
    updatedAt: classItem.updatedAt.toISOString(),
  };
}

// GET: Get class by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const classItem = await prisma.class.findUnique({
    where: { id: Number(params.id) },
    include: { grade: true, supervisor: true },
  });
  if (!classItem) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(toClassInterface(classItem));
}

// PUT: Update class by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const data = await req.json();
  const classItem = await prisma.class.update({
    where: { id: Number(params.id) },
    data: {
      name: data.name,
      capacity: data.capacity,
      gradeId: data.gradeId,
      supervisorId: data.supervisorId || null,
      schoolId: data.schoolId,
    },
  });
  return NextResponse.json(toClassInterface(classItem));
}

// DELETE: Delete class by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  await prisma.class.delete({
    where: { id: Number(params.id) },
  });
  return NextResponse.json({ success: true });
}
