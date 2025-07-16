'use client';
import { useEffect, useState } from 'react';

// Enhanced interfaces for teacher academic data
interface TeacherAcademicOverview {
  totalStudents: number;
  totalClasses: number;
  totalSubjects: number;
  averageClassPerformance: number;
  attendanceRate: number;
  totalAssessments: number;
  topPerformingClass: string;
  strugglingStudentsCount: number;
  improvingStudentsCount: number;
}

interface ClassPerformance {
  classId: string;
  className: string;
  studentCount: number;
  averageScore: number;
  attendanceRate: number;
  topStudent: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface StudentAlert {
  studentId: string;
  studentName: string;
  className: string;
  alertType: 'academic' | 'attendance' | 'behavior';
  severity: 'low' | 'medium' | 'high';
  description: string;
  averageScore: number;
  attendanceRate: number;
}

interface SubjectAnalytics {
  subjectId: string;
  subjectName: string;
  classCount: number;
  studentCount: number;
  averageScore: number;
  passRate: number;
  assessmentCount: number;
}

// **OPERATION VOLCANOFOUNTAIN - PHASE 2: Teacher Timetable Interface**
interface TimetableLesson {
  id: string;
  day: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY';
  startTime: string;
  endTime: string;
  subject: {
    name: string;
  };
  class: {
    name: string;
  };
}

interface TimetableData {
  lessons: TimetableLesson[];
  organized: {
    MONDAY: TimetableLesson[];
    TUESDAY: TimetableLesson[];
    WEDNESDAY: TimetableLesson[];
    THURSDAY: TimetableLesson[];
    FRIDAY: TimetableLesson[];
  };
  totalLessons: number;
}

interface TeacherDashboardData {
  teacher: {
    id: string;
    name: string;
    email: string;
    photo: string;
    department: string;
  };
  academicOverview: TeacherAcademicOverview;
  classPerformance: ClassPerformance[];
  studentAlerts: StudentAlert[];
  subjectAnalytics: SubjectAnalytics[];
  recentActivity: any[];
  quickStats: any;
}

const TeacherPage = () => {
  const [dashboardData, setDashboardData] = useState<TeacherDashboardData | null>(null);
  const [timetableData, setTimetableData] = useState<TimetableData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timetableLoading, setTimetableLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnhancedTeacherData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get sample teacher ID - in production, get from auth
        const teacherId = 'cmd5rj9tk001fiq8s9639abjj';

        console.log('👨‍🏫 Fetching enhanced teacher dashboard data...');

        const response = await fetch(
          `/api/working-academic-dashboard?teacherId=${teacherId}&type=teacher`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch teacher dashboard: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('✅ Enhanced Teacher Dashboard Data:', result);

        if (result.success && result.data) {
          setDashboardData(result.data);
        } else {
          throw new Error(result.error || 'Failed to load teacher dashboard data');
        }
      } catch (error) {
        console.error('❌ Error fetching enhanced teacher data:', error);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    // **OPERATION VOLCANOFOUNTAIN - PHASE 2: Fetch Teacher Timetable**
    const fetchTimetable = async () => {
      try {
        setTimetableLoading(true);
        const teacherId = 'cmd5rj9tk001fiq8s9639abjj';

        console.log('📅 Fetching teacher timetable...');

        const response = await fetch(`/api/teacher-timetable?teacherId=${teacherId}`);

        if (!response.ok) {
          console.warn('Failed to fetch timetable, continuing without it');
          return;
        }

        const result = await response.json();
        console.log('✅ Teacher Timetable Data:', result);

        if (result.data) {
          setTimetableData(result.data);
        }
      } catch (error) {
        console.error('❌ Error fetching timetable:', error);
        // Don't set error state for timetable - it's not critical
      } finally {
        setTimetableLoading(false);
      }
    };

    fetchEnhancedTeacherData();
    fetchTimetable();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading enhanced teacher dashboard...</p>
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
          <p className="text-gray-600">No teacher dashboard data available</p>
        </div>
      </div>
    );
  }

  const {
    teacher,
    academicOverview,
    classPerformance,
    studentAlerts,
    subjectAnalytics,
    recentActivity,
    quickStats,
  } = dashboardData;
  // Enhanced teacher dashboard cards data
  const enhancedTeacherCards = [
    {
      icon: '👥',
      title: 'Total Students',
      value: academicOverview.totalStudents.toString(),
      subtitle: `${academicOverview.totalClasses} classes`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: '📚',
      title: 'Subjects',
      value: academicOverview.totalSubjects.toString(),
      subtitle: `${academicOverview.totalAssessments} assessments`,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: '📊',
      title: 'Class Average',
      value: `${academicOverview.averageClassPerformance.toFixed(1)}%`,
      subtitle: `Top: ${academicOverview.topPerformingClass}`,
      color:
        academicOverview.averageClassPerformance >= 75
          ? 'text-green-600'
          : academicOverview.averageClassPerformance >= 65
            ? 'text-yellow-600'
            : 'text-red-600',
      bgColor:
        academicOverview.averageClassPerformance >= 75
          ? 'bg-green-50'
          : academicOverview.averageClassPerformance >= 65
            ? 'bg-yellow-50'
            : 'bg-red-50',
    },
    {
      icon: '📅',
      title: 'Attendance',
      value: `${academicOverview.attendanceRate.toFixed(1)}%`,
      subtitle:
        academicOverview.attendanceRate >= 90
          ? 'Excellent'
          : academicOverview.attendanceRate >= 80
            ? 'Good'
            : 'Needs attention',
      color:
        academicOverview.attendanceRate >= 90
          ? 'text-green-600'
          : academicOverview.attendanceRate >= 80
            ? 'text-yellow-600'
            : 'text-red-600',
      bgColor:
        academicOverview.attendanceRate >= 90
          ? 'bg-green-50'
          : academicOverview.attendanceRate >= 80
            ? 'bg-yellow-50'
            : 'bg-red-50',
    },
    {
      icon: '🚨',
      title: 'Student Alerts',
      value: studentAlerts.length.toString(),
      subtitle: `${academicOverview.strugglingStudentsCount} struggling`,
      color:
        studentAlerts.length === 0
          ? 'text-green-600'
          : studentAlerts.length <= 3
            ? 'text-yellow-600'
            : 'text-red-600',
      bgColor:
        studentAlerts.length === 0
          ? 'bg-green-50'
          : studentAlerts.length <= 3
            ? 'bg-yellow-50'
            : 'bg-red-50',
    },
    {
      icon: '📈',
      title: 'Improving',
      value: academicOverview.improvingStudentsCount.toString(),
      subtitle: 'students trending up',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* Enhanced Teacher Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              {teacher.photo ? (
                <img
                  src={teacher.photo}
                  alt={teacher.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl">👨‍🏫</span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{teacher.name}</h1>
              <p className="text-gray-600">
                {teacher.email} • {teacher.department}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  Teaching {academicOverview.totalSubjects} Subject
                  {academicOverview.totalSubjects > 1 ? 's' : ''}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    academicOverview.averageClassPerformance >= 75
                      ? 'bg-green-100 text-green-800'
                      : academicOverview.averageClassPerformance >= 65
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}
                >
                  {academicOverview.averageClassPerformance >= 75
                    ? '🌟 Excellent Performance'
                    : academicOverview.averageClassPerformance >= 65
                      ? '⭐ Good Performance'
                      : '📈 Room for Growth'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {enhancedTeacherCards.map((card, index) => (
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

        {/* Class Performance Overview */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h3 className="text-lg font-semibold mb-4">Class Performance Overview</h3>
          <div className="space-y-3">
            {classPerformance.slice(0, 6).map((classItem, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{classItem.className}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>👥 {classItem.studentCount} students</span>
                    <span>📅 {classItem.attendanceRate.toFixed(1)}% attendance</span>
                    <span>🏆 Top: {classItem.topStudent}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-xl font-bold ${
                      classItem.averageScore >= 80
                        ? 'text-green-600'
                        : classItem.averageScore >= 70
                          ? 'text-blue-600'
                          : classItem.averageScore >= 60
                            ? 'text-yellow-600'
                            : 'text-red-600'
                    }`}
                  >
                    {classItem.averageScore.toFixed(1)}%
                  </div>
                  <div
                    className={`text-xs px-2 py-1 rounded ${
                      classItem.riskLevel === 'low'
                        ? 'bg-green-100 text-green-800'
                        : classItem.riskLevel === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {classItem.riskLevel === 'low'
                      ? '✅ On track'
                      : classItem.riskLevel === 'medium'
                        ? '⚠️ Monitor'
                        : '🚨 Attention needed'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Analytics */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Subject Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjectAnalytics.map((subject, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">{subject.subjectName}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Classes:</span>
                    <span className="font-medium">{subject.classCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Students:</span>
                    <span className="font-medium">{subject.studentCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average:</span>
                    <span
                      className={`font-bold ${
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
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pass Rate:</span>
                    <span
                      className={`font-bold ${
                        subject.passRate >= 80
                          ? 'text-green-600'
                          : subject.passRate >= 70
                            ? 'text-blue-600'
                            : subject.passRate >= 60
                              ? 'text-yellow-600'
                              : 'text-red-600'
                      }`}
                    >
                      {subject.passRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-6">
        {/* Student Alerts */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Student Alerts</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {studentAlerts.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <span className="text-2xl">✅</span>
                <p className="text-sm">No student alerts</p>
              </div>
            ) : (
              studentAlerts.slice(0, 10).map((alert, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-l-4 ${
                    alert.severity === 'high'
                      ? 'border-red-500 bg-red-50'
                      : alert.severity === 'medium'
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-blue-500 bg-blue-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{alert.studentName}</p>
                      <p className="text-xs text-gray-600">{alert.className}</p>
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded ${
                        alert.alertType === 'academic'
                          ? 'bg-red-100 text-red-800'
                          : alert.alertType === 'attendance'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {alert.alertType}
                    </div>
                  </div>
                  <p className="text-xs text-gray-700 mt-1">{alert.description}</p>
                  <div className="text-xs text-gray-500 mt-1">
                    Score: {alert.averageScore.toFixed(1)}% • Attendance:{' '}
                    {alert.attendanceRate.toFixed(1)}%
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Teacher Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-blue-600">📝</span>
                <span className="font-medium text-blue-800">Create Assignment</span>
              </div>
            </button>
            <button className="w-full p-3 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-green-600">📊</span>
                <span className="font-medium text-green-800">Grade Book</span>
              </div>
            </button>
            <button className="w-full p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-purple-600">📅</span>
                <span className="font-medium text-purple-800">Attendance</span>
              </div>
            </button>
            <button className="w-full p-3 bg-orange-50 hover:bg-orange-100 rounded-lg text-left transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-orange-600">📈</span>
                <span className="font-medium text-orange-800">Class Reports</span>
              </div>
            </button>
          </div>
        </div>

        {/* Teaching Insights */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Teaching Insights</h3>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-800">Top Performing Class</p>
              <p className="text-green-600">{academicOverview.topPerformingClass}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-800">Students Improving</p>
              <p className="text-blue-600">
                {academicOverview.improvingStudentsCount} showing progress
              </p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="text-sm font-medium text-orange-800">Focus Area</p>
              <p className="text-orange-600">{quickStats.challengingSubject || 'Mathematics'}</p>
            </div>
          </div>
        </div>

        {/* **OPERATION VOLCANOFOUNTAIN - PHASE 2: Teacher Timetable** */}
        <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">📅 My Timetable</h3>
            {timetableData && (
              <span className="text-sm text-gray-600">
                {timetableData.totalLessons} lessons this week
              </span>
            )}
          </div>

          {timetableLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading timetable...</span>
            </div>
          ) : timetableData ? (
            <div className="space-y-4">
              {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'].map(day => {
                const dayLessons =
                  timetableData.organized[day as keyof typeof timetableData.organized];
                return (
                  <div key={day} className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      {day}
                      <span className="text-sm text-gray-500 ml-auto">
                        {dayLessons.length} lesson{dayLessons.length !== 1 ? 's' : ''}
                      </span>
                    </h4>
                    {dayLessons.length > 0 ? (
                      <div className="space-y-2">
                        {dayLessons
                          .sort((a, b) => a.startTime.localeCompare(b.startTime))
                          .map(lesson => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                                <div>
                                  <p className="font-medium text-sm">{lesson.subject.name}</p>
                                  <p className="text-xs text-gray-600">{lesson.class.name}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-blue-600">
                                  {lesson.startTime} - {lesson.endTime}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No lessons scheduled</p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-2">📅</div>
              <p className="text-gray-600">No timetable data available</p>
              <p className="text-sm text-gray-500">
                Timetable information will appear here once configured
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherPage;
