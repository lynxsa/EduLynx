'use client';

import { motion } from 'framer-motion';
import {
  ArrowUp,
  Award,
  Brain,
  Calendar,
  ChevronRight,
  Clock,
  Flame,
  Play,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { ModernLayout } from '../../components/ui/modern-layout';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ModernDashboard() {
  const studentStats = {
    name: 'Thabo Mthembu',
    grade: 'Grade 12',
    overallAverage: 85,
    nscTarget: 90,
    studyStreak: 12,
    totalPoints: 2847,
    rank: 15,
    classSize: 145,
    nscReadiness: 82,
  };

  const quickStats = [
    {
      label: 'Overall Average',
      value: '85%',
      change: '+3.2%',
      trend: 'up',
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20',
    },
    {
      label: 'NSC Readiness',
      value: '82%',
      change: '+5.1%',
      trend: 'up',
      icon: Target,
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
    },
    {
      label: 'Study Streak',
      value: '12 days',
      change: '+2 days',
      trend: 'up',
      icon: Flame,
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
    },
    {
      label: 'Class Rank',
      value: '#15',
      change: '+3 positions',
      trend: 'up',
      icon: Trophy,
      gradient: 'from-yellow-500 to-amber-600',
      bgGradient: 'from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20',
    },
  ];

  const recentCourses = [
    {
      id: 1,
      name: 'Mathematics',
      progress: 78,
      nextLesson: 'Calculus: Derivatives',
      timeLeft: '2h 30m',
      difficulty: 'Advanced',
      icon: '📐',
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      id: 2,
      name: 'Physical Sciences',
      progress: 65,
      nextLesson: 'Physics: Momentum & Impulse',
      timeLeft: '1h 45m',
      difficulty: 'Intermediate',
      icon: '⚡',
      gradient: 'from-blue-500 to-cyan-600',
    },
    {
      id: 3,
      name: 'Life Sciences',
      progress: 82,
      nextLesson: 'Biology: Genetics',
      timeLeft: '3h 15m',
      difficulty: 'Basic',
      icon: '🧬',
      gradient: 'from-green-500 to-emerald-600',
    },
  ];

  const upcomingEvents = [
    {
      title: 'Mathematics Quiz',
      date: 'Tomorrow',
      time: '10:00 AM',
      type: 'Assessment',
      color: 'purple',
    },
    {
      title: 'Physics Practical',
      date: 'Friday',
      time: '2:00 PM',
      type: 'Lab Work',
      color: 'blue',
    },
    {
      title: 'NSC Trial Exam',
      date: 'Next Week',
      time: '8:00 AM',
      type: 'Exam',
      color: 'red',
    },
  ];

  const achievements = [
    {
      title: 'Mathematics Master',
      description: 'Completed all Grade 12 Math modules',
      icon: '🏆',
      rarity: 'Gold',
      unlocked: true,
    },
    {
      title: 'Study Streak Champion',
      description: '10+ consecutive days of study',
      icon: '🔥',
      rarity: 'Silver',
      unlocked: true,
    },
    {
      title: 'Science Explorer',
      description: 'Explore all science subjects',
      icon: '🔬',
      rarity: 'Bronze',
      unlocked: false,
    },
  ];

  return (
    <ModernLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Welcome Section */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 text-white"
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back, {studentStats.name}! 👋</h1>
                <p className="text-blue-100 text-lg">Ready to excel in your NSC journey today?</p>
                <div className="flex items-center mt-4 space-x-6">
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>Target: {studentStats.nscTarget}%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5" />
                    <span>Rank #{studentStats.rank}</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-4xl">🎓</div>
                </div>
              </div>
            </div>
          </div>
          {/* Floating elements */}
          <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/5 animate-pulse"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-white/5 animate-pulse delay-1000"></div>
        </motion.div>

        {/* Quick Stats Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {quickStats.map((stat, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.bgGradient} p-6 border border-white/20 backdrop-blur-sm`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} text-white shadow-lg`}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center space-x-1 text-sm text-emerald-600 dark:text-emerald-400">
                  <ArrowUp className="w-4 h-4" />
                  <span>{stat.change}</span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                  {stat.value}
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Courses */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Continue Learning
                </h2>
                <Link
                  href="/courses"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {recentCourses.map(course => (
                  <div
                    key={course.id}
                    className="group relative overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-700/50 p-4 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-r ${course.gradient} flex items-center justify-center text-2xl shadow-lg`}
                      >
                        {course.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                            {course.name}
                          </h3>
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            {course.progress}%
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          {course.nextLesson}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className="text-xs bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded-full">
                              {course.difficulty}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {course.timeLeft}
                            </span>
                          </div>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                            <Play className="w-4 h-4" />
                          </button>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mt-3">
                          <div
                            className={`h-2 rounded-full bg-gradient-to-r ${course.gradient}`}
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Upcoming Events */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Upcoming Events
              </h3>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <div className={`w-3 h-3 rounded-full bg-${event.color}-500`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                        {event.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {event.date} at {event.time}
                      </p>
                    </div>
                    <span
                      className={`text-xs bg-${event.color}-100 dark:bg-${event.color}-900/20 text-${event.color}-600 dark:text-${event.color}-400 px-2 py-1 rounded-full`}
                    >
                      {event.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Achievements
              </h3>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-2 ${achievement.unlocked ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-900/20' : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50 opacity-60'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium text-sm ${achievement.unlocked ? 'text-yellow-800 dark:text-yellow-200' : 'text-slate-600 dark:text-slate-400'}`}
                        >
                          {achievement.title}
                        </p>
                        <p
                          className={`text-xs ${achievement.unlocked ? 'text-yellow-600 dark:text-yellow-400' : 'text-slate-500 dark:text-slate-500'}`}
                        >
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.unlocked && (
                        <span className="text-xs bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full">
                          {achievement.rarity}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/achievements"
                className="block mt-4 text-center text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
              >
                View All Achievements
              </Link>
            </div>
          </motion.div>
        </div>

        {/* AI Study Assistant CTA */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 p-6 text-white"
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2 flex items-center">
                <Brain className="w-6 h-6 mr-2" />
                Need Study Help?
              </h3>
              <p className="text-purple-100 mb-4">
                Ask our AI tutor anything about your NSC subjects!
              </p>
              <Link
                href="/ai-tutor"
                className="inline-flex items-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition-colors"
              >
                <Zap className="w-4 h-4" />
                <span>Start Chat</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="hidden lg:block">
              <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Brain className="w-12 h-12" />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </ModernLayout>
  );
}
