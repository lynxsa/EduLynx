'use client';
import { useEffect, useState } from 'react';

// Enhanced interfaces for academic data
interface AcademicOverview {
  overallAverage: number;
  assignmentAverage: number;
  examAverage: number;
  totalAssessments: number;
  classRank: number;
  classSize: number;
  performanceTrend: 'improving' | 'declining' | 'stable';
  letterGrade: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface AttendanceOverview {
  rate: number;
  status: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
}

interface SubjectPerformance {
  subjectId: string;
  subjectName: string;
  averageScore: number;
  assessmentCount: number;
  grade: string;
}

interface StudentDashboardData {
  student: {
    id: string;
    name: string;
    class: string;
    grade: string;
    photo: string;
  };
  academicOverview: AcademicOverview;
  attendanceOverview: AttendanceOverview;
  subjectPerformance: SubjectPerformance[];
  recentActivity: any[];
  quickStats: any;
}

const StudentPage = () => {
  const [dashboardData, setDashboardData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnhancedDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get sample student ID - in production, get from auth
        const studentId = 'cmd5rj9tk001eiq8s9639abjd';

        console.log('🎓 Fetching enhanced student dashboard data...');

        const response = await fetch(
          `/api/working-academic-dashboard?studentId=${studentId}&type=student`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('✅ Enhanced Student Dashboard Data:', result);

        if (result.success && result.data) {
          setDashboardData(result.data);
        } else {
          throw new Error(result.error || 'Failed to load dashboard data');
        }
      } catch (error) {
        console.error('❌ Error fetching enhanced dashboard data:', error);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEnhancedDashboardData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading enhanced dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-red-600 mb-4">Error loading dashboard: {error}</p>
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

  // No data state
  if (!dashboardData) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600">No dashboard data available</p>
        </div>
      </div>
    );
  }

  const {
    student,
    academicOverview,
    attendanceOverview,
    subjectPerformance,
    recentActivity,
    quickStats,
  } = dashboardData;

  // Enhanced dashboard cards data
  const enhancedCards = [
    {
      icon: '📊',
      title: 'Overall Average',
      value: `${academicOverview.overallAverage.toFixed(1)}%`,
      subtitle: `Grade: ${academicOverview.letterGrade}`,
      color:
        academicOverview.overallAverage >= 70
          ? 'text-green-600'
          : academicOverview.overallAverage >= 60
            ? 'text-yellow-600'
            : 'text-red-600',
      bgColor:
        academicOverview.overallAverage >= 70
          ? 'bg-green-50'
          : academicOverview.overallAverage >= 60
            ? 'bg-yellow-50'
            : 'bg-red-50',
    },
    {
      icon: '🏆',
      title: 'Class Rank',
      value: `${academicOverview.classRank}/${academicOverview.classSize}`,
      subtitle: `Top ${Math.round((academicOverview.classRank / academicOverview.classSize) * 100)}%`,
      color:
        academicOverview.classRank <= academicOverview.classSize * 0.3
          ? 'text-green-600'
          : 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: '📅',
      title: 'Attendance',
      value: `${attendanceOverview.rate.toFixed(1)}%`,
      subtitle: attendanceOverview.status,
      color:
        attendanceOverview.rate >= 90
          ? 'text-green-600'
          : attendanceOverview.rate >= 80
            ? 'text-yellow-600'
            : 'text-red-600',
      bgColor:
        attendanceOverview.rate >= 90
          ? 'bg-green-50'
          : attendanceOverview.rate >= 80
            ? 'bg-yellow-50'
            : 'bg-red-50',
    },
    {
      icon: '📝',
      title: 'Assessments',
      value: academicOverview.totalAssessments.toString(),
      subtitle: `${academicOverview.performanceTrend} trend`,
      color:
        academicOverview.performanceTrend === 'improving'
          ? 'text-green-600'
          : academicOverview.performanceTrend === 'declining'
            ? 'text-red-600'
            : 'text-blue-600',
      bgColor:
        academicOverview.performanceTrend === 'improving'
          ? 'bg-green-50'
          : academicOverview.performanceTrend === 'declining'
            ? 'bg-red-50'
            : 'bg-blue-50',
    },
    {
      icon: '📚',
      title: 'Subjects',
      value: subjectPerformance.length.toString(),
      subtitle: `Best: ${quickStats.strongestSubject}`,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon:
        academicOverview.riskLevel === 'low'
          ? '✅'
          : academicOverview.riskLevel === 'medium'
            ? '⚠️'
            : '🚨',
      title: 'Academic Status',
      value: academicOverview.riskLevel.toUpperCase(),
      subtitle:
        academicOverview.riskLevel === 'low'
          ? 'Excellent progress'
          : academicOverview.riskLevel === 'medium'
            ? 'Needs attention'
            : 'Requires support',
      color:
        academicOverview.riskLevel === 'low'
          ? 'text-green-600'
          : academicOverview.riskLevel === 'medium'
            ? 'text-yellow-600'
            : 'text-red-600',
      bgColor:
        academicOverview.riskLevel === 'low'
          ? 'bg-green-50'
          : academicOverview.riskLevel === 'medium'
            ? 'bg-yellow-50'
            : 'bg-red-50',
    },
  ];

  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* Enhanced Student Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              {student.photo ? (
                <img
                  src={student.photo}
                  alt={student.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl">👨‍🎓</span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{student.name}</h1>
              <p className="text-gray-600">
                {student.class} • {student.grade}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    academicOverview.riskLevel === 'low'
                      ? 'bg-green-100 text-green-800'
                      : academicOverview.riskLevel === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}
                >
                  {academicOverview.riskLevel === 'low'
                    ? '🌟 Excellent'
                    : academicOverview.riskLevel === 'medium'
                      ? '⚠️ Monitor'
                      : '🚨 Support Needed'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {enhancedCards.map((card, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg shadow-sm ${card.bgColor} border border-gray-100`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                  <p className="text-xs text-gray-500">{card.subtitle}</p>
                </div>
                <div className="text-2xl">{card.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Subject Performance Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h3 className="text-lg font-semibold mb-4">Subject Performance</h3>
          <div className="space-y-3">
            {subjectPerformance.slice(0, 6).map((subject, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{subject.subjectName}</p>
                  <p className="text-sm text-gray-600">{subject.assessmentCount} assessments</p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-lg font-bold ${
                      subject.averageScore >= 80
                        ? 'text-green-600'
                        : subject.averageScore >= 70
                          ? 'text-blue-600'
                          : subject.averageScore >= 60
                            ? 'text-yellow-600'
                            : 'text-red-600'
                    }`}
                  >
                    {subject.averageScore.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-500">Grade: {subject.grade}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Recent Grades</h3>
          <div className="space-y-2">
            {recentActivity.slice(0, 8).map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded"
              >
                <div>
                  <p className="font-medium">{activity.assessment}</p>
                  <p className="text-sm text-gray-600">
                    {activity.subject} • {activity.type}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      activity.grade === 'A'
                        ? 'bg-green-100 text-green-800'
                        : activity.grade === 'B'
                          ? 'bg-blue-100 text-blue-800'
                          : activity.grade === 'C'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {activity.score}% ({activity.grade})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-6">
        {/* Enhanced Attendance Overview */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Attendance Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Present Days</span>
              <span className="font-semibold text-green-600">{attendanceOverview.presentDays}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Absent Days</span>
              <span className="font-semibold text-red-600">{attendanceOverview.absentDays}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Days</span>
              <span className="font-semibold">{attendanceOverview.totalDays}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  attendanceOverview.rate >= 90
                    ? 'bg-green-500'
                    : attendanceOverview.rate >= 80
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                }`}
                style={{ width: `${attendanceOverview.rate}%` }}
              ></div>
            </div>
            <p className="text-center text-sm text-gray-600">
              {attendanceOverview.status} - {attendanceOverview.rate.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-blue-600">📝</span>
                <span className="font-medium text-blue-800">View All Assignments</span>
              </div>
            </button>
            <button className="w-full p-3 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-green-600">📊</span>
                <span className="font-medium text-green-800">Subject Reports</span>
              </div>
            </button>
            <button className="w-full p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-purple-600">📅</span>
                <span className="font-medium text-purple-800">Exam Schedule</span>
              </div>
            </button>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Performance Insights</h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-800">Strongest Subject</p>
              <p className="text-blue-600">{quickStats.strongestSubject}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="text-sm font-medium text-orange-800">Focus Area</p>
              <p className="text-orange-600">{quickStats.weakestSubject}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-800">Trend</p>
              <p
                className={
                  academicOverview.performanceTrend === 'improving'
                    ? 'text-green-600'
                    : academicOverview.performanceTrend === 'declining'
                      ? 'text-red-600'
                      : 'text-blue-600'
                }
              >
                {academicOverview.performanceTrend === 'improving'
                  ? '📈 Improving'
                  : academicOverview.performanceTrend === 'declining'
                    ? '📉 Declining'
                    : '➡️ Stable'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
