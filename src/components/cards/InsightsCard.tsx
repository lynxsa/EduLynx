'use client';
import { useState } from 'react';
import { Brain, TrendingUp, Users, BookOpen, Target, MessageSquare } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

interface InsightData {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

export function InsightsCard() {
  const [activeTab, setActiveTab] = useState<'performance' | 'predictions' | 'recommendations'>(
    'performance'
  );

  const performanceData = [
    { name: 'Math', value: 85, color: '#3b82f6' },
    { name: 'Science', value: 78, color: '#10b981' },
    { name: 'English', value: 92, color: '#f59e0b' },
    { name: 'History', value: 76, color: '#ef4444' },
  ];

  const insights: InsightData[] = [
    {
      title: 'Student Engagement',
      value: '87%',
      change: '+5.2%',
      trend: 'up',
      color: 'text-green-600',
    },
    {
      title: 'Assignment Completion',
      value: '94%',
      change: '+2.1%',
      trend: 'up',
      color: 'text-blue-600',
    },
    {
      title: 'Average Grade',
      value: '83.5',
      change: '-1.3%',
      trend: 'down',
      color: 'text-orange-600',
    },
  ];

  const predictions = [
    { subject: 'Math', current: 78, predicted: 82 },
    { subject: 'Science', current: 85, predicted: 87 },
    { subject: 'English', current: 79, predicted: 84 },
    { subject: 'History', current: 74, predicted: 76 },
  ];

  const recommendations = [
    {
      type: 'Academic',
      message: 'Consider additional Math tutoring sessions for Grade 9 students',
      priority: 'high',
      icon: BookOpen,
    },
    {
      type: 'Attendance',
      message: 'Implement early warning system for chronic absenteeism',
      priority: 'medium',
      icon: Users,
    },
    {
      type: 'Engagement',
      message: 'Introduce gamification elements to increase participation',
      priority: 'low',
      icon: Target,
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'performance':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {insights.map((insight, index) => (
                <div key={index} className="text-center">
                  <div className={`text-lg font-bold ${insight.color}`}>{insight.value}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">{insight.title}</div>
                  <div
                    className={`text-xs ${insight.trend === 'up' ? 'text-green-500' : insight.trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}
                  >
                    {insight.change}
                  </div>
                </div>
              ))}
            </div>
            <div className="h-20">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={performanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={20}
                    outerRadius={35}
                    dataKey="value"
                  >
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'predictions':
        return (
          <div className="space-y-4">
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={predictions}>
                  <XAxis dataKey="subject" tick={{ fontSize: 10 }} />
                  <YAxis hide />
                  <Tooltip />
                  <Bar dataKey="current" fill="#94a3b8" name="Current" />
                  <Bar dataKey="predicted" fill="#3b82f6" name="Predicted" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Next Quarter Forecast
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300">
                Powered by Prof Lynx AI
              </div>
            </div>
          </div>
        );

      case 'recommendations':
        return (
          <div className="space-y-3 max-h-32 overflow-y-auto">
            {recommendations.map((rec, index) => {
              const IconComponent = rec.icon;
              return (
                <div key={index} className="flex items-start gap-2">
                  <div className={`p-1 rounded ${getPriorityColor(rec.priority)}`}>
                    <IconComponent className="h-3 w-3" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-gray-900 dark:text-white">
                      {rec.type}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300 leading-tight">
                      {rec.message}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Insights</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Prof Lynx Analytics</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-purple-600">
          <MessageSquare className="h-4 w-4" />
          <span className="text-xs font-medium">AI</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-4">
        {(['performance', 'predictions', 'recommendations'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-2 py-1 text-xs font-medium rounded transition-colors ${
              activeTab === tab
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">{renderContent()}</div>
    </div>
  );
}
