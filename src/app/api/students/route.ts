import {
  createErrorResponse,
  createPaginatedResponse,
  createResponse,
  createValidationErrorResponse,
  getPaginationParams,
  getSearchParams,
  withRoles,
} from '@/lib/api-utils';
import prisma from '@/lib/prisma';
import { getAuthorizedStudents } from '@/lib/role-based-access';
import { validateStudent } from '@/lib/validation';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/students - List students with role-based access
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') as 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
    const userId = searchParams.get('userId');

    // **OPERATION VOLCANOFOUNTAIN: Priority Role-Based Access Check**
    if (role && userId) {
      console.log(`🎯 [Students API] Using role-based access for ${role} ${userId}`);

      // Use the new role-based access system
      const students = await getAuthorizedStudents({
        role: role,
        userId: userId,
      });

      console.log(
        `✅ [Students API] ${role} ${userId} fetched ${students.length} authorized students`
      );

      return NextResponse.json({
        data: students,
        metadata: {
          role: role,
          count: students.length,
          userId: userId,
        },
      });
    }

    // Fallback to original withRoles approach for backward compatibility
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
  } catch (error) {
    console.error('Error in students API:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch students',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
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
