'use client';

import { BookOpen, CheckCircle, Clock, FileText, Target, TrendingUp, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function NSCPrepPage() {
  const [selectedGrade, setSelectedGrade] = useState('Grade 12');

  const examSchedule = [
    {
      subject: 'English Home Language Paper 1',
      date: '2025-10-28',
      time: '09:00',
      duration: '3 hours',
    },
    {
      subject: 'English Home Language Paper 2',
      date: '2025-10-30',
      time: '14:00',
      duration: '3 hours',
    },
    { subject: 'Mathematics Paper 1', date: '2025-11-03', time: '09:00', duration: '3 hours' },
    { subject: 'Mathematics Paper 2', date: '2025-11-05', time: '14:00', duration: '3 hours' },
    {
      subject: 'Physical Sciences Paper 1',
      date: '2025-11-07',
      time: '09:00',
      duration: '3 hours',
    },
    {
      subject: 'Physical Sciences Paper 2',
      date: '2025-11-10',
      time: '14:00',
      duration: '3 hours',
    },
  ];

  const subjects = [
    {
      id: 'mathematics',
      name: 'Mathematics',
      icon: Target,
      progress: 78,
      topics: 12,
      practiceTests: 8,
      color: 'purple',
      status: 'on-track',
    },
    {
      id: 'english',
      name: 'English Home Language',
      icon: BookOpen,
      progress: 85,
      topics: 10,
      practiceTests: 6,
      color: 'violet',
      status: 'ahead',
    },
    {
      id: 'physical-sciences',
      name: 'Physical Sciences',
      icon: TrendingUp,
      progress: 65,
      topics: 15,
      practiceTests: 10,
      color: 'indigo',
      status: 'needs-attention',
    },
    {
      id: 'life-sciences',
      name: 'Life Sciences',
      icon: Trophy,
      progress: 92,
      topics: 8,
      practiceTests: 5,
      color: 'emerald',
      status: 'excellent',
    },
  ];

  const studyPlan = [
    {
      week: 'Week 1',
      focus: 'Mathematics - Algebra Review',
      tasks: [
        'Complete 3 practice tests',
        'Review quadratic equations',
        'Study exponential functions',
      ],
      status: 'completed',
    },
    {
      week: 'Week 2',
      focus: 'Physical Sciences - Mechanics',
      tasks: ["Newton's Laws revision", 'Practice momentum problems', 'Complete 2 mock papers'],
      status: 'current',
    },
    {
      week: 'Week 3',
      focus: 'English - Poetry Analysis',
      tasks: [
        'Analyze 4 prescribed poems',
        'Practice essay writing',
        'Complete comprehension tests',
      ],
      status: 'upcoming',
    },
  ];

  const achievements = [
    { name: 'Math Master', description: 'Completed 10 practice tests', icon: '🏆', earned: true },
    { name: 'Science Scholar', description: 'Mastered 5 physics topics', icon: '🔬', earned: true },
    { name: 'Writing Wizard', description: 'Perfect essay score', icon: '✍️', earned: false },
    { name: 'Study Streak', description: '30 days consecutive study', icon: '🔥', earned: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-violet-50/20 dark:from-slate-900 dark:via-purple-900/10 dark:to-violet-900/5">
      <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
        {/* Header */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl shadow-purple-500/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                NSC Exam Preparation
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
                Your comprehensive National Senior Certificate preparation hub
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">156</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Days to NSC</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-violet-600 dark:text-violet-400">82%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Prep Complete</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">24</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Practice Tests</div>
              </div>
              <FileText className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">45</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Topics Mastered</div>
              </div>
              <CheckCircle className="w-8 h-8 text-violet-500" />
            </div>
          </div>
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">127</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Study Hours</div>
              </div>
              <Clock className="w-8 h-8 text-indigo-500" />
            </div>
          </div>
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">4</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Achievements</div>
              </div>
              <Trophy className="w-8 h-8 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Subject Progress */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl shadow-purple-500/5">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Subject Progress
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subjects.map(subject => (
                  <Link key={subject.id} href={`/nsc-prep/${subject.id}`} className="group">
                    <div className="bg-white/60 dark:bg-slate-700/60 rounded-2xl p-6 border border-white/30 dark:border-slate-600/30 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-r ${
                            subject.color === 'purple'
                              ? 'from-purple-500 to-purple-600'
                              : subject.color === 'violet'
                                ? 'from-violet-500 to-violet-600'
                                : subject.color === 'indigo'
                                  ? 'from-indigo-500 to-indigo-600'
                                  : 'from-emerald-500 to-emerald-600'
                          } text-white group-hover:scale-110 transition-transform duration-200`}
                        >
                          <subject.icon className="w-6 h-6" />
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            subject.status === 'excellent'
                              ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                              : subject.status === 'ahead'
                                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                : subject.status === 'on-track'
                                  ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                                  : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                          }`}
                        >
                          {subject.status.replace('-', ' ')}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {subject.name}
                      </h3>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <span>{subject.topics} topics</span>
                        <span>{subject.practiceTests} tests</span>
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Progress</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {subject.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full bg-gradient-to-r ${
                              subject.color === 'purple'
                                ? 'from-purple-500 to-purple-600'
                                : subject.color === 'violet'
                                  ? 'from-violet-500 to-violet-600'
                                  : subject.color === 'indigo'
                                    ? 'from-indigo-500 to-indigo-600'
                                    : 'from-emerald-500 to-emerald-600'
                            }`}
                            style={{ width: `${subject.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Study Plan */}
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl shadow-purple-500/5">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Weekly Study Plan
              </h2>
              <div className="space-y-4">
                {studyPlan.map((week, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-2xl border ${
                      week.status === 'completed'
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : week.status === 'current'
                          ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
                          : 'bg-gray-50 dark:bg-slate-700/30 border-gray-200 dark:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{week.week}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          week.status === 'completed'
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                            : week.status === 'current'
                              ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                        }`}
                      >
                        {week.status}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-3 font-medium">
                      {week.focus}
                    </p>
                    <ul className="space-y-1">
                      {week.tasks.map((task, taskIndex) => (
                        <li
                          key={taskIndex}
                          className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
                        >
                          <CheckCircle
                            className={`w-4 h-4 ${
                              week.status === 'completed' ? 'text-green-500' : 'text-gray-400'
                            }`}
                          />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Exam Schedule */}
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl shadow-purple-500/5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Upcoming Exams
              </h3>
              <div className="space-y-3">
                {examSchedule.slice(0, 4).map((exam, index) => (
                  <div
                    key={index}
                    className="p-3 bg-white/60 dark:bg-slate-700/60 rounded-xl border border-white/30 dark:border-slate-600/30"
                  >
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                      {exam.subject}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span>{new Date(exam.date).toLocaleDateString()}</span>
                      <span>{exam.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/nsc-prep/schedule"
                className="block mt-4 text-center text-purple-600 dark:text-purple-400 hover:underline text-sm"
              >
                View Full Schedule →
              </Link>
            </div>

            {/* Achievements */}
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl shadow-purple-500/5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Achievements
              </h3>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-xl border ${
                      achievement.earned
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                        : 'bg-gray-50 dark:bg-slate-700/30 border-gray-200 dark:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <h4
                          className={`font-medium text-sm ${
                            achievement.earned
                              ? 'text-yellow-700 dark:text-yellow-400'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {achievement.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
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
