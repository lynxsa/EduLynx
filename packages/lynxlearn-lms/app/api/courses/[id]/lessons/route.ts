import { NextRequest, NextResponse } from 'next/server';

// Mock lessons data by course ID
const courseLeasons = {
  '1': [
    { id: 1, title: 'Introduction to Algebraic Expressions', duration: '45 min', completed: true },
    { id: 2, title: 'Working with Linear Equations', duration: '60 min', completed: true },
    { id: 3, title: 'Solving Quadratic Equations', duration: '75 min', completed: true },
    { id: 4, title: 'Understanding Polynomials', duration: '60 min', completed: false },
    { id: 5, title: 'Graphing Functions', duration: '90 min', completed: false },
    { id: 6, title: 'Systems of Equations', duration: '60 min', completed: false },
    { id: 7, title: 'Introduction to Trigonometry', duration: '75 min', completed: false },
    { id: 8, title: 'Trigonometric Functions', duration: '45 min', completed: false },
  ],
  '2': [
    { id: 1, title: 'Forces and Motion', duration: '60 min', completed: true },
    { id: 2, title: 'Energy and Work', duration: '45 min', completed: true },
    { id: 3, title: 'Thermal Physics', duration: '60 min', completed: true },
    { id: 4, title: 'Elements and Compounds', duration: '75 min', completed: true },
    { id: 5, title: 'Chemical Reactions', duration: '90 min', completed: false },
    { id: 6, title: 'Acids and Bases', duration: '60 min', completed: false },
  ],
  '3': [
    { id: 1, title: 'Introduction to Literary Analysis', duration: '45 min', completed: true },
    { id: 2, title: 'Shakespeare: Romeo and Juliet', duration: '90 min', completed: true },
    { id: 3, title: 'Poetry Analysis', duration: '60 min', completed: true },
    { id: 4, title: 'Essay Structure and Planning', duration: '75 min', completed: true },
    { id: 5, title: 'Critical Reading Skills', duration: '45 min', completed: true },
    { id: 6, title: 'Novel Study: Things Fall Apart', duration: '90 min', completed: false },
  ],
  '4': [
    { id: 1, title: 'Pre-Colonial South Africa', duration: '60 min', completed: true },
    { id: 2, title: 'Colonialism in Africa', duration: '75 min', completed: true },
    { id: 3, title: 'Apartheid Era', duration: '90 min', completed: false },
    { id: 4, title: 'Transition to Democracy', duration: '60 min', completed: false },
    { id: 5, title: 'World War I', duration: '75 min', completed: false },
  ],
  '5': [
    { id: 1, title: 'Introduction to Programming', duration: '60 min', completed: true },
    { id: 2, title: 'Variables and Data Types', duration: '45 min', completed: true },
    { id: 3, title: 'Control Flow and Loops', duration: '75 min', completed: true },
    { id: 4, title: 'Functions and Methods', duration: '60 min', completed: false },
    { id: 5, title: 'Arrays and Lists', duration: '45 min', completed: false },
    { id: 6, title: 'Introduction to Algorithms', duration: '90 min', completed: false },
  ],
};

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const courseId = params.id;

  if (!courseLeasons[courseId as keyof typeof courseLeasons]) {
    return NextResponse.json({ error: 'Lessons not found for this course' }, { status: 404 });
  }

  return NextResponse.json(courseLeasons[courseId as keyof typeof courseLeasons]);
}
