import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [
      totalProjects,
      projectsByStatus,
      projectsByType,
      overdueProjects,
      recentlySubmitted,
      upcomingDeadlines,
    ] = await Promise.all([
      // Total projects count
      prisma.project.count(),

      // Projects by status
      prisma.project.groupBy({
        by: ['status'],
        _count: true,
      }),

      // Projects by type
      prisma.project.groupBy({
        by: ['type'],
        _count: true,
      }),

      // Overdue projects
      prisma.project.count({
        where: {
          dueDate: {
            lt: new Date(),
          },
          status: {
            not: 'COMPLETED',
          },
        },
      }),

      // Recently submitted projects (last 7 days)
      prisma.project.count({
        where: {
          status: 'SUBMITTED',
          updatedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),

      // Upcoming deadlines (next 7 days)
      prisma.project.count({
        where: {
          dueDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
          status: {
            notIn: ['COMPLETED', 'SUBMITTED', 'GRADED'],
          },
        },
      }),
    ]);

    // Calculate completion rate
    const completedProjects =
      projectsByStatus.find(item => item.status === 'COMPLETED')?._count || 0;
    const completionRate =
      totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

    return NextResponse.json({
      success: true,
      data: {
        total: totalProjects,
        byStatus: projectsByStatus.map(item => ({
          status: item.status,
          count: item._count,
        })),
        byType: projectsByType.map(item => ({
          type: item.type,
          count: item._count,
        })),
        overdue: overdueProjects,
        recentlySubmitted,
        upcomingDeadlines,
        completionRate,
        summary: {
          active: projectsByStatus
            .filter(item => ['PLANNING', 'IN_PROGRESS'].includes(item.status))
            .reduce((sum, item) => sum + item._count, 0),
          pending: projectsByStatus.find(item => item.status === 'SUBMITTED')?._count || 0,
          completed: completedProjects,
          graded: projectsByStatus.find(item => item.status === 'GRADED')?._count || 0,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching project stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project statistics' },
      { status: 500 }
    );
  }
}
