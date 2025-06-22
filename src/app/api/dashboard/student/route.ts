import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock student dashboard data
    const dashboardData = {
      success: true,
      data: {
        studentInfo: {
          name: 'Student Dashboard',
          id: 'STU001',
          class: 'Grade 10A',
          subjects: ['Math', 'Science', 'English', 'History'],
        },
        assignments: [
          {
            id: 1,
            title: 'Math Assignment 1',
            subject: 'Mathematics',
            dueDate: '2025-06-25',
            status: 'pending',
          },
        ],
        grades: [
          {
            subject: 'Math',
            grade: 'A',
            percentage: 92,
          },
        ],
      },
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Student dashboard API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    return NextResponse.json({
      success: true,
      message: 'Student data updated successfully',
      data: body,
    });
  } catch (error) {
    console.error('Student dashboard POST error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
