import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const [inbox, unread, starred, archived] = await Promise.all([
      prisma.message.count({
        where: {
          toId: userId,
          archived: false,
        },
      }),
      prisma.message.count({
        where: {
          toId: userId,
          read: false,
          archived: false,
        },
      }),
      prisma.message.count({
        where: {
          OR: [
            { toId: userId, starred: true },
            { fromId: userId, starred: true },
          ],
          archived: false,
        },
      }),
      prisma.message.count({
        where: {
          OR: [
            { toId: userId, archived: true },
            { fromId: userId, archived: true },
          ],
        },
      }),
    ]);

    return NextResponse.json({
      inbox,
      unread,
      starred,
      archived,
    });
  } catch (error) {
    console.error('Error fetching message stats:', error);
    return NextResponse.json({ error: 'Failed to fetch message stats' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
