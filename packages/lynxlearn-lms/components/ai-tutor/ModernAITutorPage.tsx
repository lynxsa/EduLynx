'use client';

import { motion } from 'framer-motion';
import {
  Atom,
  BookOpen,
  Brain,
  Calculator,
  Clock,
  Globe,
  Image as ImageIcon,
  MessageSquare,
  Mic,
  Paperclip,
  Send,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ModernLayout } from '../../components/ui/modern-layout';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'image';
}

export default function ModernAITutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI tutor, ready to help you excel in your NSC subjects. What would you like to learn about today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickSuggestions = [
    { text: 'Explain calculus derivatives', icon: Calculator, subject: 'Mathematics' },
    { text: 'Help with organic chemistry', icon: Atom, subject: 'Physical Sciences' },
    { text: 'Genetics and heredity concepts', icon: BookOpen, subject: 'Life Sciences' },
    { text: 'Essay writing techniques', icon: BookOpen, subject: 'English' },
    { text: 'Geography map reading', icon: Globe, subject: 'Geography' },
    { text: 'Study group strategies', icon: Users, subject: 'Study Tips' },
  ];

  const featuredTopics = [
    {
      title: 'NSC Mathematics',
      description: 'Algebra, Calculus, Geometry, Statistics',
      icon: Calculator,
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
      questions: 1247,
    },
    {
      title: 'Physical Sciences',
      description: 'Physics, Chemistry, Scientific Method',
      icon: Atom,
      gradient: 'from-blue-500 to-cyan-600',
      bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      questions: 892,
    },
    {
      title: 'Life Sciences',
      description: 'Biology, Ecology, Human Physiology',
      icon: BookOpen,
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      questions: 634,
    },
  ];

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(
      () => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text:
            "I understand you're asking about " +
            inputText +
            '. Let me break this down for you with a detailed explanation and examples...',
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      },
      1000 + Math.random() * 2000
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
  };

  return (
    <ModernLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="h-[calc(100vh-8rem)] flex flex-col"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex-shrink-0 mb-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 p-8 text-white">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2 flex items-center">
                    <Brain className="w-10 h-10 mr-3" />
                    AI Tutor
                  </h1>
                  <p className="text-purple-100 text-lg">
                    Your intelligent study companion for NSC success
                  </p>

                  {/* Quick Stats */}
                  <div className="flex items-center space-x-6 mt-4">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-5 h-5" />
                      <span>24/7 Available</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5" />
                      <span>Expert Knowledge</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="w-5 h-5" />
                      <span>Instant Responses</span>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <Sparkles className="w-16 h-16" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-1 gap-6 min-h-0">
          {/* Chat Area */}
          <motion.div
            variants={itemVariants}
            className="flex-1 flex flex-col bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden"
          >
            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}
                  >
                    {message.sender === 'ai' && (
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                          <Brain className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          AI Tutor
                        </span>
                      </div>
                    )}
                    <div
                      className={`p-4 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.text}</p>
                      <div
                        className={`text-xs mt-2 ${message.sender === 'user' ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      AI Tutor
                    </span>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl p-4 ml-10">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-100"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex-shrink-0 border-t border-slate-200 dark:border-slate-700 p-6">
              {/* Quick Suggestions */}
              {messages.length <= 1 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Quick suggestions:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {quickSuggestions.slice(0, 4).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion.text)}
                        className="flex items-center space-x-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors text-sm"
                      >
                        <suggestion.icon className="w-4 h-4" />
                        <span>{suggestion.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-end space-x-4">
                <div className="flex-1 relative">
                  <textarea
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about your NSC subjects..."
                    className="w-full p-4 pr-12 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[3rem] max-h-32"
                    rows={1}
                  />
                  <div className="absolute right-3 bottom-3 flex items-center space-x-2">
                    <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors">
                      <Paperclip className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </button>
                    <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors">
                      <ImageIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </button>
                    <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors">
                      <Mic className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isLoading}
                  className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-xl transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div variants={itemVariants} className="w-80 space-y-6">
            {/* Featured Topics */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
                Popular Topics
              </h3>
              <div className="space-y-3">
                {featuredTopics.map((topic, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl bg-gradient-to-br ${topic.bgGradient} border border-white/20 cursor-pointer hover:shadow-lg transition-all`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-r ${topic.gradient} flex items-center justify-center text-white`}
                      >
                        <topic.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                          {topic.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {topic.questions} questions answered
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {topic.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Study Tips */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Study Tips
              </h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    💡 Break complex problems into smaller steps
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    📚 Practice active recall while studying
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700">
                  <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                    ⏰ Use the Pomodoro technique
                  </p>
                </div>
              </div>
            </div>

            {/* Session Stats */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Session Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Questions Asked
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Time Spent</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">12m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Topics Covered</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">3</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </ModernLayout>
  );
}
