import { NextRequest, NextResponse } from 'next/server';
import { subjectQueries } from '../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const grade = searchParams.get('grade');

    try {
      let subjects;

      if (grade) {
        subjects = await subjectQueries.getSubjectsByGrade(parseInt(grade));
      } else {
        subjects = await subjectQueries.getSubjects();
      }

      return NextResponse.json({
        success: true,
        data: subjects,
        total: subjects.length,
      });
    } catch (dbError) {
      console.warn('Database not available, using mock data:', dbError);

      // Mock subjects data
      const mockSubjects = [
        {
          id: '1',
          name: 'Mathematics',
          code: 'MATH',
          description: 'Mathematical sciences covering algebra, calculus, geometry, and statistics',
          icon: '📊',
          color: '#8B5CF6',
          isCore: true,
          grades: [8, 9, 10, 11, 12],
          language: 'english',
          capsCode: 'MATH-CAPS',
          learningArea: 'Mathematics',
          _count: { courses: 15, modules: 45 },
        },
        {
          id: '2',
          name: 'Physical Sciences',
          code: 'PHYS',
          description: 'Physics and Chemistry with practical laboratory work',
          icon: '🧪',
          color: '#7C3AED',
          isCore: true,
          grades: [10, 11, 12],
          language: 'english',
          capsCode: 'PHYS-CAPS',
          learningArea: 'Physical Sciences',
          _count: { courses: 12, modules: 36 },
        },
        {
          id: '3',
          name: 'Life Sciences',
          code: 'LIFE',
          description: 'Biology and life processes with environmental studies',
          icon: '🌱',
          color: '#10B981',
          isCore: true,
          grades: [10, 11, 12],
          language: 'english',
          capsCode: 'LIFE-CAPS',
          learningArea: 'Life Sciences',
          _count: { courses: 10, modules: 30 },
        },
        {
          id: '4',
          name: 'English Home Language',
          code: 'ENGL-HL',
          description: 'Advanced English language and literature studies',
          icon: '📚',
          color: '#059669',
          isCore: true,
          grades: [8, 9, 10, 11, 12],
          language: 'english',
          capsCode: 'ENGL-HL-CAPS',
          learningArea: 'Languages',
          _count: { courses: 20, modules: 60 },
        },
        {
          id: '5',
          name: 'Afrikaans Home Language',
          code: 'AFR-HL',
          description: 'Advanced Afrikaans language and literature studies',
          icon: '📖',
          color: '#0D9488',
          isCore: true,
          grades: [8, 9, 10, 11, 12],
          language: 'afrikaans',
          capsCode: 'AFR-HL-CAPS',
          learningArea: 'Languages',
          _count: { courses: 18, modules: 54 },
        },
        {
          id: '6',
          name: 'History',
          code: 'HIST',
          description: 'South African and world history with critical analysis',
          icon: '🏛️',
          color: '#DC2626',
          isCore: false,
          grades: [8, 9, 10, 11, 12],
          language: 'english',
          capsCode: 'HIST-CAPS',
          learningArea: 'Social Sciences',
          _count: { courses: 8, modules: 24 },
        },
        {
          id: '7',
          name: 'Geography',
          code: 'GEOG',
          description: 'Physical and human geography with GIS applications',
          icon: '🌍',
          color: '#2563EB',
          isCore: false,
          grades: [8, 9, 10, 11, 12],
          language: 'english',
          capsCode: 'GEOG-CAPS',
          learningArea: 'Social Sciences',
          _count: { courses: 7, modules: 21 },
        },
        {
          id: '8',
          name: 'Business Studies',
          code: 'BUS',
          description: 'Business principles, economics, and entrepreneurship',
          icon: '💼',
          color: '#7C2D12',
          isCore: false,
          grades: [10, 11, 12],
          language: 'english',
          capsCode: 'BUS-CAPS',
          learningArea: 'Business Studies',
          _count: { courses: 9, modules: 27 },
        },
        {
          id: '9',
          name: 'Accounting',
          code: 'ACC',
          description: 'Financial accounting and business mathematics',
          icon: '💰',
          color: '#B91C1C',
          isCore: false,
          grades: [10, 11, 12],
          language: 'english',
          capsCode: 'ACC-CAPS',
          learningArea: 'Business Studies',
          _count: { courses: 6, modules: 18 },
        },
        {
          id: '10',
          name: 'Information Technology',
          code: 'IT',
          description: 'Computer science, programming, and digital literacy',
          icon: '💻',
          color: '#1E40AF',
          isCore: false,
          grades: [10, 11, 12],
          language: 'english',
          capsCode: 'IT-CAPS',
          learningArea: 'Information Technology',
          _count: { courses: 8, modules: 24 },
        },
        {
          id: '11',
          name: 'Life Orientation',
          code: 'LO',
          description: 'Personal development, health, and social responsibility',
          icon: '🌟',
          color: '#9333EA',
          isCore: true,
          grades: [8, 9, 10, 11, 12],
          language: 'english',
          capsCode: 'LO-CAPS',
          learningArea: 'Life Orientation',
          _count: { courses: 5, modules: 15 },
        },
      ];

      let filteredSubjects = mockSubjects;

      if (grade) {
        const gradeNum = parseInt(grade);
        filteredSubjects = mockSubjects.filter(subject => subject.grades.includes(gradeNum));
      }

      return NextResponse.json({
        success: true,
        data: filteredSubjects,
        total: filteredSubjects.length,
        usingMockData: true,
      });
    }
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch subjects',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.code || !body.grades) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: name, code, grades',
        },
        { status: 400 }
      );
    }

    try {
      const subject = await subjectQueries.createSubject({
        name: body.name,
        code: body.code,
        description: body.description,
        icon: body.icon,
        color: body.color || '#8B5CF6',
        isCore: body.isCore ?? true,
        grades: body.grades,
        language: body.language || 'english',
        capsCode: body.capsCode,
        learningArea: body.learningArea,
      });

      return NextResponse.json({
        success: true,
        data: subject,
      });
    } catch (dbError) {
      console.warn('Database not available for subject creation:', dbError);

      // Return mock response
      const mockSubject = {
        id: `mock-${Date.now()}`,
        ...body,
        color: body.color || '#8B5CF6',
        isCore: body.isCore ?? true,
        language: body.language || 'english',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return NextResponse.json({
        success: true,
        data: mockSubject,
        usingMockData: true,
      });
    }
  } catch (error) {
    console.error('Error creating subject:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create subject',
      },
      { status: 500 }
    );
  }
}
