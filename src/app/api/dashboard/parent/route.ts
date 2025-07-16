import {
  calculateAttendancePercentage,
  calculateAttendanceTrends,
  calculatePerformanceTrends,
  calculateStudentAverageScore,
} from '@/lib/calculations';
import { getAuthorizedResults, getAuthorizedStudents } from '@/lib/role-based-access';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

interface SubjectScores {
  [key: string]: number[];
}

interface SubjectPerformance {
  [key: string]: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId');
    const period = searchParams.get('period') || 'week'; // week, month, semester

    if (!parentId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parent ID is required',
        },
        { status: 400 }
      );
    }

    // **OPERATION VOLCANOFOUNTAIN - PHASE 4: Parent Role-Based Access**
    console.log(`🏠 [Parent Dashboard] Fetching data for parent: ${parentId}`);

    // Get parent info
    const parent = await prisma.parent.findUnique({
      where: { id: parentId },
      include: {
        user: true,
      },
    });

    if (!parent) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parent not found',
        },
        { status: 404 }
      );
    }

    // **OPERATION VOLCANOFOUNTAIN - PHASE 4: Use Role-Based Access for Children**
    // Get children using authorized access system to ensure parent sees only their children
    const children = await getAuthorizedStudents({
      role: 'PARENT',
      userId: parentId,
    });

    console.log(`✅ [Parent Dashboard] Found ${children.length} children for parent ${parentId}`);

    // Get additional results data for children using role-based access
    const childrenResults = await getAuthorizedResults({
      role: 'PARENT',
      userId: parentId,
    });

    // Calculate comprehensive metrics for each child
    const childrenWithMetrics = await Promise.all(
      children.map(async child => {
        const attendancePercent = await calculateAttendancePercentage(child.id);
        const avgScore = await calculateStudentAverageScore(child.id);

        // Calculate subject performance for this child
        const subjectPerformance: SubjectPerformance = {};
        const subjectScores: SubjectScores = {};

        child.results.forEach((result: any) => {
          let subjectName = '';
          if (result.exam?.lesson?.subject?.name) {
            subjectName = result.exam.lesson.subject.name;
          } else if (result.assignment?.lesson?.subject?.name) {
            subjectName = result.assignment.lesson.subject.name;
          }

          if (subjectName) {
            if (!subjectScores[subjectName]) {
              subjectScores[subjectName] = [];
            }
            subjectScores[subjectName].push(result.score);
          }
        });

        // Calculate average per subject
        Object.keys(subjectScores).forEach(subject => {
          const scores = subjectScores[subject];
          subjectPerformance[subject] = Math.round(
            scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length
          );
        });

        // Calculate trend based on last few results
        const recentResults = child.results.slice(0, 5);
        const trend =
          recentResults.length >= 2
            ? recentResults[0].score > recentResults[recentResults.length - 1].score
              ? 'improving'
              : recentResults[0].score < recentResults[recentResults.length - 1].score
                ? 'declining'
                : 'stable'
            : 'stable';

        // Count upcoming events/deadlines
        const currentDate = new Date();
        const upcomingDeadlines = await prisma.assignment.count({
          where: {
            lesson: {
              class: {
                students: {
                  some: {
                    id: child.id,
                  },
                },
              },
            },
            dueDate: {
              gte: currentDate,
              lte: new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000), // Next 7 days
            },
          },
        });

        return {
          id: child.id,
          name: child.name,
          surname: child.surname,
          username: child.username,
          email: child.email,
          grade: child.grade,
          class: child.class,
          attendancePercent,
          avgScore,
          subjectPerformance,
          trend,
          upcomingDeadlines,
          recentResults: recentResults.map((r: any) => ({
            score: r.score,
            subject:
              r.exam?.lesson?.subject?.name || r.assignment?.lesson?.subject?.name || 'Unknown',
            type: r.exam ? 'Exam' : 'Assignment',
            date: r.createdAt,
          })),
          status: child.status || 'Active',
          profileImage: child.img,
        };
      })
    );

    // Calculate overall parent dashboard metrics
    const totalChildren = children.length;
    const totalNotifications = childrenWithMetrics.reduce(
      (sum, child) => sum + child.upcomingDeadlines,
      0
    );
    const overallAttendance =
      childrenWithMetrics.length > 0
        ? Math.round(
            childrenWithMetrics.reduce((sum, child) => sum + child.attendancePercent, 0) /
              childrenWithMetrics.length
          )
        : 0;
    const totalResults = childrenWithMetrics.reduce(
      (sum, child) => sum + child.recentResults.length,
      0
    );

    // Get upcoming events for all children's classes
    const classIds = children.map(child => child.classId).filter((id): id is number => id !== null);
    const upcomingEvents = await prisma.event.findMany({
      where: {
        OR: [
          { classId: { in: classIds } },
          { classId: null }, // School-wide events
        ],
        startTime: {
          gte: new Date(),
          lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Next 30 days
        },
      },
      orderBy: {
        startTime: 'asc',
      },
      take: 10,
    });

    // Get recent announcements
    const announcements = await prisma.announcement.findMany({
      where: {
        OR: [
          { classId: { in: classIds } },
          { classId: null }, // School-wide announcements
        ],
        date: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
      orderBy: {
        date: 'desc',
      },
      take: 5,
    });

    // Performance analytics data
    const performanceData = childrenWithMetrics.map(child => ({
      name: `${child.name} ${child.surname}`,
      subjects: child.subjectPerformance,
      overall: child.avgScore,
      attendance: child.attendancePercent,
    }));

    // Calculate attendance trend data for charts
    const attendanceTrendData = await calculateAttendanceTrends(
      children,
      period as 'week' | 'month' | 'semester'
    );

    // Get detailed performance trends for all children
    const performanceTrends = await calculatePerformanceTrends(
      children,
      period as 'week' | 'month' | 'semester'
    );

    return NextResponse.json({
      success: true,
      data: {
        parent: {
          id: parent.id,
          name: parent.name,
          surname: parent.surname,
          email: parent.email,
          occupation: parent.occupation,
        },
        metrics: {
          totalChildren,
          notifications: totalNotifications,
          overallAttendance,
          totalResults,
        },
        children: childrenWithMetrics,
        upcomingEvents: upcomingEvents.map(event => ({
          id: event.id,
          title: event.title,
          description: event.description,
          startTime: event.startTime,
          endTime: event.endTime,
          type: event.classId ? 'Class Event' : 'School Event',
        })),
        announcements: announcements.map(announcement => ({
          id: announcement.id,
          title: announcement.title,
          description: announcement.description,
          date: announcement.date,
          type: announcement.classId ? 'Class Announcement' : 'School Announcement',
        })),
        performanceData,
        attendanceTrendData,
        performanceTrends,
        period,
      },
    });
  } catch (error) {
    console.error('Error fetching parent dashboard data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch parent dashboard data',
      },
      { status: 500 }
    );
  }
}
