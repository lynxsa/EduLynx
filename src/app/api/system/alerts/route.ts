import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const alerts = [];
    const now = new Date();

    // Check for low attendance classes today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const classAttendance = await prisma.class.findMany({
      include: {
        students: {
          include: {
            attendances: {
              where: {
                date: {
                  gte: today,
                  lt: tomorrow,
                },
              },
            },
          },
        },
      },
    });

    for (const classItem of classAttendance) {
      const totalStudents = classItem.students.length;
      if (totalStudents > 0) {
        const presentToday = classItem.students.filter(student =>
          student.attendances.some(att => att.present)
        ).length;

        const attendanceRate = (presentToday / totalStudents) * 100;

        if (attendanceRate < 70) {
          alerts.push({
            id: `attendance-${classItem.id}`,
            type: 'WARNING',
            title: 'Low Attendance Alert',
            message: `${classItem.name} has ${attendanceRate.toFixed(1)}% attendance today`,
            timestamp: now.toISOString(),
            severity: attendanceRate < 50 ? 'HIGH' : 'MEDIUM',
          });
        }
      }
    }

    // Check for overdue assignments
    const overdueAssignments = await prisma.assignment.count({
      where: {
        dueDate: {
          lt: now,
        },
      },
    });

    if (overdueAssignments > 0) {
      alerts.push({
        id: 'overdue-assignments',
        type: 'INFO',
        title: 'Overdue Assignments',
        message: `${overdueAssignments} assignments are overdue`,
        timestamp: now.toISOString(),
        severity: overdueAssignments > 10 ? 'HIGH' : 'LOW',
      });
    }

    // Check for upcoming exams (next 3 days)
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const upcomingExams = await prisma.exam.count({
      where: {
        startTime: {
          gte: now,
          lte: threeDaysFromNow,
        },
      },
    });

    if (upcomingExams > 0) {
      alerts.push({
        id: 'upcoming-exams',
        type: 'INFO',
        title: 'Upcoming Exams',
        message: `${upcomingExams} exams scheduled in the next 3 days`,
        timestamp: now.toISOString(),
        severity: 'LOW',
      });
    }

    // Check for students with multiple absences
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const studentsWithHighAbsences = await prisma.student.findMany({
      where: {
        attendances: {
          some: {
            date: {
              gte: sevenDaysAgo,
            },
            present: false,
          },
        },
      },
      include: {
        attendances: {
          where: {
            date: {
              gte: sevenDaysAgo,
            },
            present: false,
          },
        },
      },
    });

    const criticalAbsenceStudents = studentsWithHighAbsences.filter(
      student => student.attendances.length >= 3
    );

    if (criticalAbsenceStudents.length > 0) {
      alerts.push({
        id: 'high-absences',
        type: 'WARNING',
        title: 'High Absence Alert',
        message: `${criticalAbsenceStudents.length} students have 3+ absences this week`,
        timestamp: now.toISOString(),
        severity: 'MEDIUM',
      });
    }

    // Mock system alerts (in a real system, these would come from monitoring)
    const systemAlerts = [
      {
        id: 'system-backup',
        type: 'SUCCESS',
        title: 'System Backup',
        message: 'Daily backup completed successfully',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        severity: 'LOW',
      },
    ];

    const allAlerts = [...alerts, ...systemAlerts]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20); // Limit to 20 most recent alerts

    const stats = {
      total: allAlerts.length,
      critical: allAlerts.filter(a => a.severity === 'HIGH').length,
      warning: allAlerts.filter(a => a.severity === 'MEDIUM').length,
      info: allAlerts.filter(a => a.severity === 'LOW').length,
      unread: allAlerts.length, // In a real system, track read status
    };

    return NextResponse.json({
      stats,
      alerts: allAlerts,
    });
  } catch (error) {
    console.error('System Alerts API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch system alerts' }, { status: 500 });
  }
}
