import prisma from '@/lib/prisma';
import { getAuthorizedResults } from '@/lib/role-based-access';
import { NextRequest, NextResponse } from 'next/server';

// GET: List results based on user role and permissions
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Get role and userId from query parameters for now
    // TODO: Implement proper authentication middleware
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role') as 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
    const userId = searchParams.get('userId');

    // **ADMIN DASHBOARD FIX**: Allow admin access without parameters
    if (!role || !userId) {
      // Default to admin access for admin dashboard
      console.log('🔧 [Results API] No role/userId provided - defaulting to admin access');

      const allResults = await prisma.result.findMany({
        include: {
          student: { select: { name: true, surname: true } },
          exam: {
            include: {
              lesson: {
                include: {
                  subject: { select: { name: true } },
                  class: { select: { name: true } },
                  teacher: { select: { name: true, surname: true } },
                },
              },
            },
          },
        },
        orderBy: { id: 'desc' },
      });

      console.log(`✅ [Results API] Admin access - fetched ${allResults.length} total results`);
      return NextResponse.json(allResults);
    }

    // **OPERATION VOLCANOFOUNTAIN - PHASE 1: Role-Based Data Access**
    // Get only results this user is authorized to see
    const results = await getAuthorizedResults({
      role: role,
      userId: userId,
    });

    console.log(`✅ [Results API] ${role} ${userId} fetched ${results.length} authorized results`);

    return NextResponse.json({
      data: results,
      metadata: {
        role: role,
        count: results.length,
        userId: userId,
      },
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch results',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST: Create a new result
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role') as 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
    const userId = searchParams.get('userId');

    if (!role || !userId) {
      return NextResponse.json({ error: 'Missing role or userId parameters' }, { status: 400 });
    }

    // Only ADMIN and TEACHER can create results
    if (!['ADMIN', 'TEACHER'].includes(role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const data = await req.json();

    // TODO: Add additional authorization check to ensure teacher can only create results for their students

    const result = await prisma.result.create({
      data: {
        score: data.score,
        examId: data.examId || null,
        assignmentId: data.assignmentId || null,
        studentId: data.studentId,
      },
      include: {
        exam: { include: { lesson: { include: { subject: true, class: true, teacher: true } } } },
        assignment: {
          include: { lesson: { include: { subject: true, class: true, teacher: true } } },
        },
        student: { include: { class: true } },
      },
    });

    console.log(`✅ [Results API] ${role} ${userId} created result ${result.id}`);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating result:', error);
    return NextResponse.json({ error: 'Failed to create result' }, { status: 500 });
  }
}
