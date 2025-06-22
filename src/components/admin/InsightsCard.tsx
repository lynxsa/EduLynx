'use client';
import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  GraduationCap,
  Award,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

interface InsightsData {
  trends: Array<{ period: string; students: number; attendance: number; performance: number }>;
  keyMetrics: {
    studentRetention: number;
    teacherSatisfaction: number;
    parentEngagement: number;
    academicProgress: number;
  };
  insights: Array<{
    type: 'positive' | 'negative' | 'warning' | 'info';
    title: string;
    description: string;
    value?: string | number;
  }>;
}

interface InsightsCardProps {
  data: InsightsData;
  className?: string;
}

export function InsightsCard({ data, className = '' }: InsightsCardProps) {
  const [activeTab, setActiveTab] = useState<'trends' | 'metrics' | 'insights'>('trends');

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return CheckCircle;
      case 'negative':
        return TrendingDown;
      case 'warning':
        return AlertTriangle;
      default:
        return Activity;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'negative':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">School Insights</h3>
        </div>

        <div className="flex rounded-lg bg-gray-100 p-1">
          {(['trends', 'metrics', 'insights'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'trends' && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">6-Month Performance Trends</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="students"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Students"
              />
              <Line
                type="monotone"
                dataKey="attendance"
                stroke="#10b981"
                strokeWidth={2}
                name="Attendance %"
              />
              <Line
                type="monotone"
                dataKey="performance"
                stroke="#f59e0b"
                strokeWidth={2}
                name="Performance %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeTab === 'metrics' && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Key Performance Indicators</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Student Retention</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {data.keyMetrics.studentRetention}%
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Teacher Satisfaction</p>
                  <p className="text-2xl font-bold text-green-900">
                    {data.keyMetrics.teacherSatisfaction}%
                  </p>
                </div>
                <GraduationCap className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Parent Engagement</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {data.keyMetrics.parentEngagement}%
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 font-medium">Academic Progress</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {data.keyMetrics.academicProgress}%
                  </p>
                </div>
                <Award className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 mb-4">AI-Powered Insights</h4>
          {data.insights.map((insight, index) => {
            const Icon = getInsightIcon(insight.type);
            return (
              <div key={index} className={`border rounded-lg p-4 ${getInsightColor(insight.type)}`}>
                <div className="flex items-start gap-3">
                  <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h5 className="font-medium">{insight.title}</h5>
                    <p className="text-sm mt-1 opacity-90">{insight.description}</p>
                    {insight.value && <p className="text-lg font-bold mt-2">{insight.value}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
