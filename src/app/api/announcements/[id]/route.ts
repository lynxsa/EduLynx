import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Get announcement by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const announcement = await prisma.announcement.findUnique({
    where: { id: Number(params.id) },
    include: { class: true },
  });
  if (!announcement) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(announcement);
}

// PUT: Update announcement by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const data = await req.json();
  const announcement = await prisma.announcement.update({
    where: { id: Number(params.id) },
    data: {
      title: data.title,
      description: data.description,
      date: data.date,
      classId: data.classId || null,
    },
  });
  return NextResponse.json(announcement);
}

// DELETE: Delete announcement by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  await prisma.announcement.delete({
    where: { id: Number(params.id) },
  });
  return NextResponse.json({ success: true });
}
