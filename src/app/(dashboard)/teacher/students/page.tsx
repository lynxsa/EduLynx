'use client';

import { useEffect, useState } from 'react';
import { getAuthorizedStudents } from '@/lib/role-based-access';

interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  class: {
    name: string;
  };
  grade: {
    level: number;
  };
  results: Array<{
    score: number;
  }>;
  attendances: Array<{
    present: boolean;
  }>;
}

const TeacherStudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyStudents = async () => {
      try {
        setLoading(true);

        // Get teacher ID from authentication (using sample for now)
        const teacherId = 'cmd5rj9tk001fiq8s9639abjj';

        const response = await fetch(`/api/students?role=TEACHER&userId=${teacherId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }

        const data = await response.json();
        setStudents(data.data || []);

        console.log(`✅ [Teacher Students] Loaded ${data.data?.length || 0} students`);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchMyStudents();
  }, []);

  const calculateAverageScore = (results: Array<{ score: number }>) => {
    if (results.length === 0) return 0;
    const total = results.reduce((sum, result) => sum + result.score, 0);
    return total / results.length;
  };

  const calculateAttendanceRate = (attendances: Array<{ present: boolean }>) => {
    if (attendances.length === 0) return 0;
    const presentDays = attendances.filter(a => a.present).length;
    return (presentDays / attendances.length) * 100;
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your students...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">👥 My Students</h1>
        <p className="text-gray-600">Students in your classes - {students.length} total</p>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Found</h3>
          <p className="text-gray-600">You don't have any students assigned to your classes yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {students.map(student => (
            <div
              key={student.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-semibold text-lg">
                    {student.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-600">{student.class.name}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Score:</span>
                  <span
                    className={`font-semibold ${
                      calculateAverageScore(student.results) >= 75
                        ? 'text-green-600'
                        : calculateAverageScore(student.results) >= 65
                          ? 'text-yellow-600'
                          : 'text-red-600'
                    }`}
                  >
                    {calculateAverageScore(student.results).toFixed(1)}%
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Attendance:</span>
                  <span
                    className={`font-semibold ${
                      calculateAttendanceRate(student.attendances) >= 90
                        ? 'text-green-600'
                        : calculateAttendanceRate(student.attendances) >= 80
                          ? 'text-yellow-600'
                          : 'text-red-600'
                    }`}
                  >
                    {calculateAttendanceRate(student.attendances).toFixed(1)}%
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Grade Level:</span>
                  <span className="font-semibold text-gray-700">Grade {student.grade.level}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-4 rounded-md transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherStudentsPage;
