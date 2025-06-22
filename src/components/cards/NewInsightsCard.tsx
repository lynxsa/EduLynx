'use client';

import React, { useState } from 'react';
import { BarChart3, PieChart, Users, BookOpen, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { CardSkeleton } from '@/components/Skeletons';
import { useInsights } from '@/hooks/useInsights';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function TabButton({ active, onClick, children }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
        active
          ? 'bg-blue-500 text-white shadow-sm'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );
}

export function NewInsightsCard() {
  const [activeTab, setActiveTab] = useState('class');
  const { insights, isLoading, error } = useInsights();

  if (isLoading) return <CardSkeleton />;
  if (error) return <div className="text-red-500">Error loading insights data</div>;

  const renderChart = () => {
    switch (activeTab) {
      case 'class':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={insights?.byClass || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="studentCount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'subject':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={insights?.bySubject || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="averageScore" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'gender':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={insights?.byGender || []}
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
                dataKey="count"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {(insights?.byGender || []).map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        );

      case 'grade':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={insights?.gradeProgress || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="averageScore"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'class':
        return <Users className="w-4 h-4" />;
      case 'subject':
        return <BookOpen className="w-4 h-4" />;
      case 'gender':
        return <PieChart className="w-4 h-4" />;
      case 'grade':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300 h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Analytics Insights</h3>
              <p className="text-sm text-gray-500">Multi-dimensional view</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 p-1 bg-gray-100 rounded-lg">
          {[
            { key: 'class', label: 'Class' },
            { key: 'subject', label: 'Subject' },
            { key: 'gender', label: 'Gender' },
            { key: 'grade', label: 'Grade' },
          ].map(tab => (
            <TabButton
              key={tab.key}
              active={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
            >
              <div className="flex items-center gap-1.5">
                {getTabIcon(tab.key)}
                <span>{tab.label}</span>
              </div>
            </TabButton>
          ))}
        </div>

        {/* Chart Area */}
        <div className="h-64">{renderChart()}</div>

        {/* Summary Stats */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total Records:</span>
              <span className="ml-2 font-medium text-gray-900">
                {insights?.summary?.totalRecords || 0}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Average Performance:</span>
              <span className="ml-2 font-medium text-gray-900">
                {insights?.summary?.averagePerformance || 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
