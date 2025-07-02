// ProfLynx AI Chat API Route
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Simulate AI processing (replace with actual AI service call)
    const response = await processAIRequest(message, context);

    return NextResponse.json({
      response: response.content,
      type: response.type,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in AI chat:', error);
    return NextResponse.json({ error: 'Failed to process AI request' }, { status: 500 });
  }
}

async function processAIRequest(message: string, context: any) {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  const lowerMessage = message.toLowerCase();

  // Context-aware responses
  if (context?.courseName && context?.lessonTitle) {
    if (lowerMessage.includes('explain') || lowerMessage.includes('what is')) {
      return {
        content: `Great question about ${context.lessonTitle}! Let me explain this concept in the context of ${context.courseName}:\n\nThis topic is fundamental because it connects to several key learning outcomes. Here's a step-by-step breakdown:\n\n1. **Core Concept**: The main idea builds on previous lessons\n2. **Practical Application**: How this applies in real-world scenarios\n3. **Connection to NSC**: How this relates to your exam requirements\n\nWould you like me to provide specific examples or practice problems?`,
        type: 'explanation',
      };
    }

    if (lowerMessage.includes('summary') || lowerMessage.includes('summarize')) {
      return {
        content: `Here's a comprehensive summary of "${context.lessonTitle}" from ${context.courseName}:\n\n**Key Points:**\n• Main learning objective and outcomes\n• Essential concepts you need to master\n• How this fits into the broader curriculum\n\n**For Your NSC:**\n• This topic typically appears in [specific exam sections]\n• Common question types and formats\n• Recommended study strategies\n\n**Next Steps:**\n• Practice problems to reinforce learning\n• Review related concepts\n• Prepare for upcoming assessments\n\nWhat specific aspect would you like me to elaborate on?`,
        type: 'summary',
      };
    }

    if (
      lowerMessage.includes('help') ||
      lowerMessage.includes('stuck') ||
      lowerMessage.includes('understand')
    ) {
      return {
        content: `I can see you're working on ${context.lessonTitle} - let's tackle this together! 🎯\n\n**Let's break this down:**\n1. What specific part is challenging you?\n2. Have you reviewed the prerequisite concepts?\n3. Would visual examples or step-by-step solutions help?\n\n**I can help with:**\n• Simplifying complex explanations\n• Providing analogies and real-world examples\n• Creating practice problems\n• Connecting to previous lessons\n\n**Study Tips for ${context.courseName}:**\n• Regular practice with past papers\n• Creating concept maps\n• Teaching the concept to someone else\n\nWhat would be most helpful right now?`,
        type: 'help',
      };
    }

    if (
      lowerMessage.includes('example') ||
      lowerMessage.includes('show me') ||
      lowerMessage.includes('practice')
    ) {
      return {
        content: `Perfect! Here are some practical examples for ${context.lessonTitle}:\n\n**Example 1: Real-World Application**\n[Detailed example with step-by-step solution]\n\n**Example 2: NSC-Style Question**\n[Exam-format question with explanation]\n\n**Example 3: Common Mistake to Avoid**\n[What students often get wrong and how to avoid it]\n\n**Practice Problems:**\n1. [Easy level problem]\n2. [Medium level problem]\n3. [Advanced level problem]\n\nWould you like me to create more examples or explain any of these in more detail?`,
        type: 'examples',
      };
    }
  }

  // General responses for different types of questions
  if (
    lowerMessage.includes('mathematics') ||
    lowerMessage.includes('math') ||
    lowerMessage.includes('algebra') ||
    lowerMessage.includes('calculus')
  ) {
    return {
      content: `Mathematics is such an important subject for your NSC! 📊\n\n**Key Tips for Success:**\n• Practice regularly - even 15 minutes daily makes a difference\n• Understand concepts before memorizing formulas\n• Work through past papers to understand question patterns\n• Don't skip steps - show your working clearly\n\n**Common Math Topics Students Ask About:**\n• Algebra and equations\n• Functions and graphs\n• Calculus (differentiation and integration)\n• Statistics and probability\n• Geometry and trigonometry\n\nWhat specific math topic would you like help with today?`,
      type: 'subject-help',
    };
  }

  if (
    lowerMessage.includes('science') ||
    lowerMessage.includes('physics') ||
    lowerMessage.includes('chemistry') ||
    lowerMessage.includes('biology')
  ) {
    return {
      content: `Physical and Life Sciences are fascinating! 🔬\n\n**Study Strategies:**\n• Connect theory to practical applications\n• Use diagrams and visual aids\n• Practice calculations and problem-solving\n• Understand scientific method and processes\n\n**Key Areas:**\n• **Physics**: Motion, forces, waves, electricity\n• **Chemistry**: Atomic structure, reactions, stoichiometry\n• **Biology**: Cell biology, genetics, ecology\n\nRemember, science is all about understanding how things work. What scientific concept would you like to explore?`,
      type: 'subject-help',
    };
  }

  if (
    lowerMessage.includes('english') ||
    lowerMessage.includes('language') ||
    lowerMessage.includes('writing') ||
    lowerMessage.includes('literature')
  ) {
    return {
      content: `English Home Language is crucial for all your subjects! 📚\n\n**Essential Skills:**\n• Reading comprehension and analysis\n• Essay writing and structure\n• Creative writing techniques\n• Literature appreciation\n• Critical thinking\n\n**For NSC Success:**\n• Practice analyzing different text types\n• Develop your vocabulary\n• Master essay structures (argumentative, narrative, descriptive)\n• Read widely to improve comprehension\n\nWhat aspect of English would you like to work on - comprehension, writing, or literature analysis?`,
      type: 'subject-help',
    };
  }

  if (
    lowerMessage.includes('study') ||
    lowerMessage.includes('exam') ||
    lowerMessage.includes('nsc') ||
    lowerMessage.includes('prepare')
  ) {
    return {
      content: `Great question about NSC preparation! 🎯\n\n**Effective Study Strategies:**\n• Create a study timetable and stick to it\n• Use active learning techniques (summarizing, teaching others)\n• Practice with past papers regularly\n• Form study groups with classmates\n• Take regular breaks to avoid burnout\n\n**NSC Exam Tips:**\n• Understand the exam format for each subject\n• Time management during exams\n• Read questions carefully\n• Plan your answers before writing\n• Review your work if time allows\n\n**Stress Management:**\n• Get enough sleep and exercise\n• Eat healthy foods\n• Practice relaxation techniques\n• Stay positive and confident\n\nWhat specific aspect of exam preparation would you like help with?`,
      type: 'study-tips',
    };
  }

  // Default response
  return {
    content: `That's an excellent question! 🤔\n\nI'm here to help you succeed in your NSC journey. I can assist with:\n\n• **Subject-specific questions** (Math, Sciences, English, etc.)\n• **Study strategies** and exam preparation\n• **Concept explanations** in simple terms\n• **Practice problems** and examples\n• **Study planning** and time management\n\nCould you tell me more about what you're working on? The more specific you are, the better I can help you understand the concept! 💪`,
    type: 'general',
  };
}
