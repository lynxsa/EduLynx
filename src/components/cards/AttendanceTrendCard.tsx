'use client';

import React from 'react';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAttendanceTrend } from '@/hooks/useAttendance';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { CardSkeleton } from '@/components/Skeletons';

export function AttendanceTrendCard() {
  const { trend, isLoading, error } = useAttendanceTrend();

  if (isLoading) return <CardSkeleton />;
  if (error) return <div className="text-red-500">Error loading attendance trend</div>;

  // Format data for chart (last 7 days)
  const chartData =
    trend?.slice(-7).map((item: any) => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      percentage: item.percentage || 0,
      present: item.present || 0,
      total: item.total || 0,
    })) || [];

  const latestRate = chartData[chartData.length - 1]?.percentage || 0;
  const previousRate = chartData[chartData.length - 2]?.percentage || 0;
  const isImproving = latestRate > previousRate;

  return (
    <ErrorBoundary>
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300 h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Attendance Trend</h3>
              <p className="text-sm text-gray-500">Last 7 days</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{latestRate.toFixed(1)}%</div>
            <div className="flex items-center gap-1">
              {isImproving ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${isImproving ? 'text-green-600' : 'text-red-600'}`}
              >
                {isImproving ? 'Improving' : 'Declining'}
              </span>
            </div>
          </div>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" domain={[0, 100]} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-medium text-gray-900">{label}</p>
                        <p className="text-blue-600">Attendance: {data.percentage.toFixed(1)}%</p>
                        <p className="text-gray-600">
                          Present: {data.present} / {data.total}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="percentage"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ErrorBoundary>
  );
}
