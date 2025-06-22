'use client';

import { useTotalStudents } from '@/hooks/useStudents';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { CardSkeleton } from '@/components/Skeletons';
import { StudentsChart } from '@/components/charts/StudentsChart';
import { User2, TrendingUp } from 'lucide-react';

export function TotalStudentsCard() {
  const { totalStudents, enrolledStudents, gradeDistribution, isLoading, error } =
    useTotalStudents();

  if (isLoading) return <CardSkeleton />;
  if (error) return <div className="text-red-500">Error loading students data</div>;

  return (
    <ErrorBoundary>
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <User2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Total Students</h3>
              <p className="text-sm text-gray-500">Currently enrolled</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">{totalStudents.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-green-600 font-medium">+{enrolledStudents}</span>
              <span className="text-gray-500">this term</span>
            </div>
          </div>
        </div>

        {gradeDistribution && gradeDistribution.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Distribution by Grade</h4>
            <StudentsChart data={gradeDistribution} />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
