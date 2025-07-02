import { NextRequest, NextResponse } from 'next/server';

// ProfLynx AI responses for different contexts
const aiResponses = {
  calculus: [
    'Let me help you understand calculus! The key concept here is that a limit describes what happens to a function as the input approaches a certain value. Think of it like approaching a destination - you get closer and closer without necessarily reaching it.',
    'Great question about derivatives! Remember that a derivative measures how fast something is changing. In real life, this could be the speed of a car (change in distance over time) or the slope of a hill (change in height over distance).',
    'For integration, think of it as the reverse of differentiation. If differentiation breaks things apart to find rates of change, integration puts things back together to find total amounts or areas.',
  ],
  algebra: [
    "Algebra is like solving puzzles! When we have an equation like 2x + 5 = 13, we're trying to find what number x makes this statement true. Let's work backwards: if 2x + 5 = 13, then 2x = 8, so x = 4.",
    'Functions are like machines - you put something in (the input), the machine does something to it (the rule), and something comes out (the output). For example, f(x) = 2x + 1 is a machine that doubles your input and adds 1.',
    "Quadratic equations might look scary, but they're just describing parabolas - those U-shaped curves. The solutions tell us where the parabola crosses the x-axis.",
  ],
  geometry: [
    "Geometry is all about shapes and their properties! When working with circles, remember that all points on a circle are the same distance from the center - that's the radius.",
    'Trigonometry helps us find missing sides and angles in triangles. SOH-CAH-TOA is your friend: Sin = Opposite/Hypotenuse, Cos = Adjacent/Hypotenuse, Tan = Opposite/Adjacent.',
    'Proofs in geometry are like detective work - we use what we know (given information and theorems) to figure out what we want to prove.',
  ],
  general: [
    "Hello! I'm ProfLynx, your AI learning assistant. I'm here to help you understand any concept in your studies. What would you like to learn about today?",
    'Remember, making mistakes is part of learning! Each error is an opportunity to understand the concept better. What specific topic are you working on?',
    'Breaking down complex problems into smaller steps often makes them much easier to solve. What problem are you currently facing?',
    "Practice makes perfect! The more you work with these concepts, the more natural they'll become. How can I help you practice today?",
  ],
};

const encouragements = [
  "You're doing great! Keep up the excellent work! 🌟",
  "That's a fantastic question! Curiosity leads to understanding. 💡",
  "I can see you're really thinking about this - that's the key to learning! 🧠",
  "Don't worry if this seems challenging at first - every expert was once a beginner! 💪",
  "You're making excellent progress! Each question brings you closer to mastery. 🎯",
];

function getContextualResponse(message: string, context?: any): string {
  const messageLower = message.toLowerCase();

  // Determine context based on message content
  let responseCategory = 'general';

  if (
    messageLower.includes('limit') ||
    messageLower.includes('derivative') ||
    messageLower.includes('calculus') ||
    messageLower.includes('integral')
  ) {
    responseCategory = 'calculus';
  } else if (
    messageLower.includes('equation') ||
    messageLower.includes('function') ||
    messageLower.includes('algebra') ||
    messageLower.includes('variable')
  ) {
    responseCategory = 'algebra';
  } else if (
    messageLower.includes('triangle') ||
    messageLower.includes('circle') ||
    messageLower.includes('geometry') ||
    messageLower.includes('angle')
  ) {
    responseCategory = 'geometry';
  }

  const responses = aiResponses[responseCategory as keyof typeof aiResponses];
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];

  return `${randomResponse}\n\n${randomEncouragement}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, context } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const response = getContextualResponse(message, context);

    return NextResponse.json({
      response,
      context: context || null,
      timestamp: new Date().toISOString(),
      id: Math.random().toString(36).substr(2, 9),
    });
  } catch (error) {
    console.error('Error in AI chat:', error);
    return NextResponse.json({ error: 'Failed to process AI request' }, { status: 500 });
  }
}

// Support streaming responses for real-time chat experience
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const message = searchParams.get('message');

  if (!message) {
    return NextResponse.json({ error: 'Message parameter is required' }, { status: 400 });
  }

  const response = getContextualResponse(message);

  return NextResponse.json({
    response,
    timestamp: new Date().toISOString(),
    id: Math.random().toString(36).substr(2, 9),
  });
}
