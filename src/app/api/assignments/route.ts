import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { parseJwt, getRoleFromRequest } from '@/lib/auth';

const prisma = new PrismaClient();

// GET: List assignments with server-side pagination
export async function GET(req: NextRequest) {
  const role = getRoleFromRequest(req);
  if (role !== 'TEACHER' && role !== 'STUDENT') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '15', 10);
  const skip = (page - 1) * limit;

  // Teachers see all, students see their own (add filter logic as needed)
  const [assignments, total] = await Promise.all([
    prisma.assignment.findMany({
      skip,
      take: limit,
    }),
    prisma.assignment.count(),
  ]);
  return NextResponse.json({ data: assignments, total });
}

// POST: Create a new assignment
export async function POST(req: NextRequest) {
  const role = getRoleFromRequest(req);
  if (role !== 'TEACHER') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const data = await req.json();
  try {
    const assignment = await prisma.assignment.create({ data });
    return NextResponse.json(assignment, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to create assignment', details: e instanceof Error ? e.message : e },
      { status: 400 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const role = getRoleFromRequest(req);
  if (role !== 'TEACHER') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const data = await req.json();
  if (!data.id) return NextResponse.json({ error: 'Missing assignment id' }, { status: 400 });
  try {
    const assignment = await prisma.assignment.update({ where: { id: data.id }, data });
    return NextResponse.json(assignment);
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to update assignment', details: e instanceof Error ? e.message : e },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const role = getRoleFromRequest(req);
  if (role !== 'TEACHER') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing assignment id' }, { status: 400 });
  try {
    await prisma.assignment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to delete assignment', details: e instanceof Error ? e.message : e },
      { status: 400 }
    );
  }
}
