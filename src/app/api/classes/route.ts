import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { parseJwt, getRoleFromRequest } from '@/lib/auth';
import type { Class } from '@/types/models';

const prisma = new PrismaClient();

function toClassInterface(classItem: any): Class {
  return {
    ...classItem,
    createdAt: classItem.createdAt.toISOString(),
    updatedAt: classItem.updatedAt.toISOString(),
  };
}

// GET: List classes with server-side pagination
export async function GET(req: NextRequest): Promise<NextResponse> {
  const role = getRoleFromRequest(req);
  if (role !== 'ADMIN' && role !== 'TEACHER') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '15', 10);
  const skip = (page - 1) * limit;

  const [classes, total] = await Promise.all([
    prisma.class.findMany({
      include: { grade: true, supervisor: true },
      orderBy: { name: 'asc' },
      skip,
      take: limit,
    }),
    prisma.class.count(),
  ]);
  const typedClasses: Class[] = classes.map(toClassInterface);
  return NextResponse.json({ data: typedClasses, total });
}

// POST: Create a new class
export async function POST(req: NextRequest): Promise<NextResponse> {
  const role = getRoleFromRequest(req);
  if (role !== 'ADMIN' && role !== 'TEACHER') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const data = await req.json();
  try {
    const newClass = await prisma.class.create({ data });
    return NextResponse.json(newClass, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create class', details: e instanceof Error ? e.message : e }, { status: 400 });
  }
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  const role = getRoleFromRequest(req);
  if (role !== 'ADMIN' && role !== 'TEACHER') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const data = await req.json();
  if (!data.id) return NextResponse.json({ error: 'Missing class id' }, { status: 400 });
  try {
    const updatedClass = await prisma.class.update({ where: { id: data.id }, data });
    return NextResponse.json(updatedClass);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update class', details: e instanceof Error ? e.message : e }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  const role = getRoleFromRequest(req);
  if (role !== 'ADMIN' && role !== 'TEACHER') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing class id' }, { status: 400 });
  try {
    await prisma.class.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete class', details: e instanceof Error ? e.message : e }, { status: 400 });
  }
}
