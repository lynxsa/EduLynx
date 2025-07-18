'use client';

import ModernTimetable from '@/components/ModernTimetable';
import StandardLoadingScreen from '@/components/StandardLoadingScreen';
import { useAuth } from '@/contexts/AuthContext';
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  Calendar,
  ClipboardList,
  Clock,
  GraduationCap,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface TeacherOverviewData {
  teacherInfo: {
    id: string;
    name: string;
    email: string;
    userId: string;
  };
  totals: {
    students: number;
    classes: number;
    subjects: number;
    lessons: number;
    assignments: number;
    exams: number;
    totalAssessments: number;
    strugglingStudents: number;
    improvingStudents: number;
    attendanceRecords: number;
  };
  averages: {
    overallScore: number;
    attendanceRate: number;
    classSize: number;
  };
  performance: {
    topPerformingClass: string;
    bestSubject: string;
    worstSubject: string;
  };
  classPerformance: Array<{
    classId: number;
    className: string;
    studentCount: number;
    averageScore: number;
    attendanceRate: number;
    totalResults: number;
    subjects: string[];
  }>;
  subjectAnalytics: Array<{
    subjectName: string;
    studentCount: number;
    classCount: number;
    averageScore: number;
    passRate: number;
    totalAssignments: number;
    totalExams: number;
    totalAssessments: number;
    lessonsCount: number;
  }>;
  recentActivity: Array<{
    id: number;
    studentName: string;
    score: number;
    assessment: string;
    subject: string;
    className: string;
    type: string;
    date: string;
  }>;
  strugglingStudents: Array<{
    id: string;
    name: string;
    className: string;
    averageScore: number;
  }>;
}

export default function EnhancedTeacherDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [overviewData, setOverviewData] = useState<TeacherOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated or not a teacher
  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'TEACHER')) {
      router.push('/sign-in');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchTeacherOverview = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user?.id) return;

        console.log('📊 Fetching teacher overview data...');

        const response = await fetch(`/api/teacher-overview?teacherId=${user.id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch teacher overview');
        }

        const result = await response.json();

        if (result.success) {
          setOverviewData(result.data);
          console.log('✅ Teacher overview loaded:', result.data);
        } else {
          throw new Error(result.error || 'Failed to load teacher overview');
        }
      } catch (err) {
        console.error('❌ Error fetching teacher overview:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (!isLoading && user && user.role === 'TEACHER') {
      fetchTeacherOverview();
    }
  }, [user, isLoading]);

  // Show loading screen while checking authentication
  if (isLoading || loading) {
    return <StandardLoadingScreen message="Loading teacher dashboard..." />;
  }

  // Redirect if not authorized
  if (!user || user.role !== 'TEACHER') {
    return null;
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
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

  if (!overviewData) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">No teacher data available</p>
      </div>
    );
  }

  const {
    totals,
    averages,
    performance,
    classPerformance,
    subjectAnalytics,
    recentActivity,
    strugglingStudents,
  } = overviewData;

  // Overview cards data
  const overviewCards = [
    {
      icon: <Users className="w-6 h-6" />,
      title: 'My Students',
      value: totals.students.toString(),
      subtitle: `${totals.classes} classes`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: totals.students > 0 ? 'up' : 'neutral',
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Subjects',
      value: totals.subjects.toString(),
      subtitle: `${totals.lessons} lessons`,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: 'neutral',
    },
    {
      icon: <ClipboardList className="w-6 h-6" />,
      title: 'Assessments',
      value: totals.totalAssessments.toString(),
      subtitle: `${totals.assignments} assignments, ${totals.exams} exams`,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: 'neutral',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Class Average',
      value: `${averages.overallScore.toFixed(1)}%`,
      subtitle: `Best: ${performance.topPerformingClass}`,
      color:
        averages.overallScore >= 75
          ? 'text-green-600'
          : averages.overallScore >= 60
            ? 'text-yellow-600'
            : 'text-red-600',
      bgColor:
        averages.overallScore >= 75
          ? 'bg-green-50'
          : averages.overallScore >= 60
            ? 'bg-yellow-50'
            : 'bg-red-50',
      trend: averages.overallScore >= 75 ? 'up' : averages.overallScore >= 60 ? 'neutral' : 'down',
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: 'Attendance',
      value: `${averages.attendanceRate.toFixed(1)}%`,
      subtitle: `${totals.attendanceRecords} records`,
      color:
        averages.attendanceRate >= 90
          ? 'text-green-600'
          : averages.attendanceRate >= 80
            ? 'text-yellow-600'
            : 'text-red-600',
      bgColor:
        averages.attendanceRate >= 90
          ? 'bg-green-50'
          : averages.attendanceRate >= 80
            ? 'bg-yellow-50'
            : 'bg-red-50',
      trend:
        averages.attendanceRate >= 90 ? 'up' : averages.attendanceRate >= 80 ? 'neutral' : 'down',
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: 'Need Support',
      value: totals.strugglingStudents.toString(),
      subtitle: `${totals.improvingStudents} improving`,
      color:
        totals.strugglingStudents === 0
          ? 'text-green-600'
          : totals.strugglingStudents <= 5
            ? 'text-yellow-600'
            : 'text-red-600',
      bgColor:
        totals.strugglingStudents === 0
          ? 'bg-green-50'
          : totals.strugglingStudents <= 5
            ? 'bg-yellow-50'
            : 'bg-red-50',
      trend: totals.strugglingStudents === 0 ? 'up' : 'down',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Teacher Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {overviewData.teacherInfo.name}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-500">Total Students: {totals.students}</div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {overviewCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} rounded-lg p-6 border border-gray-200 dark:border-gray-700`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`${card.color} ${card.bgColor} p-2 rounded-lg`}>{card.icon}</div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {card.title}
                  </p>
                  <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{card.subtitle}</p>
                </div>
              </div>
              <div className="text-right">
                {card.trend === 'up' && <TrendingUp className="w-5 h-5 text-green-500" />}
                {card.trend === 'down' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                {card.trend === 'neutral' && <Target className="w-5 h-5 text-gray-400" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* My Timetable */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          My Timetable
        </h2>
        <ModernTimetable teacherId={user.id} />
      </div>

      {/* Class Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          Class Performance
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-4 font-medium text-gray-900 dark:text-white">
                  Class
                </th>
                <th className="text-left py-2 px-4 font-medium text-gray-900 dark:text-white">
                  Students
                </th>
                <th className="text-left py-2 px-4 font-medium text-gray-900 dark:text-white">
                  Average
                </th>
                <th className="text-left py-2 px-4 font-medium text-gray-900 dark:text-white">
                  Attendance
                </th>
                <th className="text-left py-2 px-4 font-medium text-gray-900 dark:text-white">
                  Subjects
                </th>
              </tr>
            </thead>
            <tbody>
              {classPerformance.map((classData, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-600">
                  <td className="py-2 px-4 font-medium text-gray-900 dark:text-white">
                    {classData.className}
                  </td>
                  <td className="py-2 px-4 text-gray-600 dark:text-gray-400">
                    {classData.studentCount}
                  </td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        classData.averageScore >= 75
                          ? 'bg-green-100 text-green-800'
                          : classData.averageScore >= 60
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {classData.averageScore.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        classData.attendanceRate >= 90
                          ? 'bg-green-100 text-green-800'
                          : classData.attendanceRate >= 80
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {classData.attendanceRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-2 px-4 text-gray-600 dark:text-gray-400">
                    {classData.subjects.join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subject Analytics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Subject Performance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjectAnalytics.map((subject, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                {subject.subjectName}
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Students:</span>
                  <span className="font-medium">{subject.studentCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Classes:</span>
                  <span className="font-medium">{subject.classCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Average:</span>
                  <span
                    className={`font-medium ${
                      subject.averageScore >= 75
                        ? 'text-green-600'
                        : subject.averageScore >= 60
                          ? 'text-yellow-600'
                          : 'text-red-600'
                    }`}
                  >
                    {subject.averageScore.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Pass Rate:</span>
                  <span
                    className={`font-medium ${
                      subject.passRate >= 80
                        ? 'text-green-600'
                        : subject.passRate >= 60
                          ? 'text-yellow-600'
                          : 'text-red-600'
                    }`}
                  >
                    {subject.passRate.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Assessments:</span>
                  <span className="font-medium">{subject.totalAssessments}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Students Needing Support */}
      {strugglingStudents.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Students Needing Support
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {strugglingStudents.map((student, index) => (
              <div
                key={index}
                className="border border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800 rounded-lg p-4"
              >
                <h3 className="font-medium text-gray-900 dark:text-white">{student.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{student.className}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Average:</span>
                  <span className="text-sm font-medium text-red-600">
                    {student.averageScore.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
