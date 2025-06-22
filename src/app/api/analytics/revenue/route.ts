import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Since we don't have a finance table yet, let's return mock data
    // In a real scenario, you'd query actual finance/revenue records

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Get student count for revenue calculation (tuition fees)
    const totalStudents = await prisma.student.count();

    // Mock revenue calculation based on student count
    const monthlyTuitionPerStudent = 500; // Example tuition fee
    const estimatedMonthlyRevenue = totalStudents * monthlyTuitionPerStudent;

    // Mock data for charts
    const monthlyRevenue = [
      { month: 'Jan', revenue: estimatedMonthlyRevenue * 0.95 },
      { month: 'Feb', revenue: estimatedMonthlyRevenue * 0.98 },
      { month: 'Mar', revenue: estimatedMonthlyRevenue * 1.02 },
      { month: 'Apr', revenue: estimatedMonthlyRevenue * 0.97 },
      { month: 'May', revenue: estimatedMonthlyRevenue * 1.05 },
      { month: 'Jun', revenue: estimatedMonthlyRevenue },
    ];

    const yearToDateRevenue = monthlyRevenue
      .slice(0, currentMonth + 1)
      .reduce((sum, month) => sum + month.revenue, 0);

    const lastYearRevenue = yearToDateRevenue * 0.92; // Mock 8% growth
    const growthPercentage = ((yearToDateRevenue - lastYearRevenue) / lastYearRevenue) * 100;

    return NextResponse.json({
      currentMonth: estimatedMonthlyRevenue,
      yearToDate: yearToDateRevenue,
      lastYear: lastYearRevenue,
      growthPercentage: Math.round(growthPercentage * 100) / 100,
      monthlyBreakdown: monthlyRevenue,
      totalStudents,
      averageRevenuePerStudent: monthlyTuitionPerStudent,
    });
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    return NextResponse.json({ error: 'Failed to fetch revenue data' }, { status: 500 });
  }
}
