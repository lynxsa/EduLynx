import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { parseJwt, getRoleFromRequest } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest): Promise<NextResponse> {
  const role = getRoleFromRequest(req);
  if (role !== 'TEACHER' && role !== 'STUDENT') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const attempts = await prisma.quizAttempt.findMany();
  return NextResponse.json(attempts);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const role = getRoleFromRequest(req);
  if (role !== 'STUDENT') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const data = await req.json();
  try {
    const attempt = await prisma.quizAttempt.create({ data });
    return NextResponse.json(attempt, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create attempt', details: e instanceof Error ? e.message : e }, { status: 400 });
  }
}
