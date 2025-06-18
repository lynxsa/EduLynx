import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { parseJwt, getRoleFromRequest } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest): Promise<NextResponse> {
  const role = getRoleFromRequest(req);
  if (role !== 'TEACHER' && role !== 'STUDENT') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  // Teachers see all, students see their own (add filter logic as needed)
  const submissions = await prisma.submission.findMany();
  return NextResponse.json(submissions);
}

// Add POST (student), GET (teacher/student), role checks
export async function POST(req: NextRequest): Promise<NextResponse> {
  const role = getRoleFromRequest(req);
  if (role !== 'STUDENT') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const data = await req.json();
  try {
    const submission = await prisma.submission.create({ data });
    return NextResponse.json(submission, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create submission', details: e instanceof Error ? e.message : e }, { status: 400 });
  }
}
