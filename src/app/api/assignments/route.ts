import { getRoleFromRequest } from '@/lib/auth';
import { getAuthorizedAssignments } from '@/lib/role-based-access';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET: List assignments with role-based access
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role') as 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
    const userId = searchParams.get('userId');

    // **ADMIN DASHBOARD FIX**: Allow admin access without parameters
    if (!role || !userId) {
      console.log('🔧 [Assignments API] No role/userId provided - defaulting to admin access');

      const allAssignments = await prisma.assignment.findMany({
        include: {
          lesson: {
            include: {
              subject: { select: { name: true } },
              class: { select: { name: true } },
              teacher: { select: { name: true, surname: true } },
            },
          },
        },
        orderBy: { startDate: 'desc' },
      });

      console.log(
        `✅ [Assignments API] Admin access - fetched ${allAssignments.length} total assignments`
      );
      return NextResponse.json(allAssignments);
    }

    // **OPERATION VOLCANOFOUNTAIN: Priority Role-Based Access**
    if (role && userId) {
      console.log(`📝 [Assignments API] Using role-based access for ${role} ${userId}`);

      const assignments = await getAuthorizedAssignments({
        role: role,
        userId: userId,
      });

      console.log(
        `✅ [Assignments API] ${role} ${userId} fetched ${assignments.length} authorized assignments`
      );

      return NextResponse.json({
        data: assignments,
        metadata: {
          role: role,
          count: assignments.length,
          userId: userId,
        },
      });
    }

    // Fallback to original role-based approach
    const fallbackRole = getRoleFromRequest(req);
    if (fallbackRole !== 'TEACHER' && fallbackRole !== 'STUDENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '15', 10);
    const skip = (page - 1) * limit;

    // Teachers see all, students see their own (add filter logic as needed)
    const [assignments, total] = await Promise.all([
      prisma.assignment.findMany({
        skip,
        take: limit,
        include: {
          lesson: {
            include: {
              subject: true,
              class: true,
              teacher: true,
            },
          },
          results: {
            include: {
              student: true,
            },
          },
        },
      }),
      prisma.assignment.count(),
    ]);
    return NextResponse.json({ data: assignments, total });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch assignments',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST: Create a new assignment
export async function POST(req: NextRequest) {
  const role = getRoleFromRequest(req);
  if (role !== 'TEACHER') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const data = await req.json();
  try {
    const assignment = await prisma.assignment.create({ data });
    return NextResponse.json(assignment, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to create assignment', details: e instanceof Error ? e.message : e },
      { status: 400 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const role = getRoleFromRequest(req);
  if (role !== 'TEACHER') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const data = await req.json();
  if (!data.id) return NextResponse.json({ error: 'Missing assignment id' }, { status: 400 });
  try {
    const assignment = await prisma.assignment.update({ where: { id: data.id }, data });
    return NextResponse.json(assignment);
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to update assignment', details: e instanceof Error ? e.message : e },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const role = getRoleFromRequest(req);
  if (role !== 'TEACHER') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing assignment id' }, { status: 400 });
  try {
    await prisma.assignment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to delete assignment', details: e instanceof Error ? e.message : e },
      { status: 400 }
    );
  }
}
