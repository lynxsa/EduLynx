import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Define a type for incoming messages
interface GeminiMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: NextRequest) {
  const { messages } = await req.json() as { messages: GeminiMessage[] };
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ role: 'assistant', content: 'Gemini API key not configured.' }, { status: 500 });
  }
  try {
    // Prepare messages for Gemini (convert to Gemini format)
    const geminiMessages = messages.map((m: GeminiMessage) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
    const body = JSON.stringify({ contents: geminiMessages });
    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    if (!geminiRes.ok) {
      const error = await geminiRes.text();
      return NextResponse.json({ role: 'assistant', content: `Gemini error: ${error}` }, { status: 500 });
    }
    const geminiData = await geminiRes.json();
    const aiReply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'Prof. Lynx could not answer right now.';
    return NextResponse.json({ role: 'assistant', content: aiReply });
  } catch (err: unknown) {
    let message = 'Gemini integration failed.';
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ role: 'assistant', content: message }, { status: 500 });
  }
}
