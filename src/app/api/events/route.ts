import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: List all events
export async function GET(req: NextRequest): Promise<NextResponse> {
  const events = await prisma.event.findMany({
    orderBy: { startTime: 'desc' },
    include: { class: true },
  });
  return NextResponse.json(events);
}

// POST: Create a new event
export async function POST(req: NextRequest): Promise<NextResponse> {
  const data = await req.json();
  const event = await prisma.event.create({
    data: {
      title: data.title,
      description: data.description,
      startTime: data.startTime,
      endTime: data.endTime,
      classId: data.classId || null,
    },
  });
  return NextResponse.json(event);
}
