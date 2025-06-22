'use client';

import React from 'react';
import { ClipboardList, Clock, AlertCircle, TrendingUp, CheckCircle } from 'lucide-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { CardSkeleton } from '@/components/Skeletons';
import { AssignmentsPieChart } from '@/components/charts/AssignmentsPieChart';
import { useAssignmentsDue } from '@/hooks/useAdminData';

export function AssignmentsDueCard() {
  const { assignmentsData, isLoading, error } = useAssignmentsDue();

  if (isLoading) return <CardSkeleton />;
  if (error) return <div className="text-red-500">Error loading assignments data</div>;

  const totalDue = assignmentsData?.stats?.totalPending || 0;
  const dueThisWeek = assignmentsData?.stats?.dueThisWeek || 0;
  const overdue = assignmentsData?.stats?.overdue || 0;
  const submissionRate = assignmentsData?.stats?.avgSubmissionRate || 0;

  // Prepare chart data
  const chartData = [
    { name: 'Due This Week', value: dueThisWeek, color: '#3b82f6' },
    { name: 'Overdue', value: overdue, color: '#ef4444' },
    { name: 'Submitted', value: Math.round(totalDue * (submissionRate / 100)), color: '#10b981' },
  ].filter(item => item.value > 0);

  return (
    <ErrorBoundary>
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Assignments Due</h3>
              <p className="text-sm text-gray-500">Pending submissions</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">{totalDue}</div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-500">total pending</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <Clock className="w-4 h-4 text-blue-600" />
              <div>
                <div className="text-lg font-semibold text-blue-700">{dueThisWeek}</div>
                <div className="text-xs text-blue-600">This Week</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <div>
                <div className="text-lg font-semibold text-red-700">{overdue}</div>
                <div className="text-xs text-red-600">Overdue</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <div>
                <div className="text-lg font-semibold text-green-700">
                  {submissionRate.toFixed(0)}%
                </div>
                <div className="text-xs text-green-600">Submitted</div>
              </div>
            </div>
          </div>

          {chartData.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Status Breakdown</h4>
              <AssignmentsPieChart data={chartData} />
            </div>
          )}

          {assignmentsData?.upcoming && assignmentsData.upcoming.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Upcoming Deadlines</h4>
              <div className="space-y-2">
                {assignmentsData.upcoming.slice(0, 3).map((assignment: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="text-sm text-gray-900 truncate">{assignment.title}</div>
                    <div className="text-xs text-gray-500">{assignment.class}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
