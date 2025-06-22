import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Calculate dropout risk based on attendance patterns
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get students with poor attendance in the last 30 days
    const studentsWithAttendance = await prisma.student.findMany({
      include: {
        attendances: {
          where: {
            date: {
              gte: thirtyDaysAgo,
            },
          },
          select: {
            present: true,
          },
        },
        results: {
          select: {
            score: true,
          },
          orderBy: {
            id: 'desc',
          },
          take: 5, // Last 5 results
        },
      },
    });

    const riskStudents = studentsWithAttendance
      .map(student => {
        const totalAttendance = student.attendances.length;
        const presentCount = student.attendances.filter(a => a.present).length;
        const attendanceRate = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 100;

        // Calculate average score from recent results
        const recentScores = student.results.map(r => r.score);
        const averageScore =
          recentScores.length > 0
            ? recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length
            : 75; // Default assumption

        // Risk calculation: Low attendance + Low grades = High risk
        let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
        let riskScore = 0;

        if (attendanceRate < 70) riskScore += 40;
        else if (attendanceRate < 85) riskScore += 20;

        if (averageScore < 50) riskScore += 40;
        else if (averageScore < 70) riskScore += 20;

        if (riskScore >= 60) riskLevel = 'HIGH';
        else if (riskScore >= 30) riskLevel = 'MEDIUM';

        return {
          id: student.id,
          name: student.name,
          surname: student.surname,
          attendanceRate: Math.round(attendanceRate),
          averageScore: Math.round(averageScore),
          riskLevel,
          riskScore,
        };
      })
      .filter(student => student.riskLevel !== 'LOW')
      .sort((a, b) => b.riskScore - a.riskScore);

    const stats = {
      total: studentsWithAttendance.length,
      highRisk: riskStudents.filter(s => s.riskLevel === 'HIGH').length,
      mediumRisk: riskStudents.filter(s => s.riskLevel === 'MEDIUM').length,
      lowRisk: studentsWithAttendance.length - riskStudents.length,
    };

    return NextResponse.json({
      stats,
      students: riskStudents.slice(0, 10), // Top 10 at-risk students
    });
  } catch (error) {
    console.error('Dropout Risk API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch dropout risk data' }, { status: 500 });
  }
}
