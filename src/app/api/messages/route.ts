import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type') || 'inbox';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    let where: any = {};

    switch (type) {
      case 'inbox':
        where = {
          toId: userId,
          archived: false,
        };
        break;
      case 'sent':
        where = {
          fromId: userId,
          archived: false,
        };
        break;
      case 'starred':
        where = {
          OR: [
            { toId: userId, starred: true },
            { fromId: userId, starred: true },
          ],
          archived: false,
        };
        break;
      case 'archived':
        where = {
          OR: [
            { toId: userId, archived: true },
            { fromId: userId, archived: true },
          ],
        };
        break;
      default:
        where = {
          OR: [{ toId: userId }, { fromId: userId }],
          archived: false,
        };
    }

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where,
        include: {
          from: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
            },
          },
          to: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.message.count({ where }),
    ]);

    const formattedMessages = messages.map(message => ({
      id: message.id,
      from: `${message.from.firstName} ${message.from.lastName}`,
      to: `${message.to.firstName} ${message.to.lastName}`,
      subject: message.subject,
      preview: message.preview,
      timestamp: message.createdAt.toISOString(),
      read: message.read,
      starred: message.starred,
      priority: message.priority.toLowerCase(),
      type: type,
      content: message.content,
    }));

    return NextResponse.json({
      data: formattedMessages,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const { subject, content, fromId, toId, priority = 'NORMAL' } = await request.json();

    if (!subject || !content || !fromId || !toId) {
      return NextResponse.json(
        { error: 'Subject, content, fromId, and toId are required' },
        { status: 400 }
      );
    }

    // Generate preview from content (first 100 characters)
    const preview = content.length > 100 ? content.substring(0, 100) + '...' : content;

    const message = await prisma.message.create({
      data: {
        subject,
        content,
        preview,
        fromId,
        toId,
        priority: priority.toUpperCase(),
      },
      include: {
        from: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        to: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      id: message.id,
      from: `${message.from.firstName} ${message.from.lastName}`,
      to: `${message.to.firstName} ${message.to.lastName}`,
      subject: message.subject,
      preview: message.preview,
      timestamp: message.createdAt.toISOString(),
      read: message.read,
      starred: message.starred,
      priority: message.priority.toLowerCase(),
      type: 'sent',
    });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { messageId, read, starred, archived } = await request.json();

    if (!messageId) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (typeof read === 'boolean') updateData.read = read;
    if (typeof starred === 'boolean') updateData.starred = starred;
    if (typeof archived === 'boolean') updateData.archived = archived;

    const message = await prisma.message.update({
      where: { id: messageId },
      data: updateData,
    });

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
