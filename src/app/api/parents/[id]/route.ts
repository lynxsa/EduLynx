import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { Parent } from '@/types/models';

function toParentInterface(parent: any): Parent {
  return {
    ...parent,
    createdAt: parent.createdAt ? parent.createdAt.toISOString() : '',
    children: Array.isArray(parent.students) ? parent.students.map((s: any) => s.id) : [],
  };
}

// GET: Get parent by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const parent = await prisma.parent.findUnique({
    where: { id: params.id },
    include: { students: true, school: true },
  });
  if (!parent) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(toParentInterface(parent));
}

// PUT: Update parent by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();
  const parent = await prisma.parent.update({
    where: { id: params.id },
    data: {
      username: data.username,
      name: data.name,
      surname: data.surname,
      email: data.email,
      phone: data.phone,
      address: data.address,
      img: data.img || null,
      sex: data.sex,
      schoolId: data.schoolId,
    },
  });
  return NextResponse.json(toParentInterface(parent));
}

// DELETE: Delete parent by ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.parent.delete({
    where: { id: params.id },
  });
  return NextResponse.json({ success: true });
}
