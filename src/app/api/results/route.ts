import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: List all results
export async function GET(req: NextRequest): Promise<NextResponse> {
  const results = await prisma.result.findMany({
    orderBy: { id: 'desc' },
    include: {
      exam: { include: { lesson: { include: { subject: true, class: true, teacher: true } } } },
      assignment: true,
      student: true,
    },
  });
  return NextResponse.json(results);
}

// POST: Create a new result
export async function POST(req: NextRequest): Promise<NextResponse> {
  const data = await req.json();
  const result = await prisma.result.create({
    data: {
      score: data.score,
      examId: data.examId || null,
      assignmentId: data.assignmentId || null,
      studentId: data.studentId,
    },
  });
  return NextResponse.json(result);
}
