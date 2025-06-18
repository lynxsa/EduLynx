import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Get subject by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  const subject = await prisma.subject.findUnique({
    where: { id: Number(params.id) },
  });
  if (!subject) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(subject);
}

// PUT: Update subject by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  const data = await req.json();
  const subject = await prisma.subject.update({
    where: { id: Number(params.id) },
    data: {
      name: data.name,
    },
  });
  return NextResponse.json(subject);
}

// DELETE: Delete subject by ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  await prisma.subject.delete({
    where: { id: Number(params.id) },
  });
  return NextResponse.json({ success: true });
}
