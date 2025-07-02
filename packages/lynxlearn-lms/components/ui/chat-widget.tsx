// ProfLynx AI Chat Widget for LynxLearn LMS
'use client';

import {
  BookOpen,
  Bot,
  Brain,
  HelpCircle,
  Lightbulb,
  Minimize2,
  Send,
  Sparkles,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from './button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './card';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'explanation' | 'summary' | 'help';
}

interface ChatWidgetProps {
  courseId?: string;
  lessonId?: string;
  context?: {
    courseName?: string;
    lessonTitle?: string;
    currentTopic?: string;
    timestamp?: number;
  };
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  onClose?: () => void;
}

const quickActions = [
  {
    id: 'explain',
    label: 'Explain this',
    icon: Brain,
    prompt: 'Can you explain this concept in simple terms?',
    color: 'bg-blue-500',
  },
  {
    id: 'summarize',
    label: 'Summarize',
    icon: BookOpen,
    prompt: 'Can you provide a summary of this lesson?',
    color: 'bg-green-500',
  },
  {
    id: 'help',
    label: 'Need help',
    icon: HelpCircle,
    prompt: 'I need help understanding this topic. Can you help?',
    color: 'bg-purple-500',
  },
  {
    id: 'examples',
    label: 'Show examples',
    icon: Lightbulb,
    prompt: 'Can you show me some examples of this concept?',
    color: 'bg-orange-500',
  },
];

export default function ChatWidget({
  courseId,
  lessonId,
  context,
  isMinimized = false,
  onToggleMinimize,
  onClose,
}: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hello! I'm ProfLynx, your AI learning assistant. I'm here to help you understand ${context?.courseName || 'this course'} better. Feel free to ask me anything!`,
      isUser: false,
      timestamp: new Date(),
      type: 'text',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate API call to ProfLynx AI
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          context: {
            courseId,
            lessonId,
            ...context,
          },
        }),
      });

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || getDefaultResponse(message),
        isUser: false,
        timestamp: new Date(),
        type: data.type || 'text',
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting right now. Please try again in a moment!",
        isUser: false,
        timestamp: new Date(),
        type: 'text',
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('explain') || lowerMessage.includes('what is')) {
      return 'Great question! Let me break this down for you in simple terms. This concept is fundamental to understanding the broader topic. Would you like me to provide some examples to illustrate this better?';
    }

    if (lowerMessage.includes('summary') || lowerMessage.includes('summarize')) {
      return "Here's a concise summary of the key points: \n\n1. Main concept overview\n2. Key applications and examples\n3. How this connects to other topics\n\nWould you like me to elaborate on any of these points?";
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('stuck')) {
      return "I'm here to help! Let's work through this step by step. Can you tell me specifically what part you're finding challenging? I can provide different explanations or examples until it clicks for you.";
    }

    if (lowerMessage.includes('example') || lowerMessage.includes('show me')) {
      return 'Absolutely! Here are some practical examples:\n\nExample 1: [Real-world application]\nExample 2: [Academic context]\nExample 3: [Everyday scenario]\n\nWhich example resonates most with you?';
    }

    return "That's an excellent question! Based on what we're covering in this lesson, I can help you understand this concept better. Could you provide a bit more context about what specifically you'd like to know?";
  };

  const handleQuickAction = (action: (typeof quickActions)[0]) => {
    sendMessage(action.prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputMessage);
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggleMinimize}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
        >
          <Bot className="h-6 w-6 text-white" />
        </Button>

        {messages.length > 1 && (
          <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
            {messages.filter(m => !m.isUser).length - 1}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-96 h-[600px] shadow-2xl border-2 border-purple-200 dark:border-purple-800">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Bot className="h-6 w-6" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <CardTitle className="text-lg">ProfLynx AI</CardTitle>
              <p className="text-xs text-blue-100">Your Learning Assistant</p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleMinimize}
              className="h-8 w-8 text-white hover:bg-white/20"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>

            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        {/* Quick Actions */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick Actions:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map(action => {
              const IconComponent = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action)}
                  disabled={isLoading}
                  className="flex items-center space-x-2 p-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-xs disabled:opacity-50"
                >
                  <div className={`p-1 rounded ${action.color} text-white`}>
                    <IconComponent className="h-3 w-3" />
                  </div>
                  <span className="truncate">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.isUser
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {!message.isUser && (
                    <Sparkles className="h-4 w-4 text-purple-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-[80%]">
                <div className="flex items-center space-x-2">
                  <Bot className="h-4 w-4 text-purple-500" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      <CardFooter className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex space-x-2 w-full">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask ProfLynx anything..."
            disabled={isLoading}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 dark:bg-gray-700 dark:text-white"
          />
          <Button
            onClick={() => sendMessage(inputMessage)}
            disabled={!inputMessage.trim() || isLoading}
            size="icon"
            variant="gradient"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
