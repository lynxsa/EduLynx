'use client';

import { motion } from 'framer-motion';
import {
  Award,
  Brain,
  Calendar,
  CheckCircle,
  Crown,
  Flame,
  Lock,
  Shield,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import NSCLayout from '../layout/NSCLayout';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ModernAchievementsPage() {
  const userStats = {
    totalPoints: 2847,
    totalAchievements: 24,
    unlockedAchievements: 18,
    currentStreak: 12,
    rank: 15,
    classSize: 145,
    level: 8,
    nextLevelPoints: 3000,
  };

  const categories = [
    {
      name: 'Academic Excellence',
      icon: Trophy,
      color: 'from-yellow-500 to-amber-600',
      bgColor: 'from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20',
      count: 8,
      unlocked: 6,
    },
    {
      name: 'Study Habits',
      icon: Flame,
      color: 'from-orange-500 to-red-600',
      bgColor: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
      count: 6,
      unlocked: 5,
    },
    {
      name: 'Social Learning',
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
      count: 4,
      unlocked: 3,
    },
    {
      name: 'Innovation',
      icon: Brain,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
      count: 6,
      unlocked: 4,
    },
  ];

  const achievements = [
    {
      id: 1,
      title: 'Mathematics Master',
      description: 'Complete all Grade 12 Mathematics modules with 85% or higher',
      icon: Trophy,
      rarity: 'Legendary',
      points: 500,
      unlocked: true,
      unlockedDate: '2025-06-20',
      progress: 100,
      category: 'Academic Excellence',
      gradient: 'from-yellow-500 to-amber-600',
      bgGradient: 'from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20',
    },
    {
      id: 2,
      title: 'Study Streak Champion',
      description: 'Maintain a 30-day consecutive study streak',
      icon: Flame,
      rarity: 'Epic',
      points: 300,
      unlocked: false,
      progress: 40,
      category: 'Study Habits',
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
    },
    {
      id: 3,
      title: 'Science Explorer',
      description: 'Complete introductory modules in all three science subjects',
      icon: Award,
      rarity: 'Rare',
      points: 250,
      unlocked: true,
      unlockedDate: '2025-06-15',
      progress: 100,
      category: 'Academic Excellence',
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
    },
    {
      id: 4,
      title: 'Team Player',
      description: 'Participate in 5 study group sessions',
      icon: Users,
      rarity: 'Common',
      points: 150,
      unlocked: true,
      unlockedDate: '2025-06-10',
      progress: 100,
      category: 'Social Learning',
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
    },
    {
      id: 5,
      title: 'AI Assistant Pro',
      description: 'Have 50 productive conversations with the AI tutor',
      icon: Brain,
      rarity: 'Epic',
      points: 350,
      unlocked: false,
      progress: 64,
      category: 'Innovation',
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
    },
    {
      id: 6,
      title: 'Perfect Score',
      description: 'Score 100% on any subject quiz',
      icon: Target,
      rarity: 'Rare',
      points: 200,
      unlocked: true,
      unlockedDate: '2025-06-18',
      progress: 100,
      category: 'Academic Excellence',
      gradient: 'from-indigo-500 to-blue-600',
      bgGradient: 'from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20',
    },
    {
      id: 7,
      title: 'Speed Reader',
      description: 'Complete 10 lessons in a single day',
      icon: Zap,
      rarity: 'Common',
      points: 100,
      unlocked: false,
      progress: 30,
      category: 'Study Habits',
      gradient: 'from-yellow-500 to-orange-600',
      bgGradient: 'from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
    },
    {
      id: 8,
      title: 'Helping Hand',
      description: 'Help other students by answering 20 forum questions',
      icon: Shield,
      rarity: 'Rare',
      points: 250,
      unlocked: false,
      progress: 15,
      category: 'Social Learning',
      gradient: 'from-teal-500 to-green-600',
      bgGradient: 'from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20',
    },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'Epic':
        return 'text-purple-600 dark:text-purple-400';
      case 'Rare':
        return 'text-blue-600 dark:text-blue-400';
      case 'Common':
        return 'text-slate-600 dark:text-slate-400';
      default:
        return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'Legendary':
        return 'bg-yellow-100 dark:bg-yellow-900/20';
      case 'Epic':
        return 'bg-purple-100 dark:bg-purple-900/20';
      case 'Rare':
        return 'bg-blue-100 dark:bg-blue-900/20';
      case 'Common':
        return 'bg-slate-100 dark:bg-slate-800';
      default:
        return 'bg-slate-100 dark:bg-slate-800';
    }
  };

  return (
    <NSCLayout bgGradient="from-slate-50 via-yellow-50/30 to-orange-50/20 dark:from-slate-900 dark:via-yellow-900/10 dark:to-orange-900/5">
      {/* Header Section */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 p-8 text-white"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4 flex items-center">
                <Trophy className="w-10 h-10 mr-3" />
                Achievements
              </h1>
              <p className="text-purple-100 text-lg mb-6">
                Celebrate your learning milestones and unlock new rewards
              </p>

              {/* User Level */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Crown className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">Level {userStats.level}</div>
                    <div className="text-purple-100 text-sm">
                      {userStats.totalPoints} / {userStats.nextLevelPoints} XP
                    </div>
                  </div>
                </div>
                <div className="flex-1 max-w-xs">
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
                      style={{
                        width: `${(userStats.totalPoints / userStats.nextLevelPoints) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Award className="w-16 h-16" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <Trophy className="w-6 h-6" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {userStats.unlockedAchievements}
              </div>
              <div className="text-slate-600 dark:text-slate-400 text-sm">Unlocked</div>
            </div>
          </div>
          <div className="text-slate-500 dark:text-slate-400 text-sm">
            {userStats.totalAchievements - userStats.unlockedAchievements} remaining
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white">
              <Star className="w-6 h-6" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {userStats.totalPoints.toLocaleString()}
              </div>
              <div className="text-slate-600 dark:text-slate-400 text-sm">Total XP</div>
            </div>
          </div>
          <div className="text-slate-500 dark:text-slate-400 text-sm">
            {userStats.nextLevelPoints - userStats.totalPoints} to next level
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white">
              <Flame className="w-6 h-6" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {userStats.currentStreak}
              </div>
              <div className="text-slate-600 dark:text-slate-400 text-sm">Day Streak</div>
            </div>
          </div>
          <div className="text-slate-500 dark:text-slate-400 text-sm">Personal best: 18 days</div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                #{userStats.rank}
              </div>
              <div className="text-slate-600 dark:text-slate-400 text-sm">Class Rank</div>
            </div>
          </div>
          <div className="text-slate-500 dark:text-slate-400 text-sm">
            of {userStats.classSize} students
          </div>
        </div>
      </motion.div>

      {/* Achievement Categories */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${category.bgColor} p-6 border border-white/20`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-r ${category.color} text-white shadow-lg`}
                >
                  <category.icon className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {category.unlocked}/{category.count}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 text-xs">Unlocked</div>
                </div>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                {category.name}
              </h3>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full bg-gradient-to-r ${category.color}`}
                  style={{ width: `${(category.unlocked / category.count) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Achievements Grid */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            All Achievements
          </h2>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors text-sm">
              All
            </button>
            <button className="px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors text-sm">
              Unlocked
            </button>
            <button className="px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors text-sm">
              In Progress
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map(achievement => (
            <motion.div
              key={achievement.id}
              variants={itemVariants}
              className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                achievement.unlocked
                  ? `bg-gradient-to-br ${achievement.bgGradient} border-slate-200 dark:border-slate-700 hover:shadow-lg`
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-75'
              }`}
            >
              <div className="p-6">
                {/* Achievement Header */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl ${achievement.unlocked ? `bg-gradient-to-r ${achievement.gradient} text-white shadow-lg` : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}
                  >
                    {achievement.unlocked ? (
                      <achievement.icon className="w-6 h-6" />
                    ) : (
                      <Lock className="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {achievement.unlocked && (
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    )}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityBg(achievement.rarity)} ${getRarityColor(achievement.rarity)}`}
                    >
                      {achievement.rarity}
                    </span>
                  </div>
                </div>

                {/* Achievement Details */}
                <div className="mb-4">
                  <h3
                    className={`text-lg font-bold mb-2 ${achievement.unlocked ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}
                  >
                    {achievement.title}
                  </h3>
                  <p
                    className={`text-sm ${achievement.unlocked ? 'text-slate-600 dark:text-slate-400' : 'text-slate-500 dark:text-slate-500'}`}
                  >
                    {achievement.description}
                  </p>
                </div>

                {/* Progress Bar (for unlocked or in-progress) */}
                {(achievement.unlocked || achievement.progress > 0) && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Progress
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {achievement.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${achievement.gradient}`}
                        style={{ width: `${achievement.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span
                      className={`text-sm font-medium ${achievement.unlocked ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                      {achievement.points} XP
                    </span>
                  </div>
                  {achievement.unlocked && achievement.unlockedDate && (
                    <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(achievement.unlockedDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Shine effect for unlocked achievements */}
              {achievement.unlocked && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/20 to-transparent"></div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </NSCLayout>
  );
}
