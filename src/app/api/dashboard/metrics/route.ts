import { NextRequest, NextResponse } from 'next/server';
import { getDashboardMetrics } from '@/lib/calculations';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const schoolId = searchParams.get('schoolId');

    const metrics = await getDashboardMetrics(schoolId ? parseInt(schoolId) : undefined);

    return NextResponse.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch dashboard metrics',
      },
      { status: 500 }
    );
  }
}
