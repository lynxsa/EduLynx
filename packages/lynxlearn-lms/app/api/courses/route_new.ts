import { NextRequest, NextResponse } from 'next/server';
import { courseQueries } from '../../../lib/db';

// Fallback mock data for when database is not available
const mockCourses = [
  {
    id: '1',
    title: 'Grade 12 Mathematics: NSC Success',
    description:
      'Complete NSC Mathematics curriculum covering all essential topics for matric success. Includes calculus, algebra, geometry, and statistics with ProfLynx AI support.',
    instructor: 'Dr. Nomsa Mthembu',
    rating: 4.9,
    students: 3247,
    duration: '12 weeks',
    level: 'Grade 12',
    language: 'English/Afrikaans',
    thumbnail:
      'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    enrolled: true,
    category: 'Mathematics',
    published: true,
    progress: 75,
    lessons: 24,
    teacher: 'Dr. Nomsa Mthembu',
    color: 'bg-blue-500',
    createdAt: '2024-01-15',
    updatedAt: '2024-06-20',
  },
  {
    id: '2',
    title: 'Physical Sciences: Chemistry & Physics',
    description:
      'Complete CAPS-aligned course with practical experiments and AI-powered problem solving.',
    instructor: 'Prof. Ahmed Hassan',
    rating: 4.8,
    students: 2156,
    duration: '14 weeks',
    level: 'Grade 11-12',
    language: 'English',
    thumbnail:
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    enrolled: false,
    category: 'Physical Sciences',
    published: true,
    progress: 62,
    lessons: 18,
    teacher: 'Prof. Ahmed Hassan',
    color: 'bg-purple-500',
    createdAt: '2024-02-01',
    updatedAt: '2024-06-18',
  },
  {
    id: '3',
    title: 'English Home Language: Literature & Writing',
    description:
      'Develop critical thinking and writing skills with personalized feedback from ProfLynx AI.',
    instructor: 'Mrs. Jane Williams',
    rating: 4.7,
    students: 1892,
    duration: '10 weeks',
    level: 'Grade 10-12',
    language: 'English',
    thumbnail:
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    enrolled: true,
    category: 'Languages',
    published: true,
    progress: 88,
    lessons: 20,
    teacher: 'Mrs. Jane Williams',
    color: 'bg-green-500',
    createdAt: '2024-01-20',
    updatedAt: '2024-06-15',
  },
  {
    id: '4',
    title: 'Life Sciences: Biology for NSC',
    description:
      'Comprehensive biology course covering all NSC requirements with interactive virtual labs.',
    instructor: 'Dr. Mpho Khoza',
    rating: 4.6,
    students: 1654,
    duration: '13 weeks',
    level: 'Grade 10-12',
    language: 'English/Afrikaans',
    thumbnail:
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    enrolled: false,
    category: 'Life Sciences',
    published: true,
    progress: 45,
    lessons: 15,
    teacher: 'Dr. Mpho Khoza',
    color: 'bg-yellow-500',
    createdAt: '2024-02-10',
    updatedAt: '2024-06-12',
  },
  {
    id: '5',
    title: 'Accounting: Financial Literacy & NSC Prep',
    description: 'Master accounting principles with practical South African business examples.',
    instructor: 'Mrs. Thandi Mbeki',
    rating: 4.5,
    students: 1234,
    duration: '11 weeks',
    level: 'Grade 10-12',
    language: 'English/Afrikaans',
    thumbnail:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    enrolled: false,
    category: 'Business Studies',
    published: true,
    progress: 50,
    lessons: 16,
    teacher: 'Mrs. Thandi Mbeki',
    color: 'bg-red-500',
    createdAt: '2024-03-01',
    updatedAt: '2024-06-10',
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const subject = searchParams.get('subject');
    const grade = searchParams.get('grade');
    const difficulty = searchParams.get('difficulty');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    try {
      // Try to use database queries
      const courses = await courseQueries.getCourses();

      // Apply filters
      let filteredCourses = courses;

      if (subject) {
        filteredCourses = filteredCourses.filter(course =>
          course.subject.name.toLowerCase().includes(subject.toLowerCase())
        );
      }

      if (grade) {
        filteredCourses = filteredCourses.filter(course => course.grade === parseInt(grade));
      }

      if (difficulty) {
        filteredCourses = filteredCourses.filter(
          course => course.difficulty === difficulty.toUpperCase()
        );
      }

      if (status) {
        filteredCourses = filteredCourses.filter(course => 
          'status' in course ? course.status === status.toUpperCase() : false
        );
      }

      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

      return NextResponse.json({
        success: true,
        data: paginatedCourses,
        total: filteredCourses.length,
        page,
        totalPages: Math.ceil(filteredCourses.length / limit),
      });
    } catch (dbError) {
      console.warn('Database not available, using mock data:', dbError);

      // Fallback to mock data
      let filteredCourses = mockCourses.filter(course => course.published);

      // Apply filters for mock data
      if (category && category !== 'all') {
        filteredCourses = filteredCourses.filter(course =>
          course.category.toLowerCase().includes(category.toLowerCase())
        );
      }

      if (level && level !== 'all') {
        filteredCourses = filteredCourses.filter(course =>
          course.level.toLowerCase().includes(level.toLowerCase())
        );
      }

      if (search) {
        const searchLower = search.toLowerCase();
        filteredCourses = filteredCourses.filter(
          course =>
            course.title.toLowerCase().includes(searchLower) ||
            course.description.toLowerCase().includes(searchLower) ||
            course.teacher.toLowerCase().includes(searchLower)
        );
      }

      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

      return NextResponse.json({
        success: true,
        data: paginatedCourses,
        total: filteredCourses.length,
        page,
        totalPages: Math.ceil(filteredCourses.length / limit),
        usingMockData: true,
      });
    }
  } catch (error) {
    console.error('Error in courses API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch courses',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.subjectId || !body.grade || !body.createdById) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: title, subjectId, grade, createdById',
        },
        { status: 400 }
      );
    }

    try {
      const course = await courseQueries.createCourse({
        title: body.title,
        description: body.description,
        subjectId: body.subjectId,
        grade: parseInt(body.grade),
        semester: body.semester ? parseInt(body.semester) : undefined,
        difficulty: body.difficulty || 'INTERMEDIATE',
        language: body.language || 'english',
        tags: body.tags || [],
        estimatedHours: body.estimatedHours ? parseInt(body.estimatedHours) : undefined,
        prerequisites: body.prerequisites || [],
        learningOutcomes: body.learningOutcomes || [],
        createdById: body.createdById,
      });

      return NextResponse.json({
        success: true,
        data: course,
      });
    } catch (dbError) {
      console.warn('Database not available for course creation:', dbError);

      // Return mock response
      const mockCourse = {
        id: `mock-${Date.now()}`,
        title: body.title,
        description: body.description,
        slug: body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        grade: parseInt(body.grade),
        difficulty: body.difficulty || 'INTERMEDIATE',
        language: body.language || 'english',
        status: 'DRAFT',
        isPublished: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return NextResponse.json({
        success: true,
        data: mockCourse,
        usingMockData: true,
      });
    }
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create course',
      },
      { status: 500 }
    );
  }
}
