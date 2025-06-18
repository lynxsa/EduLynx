import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: List all exams
export async function GET(req: NextRequest): Promise<NextResponse> {
  const exams = await prisma.exam.findMany({
    orderBy: { startTime: 'desc' },
    include: { lesson: { include: { subject: true, class: true, teacher: true } } },
  });
  return NextResponse.json(exams);
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
