'use client';

import React from 'react';
import { UserPlus, TrendingUp, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNewRegistrations } from '@/hooks/useStudents';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { CardSkeleton } from '@/components/Skeletons';

export function RecentRegistrationsCard() {
  const { registrations, isLoading, error } = useNewRegistrations();

  if (isLoading) return <CardSkeleton />;
  if (error) return <div className="text-red-500">Error loading registration data</div>;

  // Format data for chart (last 7 days)
  const chartData =
    registrations?.dailyStats?.slice(-7).map((item: any) => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      registrations: item.count || 0,
    })) || [];

  const totalThisWeek = chartData.reduce((sum: number, day: any) => sum + day.registrations, 0);
  const previousWeekTotal = registrations?.previousWeekTotal || 0;
  const growthPercentage =
    previousWeekTotal > 0
      ? (((totalThisWeek - previousWeekTotal) / previousWeekTotal) * 100).toFixed(1)
      : '0';

  return (
    <ErrorBoundary>
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300 h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">New Registrations</h3>
              <p className="text-sm text-gray-500">This week's signups</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{totalThisWeek}</div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">+{growthPercentage}%</span>
            </div>
          </div>
        </div>

        <div className="h-48 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-medium text-gray-900">{label}</p>
                        <p className="text-green-600">Registrations: {payload[0].value}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="registrations" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Previous week:</span>
            <span className="font-medium text-gray-900">{previousWeekTotal}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Growth:</span>
            <span
              className={`font-medium ${Number(growthPercentage) >= 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {Number(growthPercentage) >= 0 ? '+' : ''}
              {growthPercentage}%
            </span>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
