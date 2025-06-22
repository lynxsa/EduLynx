'use client';
import { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  TrendingUp,
  Users,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  BarChart3,
} from 'lucide-react';

interface AIRecommendation {
  type: 'insight' | 'action' | 'warning' | 'success';
  title: string;
  description: string;
  confidence: number;
  category: 'academic' | 'operational' | 'financial' | 'engagement';
}

interface ChatMessage {
  type: 'ai' | 'user';
  message: string;
  timestamp: string;
}

interface ProfLynxAIProps {
  recommendations: AIRecommendation[];
  className?: string;
}

export function ProfLynxAI({ recommendations, className = '' }: ProfLynxAIProps) {
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      type: 'ai',
      message:
        "Hello! I'm Prof Lynx, your AI assistant. I've analyzed your school's data and have some insights for you. How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'insight':
        return Lightbulb;
      case 'action':
        return TrendingUp;
      case 'warning':
        return AlertTriangle;
      case 'success':
        return CheckCircle;
      default:
        return Sparkles;
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'insight':
        return 'bg-blue-50 border-blue-200 text-blue-900';
      case 'action':
        return 'bg-purple-50 border-purple-200 text-purple-900';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'academic':
        return BookOpen;
      case 'operational':
        return Users;
      case 'financial':
        return BarChart3;
      case 'engagement':
        return Users;
      default:
        return Sparkles;
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      type: 'user',
      message: chatInput,
      timestamp: new Date().toISOString(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        type: 'ai',
        message:
          "I understand your question. Based on your school's current data, I recommend focusing on improving student engagement through targeted interventions. Would you like me to provide specific strategies?",
        timestamp: new Date().toISOString(),
      };
      setChatMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <Bot className="w-8 h-8 text-purple-600" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Prof Lynx AI</h3>
          <p className="text-sm text-gray-600">Your intelligent school management assistant</p>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Smart Recommendations
        </h4>
        <div className="space-y-3">
          {recommendations.slice(0, 3).map((rec, index) => {
            const Icon = getRecommendationIcon(rec.type);
            const CategoryIcon = getCategoryIcon(rec.category);
            return (
              <div
                key={index}
                className={`border rounded-lg p-4 ${getRecommendationColor(rec.type)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium">{rec.title}</h5>
                        <CategoryIcon className="w-4 h-4 opacity-60" />
                      </div>
                      <p className="text-sm opacity-90">{rec.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-current rounded-full opacity-60" />
                          <span className="text-xs opacity-80">{rec.confidence}% confidence</span>
                        </div>
                        <span className="text-xs opacity-60 uppercase tracking-wide">
                          {rec.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Ask Prof Lynx</h4>

        <div className="bg-gray-50 rounded-lg p-3 mb-3 max-h-48 overflow-y-auto">
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`mb-3 last:mb-0 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}
            >
              <div
                className={`inline-block max-w-[80%] p-3 rounded-lg ${
                  msg.type === 'user' ? 'bg-purple-600 text-white' : 'bg-white border text-gray-900'
                }`}
              >
                <p className="text-sm">{msg.message}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="text-left">
              <div className="inline-block bg-white border p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    />
                    <div
                      className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">Prof Lynx is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about your school's performance..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !chatInput.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
