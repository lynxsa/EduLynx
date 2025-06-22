'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { ClipboardCheck, FileText, GraduationCap, Clock } from 'lucide-react';
import { usePendingGrading } from '@/hooks/useAdminData';

export function PendingGradingCard() {
  // For demo purposes, using a hardcoded teacher ID. In a real app, this would come from auth context
  const { gradingData, isLoading, error } = usePendingGrading('1');

  if (isLoading) {
    return (
      <Card
        title="Pending Grading"
        value="Loading..."
        icon={ClipboardCheck}
        className="animate-pulse"
      />
    );
  }

  if (error) {
    return (
      <Card
        title="Pending Grading"
        value="Error"
        icon={ClipboardCheck}
        changeType="negative"
        change="Failed to load"
      />
    );
  }

  const totalPending = gradingData?.stats?.totalPending || 0;
  const assignments = gradingData?.stats?.assignments || 0;
  const exams = gradingData?.stats?.exams || 0;

  return (
    <Card
      title="Pending Grading"
      value={totalPending}
      icon={ClipboardCheck}
      change={`${assignments} assignments, ${exams} exams`}
      changeType={totalPending > 10 ? 'warning' : 'neutral'}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <FileText className="h-3 w-3 text-blue-500" />
            <span className="text-gray-600">Assignments</span>
          </div>
          <span className="font-medium text-blue-600">{assignments}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-3 w-3 text-purple-500" />
            <span className="text-gray-600">Exams</span>
          </div>
          <span className="font-medium text-purple-600">{exams}</span>
        </div>

        {gradingData?.stats?.oldestPending && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-orange-500" />
              <span className="text-gray-600">Oldest</span>
            </div>
            <span className="font-medium text-orange-600">
              {new Date(gradingData.stats.oldestPending.date).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {gradingData?.pending && gradingData.pending.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Priority Items</h4>
          <div className="space-y-1">
            {gradingData.pending.slice(0, 3).map((item: any, index: number) => (
              <div key={index} className="text-xs text-gray-600 truncate">
                {item.title} - {item.class} ({item.pendingCount} pending)
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
