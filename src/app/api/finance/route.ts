import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const entries = await prisma.financeEntry.findMany({ orderBy: { date: 'desc' } });
  return NextResponse.json({ entries });
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const entry = await prisma.financeEntry.create({
    data: {
      title: data.title,
      amount: data.amount,
      type: data.type,
      category: data.category,
      reference: data.reference,
      notes: data.notes,
      date: new Date(data.date),
    },
  });
  return NextResponse.json(entry);
}

export async function PUT(req: NextRequest) {
  const data = await req.json();
  const entry = await prisma.financeEntry.update({
    where: { id: data.id },
    data: {
      title: data.title,
      amount: data.amount,
      type: data.type,
      category: data.category,
      reference: data.reference,
      notes: data.notes,
      date: new Date(data.date),
    },
  });
  return NextResponse.json(entry);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await prisma.financeEntry.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
