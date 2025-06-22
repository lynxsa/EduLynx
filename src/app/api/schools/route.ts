import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { parseJwt, getRoleFromRequest } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const role = getRoleFromRequest(req);
  if (role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const schools = await prisma.school.findMany();
  return NextResponse.json(schools);
}

export async function POST(req: NextRequest) {
  const role = getRoleFromRequest(req);
  if (role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const data = await req.json();
  try {
    const school = await prisma.school.create({ data });
    return NextResponse.json(school, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to create school', details: e instanceof Error ? e.message : e },
      { status: 400 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const role = getRoleFromRequest(req);
  if (role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const data = await req.json();
  if (!data.id) return NextResponse.json({ error: 'Missing school id' }, { status: 400 });
  try {
    const school = await prisma.school.update({ where: { id: data.id }, data });
    return NextResponse.json(school);
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to update school', details: e instanceof Error ? e.message : e },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const role = getRoleFromRequest(req);
  if (role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing school id' }, { status: 400 });
  try {
    await prisma.school.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to delete school', details: e instanceof Error ? e.message : e },
      { status: 400 }
    );
  }
}
