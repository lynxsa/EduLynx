import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { parseJwt, getRoleFromRequest } from '@/lib/auth';

const prisma = new PrismaClient();

// GET: List all quizzes
export async function GET(req: NextRequest) {
  const role = getRoleFromRequest(req);
  if (role !== 'TEACHER' && role !== 'STUDENT') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const quizzes = await prisma.quiz.findMany({
    include: { lesson: true },
    orderBy: { startDate: 'asc' },
  });
  return NextResponse.json(quizzes);
}

// POST: Create a new quiz
export async function POST(req: NextRequest) {
  const role = getRoleFromRequest(req);
  if (role !== 'TEACHER') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const data = await req.json();
  try {
    const quiz = await prisma.quiz.create({ data });
    return NextResponse.json(quiz, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to create quiz', details: e instanceof Error ? e.message : e },
      { status: 400 }
    );
  }
}

// PUT: Update an existing quiz
export async function PUT(req: NextRequest) {
  const role = getRoleFromRequest(req);
  if (role !== 'TEACHER') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const data = await req.json();
  if (!data.id) return NextResponse.json({ error: 'Missing quiz id' }, { status: 400 });
  try {
    const quiz = await prisma.quiz.update({ where: { id: data.id }, data });
    return NextResponse.json(quiz);
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to update quiz', details: e instanceof Error ? e.message : e },
      { status: 400 }
    );
  }
}

// DELETE: Remove a quiz
export async function DELETE(req: NextRequest) {
  const role = getRoleFromRequest(req);
  if (role !== 'TEACHER') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing quiz id' }, { status: 400 });
  try {
    await prisma.quiz.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to delete quiz', details: e instanceof Error ? e.message : e },
      { status: 400 }
    );
  }
}
