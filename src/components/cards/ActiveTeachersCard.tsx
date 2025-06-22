'use client';

import { useActiveTeachers } from '@/hooks/useTeachers';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { CardSkeleton } from '@/components/Skeletons';
import { UserCheck, BookOpen } from 'lucide-react';

export function ActiveTeachersCard() {
  const { totalTeachers, activeTeachers, subjectDistribution, isLoading, error } =
    useActiveTeachers();

  if (isLoading) return <CardSkeleton />;
  if (error) return <div className="text-red-500">Error loading teachers data</div>;

  return (
    <ErrorBoundary>
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <UserCheck className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Active Teachers</h3>
            <p className="text-sm text-gray-500">Currently teaching</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-3xl font-bold text-gray-900">{activeTeachers}</div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">of {totalTeachers} total</span>
          </div>

          {subjectDistribution && subjectDistribution.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <BookOpen className="w-4 h-4" />
                <span>Top Subjects</span>
              </div>
              <div className="space-y-1">
                {subjectDistribution.slice(0, 3).map((subject, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-700">{subject.subject}</span>
                    <span className="text-gray-500">{subject.count}</span>
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
