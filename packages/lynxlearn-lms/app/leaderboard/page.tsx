'use client';

import {
  Award,
  BookOpen,
  Brain,
  Crown,
  Flame,
  Medal,
  Star,
  TrendingUp,
  Trophy,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  level: number;
  rank: number;
  streak: number;
  completedLessons: number;
  perfectScores: number;
  weeklyGrowth: number;
  grade: number;
  school?: string;
  province: string;
  badges: string[];
}

interface TimeFilter {
  id: string;
  name: string;
  period: 'weekly' | 'monthly' | 'allTime';
}

interface CategoryFilter {
  id: string;
  name: string;
  icon: any;
  metric: keyof LeaderboardEntry;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('weekly');
  const [selectedCategory, setSelectedCategory] = useState<string>('points');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [currentUser, setCurrentUser] = useState<LeaderboardEntry | null>(null);

  const timeFilters: TimeFilter[] = [
    { id: 'weekly', name: 'This Week', period: 'weekly' },
    { id: 'monthly', name: 'This Month', period: 'monthly' },
    { id: 'allTime', name: 'All Time', period: 'allTime' },
  ];

  const categoryFilters: CategoryFilter[] = [
    { id: 'points', name: 'Study Points', icon: Star, metric: 'points' },
    { id: 'streak', name: 'Study Streak', icon: Flame, metric: 'streak' },
    { id: 'lessons', name: 'Lessons Completed', icon: BookOpen, metric: 'completedLessons' },
    { id: 'perfect', name: 'Perfect Scores', icon: Brain, metric: 'perfectScores' },
    { id: 'level', name: 'Level', icon: TrendingUp, metric: 'level' },
  ];

  useEffect(() => {
    // Mock leaderboard data
    const mockLeaderboard: LeaderboardEntry[] = [
      {
        id: '1',
        name: 'Nomsa Mthembu',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        points: 4250,
        level: 18,
        rank: 1,
        streak: 23,
        completedLessons: 67,
        perfectScores: 28,
        weeklyGrowth: 15,
        grade: 12,
        school: 'Johannesburg High School',
        province: 'Gauteng',
        badges: ['perfectionist', 'streak-master', 'scholar'],
      },
      {
        id: '2',
        name: 'Thabo Mokone',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        points: 3890,
        level: 16,
        rank: 2,
        streak: 18,
        completedLessons: 58,
        perfectScores: 22,
        weeklyGrowth: 12,
        grade: 11,
        school: 'Cape Town Technical High',
        province: 'Western Cape',
        badges: ['speed-demon', 'math-wizard'],
      },
      {
        id: '3',
        name: 'Zanele Dlamini',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        points: 3650,
        level: 15,
        rank: 3,
        streak: 31,
        completedLessons: 54,
        perfectScores: 25,
        weeklyGrowth: 18,
        grade: 12,
        school: 'Durban Girls High',
        province: 'KwaZulu-Natal',
        badges: ['streak-champion', 'social-butterfly'],
      },
      {
        id: '4',
        name: 'Ahmed Hassan',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        points: 3420,
        level: 14,
        rank: 4,
        streak: 12,
        completedLessons: 48,
        perfectScores: 19,
        weeklyGrowth: 8,
        grade: 11,
        school: 'Pretoria Science Academy',
        province: 'Gauteng',
        badges: ['science-star', 'consistent-learner'],
      },
      {
        id: '5',
        name: 'Lerato Molefe',
        avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150',
        points: 3180,
        level: 13,
        rank: 5,
        streak: 9,
        completedLessons: 45,
        perfectScores: 16,
        weeklyGrowth: 22,
        grade: 10,
        school: 'Bloemfontein Secondary',
        province: 'Free State',
        badges: ['rising-star', 'team-player'],
      },
      {
        id: '6',
        name: 'Sipho Ngcobo',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        points: 2950,
        level: 12,
        rank: 6,
        streak: 15,
        completedLessons: 42,
        perfectScores: 14,
        weeklyGrowth: 5,
        grade: 12,
        school: 'Port Elizabeth High',
        province: 'Eastern Cape',
        badges: ['dedicated-learner'],
      },
      {
        id: '7',
        name: 'Khadija Patel',
        avatar: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=150',
        points: 2850,
        level: 12,
        rank: 7,
        streak: 7,
        completedLessons: 39,
        perfectScores: 12,
        weeklyGrowth: 14,
        grade: 11,
        school: 'Kimberley Girls School',
        province: 'Northern Cape',
        badges: ['week-warrior', 'perfectionist'],
      },
      {
        id: 'current',
        name: 'You',
        points: 2850,
        level: 12,
        rank: 47,
        streak: 7,
        completedLessons: 34,
        perfectScores: 12,
        weeklyGrowth: 14,
        grade: 12,
        province: 'Gauteng',
        badges: ['week-warrior', 'perfectionist'],
      },
    ];

    setLeaderboard(mockLeaderboard.filter(entry => entry.id !== 'current'));
    setCurrentUser(mockLeaderboard.find(entry => entry.id === 'current') || null);
  }, [selectedTime, selectedCategory]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-500">
            #{rank}
          </span>
        );
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600';
      default:
        return 'bg-white/70 dark:bg-slate-800/70';
    }
  };

  const getMetricValue = (entry: LeaderboardEntry, metric: keyof LeaderboardEntry) => {
    const value = entry[metric];
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return value;
  };

  const getMetricLabel = (categoryId: string) => {
    const category = categoryFilters.find(c => c.id === categoryId);
    return category?.name || 'Points';
  };

  const grades = ['all', '8', '9', '10', '11', '12'];

  const filteredLeaderboard = leaderboard.filter(
    entry => selectedGrade === 'all' || entry.grade.toString() === selectedGrade
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-violet-50/20 dark:from-slate-900 dark:via-purple-900/10 dark:to-violet-900/5">
      <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
        {/* Header */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl shadow-purple-500/5">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl text-white">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  Leaderboard
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Compete with learners across South Africa
                </p>
              </div>
            </div>

            {/* Your Rank Card */}
            {currentUser && (
              <div className="bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl p-4 text-white min-w-64">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold">#{currentUser.rank}</span>
                  </div>
                  <div>
                    <div className="font-semibold">Your Rank</div>
                    <div className="text-purple-100 text-sm">
                      {currentUser.points.toLocaleString()} points • Level {currentUser.level}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl shadow-purple-500/5">
          <div className="space-y-6">
            {/* Time Filters */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Time Period
              </h3>
              <div className="flex flex-wrap gap-2">
                {timeFilters.map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedTime(filter.id)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      selectedTime === filter.id
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                        : 'bg-white/50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-600/50'
                    }`}
                  >
                    {filter.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Category & Grade Filters */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Category
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categoryFilters.map(filter => (
                    <button
                      key={filter.id}
                      onClick={() => setSelectedCategory(filter.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-xl font-medium transition-all ${
                        selectedCategory === filter.id
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                          : 'bg-white/50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-600/50'
                      }`}
                    >
                      <filter.icon className="w-4 h-4" />
                      <span className="text-sm">{filter.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Grade</h3>
                <div className="flex flex-wrap gap-2">
                  {grades.map(grade => (
                    <button
                      key={grade}
                      onClick={() => setSelectedGrade(grade)}
                      className={`px-3 py-2 rounded-xl font-medium transition-all ${
                        selectedGrade === grade
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                          : 'bg-white/50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-600/50'
                      }`}
                    >
                      {grade === 'all' ? 'All Grades' : `Grade ${grade}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top 3 Podium */}
        {filteredLeaderboard.length >= 3 && (
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl shadow-purple-500/5">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              🏆 Top Performers
            </h2>
            <div className="flex justify-center items-end space-x-4">
              {/* 2nd Place */}
              <div className="text-center">
                <div className="relative mb-4">
                  <img
                    src={
                      filteredLeaderboard[1]?.avatar ||
                      `https://ui-avatars.com/api/?name=${filteredLeaderboard[1]?.name}&background=random`
                    }
                    alt={filteredLeaderboard[1]?.name}
                    className="w-20 h-20 rounded-full mx-auto border-4 border-gray-300"
                  />
                  <div className="absolute -top-2 -right-2 bg-gray-300 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                </div>
                <div className="bg-gradient-to-t from-gray-200 to-gray-300 h-24 w-24 mx-auto rounded-t-lg flex items-end justify-center pb-2">
                  <Medal className="w-6 h-6 text-gray-600" />
                </div>
                <div className="mt-3">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {filteredLeaderboard[1]?.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {getMetricValue(
                      filteredLeaderboard[1],
                      categoryFilters.find(c => c.id === selectedCategory)?.metric || 'points'
                    )}{' '}
                    {getMetricLabel(selectedCategory).toLowerCase()}
                  </div>
                </div>
              </div>

              {/* 1st Place */}
              <div className="text-center">
                <div className="relative mb-4">
                  <img
                    src={
                      filteredLeaderboard[0]?.avatar ||
                      `https://ui-avatars.com/api/?name=${filteredLeaderboard[0]?.name}&background=random`
                    }
                    alt={filteredLeaderboard[0]?.name}
                    className="w-24 h-24 rounded-full mx-auto border-4 border-yellow-400"
                  />
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                </div>
                <div className="bg-gradient-to-t from-yellow-300 to-yellow-400 h-32 w-28 mx-auto rounded-t-lg flex items-end justify-center pb-2">
                  <Crown className="w-8 h-8 text-yellow-700" />
                </div>
                <div className="mt-3">
                  <div className="font-bold text-lg text-gray-900 dark:text-white">
                    {filteredLeaderboard[0]?.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {getMetricValue(
                      filteredLeaderboard[0],
                      categoryFilters.find(c => c.id === selectedCategory)?.metric || 'points'
                    )}{' '}
                    {getMetricLabel(selectedCategory).toLowerCase()}
                  </div>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="text-center">
                <div className="relative mb-4">
                  <img
                    src={
                      filteredLeaderboard[2]?.avatar ||
                      `https://ui-avatars.com/api/?name=${filteredLeaderboard[2]?.name}&background=random`
                    }
                    alt={filteredLeaderboard[2]?.name}
                    className="w-20 h-20 rounded-full mx-auto border-4 border-amber-400"
                  />
                  <div className="absolute -top-2 -right-2 bg-amber-400 text-amber-900 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                </div>
                <div className="bg-gradient-to-t from-amber-200 to-amber-300 h-20 w-24 mx-auto rounded-t-lg flex items-end justify-center pb-2">
                  <Award className="w-6 h-6 text-amber-700" />
                </div>
                <div className="mt-3">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {filteredLeaderboard[2]?.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {getMetricValue(
                      filteredLeaderboard[2],
                      categoryFilters.find(c => c.id === selectedCategory)?.metric || 'points'
                    )}{' '}
                    {getMetricLabel(selectedCategory).toLowerCase()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-xl shadow-purple-500/5 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Full Rankings - {getMetricLabel(selectedCategory)}
            </h2>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-slate-700">
            {filteredLeaderboard.map((entry, index) => (
              <div
                key={entry.id}
                className={`p-6 transition-all hover:bg-gray-50 dark:hover:bg-slate-700/50 ${
                  index < 3 ? getRankBg(entry.rank) + ' text-white' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  {/* Rank */}
                  <div className="flex-shrink-0 w-12 flex justify-center">
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* Avatar */}
                  <img
                    src={
                      entry.avatar ||
                      `https://ui-avatars.com/api/?name=${entry.name}&background=random`
                    }
                    alt={entry.name}
                    className="w-12 h-12 rounded-full"
                  />

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3
                        className={`font-semibold ${
                          index < 3 ? 'text-white' : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        {entry.name}
                      </h3>
                      <span
                        className={`text-sm px-2 py-1 rounded-full ${
                          index < 3
                            ? 'bg-white/20 text-white'
                            : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                        }`}
                      >
                        Grade {entry.grade}
                      </span>
                      {entry.weeklyGrowth > 10 && (
                        <span
                          className={`text-sm px-2 py-1 rounded-full flex items-center space-x-1 ${
                            index < 3
                              ? 'bg-green-500/20 text-green-100'
                              : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          }`}
                        >
                          <TrendingUp className="w-3 h-3" />
                          <span>+{entry.weeklyGrowth}%</span>
                        </span>
                      )}
                    </div>

                    <div
                      className={`text-sm ${
                        index < 3 ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {entry.school && `${entry.school} • `}
                      {entry.province}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-6 text-right">
                    <div>
                      <div
                        className={`text-2xl font-bold ${
                          index < 3 ? 'text-white' : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        {getMetricValue(
                          entry,
                          categoryFilters.find(c => c.id === selectedCategory)?.metric || 'points'
                        )}
                      </div>
                      <div
                        className={`text-sm ${
                          index < 3 ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {getMetricLabel(selectedCategory)}
                      </div>
                    </div>

                    {/* Streak indicator */}
                    {entry.streak > 5 && (
                      <div
                        className={`flex items-center space-x-1 ${
                          index < 3 ? 'text-orange-200' : 'text-orange-500'
                        }`}
                      >
                        <Flame className="w-4 h-4" />
                        <span className="text-sm font-medium">{entry.streak}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-purple-500 to-violet-500 rounded-3xl p-8 text-white text-center">
          <Zap className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h3 className="text-2xl font-bold mb-2">Climb the Rankings!</h3>
          <p className="text-purple-100 mb-6">
            Complete lessons, maintain your streak, and achieve perfect scores to rise up the
            leaderboard
          </p>
          <Button className="bg-white text-purple-600 hover:bg-purple-50">
            <BookOpen className="w-4 h-4 mr-2" />
            Start Learning
          </Button>
        </div>
      </div>
    </div>
  );
}
