import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: List subjects with server-side pagination
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '15', 10);
  const skip = (page - 1) * limit;

  const [subjects, total] = await Promise.all([
    prisma.subject.findMany({
      orderBy: { name: 'asc' },
      skip,
      take: limit,
    }),
    prisma.subject.count(),
  ]);
  return NextResponse.json({ data: subjects, total });
}

// POST: Create a new subject
export async function POST(req: NextRequest): Promise<NextResponse> {
  const data = await req.json();
  const subject = await prisma.subject.create({
    data: {
      name: data.name,
    },
  });
  return NextResponse.json(subject);
}
