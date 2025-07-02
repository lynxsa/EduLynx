import { NextRequest, NextResponse } from 'next/server';

// Enhanced course data with modules and lessons
const courseData: Record<string, any> = {
  '1': {
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
    progress: 37.5,
    enrolled: true,
    modules: [
      {
        id: '1',
        title: 'Module 1: Functions and Algebra',
        description: 'Master functions, equations, and algebraic manipulation.',
        duration: '3 weeks',
        completed: true,
        lessons: [
          {
            id: '1',
            title: 'Introduction to Functions',
            duration: '45 min',
            completed: true,
            type: 'video',
            description: 'Understanding function notation and basic properties',
          },
          {
            id: '2',
            title: 'Linear Functions and Graphs',
            duration: '60 min',
            completed: true,
            type: 'video',
            description: 'Graphing linear functions and interpreting slopes',
          },
          {
            id: '3',
            title: 'Quadratic Functions',
            duration: '75 min',
            completed: true,
            type: 'video',
            description: 'Working with parabolas and quadratic equations',
          },
          {
            id: '4',
            title: 'Functions Quiz',
            duration: '30 min',
            completed: true,
            type: 'quiz',
            description: 'Test your understanding of functions',
          },
        ],
      },
      {
        id: '2',
        title: 'Module 2: Calculus Fundamentals',
        description: 'Introduction to limits, derivatives, and basic calculus concepts.',
        duration: '4 weeks',
        completed: false,
        lessons: [
          {
            id: '5',
            title: 'Introduction to Limits',
            duration: '60 min',
            completed: true,
            type: 'video',
            description: 'Understanding the concept of limits',
          },
          {
            id: '6',
            title: 'Calculating Derivatives',
            duration: '75 min',
            completed: false,
            type: 'video',
            description: 'Learn differentiation rules and techniques',
          },
          {
            id: '7',
            title: 'Applications of Derivatives',
            duration: '90 min',
            completed: false,
            type: 'video',
            description: 'Real-world applications of calculus',
          },
          {
            id: '8',
            title: 'Calculus Practice Problems',
            duration: '45 min',
            completed: false,
            type: 'assignment',
            description: 'Solve calculus problems with step-by-step guidance',
          },
        ],
      },
      {
        id: '3',
        title: 'Module 3: Geometry and Trigonometry',
        description: 'Explore geometric relationships and trigonometric functions.',
        duration: '3 weeks',
        completed: false,
        lessons: [
          {
            id: '9',
            title: 'Circle Geometry',
            duration: '60 min',
            completed: false,
            type: 'video',
            description: 'Properties of circles and geometric proofs',
          },
          {
            id: '10',
            title: 'Trigonometric Functions',
            duration: '75 min',
            completed: false,
            type: 'video',
            description: 'Understanding sin, cos, and tan functions',
          },
          {
            id: '11',
            title: 'Solving Triangles',
            duration: '60 min',
            completed: false,
            type: 'video',
            description: 'Using trigonometry to solve triangle problems',
          },
        ],
      },
      {
        id: '4',
        title: 'Module 4: Statistics and Probability',
        description: 'Data analysis and probability for NSC requirements.',
        duration: '2 weeks',
        completed: false,
        lessons: [
          {
            id: '12',
            title: 'Data Analysis',
            duration: '60 min',
            completed: false,
            type: 'video',
            description: 'Interpreting graphs and statistical measures',
          },
          {
            id: '13',
            title: 'Probability Basics',
            duration: '45 min',
            completed: false,
            type: 'video',
            description: 'Understanding probability concepts',
          },
          {
            id: '14',
            title: 'Final Assessment',
            duration: '120 min',
            completed: false,
            type: 'quiz',
            description: 'Comprehensive NSC-style examination',
          },
        ],
      },
    ],
  },
  '2': {
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
    enrolled: false,
    modules: [
      {
        id: '1',
        title: 'Module 1: Chemistry Fundamentals',
        description: 'Basic chemical principles and atomic structure.',
        duration: '4 weeks',
        completed: false,
        lessons: [
          {
            id: '1',
            title: 'Atomic Structure',
            duration: '60 min',
            completed: false,
            type: 'video',
            description: 'Understanding atoms, electrons, and chemical bonding',
          },
          {
            id: '2',
            title: 'Chemical Equations',
            duration: '45 min',
            completed: false,
            type: 'video',
            description: 'Balancing equations and stoichiometry',
          },
        ],
      },
    ],
  },
};

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const courseId = params.id;
    const course = courseData[courseId];

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 });
  }
}
