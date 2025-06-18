import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Get assignment by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const assignment = await prisma.assignment.findUnique({
    where: { id: Number(params.id) },
    include: { lesson: true },
  });
  if (!assignment) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(assignment);
}

// PUT: Update assignment by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();
  const assignment = await prisma.assignment.update({
    where: { id: Number(params.id) },
    data: {
      title: data.title,
      startDate: data.startDate,
      dueDate: data.dueDate,
      lessonId: data.lessonId,
    },
  });
  return NextResponse.json(assignment);
}

// DELETE: Delete assignment by ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.assignment.delete({
    where: { id: Number(params.id) },
  });
  return NextResponse.json({ success: true });
}
