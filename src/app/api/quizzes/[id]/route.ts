import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Get quiz by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const quiz = await prisma.quiz.findUnique({
    where: { id: Number(params.id) },
    include: { lesson: true },
  });
  if (!quiz) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(quiz);
}

// PUT: Update quiz by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();
  const quiz = await prisma.quiz.update({
    where: { id: Number(params.id) },
    data: {
      title: data.title,
      startDate: data.startDate,
      endDate: data.endDate,
      lessonId: data.lessonId,
    },
  });
  return NextResponse.json(quiz);
}

// DELETE: Delete quiz by ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.quiz.delete({
    where: { id: Number(params.id) },
  });
  return NextResponse.json({ success: true });
}
