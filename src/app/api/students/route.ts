import { NextRequest } from 'next/server';
import { withRoles } from '@/lib/api-utils';
import { validateStudent } from '@/lib/validation';
import {
  createResponse,
  createErrorResponse,
  createValidationErrorResponse,
  getPaginationParams,
  createPaginatedResponse,
  getSearchParams,
} from '@/lib/api-utils';
import prisma from '@/lib/prisma';

// GET /api/students - List students with pagination and search
export async function GET(request: NextRequest) {
  return withRoles(request, ['ADMIN', 'TEACHER'], async (req, user) => {
    try {
      const { page, limit, skip } = getPaginationParams(request);
      const { search, sortBy, sortOrder, filters } = getSearchParams(request);

      // Build where clause
      const where: any = {};

      if (user.schoolId) {
        where.schoolId = user.schoolId;
      }

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { surname: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { username: { contains: search, mode: 'insensitive' } },
        ];
      }

      // Apply filters
      if (filters.classId) {
        where.classId = parseInt(filters.classId);
      }
      if (filters.gradeId) {
        where.gradeId = parseInt(filters.gradeId);
      }
      if (filters.sex) {
        where.sex = filters.sex;
      }

      // Get students with count
      const [students, total] = await Promise.all([
        prisma.student.findMany({
          where,
          include: {
            class: {
              select: { name: true, id: true },
            },
            grade: {
              select: { level: true, id: true },
            },
            parent: {
              select: { name: true, surname: true, phone: true, email: true },
            },
          },
          orderBy: {
            [sortBy]: sortOrder === 'desc' ? 'desc' : 'asc',
          },
          skip,
          take: limit,
        }),
        prisma.student.count({ where }),
      ]);

      return createPaginatedResponse(students, total, page, limit);
    } catch (error) {
      console.error('Error fetching students:', error);
      return createErrorResponse('Failed to fetch students', 500);
    }
  });
}

// POST /api/students - Create new student
export async function POST(request: NextRequest) {
  return withRoles(request, ['ADMIN'], async (req, user) => {
    try {
      const body = await request.json();

      // Validate input
      const validation = validateStudent(body);
      if (!validation.isValid) {
        return createValidationErrorResponse(validation.errors);
      }

      // Check if username or email already exists
      const existing = await prisma.student.findFirst({
        where: {
          OR: [{ username: body.username }, { email: body.email }],
        },
      });

      if (existing) {
        return createErrorResponse('Student with this username or email already exists', 409);
      }

      // Create student
      const student = await prisma.student.create({
        data: {
          ...body,
          schoolId: user.schoolId,
          birthday: new Date(body.birthday),
        },
        include: {
          class: {
            select: { name: true, id: true },
          },
          grade: {
            select: { level: true, id: true },
          },
          parent: {
            select: { name: true, surname: true, phone: true, email: true },
          },
        },
      });

      return createResponse(student, 'Student created successfully');
    } catch (error) {
      console.error('Error creating student:', error);
      return createErrorResponse('Failed to create student', 500);
    }
  });
}
