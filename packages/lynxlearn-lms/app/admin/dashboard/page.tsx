'use client';

import {
  AlertTriangle,
  BarChart3,
  GraduationCap,
  MoreHorizontal,
  Settings,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const adminProfile = {
    name: 'Mr. John Ndlovu',
    role: 'Principal',
    school: 'Johannesburg High School',
    avatar: '/api/placeholder/40/40',
  };

  const schoolStats = {
    totalStudents: 1247,
    totalTeachers: 85,
    totalSubjects: 12,
    avgPerformance: 76.8,
    attendanceRate: 94.2,
    parentEngagement: 78.5,
  };

  const recentAlerts = [
    {
      id: 1,
      type: 'performance',
      message: 'Grade 10B Mathematics performance below average',
      severity: 'warning',
      time: '2 hours ago',
    },
    {
      id: 2,
      type: 'attendance',
      message: '15 students absent today - flu outbreak suspected',
      severity: 'high',
      time: '4 hours ago',
    },
    {
      id: 3,
      type: 'system',
      message: 'Server maintenance scheduled for weekend',
      severity: 'info',
      time: '1 day ago',
    },
  ];

  const performanceData = [
    { grade: 'Grade 8', students: 165, avgScore: 78.2, trend: 'up', change: '+2.3%' },
    { grade: 'Grade 9', students: 158, avgScore: 75.8, trend: 'up', change: '+1.8%' },
    { grade: 'Grade 10', students: 142, avgScore: 74.5, trend: 'down', change: '-0.9%' },
    { grade: 'Grade 11', students: 138, avgScore: 77.1, trend: 'up', change: '+3.2%' },
    { grade: 'Grade 12', students: 134, avgScore: 79.4, trend: 'up', change: '+1.5%' },
  ];

  const subjectPerformance = [
    { subject: 'Mathematics', avgScore: 72.3, trend: 'up', teachers: 8 },
    { subject: 'English', avgScore: 78.9, trend: 'up', teachers: 6 },
    { subject: 'Physical Sciences', avgScore: 75.1, trend: 'down', teachers: 5 },
    { subject: 'Life Sciences', avgScore: 79.2, trend: 'up', teachers: 4 },
    { subject: 'History', avgScore: 76.8, trend: 'neutral', teachers: 3 },
    { subject: 'Geography', avgScore: 74.5, trend: 'up', teachers: 3 },
  ];

  const quickActions = [
    { name: 'Add New Student', icon: Users, href: '/admin/students/new', color: 'purple' },
    { name: 'Add New Teacher', icon: UserCheck, href: '/admin/teachers/new', color: 'violet' },
    { name: 'System Settings', icon: Settings, href: '/admin/settings', color: 'indigo' },
    { name: 'View Reports', icon: BarChart3, href: '/admin/reports', color: 'blue' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-violet-50/20 dark:from-slate-900 dark:via-purple-900/10 dark:to-violet-900/5">
      <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl shadow-purple-500/5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                Welcome back, {adminProfile.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {adminProfile.role} • {adminProfile.school}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {schoolStats.totalStudents}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Students</div>
            </div>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg shadow-purple-500/5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {schoolStats.totalTeachers}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Teachers</div>
              </div>
              <UserCheck className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg shadow-purple-500/5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                  {schoolStats.avgPerformance}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg Performance</div>
              </div>
              <BarChart3 className="w-8 h-8 text-violet-500" />
            </div>
          </div>

          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg shadow-purple-500/5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {schoolStats.attendanceRate}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Attendance Rate</div>
              </div>
              <Users className="w-8 h-8 text-indigo-500" />
            </div>
          </div>

          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg shadow-purple-500/5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {schoolStats.parentEngagement}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Parent Engagement</div>
              </div>
              <GraduationCap className="w-8 h-8 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl shadow-purple-500/5">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <div className="bg-white/80 dark:bg-slate-700/80 rounded-2xl p-6 border border-white/30 dark:border-slate-600/30 hover:shadow-lg transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-r ${
                        action.color === 'purple'
                          ? 'from-purple-500 to-purple-600'
                          : action.color === 'violet'
                            ? 'from-violet-500 to-violet-600'
                            : action.color === 'indigo'
                              ? 'from-indigo-500 to-indigo-600'
                              : 'from-blue-500 to-blue-600'
                      } text-white group-hover:scale-110 transition-transform duration-200`}
                    >
                      <action.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{action.name}</h3>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Performance Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Grade Performance */}
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl shadow-purple-500/5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Grade Performance
                </h2>
                <Link href="/admin/analytics">
                  <button className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-sm">
                    View Details →
                  </button>
                </Link>
              </div>

              <div className="space-y-4">
                {performanceData.map((grade, index) => (
                  <div
                    key={index}
                    className="bg-white/80 dark:bg-slate-700/80 rounded-2xl p-6 border border-white/30 dark:border-slate-600/30"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {grade.grade}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {grade.students} students
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900 dark:text-white">
                            {grade.avgScore}%
                          </div>
                          <div
                            className={`text-sm font-medium flex items-center ${
                              grade.trend === 'up'
                                ? 'text-green-600 dark:text-green-400'
                                : grade.trend === 'down'
                                  ? 'text-red-600 dark:text-red-400'
                                  : 'text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            {grade.trend === 'up' ? (
                              <TrendingUp className="w-4 h-4 mr-1" />
                            ) : grade.trend === 'down' ? (
                              <TrendingDown className="w-4 h-4 mr-1" />
                            ) : null}
                            {grade.change}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subject Performance */}
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl shadow-purple-500/5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Subject Performance
                </h2>
                <Link href="/admin/subjects">
                  <button className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-sm">
                    Manage Subjects →
                  </button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subjectPerformance.map((subject, index) => (
                  <div
                    key={index}
                    className="bg-white/80 dark:bg-slate-700/80 rounded-2xl p-4 border border-white/30 dark:border-slate-600/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {subject.subject}
                      </h3>
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-slate-600 rounded transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {subject.avgScore}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {subject.teachers} teachers
                        </div>
                      </div>
                      <div
                        className={`p-2 rounded-lg ${
                          subject.trend === 'up'
                            ? 'bg-green-100 dark:bg-green-900/30'
                            : subject.trend === 'down'
                              ? 'bg-red-100 dark:bg-red-900/30'
                              : 'bg-gray-100 dark:bg-gray-900/30'
                        }`}
                      >
                        {subject.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                        ) : subject.trend === 'down' ? (
                          <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                        ) : (
                          <BarChart3 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Alerts */}
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl shadow-purple-500/5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Alerts
              </h3>
              <div className="space-y-4">
                {recentAlerts.map(alert => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-xl border ${
                      alert.severity === 'high'
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                        : alert.severity === 'warning'
                          ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                          : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <AlertTriangle
                        className={`w-5 h-5 mt-0.5 ${
                          alert.severity === 'high'
                            ? 'text-red-500'
                            : alert.severity === 'warning'
                              ? 'text-yellow-500'
                              : 'text-blue-500'
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {alert.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {alert.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Overview */}
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl shadow-purple-500/5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                System Overview
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Server Status</span>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs font-medium">
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active Users</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">847</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Storage Used</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">68%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Last Backup</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">2h ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
