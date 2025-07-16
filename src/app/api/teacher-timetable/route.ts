/**
 * OPERATION VOLCANOFOUNTAIN - PHASE 2
 * Teacher Timetable API
 * Provides teachers with their lesson schedule
 */

import { getTeacherTimetable } from '@/lib/role-based-access';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get('teacherId');

    if (!teacherId) {
      return NextResponse.json(
        {
          error: 'Missing teacherId parameter',
          message: 'Please provide teacherId query parameter',
        },
        { status: 400 }
      );
    }

    // Get teacher's timetable
    const timetable = await getTeacherTimetable(teacherId);

    // Group lessons by day for better organization
    const organizedTimetable = {
      MONDAY: timetable.filter(lesson => lesson.day === 'MONDAY'),
      TUESDAY: timetable.filter(lesson => lesson.day === 'TUESDAY'),
      WEDNESDAY: timetable.filter(lesson => lesson.day === 'WEDNESDAY'),
      THURSDAY: timetable.filter(lesson => lesson.day === 'THURSDAY'),
      FRIDAY: timetable.filter(lesson => lesson.day === 'FRIDAY'),
    };

    console.log(`✅ [Timetable API] Teacher ${teacherId} fetched ${timetable.length} lessons`);

    return NextResponse.json({
      data: {
        lessons: timetable,
        organized: organizedTimetable,
        totalLessons: timetable.length,
      },
      metadata: {
        teacherId: teacherId,
        daysWithLessons: Object.values(organizedTimetable).filter(day => day.length > 0).length,
      },
    });
  } catch (error) {
    console.error('Error fetching teacher timetable:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch timetable',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
