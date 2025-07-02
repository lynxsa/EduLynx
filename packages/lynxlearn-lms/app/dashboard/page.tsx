'use client';

import { motion } from 'framer-motion';
import {
  Award,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle,
  ChevronRight,
  Flame,
  Gift,
  Heart,
  Medal,
  Play,
  Sparkles,
  Star,
  Target,
  Timer,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import NSCLayout from '../../components/layout/NSCLayout';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Enhanced Dashboard Card Component
const EnhancedDashboardCard = ({
  icon: Icon,
  title,
  value,
  color,
  description,
  gradient,
  trend,
}: any) => (
  <motion.div
    variants={itemVariants}
    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg p-4 hover:shadow-xl transition-all duration-300"
  >
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</p>
        <div className="flex items-center space-x-2">
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {trend && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              +{trend}%
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</p>
      </div>
      <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} shadow-lg`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </motion.div>
);

// Gamification Components
const StudyStreakCard = () => (
  <motion.div
    variants={itemVariants}
    className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-4 text-white"
  >
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-bold flex items-center">
          <Flame className="w-5 h-5 mr-2" />
          Study Streak
        </h3>
        <p className="text-3xl font-bold">12 Days</p>
        <p className="text-orange-100 text-sm">Keep it up! 🔥</p>
      </div>
      <div className="text-right">
        <div className="text-2xl">🔥</div>
        <p className="text-xs opacity-80">Longest: 28 days</p>
      </div>
    </div>
  </motion.div>
);

const StudyPointsCard = () => (
  <motion.div
    variants={itemVariants}
    className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-4 text-white"
  >
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-bold flex items-center">
          <Sparkles className="w-5 h-5 mr-2" />
          Study Points
        </h3>
        <p className="text-3xl font-bold">2,450</p>
        <p className="text-purple-100 text-sm">+150 today</p>
      </div>
      <div className="text-right">
        <div className="text-2xl">✨</div>
        <p className="text-xs opacity-80">Rank: Gold</p>
      </div>
    </div>
  </motion.div>
);

const LevelProgressCard = () => (
  <motion.div
    variants={itemVariants}
    className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-4 text-white"
  >
    <div className="flex items-center justify-between mb-3">
      <div>
        <h3 className="text-lg font-bold flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Level Progress
        </h3>
        <p className="text-sm opacity-90">Level 15 Scholar</p>
      </div>
      <div className="text-2xl">🎓</div>
    </div>
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>XP Progress</span>
        <span>1,250 / 1,500</span>
      </div>
      <div className="w-full bg-white/20 rounded-full h-2">
        <div className="bg-white rounded-full h-2" style={{ width: '83%' }}></div>
      </div>
      <p className="text-xs opacity-80">250 XP to Level 16!</p>
    </div>
  </motion.div>
);

const WeeklyGoalCard = () => (
  <motion.div
    variants={itemVariants}
    className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white"
  >
    <div className="flex items-center justify-between mb-3">
      <div>
        <h3 className="text-lg font-bold flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Weekly Goal
        </h3>
        <p className="text-sm opacity-90">Study 15 hours</p>
      </div>
      <div className="text-2xl">🎯</div>
    </div>
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Progress</span>
        <span>12.5 / 15 hours</span>
      </div>
      <div className="w-full bg-white/20 rounded-full h-2">
        <div className="bg-white rounded-full h-2" style={{ width: '83%' }}></div>
      </div>
      <p className="text-xs opacity-80">2.5 hours remaining</p>
    </div>
  </motion.div>
);

// Achievement Badge Component
const AchievementBadge = ({ icon: Icon, title, description, earned = false }) => (
  <div
    className={`p-3 rounded-lg border-2 transition-all ${
      earned
        ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'
    }`}
  >
    <Icon className={`w-6 h-6 mx-auto mb-2 ${earned ? 'text-yellow-500' : 'text-slate-400'}`} />
    <h4
      className={`text-xs font-semibold text-center ${earned ? 'text-yellow-700 dark:text-yellow-400' : 'text-slate-500'}`}
    >
      {title}
    </h4>
    <p className="text-xs text-center text-slate-400 mt-1">{description}</p>
  </div>
);

// Recent Activity Item
const ActivityItem = ({ icon: Icon, action, subject, time, points }) => (
  <div className="flex items-center space-x-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
    <div className="flex-shrink-0">
      <Icon className="w-5 h-5 text-blue-500" />
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{action}</p>
      <p className="text-xs text-slate-500">
        {subject} • {time}
      </p>
    </div>
    <div className="text-right">
      <p className="text-sm font-semibold text-green-600">+{points} XP</p>
    </div>
  </div>
);

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <NSCLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
      </NSCLayout>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <NSCLayout>
      {/* Welcome Header with Time-based Greeting */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Good{' '}
              {new Date().getHours() < 12
                ? 'Morning'
                : new Date().getHours() < 18
                  ? 'Afternoon'
                  : 'Evening'}
              , {session.user?.name?.split(' ')[0] || 'Student'}! 🌟
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
              Ready to continue your learning adventure? Let's make today count! 🚀
            </p>
          </div>
          <div className="hidden md:block">
            <div className="text-6xl">📚</div>
          </div>
        </div>
      </motion.div>

      {/* Gamification Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StudyStreakCard />
        <StudyPointsCard />
        <LevelProgressCard />
        <WeeklyGoalCard />
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <EnhancedDashboardCard
          icon={BookOpen}
          title="Active Courses"
          value="8"
          color="text-blue-600"
          description="NSC Subjects"
          gradient="from-blue-500 to-blue-600"
          trend="12"
        />
        <EnhancedDashboardCard
          icon={Trophy}
          title="Achievements"
          value="24"
          color="text-yellow-600"
          description="Badges earned"
          gradient="from-yellow-500 to-orange-500"
          trend="8"
        />
        <EnhancedDashboardCard
          icon={Timer}
          title="Study Time"
          value="12.5h"
          color="text-green-600"
          description="This week"
          gradient="from-green-500 to-emerald-500"
          trend="15"
        />
        <EnhancedDashboardCard
          icon={Brain}
          title="IQ Score"
          value="142"
          color="text-purple-600"
          description="Learning intelligence"
          gradient="from-purple-500 to-violet-500"
          trend="5"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
              <Zap className="w-6 h-6 mr-2 text-yellow-500" />
              Recent Activity
            </h2>
            <Link
              href="/activity"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
            >
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-2">
            <ActivityItem
              icon={CheckCircle}
              action="Completed Mathematics Chapter 8"
              subject="Calculus & Derivatives"
              time="2 hours ago"
              points="50"
            />
            <ActivityItem
              icon={Play}
              action="Watched Physics Video"
              subject="Electromagnetic Waves"
              time="4 hours ago"
              points="25"
            />
            <ActivityItem
              icon={Award}
              action="Earned Achievement"
              subject="Mathematics Master"
              time="1 day ago"
              points="100"
            />
            <ActivityItem
              icon={BookOpen}
              action="Started New Course"
              subject="Life Sciences Grade 12"
              time="2 days ago"
              points="75"
            />
            <ActivityItem
              icon={Heart}
              action="Joined Study Group"
              subject="NSC Exam Prep"
              time="3 days ago"
              points="30"
            />
          </div>
        </motion.div>

        {/* Quick Actions & Achievements */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/courses"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg p-3 flex flex-col items-center space-y-2 transition-all transform hover:scale-105"
              >
                <BookOpen className="h-6 w-6" />
                <span className="text-sm font-medium">Courses</span>
              </Link>
              <Link
                href="/calendar"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg p-3 flex flex-col items-center space-y-2 transition-all transform hover:scale-105"
              >
                <Calendar className="h-6 w-6" />
                <span className="text-sm font-medium">Calendar</span>
              </Link>
              <Link
                href="/study-groups"
                className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white rounded-lg p-3 flex flex-col items-center space-y-2 transition-all transform hover:scale-105"
              >
                <Users className="h-6 w-6" />
                <span className="text-sm font-medium">Study Groups</span>
              </Link>
              <Link
                href="/achievements"
                className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white rounded-lg p-3 flex flex-col items-center space-y-2 transition-all transform hover:scale-105"
              >
                <Trophy className="h-6 w-6" />
                <span className="text-sm font-medium">Achievements</span>
              </Link>
            </div>
          </motion.div>

          {/* Recent Achievements */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <Medal className="w-5 h-5 mr-2 text-yellow-500" />
              Latest Achievements
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <AchievementBadge
                icon={Star}
                title="Math Star"
                description="Complete 10 math lessons"
                earned={true}
              />
              <AchievementBadge
                icon={Flame}
                title="Hot Streak"
                description="7 day study streak"
                earned={true}
              />
              <AchievementBadge
                icon={Trophy}
                title="Scholar"
                description="Reach level 15"
                earned={true}
              />
              <AchievementBadge
                icon={Gift}
                title="Early Bird"
                description="Study before 8am"
                earned={false}
              />
              <AchievementBadge
                icon={Users}
                title="Team Player"
                description="Join study group"
                earned={false}
              />
              <AchievementBadge
                icon={Brain}
                title="Genius"
                description="Score 95%+ on test"
                earned={false}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Course Progress & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Progress */}
        <motion.div
          variants={itemVariants}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              Course Progress
            </h3>
            <Link
              href="/courses"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
            >
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {[
              {
                title: 'Mathematics Grade 12',
                progress: 85,
                color: 'bg-blue-500',
                lessons: '34/40',
              },
              {
                title: 'Physical Sciences',
                progress: 72,
                color: 'bg-green-500',
                lessons: '29/40',
              },
              {
                title: 'English Home Language',
                progress: 91,
                color: 'bg-purple-500',
                lessons: '36/40',
              },
              { title: 'Life Sciences', progress: 68, color: 'bg-pink-500', lessons: '27/40' },
            ].map((course, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
              >
                <div
                  className={`w-12 h-12 ${course.color} rounded-xl flex items-center justify-center shadow-lg`}
                >
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 dark:text-white">{course.title}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className={`${course.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400 min-w-max">
                      {course.lessons}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    {course.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          variants={itemVariants}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-500" />
              Upcoming Events
            </h3>
            <Link
              href="/calendar"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
            >
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {[
              {
                title: 'Mathematics Mock Exam',
                date: 'Tomorrow',
                time: '10:00 AM',
                type: 'Exam',
                color: 'red',
              },
              {
                title: 'Physics Project Due',
                date: 'Friday',
                time: '11:59 PM',
                type: 'Assignment',
                color: 'blue',
              },
              {
                title: 'Study Group: Chemistry',
                date: 'Saturday',
                time: '2:00 PM',
                type: 'Meeting',
                color: 'green',
              },
              {
                title: 'English Essay Due',
                date: 'Monday',
                time: '9:00 AM',
                type: 'Assignment',
                color: 'purple',
              },
            ].map((event, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:shadow-md transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      event.color === 'red'
                        ? 'bg-red-500'
                        : event.color === 'blue'
                          ? 'bg-blue-500'
                          : event.color === 'green'
                            ? 'bg-green-500'
                            : 'bg-purple-500'
                    }`}
                  ></div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{event.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {event.date} at {event.time}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    event.type === 'Exam'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      : event.type === 'Assignment'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  }`}
                >
                  {event.type}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </NSCLayout>
  );
}
