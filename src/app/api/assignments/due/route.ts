import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    // Get assignments due in the next 7 days
    const assignmentsDue = await prisma.assignment.findMany({
      where: {
        dueDate: {
          gte: now,
          lte: sevenDaysFromNow,
        },
      },
      include: {
        lesson: {
          include: {
            subject: {
              select: { name: true },
            },
            class: {
              select: { name: true },
            },
          },
        },
        results: {
          select: { id: true },
        },
      },
      orderBy: {
        dueDate: 'asc',
      },
    });

    // Calculate submission stats
    const assignmentsWithStats = await Promise.all(
      assignmentsDue.map(async assignment => {
        const totalStudents = await prisma.student.count({
          where: {
            classId: assignment.lesson.classId,
          },
        });

        const submittedCount = assignment.results.length;
        const pendingCount = totalStudents - submittedCount;

        return {
          id: assignment.id,
          title: assignment.title,
          dueDate: assignment.dueDate,
          subject: assignment.lesson.subject.name,
          class: assignment.lesson.class.name,
          totalStudents,
          submitted: submittedCount,
          pending: pendingCount,
          submissionRate:
            totalStudents > 0 ? Math.round((submittedCount / totalStudents) * 100) : 0,
        };
      })
    );

    // Get overdue assignments
    const overdueAssignments = await prisma.assignment.findMany({
      where: {
        dueDate: {
          lt: now,
        },
      },
      include: {
        lesson: {
          include: {
            subject: {
              select: { name: true },
            },
            class: {
              select: { name: true },
            },
          },
        },
        results: {
          select: { id: true },
        },
      },
      orderBy: {
        dueDate: 'desc',
      },
      take: 5,
    });

    const overdueWithStats = await Promise.all(
      overdueAssignments.map(async assignment => {
        const totalStudents = await prisma.student.count({
          where: {
            classId: assignment.lesson.classId,
          },
        });

        const submittedCount = assignment.results.length;

        return {
          id: assignment.id,
          title: assignment.title,
          dueDate: assignment.dueDate,
          subject: assignment.lesson.subject.name,
          class: assignment.lesson.class.name,
          totalStudents,
          submitted: submittedCount,
          pending: totalStudents - submittedCount,
        };
      })
    );

    const stats = {
      dueThisWeek: assignmentsDue.length,
      overdue: overdueAssignments.length,
      totalPending: assignmentsWithStats.reduce((sum, a) => sum + a.pending, 0),
      avgSubmissionRate:
        assignmentsDue.length > 0
          ? Math.round(
              assignmentsWithStats.reduce((sum, a) => sum + a.submissionRate, 0) /
                assignmentsDue.length
            )
          : 0,
    };

    return NextResponse.json({
      stats,
      upcoming: assignmentsWithStats,
      overdue: overdueWithStats,
    });
  } catch (error) {
    console.error('Assignments Due API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch assignments due data' }, { status: 500 });
  }
}
