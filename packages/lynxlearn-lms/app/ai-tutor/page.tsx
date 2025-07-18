'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function AITutorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI Tutor. How can I help you with your studies today?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to sign-in if not authenticated
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Mock AI response - in production, this would call an AI service
      const aiResponse = generateAIResponse(input);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };

      setTimeout(() => {
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error generating AI response:', error);
      setIsLoading(false);
    }
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('math') || input.includes('algebra') || input.includes('calculus')) {
      return 'I can help you with mathematics! What specific math topic would you like to work on? I can explain concepts, solve problems step-by-step, or provide practice questions.';
    } else if (input.includes('science') || input.includes('physics') || input.includes('chemistry')) {
      return 'Science is fascinating! I can assist with physics, chemistry, and life sciences. What would you like to explore? I can explain concepts, help with experiments, or discuss real-world applications.';
    } else if (input.includes('english') || input.includes('essay') || input.includes('writing')) {
      return 'I\'m here to help with English! Whether you need help with essay writing, grammar, literature analysis, or reading comprehension, I can guide you through it.';
    } else if (input.includes('help') || input.includes('study') || input.includes('learn')) {
      return 'I\'m here to support your learning journey! I can help with:\n• Subject explanations\n• Problem-solving strategies\n• Study tips and techniques\n• Practice questions\n• Exam preparation\n\nWhat subject or topic would you like to focus on?';
    } else {
      return 'That\'s an interesting question! I\'m here to help you learn and understand various subjects. Could you tell me which subject area you\'d like to explore, or what specific topic you\'re working on?';
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-gray-600">Please sign in to access the AI Tutor.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-lg">
          <h1 className="text-3xl font-bold mb-2">AI Tutor</h1>
          <p className="text-purple-100">Your personal AI learning assistant</p>
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg whitespace-pre-wrap ${
                  message.sender === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 border border-gray-200 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-bounce w-2 h-2 bg-purple-600 rounded-full"></div>
                  <div className="animate-bounce w-2 h-2 bg-purple-600 rounded-full" style={{ animationDelay: '0.1s' }}></div>
                  <div className="animate-bounce w-2 h-2 bg-purple-600 rounded-full" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-gray-200 bg-white rounded-b-lg">
          <div className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about your studies..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Math Help', description: 'Algebra, Calculus, Geometry', icon: '📐' },
          { title: 'Science Support', description: 'Physics, Chemistry, Biology', icon: '🔬' },
          { title: 'English Assistance', description: 'Writing, Literature, Grammar', icon: '📚' },
          { title: 'Study Tips', description: 'Learning strategies & techniques', icon: '💡' },
        ].map((action, index) => (
          <button
            key={index}
            onClick={() => setInput(`I need help with ${action.title.toLowerCase()}`)}
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
          >
            <div className="text-2xl mb-2">{action.icon}</div>
            <h3 className="font-semibold text-gray-800">{action.title}</h3>
            <p className="text-sm text-gray-600">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}