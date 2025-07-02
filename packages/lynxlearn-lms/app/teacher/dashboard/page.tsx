'use client';

import {
  Calendar,
  CheckCircle,
  FileText,
  MoreHorizontal,
  PlusCircle,
  TrendingUp,
  Users,
} from 'lucide-react';
import Link from 'next/link';

export default function TeacherDashboardPage() {
  const teacherProfile = {
    name: 'Dr. Sarah Johnson',
    subjects: ['Mathematics', 'Physical Sciences'],
    school: 'Johannesburg High School',
    avatar: '/api/placeholder/40/40',
    totalStudents: 145,
    activeClasses: 6,
    avgClassPerformance: 78.5,
    upcomingLessons: 4,
  };

  const classes = [
    {
      id: 1,
      name: 'Grade 12 Mathematics',
      students: 28,
      avgGrade: 75.2,
      nextLesson: 'Today 10:00 AM',
      topic: 'Calculus - Derivatives',
      progress: 68,
      color: 'purple',
    },
    {
      id: 2,
      name: 'Grade 11 Mathematics',
      students: 32,
      avgGrade: 72.8,
      nextLesson: 'Today 2:00 PM',
      topic: 'Trigonometry',
      progress: 75,
      color: 'violet',
    },
    {
      id: 3,
      name: 'Grade 12 Physical Sciences',
      students: 25,
      avgGrade: 80.1,
      nextLesson: 'Tomorrow 9:00 AM',
      topic: 'Organic Chemistry',
      progress: 82,
      color: 'indigo',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'assignment_submitted',
      student: 'Thabo Mthembu',
      action: 'submitted Math Assignment 5',
      time: '2 hours ago',
      score: 85,
    },
    {
      id: 2,
      type: 'quiz_completed',
      student: 'Nomsa Dlamini',
      action: 'completed Physics Quiz 3',
      time: '4 hours ago',
      score: 92,
    },
    {
      id: 3,
      type: 'question_asked',
      student: 'Sipho Khumalo',
      action: 'asked about derivatives',
      time: '6 hours ago',
      score: null,
    },
  ];

  const upcomingDeadlines = [
    {
      id: 1,
      title: 'Grade submissions due',
      subject: 'Mathematics',
      date: 'Tomorrow',
      type: 'admin',
      priority: 'high',
    },
    {
      id: 2,
      title: 'Parent-teacher conferences',
      subject: 'All classes',
      date: 'Next week',
      type: 'meeting',
      priority: 'medium',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-violet-50/20 dark:from-slate-900 dark:via-purple-900/10 dark:to-violet-900/5">
      <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl shadow-purple-500/5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                Welcome back, {teacherProfile.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {teacherProfile.school} • {teacherProfile.subjects.join(' & ')}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {teacherProfile.totalStudents}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Students</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg shadow-purple-500/5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {teacherProfile.activeClasses}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Classes</div>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg shadow-purple-500/5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                  {teacherProfile.avgClassPerformance}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Class Average</div>
              </div>
              <TrendingUp className="w-8 h-8 text-violet-500" />
            </div>
          </div>

          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg shadow-purple-500/5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {teacherProfile.upcomingLessons}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Lessons Today</div>
              </div>
              <Calendar className="w-8 h-8 text-indigo-500" />
            </div>
          </div>

          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg shadow-purple-500/5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">24</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Pending Reviews</div>
              </div>
              <FileText className="w-8 h-8 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Classes Overview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl shadow-purple-500/5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Classes</h2>
                <Link href="/teacher/classes">
                  <button className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all duration-200 shadow-lg shadow-purple-500/25">
                    <PlusCircle className="w-4 h-4 inline mr-2" />
                    New Class
                  </button>
                </Link>
              </div>

              <div className="space-y-4">
                {classes.map(classItem => (
                  <div
                    key={classItem.id}
                    className="bg-white/80 dark:bg-slate-700/80 rounded-2xl p-6 border border-white/30 dark:border-slate-600/30 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {classItem.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {classItem.students} students • Avg: {classItem.avgGrade}%
                        </p>
                      </div>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg transition-colors">
                        <MoreHorizontal className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Current Topic
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {classItem.topic}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Next Lesson
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {classItem.nextLesson}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Progress</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {classItem.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r ${
                            classItem.color === 'purple'
                              ? 'from-purple-500 to-purple-600'
                              : classItem.color === 'violet'
                                ? 'from-violet-500 to-violet-600'
                                : 'from-indigo-500 to-indigo-600'
                          }`}
                          style={{ width: `${classItem.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Link href={`/teacher/classes/${classItem.id}`}>
                        <button className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-sm font-medium">
                          View Class
                        </button>
                      </Link>
                      <Link href={`/teacher/classes/${classItem.id}/assignments`}>
                        <button className="px-4 py-2 bg-gray-100 dark:bg-slate-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-500 transition-colors text-sm font-medium">
                          Assignments
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl shadow-purple-500/5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.student}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{activity.action}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {activity.time}
                        </span>
                        {activity.score && (
                          <span className="text-xs font-medium text-green-600 dark:text-green-400">
                            {activity.score}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl shadow-purple-500/5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Upcoming Deadlines
              </h3>
              <div className="space-y-3">
                {upcomingDeadlines.map(deadline => (
                  <div
                    key={deadline.id}
                    className="p-4 bg-white/60 dark:bg-slate-700/60 rounded-xl border border-white/30 dark:border-slate-600/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {deadline.title}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          deadline.priority === 'high'
                            ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}
                      >
                        {deadline.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{deadline.subject}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{deadline.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
