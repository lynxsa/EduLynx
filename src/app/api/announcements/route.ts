import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { parseJwt, getRoleFromRequest } from '@/lib/auth';

const prisma = new PrismaClient();

// GET: List announcements with server-side pagination
export async function GET(req: NextRequest): Promise<NextResponse> {
  const role = getRoleFromRequest(req);
  if (role !== 'ADMIN' && role !== 'TEACHER') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '15', 10);
  const skip = (page - 1) * limit;

  const [announcements, total] = await Promise.all([
    prisma.announcement.findMany({
      orderBy: { date: 'desc' },
      include: { class: true },
      skip,
      take: limit,
    }),
    prisma.announcement.count(),
  ]);
  return NextResponse.json({ data: announcements, total });
}

// POST: Create a new announcement
export async function POST(req: NextRequest): Promise<NextResponse> {
  const role = getRoleFromRequest(req);
  if (role !== 'ADMIN' && role !== 'TEACHER') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const data = await req.json();
  try {
    const announcement = await prisma.announcement.create({ data });
    return NextResponse.json(announcement, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create announcement', details: e instanceof Error ? e.message : e }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  const role = getRoleFromRequest(req);
  if (role !== 'ADMIN' && role !== 'TEACHER') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing announcement id' }, { status: 400 });
  try {
    await prisma.announcement.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete announcement', details: e instanceof Error ? e.message : e }, { status: 400 });
  }
}
