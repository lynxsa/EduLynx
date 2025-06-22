'use client';

import React from 'react';
import { BookOpenCheck, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useSubjectScores } from '@/hooks/useSubjects';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { CardSkeleton } from '@/components/Skeletons';

const COLORS = [
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Yellow
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#84cc16', // Lime
];

export function SubjectPerformanceCard() {
  const { subjectScores, isLoading, error } = useSubjectScores();

  if (isLoading) return <CardSkeleton />;
  if (error) return <div className="text-red-500">Error loading subject performance data</div>;

  // Format data for pie chart
  const chartData =
    subjectScores?.map((subject: any, index: number) => ({
      name: subject.name,
      value: subject.averageScore || 0,
      color: COLORS[index % COLORS.length],
      studentCount: subject.studentCount || 0,
    })) || [];

  const overallAverage =
    chartData.length > 0
      ? (
          chartData.reduce((sum: number, subject: any) => sum + subject.value, 0) / chartData.length
        ).toFixed(1)
      : '0';

  const bestPerforming = chartData.reduce(
    (max: any, subject: any) => (subject.value > max.value ? subject : max),
    { name: 'N/A', value: 0 }
  );

  return (
    <ErrorBoundary>
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300 h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpenCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Subject Performance</h3>
              <p className="text-sm text-gray-500">Average scores by subject</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{overallAverage}%</div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-500">overall</span>
            </div>
          </div>
        </div>

        {chartData.length > 0 ? (
          <>
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                    labelLine={false}
                  >
                    {chartData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                            <p className="font-medium text-gray-900">{data.name}</p>
                            <p className="text-indigo-600">Average: {data.value}%</p>
                            <p className="text-gray-600">Students: {data.studentCount}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Best Performing:</span>
                <span className="font-medium text-gray-900">{bestPerforming.name}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Score:</span>
                <span className="font-medium text-indigo-600">{bestPerforming.value}%</span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 py-8">
            No subject performance data available
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
