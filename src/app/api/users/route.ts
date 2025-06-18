import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { parseJwt, getRoleFromRequest } from '@/lib/auth';
import type { User } from '@/types/models';

const prisma = new PrismaClient();

function toUserInterface(user: any): User {
  return {
    ...user,
    dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString() : null,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const role = getRoleFromRequest(req);
  if (role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const users = await prisma.user.findMany();
  const typedUsers: User[] = users.map(toUserInterface);
  return NextResponse.json(typedUsers);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const role = getRoleFromRequest(req);
  if (role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const data: User = await req.json();
  try {
    const user = await prisma.user.create({ data });
    return NextResponse.json(toUserInterface(user), { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create user', details: e instanceof Error ? e.message : 'Unknown error' }, { status: 400 });
  }
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  const role = getRoleFromRequest(req);
  if (role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const data: Partial<User> = await req.json();
  if (!data.id) return NextResponse.json({ error: 'Missing user id' }, { status: 400 });
  try {
    const user = await prisma.user.update({ where: { id: data.id }, data });
    return NextResponse.json(toUserInterface(user));
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update user', details: e instanceof Error ? e.message : 'Unknown error' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  const role = getRoleFromRequest(req);
  if (role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing user id' }, { status: 400 });
  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete user', details: e instanceof Error ? e.message : 'Unknown error' }, { status: 400 });
  }
}
