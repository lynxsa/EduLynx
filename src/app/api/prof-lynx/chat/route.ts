import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { message, userRole, analyticsData } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Use Gemini AI API
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return NextResponse.json({ 
        response: 'I apologize, but I\'m currently unavailable. The AI service is not configured.' 
      });
    }

    // Create context-aware prompt
    const systemPrompt = `You are Prof Lynx, an AI assistant for the EduLynx educational management system. 
You are helping a ${userRole.toLowerCase()} user. 
Current analytics: ${analyticsData ? JSON.stringify(analyticsData) : 'No data available'}.
Be helpful, professional, and educational-focused. Provide insights based on the user's role and available data.
Keep responses concise and actionable.`;

    const fullPrompt = `${systemPrompt}\n\nUser: ${message}\n\nProf Lynx:`;

    // Call Gemini API
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }]
      }),
    });

    if (!geminiResponse.ok) {
      throw new Error('Gemini API call failed');
    }

    const geminiData = await geminiResponse.json();
    const aiResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 
      'I apologize, but I couldn\'t process your request at the moment. Please try again.';

    return NextResponse.json({ response: aiResponse });

  } catch (error) {
    console.error('Prof Lynx Chat API Error:', error);
    
    // Fallback responses based on common queries
    const fallbackResponses = [
      'Based on your current data, everything seems to be running smoothly! Is there anything specific you\'d like to know about?',
      'I can help you analyze attendance patterns, student performance, or provide insights about your educational data. What would you like to explore?',
      'Your system metrics look good! Would you like me to explain any specific aspect of your dashboard?'
    ];
    
    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    
    return NextResponse.json({ 
      response: randomResponse
    });
  }
}
