'use client';

import { BookOpen, Users, Clock, Calendar } from 'lucide-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { CardSkeleton } from '@/components/Skeletons';
import { useMyClasses } from '@/hooks/useTeachers';

export function MyClassesCard() {
  const { classes: myClasses, isLoading, error } = useMyClasses();

  if (isLoading) return <CardSkeleton />;
  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="text-center text-red-500">
          <BookOpen className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">Failed to load classes data</p>
        </div>
      </div>
    );
  }

  const totalStudents = myClasses.reduce(
    (total: number, classItem: any) => total + (classItem.studentCount || 0),
    0
  );
  const totalClasses = myClasses.length;
  const avgClassSize = totalClasses > 0 ? Math.round(totalStudents / totalClasses) : 0;

  return (
    <ErrorBoundary>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">My Classes</h3>
              <p className="text-sm text-gray-600">Classes you teach</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{totalClasses}</p>
            <p className="text-xs text-gray-500">{totalStudents} students</p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-gray-600">Avg Size</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{avgClassSize}</p>
            <p className="text-xs text-gray-500">students per class</p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-gray-600">Today</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {myClasses.filter((c: any) => c.hasClassToday).length}
            </p>
            <p className="text-xs text-gray-500">classes scheduled</p>
          </div>
        </div>

        {/* Classes List */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Your Classes</h4>
          {totalClasses === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No classes assigned</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {myClasses.slice(0, 5).map((classItem: any, index: number) => (
                <div
                  key={classItem.id || index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-purple-100 rounded">
                      <BookOpen className="w-3 h-3 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {classItem.name || classItem.className}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Grade {classItem.grade || classItem.gradeLevel}</span>
                        {classItem.subject && (
                          <>
                            <span>•</span>
                            <span>{classItem.subject}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Users className="w-3 h-3" />
                      <span>{classItem.studentCount || 0}</span>
                    </div>
                    {classItem.nextClass && (
                      <div className="flex items-center gap-1 text-xs text-blue-600 mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(classItem.nextClass).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {totalClasses > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Quick Actions</span>
              <div className="flex gap-2">
                <button className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors">
                  Take Attendance
                </button>
                <button className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                  Grade Book
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
