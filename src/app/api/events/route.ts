import {
  createErrorResponse,
  createPaginatedResponse,
  createResponse,
  getPaginationParams,
  getSearchParams,
  withAuth,
} from '@/lib/api-utils';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

// GET /api/events - List events
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      const { page, limit, skip } = getPaginationParams(request);
      const { search, sortOrder, filters } = getSearchParams(request);
      let { sortBy } = getSearchParams(request);

      // Event model doesn't have createdAt, so default to startTime
      if (sortBy === 'createdAt') {
        sortBy = 'startTime';
      }

      // Build where clause
      const where: any = {};

      // Filter by school if user has schoolId
      if (user.schoolId) {
        where.class = {
          schoolId: user.schoolId,
        };
      }

      // Filter by class if provided
      if (filters.classId) {
        where.classId = parseInt(filters.classId);
      }

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      // Date range filtering
      const now = new Date();
      const startDate = filters.startDate ? new Date(filters.startDate) : now;
      const endDate = filters.endDate
        ? new Date(filters.endDate)
        : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

      where.startTime = {
        gte: startDate,
        lte: endDate,
      };

      // Get events with count
      const [events, total] = await Promise.all([
        prisma.event.findMany({
          where,
          include: {
            class: {
              select: { name: true, id: true },
            },
          },
          orderBy: {
            [sortBy]: sortOrder === 'desc' ? 'desc' : 'asc',
          },
          skip,
          take: limit,
        }),
        prisma.event.count({ where }),
      ]);

      return createPaginatedResponse(events, total, page, limit);
    } catch (error) {
      console.error('Error fetching events:', error);
      return createErrorResponse('Failed to fetch events', 500);
    }
  });
}

// POST /api/events - Create new event
export async function POST(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      const body = await request.json();
      const { title, description, startTime, endTime, classId } = body;

      // Validate required fields
      if (!title || !description || !startTime || !endTime) {
        return createErrorResponse(
          'Title, description, start time, and end time are required',
          400
        );
      }

      // Validate dates
      const start = new Date(startTime);
      const end = new Date(endTime);

      if (end <= start) {
        return createErrorResponse('End time must be after start time', 400);
      }

      // If classId is provided, verify it belongs to the user's school
      if (classId && user.schoolId) {
        const classExists = await prisma.class.findFirst({
          where: {
            id: classId,
            schoolId: user.schoolId,
          },
        });

        if (!classExists) {
          return createErrorResponse('Class not found or access denied', 404);
        }
      }

      // Create event
      const event = await prisma.event.create({
        data: {
          title,
          description,
          startTime: start,
          endTime: end,
          classId: classId || null,
        },
        include: {
          class: {
            select: { name: true, id: true },
          },
        },
      });

      return createResponse(event, 'Event created successfully');
    } catch (error) {
      console.error('Error creating event:', error);
      return createErrorResponse('Failed to create event', 500);
    }
  });
}
