import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const period = url.searchParams.get('period') || 'year';

    // Calculate total revenue from fee payments (mock calculation for now)
    const students = await prisma.student.count();
    const monthlyFeePerStudent = 1500; // R1500 per month per student
    const totalRevenue = students * monthlyFeePerStudent * 12; // Annual revenue

    // Monthly revenue
    const monthlyRevenue = students * monthlyFeePerStudent;

    // Mock expenses calculation (can be enhanced with actual expense tracking)
    const teacherCount = await prisma.teacher.count();
    const averageTeacherSalary = 25000; // R25,000 per month
    const monthlyTeacherSalaries = teacherCount * averageTeacherSalary;

    // Other expenses (utilities, supplies, etc.)
    const otherMonthlyExpenses = 150000; // R150,000 per month
    const totalMonthlyExpenses = monthlyTeacherSalaries + otherMonthlyExpenses;
    const annualExpenses = totalMonthlyExpenses * 12;

    // Net profit calculation
    const netProfit = totalRevenue - annualExpenses;
    const monthlyNetProfit = monthlyRevenue - totalMonthlyExpenses;

    // Mock recent transactions (can be enhanced with actual transaction table)
    const recentTransactions = [
      {
        id: 1,
        type: 'revenue',
        description: `Tuition Payments - ${new Date().toLocaleDateString()}`,
        amount: monthlyRevenue * 0.8, // 80% of monthly revenue
        date: new Date().toISOString().split('T')[0],
        status: 'completed',
      },
      {
        id: 2,
        type: 'expense',
        description: 'Teacher Salaries',
        amount: -monthlyTeacherSalaries,
        date: new Date().toISOString().split('T')[0],
        status: 'completed',
      },
      {
        id: 3,
        type: 'revenue',
        description: 'Registration Fees',
        amount: students * 500, // R500 registration per student
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'completed',
      },
      {
        id: 4,
        type: 'expense',
        description: 'Utilities & Maintenance',
        amount: -otherMonthlyExpenses * 0.6,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'completed',
      },
      {
        id: 5,
        type: 'revenue',
        description: 'Extra Classes & Activities',
        amount: students * 200, // R200 per student for extra activities
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'pending',
      },
    ];

    // Calculate pending payments (students who haven't paid)
    const pendingPayments = monthlyRevenue * 0.15; // Assume 15% pending

    // Monthly breakdown for the last 6 months
    const monthlyBreakdown = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    for (let i = 0; i < 6; i++) {
      const revenue = monthlyRevenue * (0.95 + Math.random() * 0.1); // Some variation
      const expenses = totalMonthlyExpenses * (0.95 + Math.random() * 0.1);

      monthlyBreakdown.push({
        month: months[i],
        revenue: Math.round(revenue),
        expenses: Math.round(expenses),
      });
    }

    // Calculate profit margin
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    const financialData = {
      totalRevenue: Math.round(totalRevenue),
      monthlyRevenue: Math.round(monthlyRevenue),
      pendingPayments: Math.round(pendingPayments),
      expenses: Math.round(annualExpenses),
      monthlyExpenses: Math.round(totalMonthlyExpenses),
      netProfit: Math.round(netProfit),
      monthlyNetProfit: Math.round(monthlyNetProfit),
      profitMargin: Math.round(profitMargin * 100) / 100,
      recentTransactions,
      monthlyBreakdown,
      metrics: {
        totalStudents: students,
        averageFeePerStudent: monthlyFeePerStudent,
        teacherCount,
        averageTeacherSalary,
        revenueGrowth: 12.5, // Mock growth rate
        expenseRatio: Math.round((annualExpenses / totalRevenue) * 100 * 100) / 100,
      },
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: financialData,
    });
  } catch (error) {
    console.error('Finance API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch financial data',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
