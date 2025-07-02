import { NextRequest, NextResponse } from 'next/server';

// Mock lesson content data
const lessonContents = {
  '1': {
    '1': {
      title: 'Introduction to Algebraic Expressions',
      content: `
        <h2>What is an algebraic expression?</h2>
        <p>An algebraic expression is a mathematical phrase that contains variables, numbers, and operations.</p>
        
        <h3>Components of algebraic expressions:</h3>
        <ul>
          <li><strong>Variables:</strong> Letters that represent unknown values (x, y, z, etc.)</li>
          <li><strong>Constants:</strong> Fixed numerical values</li>
          <li><strong>Operators:</strong> Mathematical operations (+, -, ×, ÷)</li>
          <li><strong>Exponents:</strong> Powers to which a value is raised</li>
        </ul>
        
        <h3>Examples:</h3>
        <ul>
          <li>3x + 5</li>
          <li>2x² - 4y + 7</li>
          <li>a/b - 3c</li>
        </ul>
        
        <h2>Terms and Coefficients</h2>
        <p>A term is a part of an expression separated by + or - signs.</p>
        <p>The coefficient is the numerical factor of a term.</p>
        
        <h3>Example:</h3>
        <p>In the expression <strong>5x² + 3xy - 7y + 2</strong></p>
        <ul>
          <li>5x² is a term with coefficient 5</li>
          <li>3xy is a term with coefficient 3</li>
          <li>-7y is a term with coefficient -7</li>
          <li>2 is a constant term</li>
        </ul>
      `,
      video: 'https://www.youtube.com/embed/ZKehlWpnT2E',
      exercises: [
        {
          question: 'Identify the terms in the expression: 7x² - 4xy + 9',
          answer: '7x², -4xy, and 9',
        },
        { question: 'Find the coefficient of y in the expression: 5x - 12y + 3', answer: '-12' },
        {
          question: 'Write an algebraic expression for: Five more than twice a number',
          answer: '2x + 5',
        },
      ],
      nextLessonId: 2,
      prevLessonId: null,
    },
    '2': {
      title: 'Working with Linear Equations',
      content: `
        <h2>What is a linear equation?</h2>
        <p>A linear equation is an equation where the highest power of the variable is 1.</p>
        
        <h3>Standard form:</h3>
        <p>ax + b = c</p>
        
        <h3>Examples:</h3>
        <ul>
          <li>2x + 5 = 15</li>
          <li>4x - 7 = 9</li>
          <li>3x = 12</li>
        </ul>
        
        <h2>Solving Linear Equations</h2>
        <p>To solve a linear equation, we isolate the variable.</p>
        
        <h3>Steps:</h3>
        <ol>
          <li>Simplify both sides of the equation.</li>
          <li>Use inverse operations to isolate the variable.</li>
          <li>Verify your solution.</li>
        </ol>
        
        <h3>Example:</h3>
        <p>Solve 2x + 5 = 15</p>
        <ul>
          <li>2x + 5 - 5 = 15 - 5 (subtract 5 from both sides)</li>
          <li>2x = 10</li>
          <li>2x/2 = 10/2 (divide both sides by 2)</li>
          <li>x = 5</li>
          <li>Verify: 2(5) + 5 = 10 + 5 = 15 ✓</li>
        </ul>
      `,
      video: 'https://www.youtube.com/embed/bAerloq-cWI',
      exercises: [
        { question: 'Solve for x: 3x + 4 = 19', answer: 'x = 5' },
        { question: 'Solve for y: 5y - 8 = 12', answer: 'y = 4' },
        { question: 'Solve for z: 2z + 6 = z + 16', answer: 'z = 10' },
      ],
      nextLessonId: 3,
      prevLessonId: 1,
    },
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; lessonId: string } }
) {
  const { id, lessonId } = params;

  // Check if we have content for this course
  if (!lessonContents[id as keyof typeof lessonContents]) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  }

  // Check if we have content for this lesson
  const courseLessons = lessonContents[id as keyof typeof lessonContents];
  if (!courseLessons[lessonId as keyof typeof courseLessons]) {
    return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
  }

  return NextResponse.json(courseLessons[lessonId as keyof typeof courseLessons]);
}
