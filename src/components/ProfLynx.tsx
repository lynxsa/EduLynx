'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, X, Send, TrendingUp, Users, BookOpen, Calendar } from 'lucide-react';

interface AnalyticsData {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  averageAttendance: number;
  recentActivity: string[];
}

interface ProfLynxProps {
  userRole: string;
  userName: string;
}

const ProfLynx: React.FC<ProfLynxProps> = ({ userRole, userName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: `Hello ${userName}! I'm Prof Lynx, your AI assistant. I can help you with analytics, insights, and answer questions about your educational data. How can I assist you today?`
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch analytics data from your backend
      const response = await fetch('/api/analytics');
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    setIsLoading(true);
    try {
      // Send to your backend AI endpoint
      const response = await fetch('/api/prof-lynx/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          userRole,
          analyticsData
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setChatMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'I apologize, but I encountered an issue processing your request. Please try again.' 
        }]);
      }
    } catch (error) {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I encountered a connection issue. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isOpen && !analyticsData) {
      fetchAnalytics();
    }
  }, [isOpen, analyticsData, fetchAnalytics]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 z-50"
        title="Prof Lynx AI Assistant"
      >
        <Bot className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">Prof Lynx</h3>
            <p className="text-xs text-white/80">AI Educational Assistant</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="hover:bg-white/20 p-1 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Analytics Dashboard */}
      {analyticsData && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Analytics</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white p-2 rounded flex items-center gap-2">
              <Users className="w-3 h-3 text-blue-500" />
              <div>
                <div className="font-medium">{analyticsData.totalStudents}</div>
                <div className="text-gray-500">Students</div>
              </div>
            </div>
            <div className="bg-white p-2 rounded flex items-center gap-2">
              <BookOpen className="w-3 h-3 text-green-500" />
              <div>
                <div className="font-medium">{analyticsData.totalTeachers}</div>
                <div className="text-gray-500">Teachers</div>
              </div>
            </div>
            <div className="bg-white p-2 rounded flex items-center gap-2">
              <Calendar className="w-3 h-3 text-purple-500" />
              <div>
                <div className="font-medium">{analyticsData.totalClasses}</div>
                <div className="text-gray-500">Classes</div>
              </div>
            </div>
            <div className="bg-white p-2 rounded flex items-center gap-2">
              <TrendingUp className="w-3 h-3 text-orange-500" />
              <div>
                <div className="font-medium">{analyticsData.averageAttendance}%</div>
                <div className="text-gray-500">Attendance</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg text-sm ${
                message.role === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-800">
              <div className="flex items-center gap-2">
                <div className="animate-pulse">Thinking...</div>
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Prof Lynx anything..."
            className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfLynx;
