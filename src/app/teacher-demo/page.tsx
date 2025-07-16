/**
 * Teacher Dashboard Demo - Role-Based Access
 * Shows how teachers only see their assigned students/classes
 */

'use client';

import { useEffect, useState } from 'react';

interface Student {
  id: string;
  name: string;
  surname: string;
  class: {
    name: string;
  };
}

interface Result {
  id: number;
  score: number;
  student: {
    name: string;
    surname: string;
  };
  exam?: {
    lesson: {
      subject: { name: string };
      class: { name: string };
    };
  };
}

export default function TeacherDashboardDemo() {
  const [students, setStudents] = useState<Student[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [teacherId] = useState('cmd5rj9oc0001iq8si7pug25s'); // Sample teacher ID

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        // Fetch students that this teacher can access
        const studentsResponse = await fetch(`/api/students?role=TEACHER&userId=${teacherId}`);
        const studentsData = await studentsResponse.json();
        setStudents(studentsData.data || []);

        // Fetch results that this teacher can access
        const resultsResponse = await fetch(`/api/results?role=TEACHER&userId=${teacherId}`);
        const resultsData = await resultsResponse.json();
        setResults(resultsData.data || []);
      } catch (error) {
        console.error('Error fetching teacher data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [teacherId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading teacher dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h1 className="text-2xl font-bold text-green-800 mb-2">
          🎯 Teacher Role-Based Access Demo
        </h1>
        <p className="text-green-700">
          This demo shows how teachers only see data from their assigned classes. Teacher ID:{' '}
          <code className="bg-green-100 px-2 py-1 rounded">{teacherId}</code>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">📚 My Students</h2>
            <span className="ml-2 bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
              {students.length} students
            </span>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {students.slice(0, 10).map(student => (
              <div key={student.id} className="border-b border-gray-200 py-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">
                      {student.name} {student.surname}
                    </p>
                    <p className="text-sm text-gray-500">
                      Class: {student.class?.name || 'Not assigned'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {students.length > 10 && (
              <p className="text-center text-gray-500 mt-4">
                ... and {students.length - 10} more students
              </p>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">📊 Recent Results</h2>
            <span className="ml-2 bg-green-100 text-green-800 text-sm px-2 py-1 rounded">
              {results.length} results
            </span>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {results.slice(0, 10).map(result => (
              <div key={result.id} className="border-b border-gray-200 py-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">
                      {result.student.name} {result.student.surname}
                    </p>
                    <p className="text-sm text-gray-500">
                      {result.exam?.lesson?.subject?.name || 'Subject'} -{' '}
                      {result.exam?.lesson?.class?.name || 'Class'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${result.score >= 70 ? 'text-green-600' : result.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}
                    >
                      {result.score}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {results.length > 10 && (
              <p className="text-center text-gray-500 mt-4">
                ... and {results.length - 10} more results
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-blue-600">{students.length}</p>
          <p className="text-sm text-blue-700">Students</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-green-600">{results.length}</p>
          <p className="text-sm text-green-700">Results</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length || 0)}%
          </p>
          <p className="text-sm text-yellow-700">Avg Score</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-purple-600">
            {new Set(students.map(s => s.class?.name)).size}
          </p>
          <p className="text-sm text-purple-700">Classes</p>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">🔒 Role-Based Access Active</h3>
        <p className="text-sm text-gray-600">
          This teacher can only see students and results from their assigned classes. An admin would
          see all {/* total count */} students and {/* total count */} results across the entire
          school.
        </p>
      </div>
    </div>
  );
}
