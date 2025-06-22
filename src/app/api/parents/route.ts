import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { Parent } from '@/types/models';

function toParentInterface(parent: any): Parent {
  return {
    ...parent,
    createdAt: parent.createdAt ? parent.createdAt.toISOString() : '',
  };
}

// GET: List parents with server-side pagination
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '15', 10);
  const skip = (page - 1) * limit;

  const [parents, total] = await Promise.all([
    prisma.parent.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        surname: true,
        email: true,
        phone: true,
        address: true,
        img: true,
        sex: true,
        createdAt: true,
        schoolId: true,
        userId: true,
      },
      orderBy: { name: 'asc' },
      skip,
      take: limit,
    }),
    prisma.parent.count(),
  ]);
  const typedParents: Parent[] = parents.map(toParentInterface);
  return NextResponse.json({ data: typedParents, total });
}
