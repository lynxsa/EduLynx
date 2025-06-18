import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: List all grades (id and level only)
export async function GET(req: NextRequest): Promise<NextResponse> {
  const grades = await prisma.grade.findMany({
    select: { id: true, level: true },
    orderBy: { level: 'asc' },
  });
  return NextResponse.json(grades);
}
