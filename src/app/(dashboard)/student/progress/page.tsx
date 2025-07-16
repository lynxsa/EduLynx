/**
 * OPERATION VOLCANOFOUNTAIN - PHASE 3
 * Student Progress Page - Student-Specific Academic Journey
 */

'use client';

import { useEffect, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface StudentProgressData {
  student: {
    id: string;
    name: string;
    email: string;
    class: {
      name: string;
    };
    grade: {
      level: number;
    };
  };
  academicOverview: {
    averageScore: number;
    attendanceRate: number;
    totalAssignments: number;
    completedAssignments: number;
    upcomingExams: number;
    currentGrade: string;
  };
  subjectPerformance: Array<{
    subject: string;
    average: number;
    trend: 'improving' | 'stable' | 'declining';
    lastScore: number;
  }>;
  recentResults: Array<{
    id: string;
    title: string;
    subject: string;
    score: number;
    date: string;
    type: 'exam' | 'assignment';
  }>;
  progressTrend: Array<{
    month: string;
    score: number;
    attendance: number;
  }>;
}

const StudentProgressPage = () => {
  const [progressData, setProgressData] = useState<StudentProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentProgress = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get student ID from authentication (using sample for now)
        const studentId = 'SAMPLE_STUDENT_ID';

        const response = await fetch(`/api/student-progress?studentId=${studentId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch progress: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.data) {
          setProgressData(result.data);
        } else {
          throw new Error('No progress data received');
        }
      } catch (error) {
        console.error('Error fetching student progress:', error);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProgress();
  }, []);

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your progress...</p>
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

  if (!progressData) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600">No progress data available</p>
        </div>
      </div>
    );
  }

  const { student, academicOverview, subjectPerformance, recentResults, progressTrend } =
    progressData;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📈 My Academic Progress</h1>
        <p className="text-gray-600">
          Track your learning journey, {student.name} • {student.class.name} • Grade{' '}
          {student.grade.level}
        </p>
      </div>

      {/* Academic Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-blue-600">
                {academicOverview.averageScore.toFixed(1)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xl">📊</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {academicOverview.averageScore >= 75
              ? 'Excellent work!'
              : academicOverview.averageScore >= 65
                ? 'Good progress!'
                : 'Keep working hard!'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {academicOverview.attendanceRate.toFixed(1)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xl">✅</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {academicOverview.attendanceRate >= 90
              ? 'Perfect attendance!'
              : academicOverview.attendanceRate >= 80
                ? 'Good attendance!'
                : 'Try to attend more classes'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Assignments</p>
              <p className="text-2xl font-bold text-purple-600">
                {academicOverview.completedAssignments}/{academicOverview.totalAssignments}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-xl">📝</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {(
              (academicOverview.completedAssignments / academicOverview.totalAssignments) *
              100
            ).toFixed(0)}
            % completion rate
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming Exams</p>
              <p className="text-2xl font-bold text-orange-600">{academicOverview.upcomingExams}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 text-xl">📅</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {academicOverview.upcomingExams > 0 ? 'Prepare well!' : 'No upcoming exams'}
          </p>
        </div>
      </div>

      {/* Progress Trends Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h3 className="text-lg font-semibold mb-4">📈 Progress Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={progressTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#3b82f6" name="Average Score" />
            <Line type="monotone" dataKey="attendance" stroke="#10b981" name="Attendance %" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Subject Performance */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">📚 Subject Performance</h3>
          <div className="space-y-4">
            {subjectPerformance.map((subject, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      subject.trend === 'improving'
                        ? 'bg-green-500'
                        : subject.trend === 'stable'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                    }`}
                  ></div>
                  <div>
                    <p className="font-medium">{subject.subject}</p>
                    <p className="text-sm text-gray-600">
                      {subject.trend === 'improving'
                        ? '↗ Improving'
                        : subject.trend === 'stable'
                          ? '→ Stable'
                          : '↘ Needs focus'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{subject.average.toFixed(1)}%</p>
                  <p className="text-sm text-gray-500">Last: {subject.lastScore}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Results */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">📊 Recent Results</h3>
          <div className="space-y-3">
            {recentResults.map(result => (
              <div
                key={result.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{result.title}</p>
                  <p className="text-sm text-gray-600">
                    {result.subject} • {result.type}
                  </p>
                  <p className="text-xs text-gray-500">{result.date}</p>
                </div>
                <div
                  className={`text-right font-bold text-lg ${
                    result.score >= 75
                      ? 'text-green-600'
                      : result.score >= 65
                        ? 'text-yellow-600'
                        : 'text-red-600'
                  }`}
                >
                  {result.score}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProgressPage;
