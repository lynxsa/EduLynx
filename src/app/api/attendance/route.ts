import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { parseJwt, getRoleFromRequest } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest): Promise<NextResponse> {
  const role = getRoleFromRequest(req);
  if (role !== 'TEACHER') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const attendance = await prisma.attendance.findMany();
  return NextResponse.json(attendance);
}

// Add POST (teacher only)
export async function POST(req: NextRequest): Promise<NextResponse> {
  const role = getRoleFromRequest(req);
  if (role !== 'TEACHER') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const data = await req.json();
  try {
    const attendance = await prisma.attendance.create({ data });
    return NextResponse.json(attendance, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create attendance', details: e instanceof Error ? e.message : e }, { status: 400 });
  }
}
