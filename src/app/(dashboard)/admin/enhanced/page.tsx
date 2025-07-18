'use client';

import {
  Activity,
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Award,
  BarChart3,
  BookOpen,
  Calendar,
  GraduationCap,
  Monitor,
  PieChart,
  RefreshCw,
  School,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface DashboardData {
  overview: {
    totalStudents: number;
    totalTeachers: number;
    totalParents: number;
    totalClasses: number;
    totalSubjects: number;
    attendanceRate: number;
    overallAverage: number;
    genderDistribution: { male: number; female: number };
  };
  education: {
    gradeDistribution: Array<{
      grade: string;
      phase: string;
      count: number;
      percentage: number;
    }>;
    achievementLevels: Array<{
      level: number;
      name: string;
      description: string;
      count: number;
      percentage: number;
      color: string;
    }>;
    capsInsights: {
      totalSubjects: number;
      coreSubjects: number;
      electiveSubjects: number;
      overallPassRate: number;
    };
  };
  performance: {
    subjectAnalytics: Array<{
      name: string;
      code: string;
      teacherCount: number;
      studentCount: number;
      averageScore: number;
      achievementLevel: number;
      passRate: number;
    }>;
    topPerformers: Array<{
      id: string;
      name: string;
      average: number;
      achievementLevel: number;
      grade: string;
      class: string;
      totalAssessments: number;
    }>;
    overallTrends: {
      improving: number;
      declining: number;
      stable: number;
    };
  };
  activity: {
    recentEnrollments: Array<{
      id: string;
      name: string;
      grade: string;
      class: string;
      enrolledAt: string;
    }>;
    recentResults: Array<{
      id: number;
      studentName: string;
      subject: string;
      score: number;
      achievementLevel: number;
      type: string;
      grade: string;
    }>;
    upcomingEvents: Array<{
      id: number;
      title: string;
      description: string;
      startTime: string;
      type: string;
      priority: string;
    }>;
  };
  system: {
    health: {
      status: string;
      uptime: string;
      activeUsers: number;
      lastBackup: string;
      databaseSize: string;
      responseTime: number;
    };
    dataQuality: {
      studentsWithResults: number;
      completenessScore: number;
    };
  };
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  color?: string;
  onClick?: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  changeType = 'neutral',
  color = 'blue',
  onClick,
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    indigo: 'from-indigo-500 to-indigo-600',
  };

  const changeIcons = {
    positive: ArrowUpRight,
    negative: ArrowDownRight,
    neutral: null,
  };

  const ChangeIcon = changeIcons[changeType];

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200 ${onClick ? 'cursor-pointer hover:scale-105' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {change && (
            <div
              className={`flex items-center mt-2 text-sm ${
                changeType === 'positive'
                  ? 'text-green-600'
                  : changeType === 'negative'
                    ? 'text-red-600'
                    : 'text-slate-500'
              }`}
            >
              {ChangeIcon && <ChangeIcon className="w-4 h-4 mr-1" />}
              <span>{change}</span>
            </div>
          )}
        </div>
        <div
          className={`p-3 rounded-lg bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]} text-white`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const AchievementLevelCard: React.FC<{ data: DashboardData['education']['achievementLevels'] }> = ({
  data,
}) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
        SA Achievement Levels
      </h3>
      <Award className="w-5 h-5 text-yellow-500" />
    </div>
    <div className="space-y-3">
      {data
        .filter(level => level.count > 0)
        .map(level => (
          <div key={level.level} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full bg-${level.color}-500`}></div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Level {level.level}: {level.name}
                </p>
                <p className="text-xs text-slate-500">{level.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900 dark:text-white">{level.count}</p>
              <p className="text-xs text-slate-500">{level.percentage}%</p>
            </div>
          </div>
        ))}
    </div>
  </div>
);

const TopPerformersCard: React.FC<{ data: DashboardData['performance']['topPerformers'] }> = ({
  data,
}) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Top Performers</h3>
      <Star className="w-5 h-5 text-yellow-500" />
    </div>
    <div className="space-y-3">
      {data.slice(0, 5).map((student, index) => (
        <div key={student.id} className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {index + 1}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">{student.name}</p>
              <p className="text-xs text-slate-500">
                {student.grade} • {student.class}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-green-600">{student.average}%</p>
            <p className="text-xs text-slate-500">Level {student.achievementLevel}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SubjectPerformanceCard: React.FC<{
  data: DashboardData['performance']['subjectAnalytics'];
}> = ({ data }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Subject Performance</h3>
      <BarChart3 className="w-5 h-5 text-blue-500" />
    </div>
    <div className="space-y-3">
      {data.slice(0, 6).map(subject => (
        <div key={subject.name} className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-slate-900 dark:text-white">{subject.name}</p>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {subject.averageScore}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full h-2 transition-all duration-300"
                style={{ width: `${Math.min(subject.averageScore, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-slate-500">{subject.teacherCount} teachers</span>
              <span className="text-xs text-slate-500">{subject.passRate}% pass rate</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const RecentActivityCard: React.FC<{
  enrollments: DashboardData['activity']['recentEnrollments'];
  results: DashboardData['activity']['recentResults'];
}> = ({ enrollments, results }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
      <Activity className="w-5 h-5 text-green-500" />
    </div>
    <div className="space-y-3">
      <div>
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          New Enrollments
        </h4>
        {enrollments.slice(0, 3).map(enrollment => (
          <div key={enrollment.id} className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm text-slate-900 dark:text-white">{enrollment.name}</p>
              <p className="text-xs text-slate-500">
                {enrollment.grade} • {enrollment.class}
              </p>
            </div>
            <div className="text-xs text-slate-500">
              {new Date(enrollment.enrolledAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Latest Results
        </h4>
        {results.slice(0, 3).map(result => (
          <div key={result.id} className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm text-slate-900 dark:text-white">{result.studentName}</p>
              <p className="text-xs text-slate-500">{result.subject}</p>
            </div>
            <div className="text-right">
              <p
                className={`text-sm font-semibold ${
                  result.score >= 70
                    ? 'text-green-600'
                    : result.score >= 50
                      ? 'text-yellow-600'
                      : 'text-red-600'
                }`}
              >
                {result.score}%
              </p>
              <p className="text-xs text-slate-500">Level {result.achievementLevel}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function EnhancedAdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const router = useRouter();

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/dashboard/admin-enhanced');
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch dashboard data');
      }

      setData(result.data);
      setLastUpdated(new Date());
      console.log('✅ Dashboard data loaded successfully');
    } catch (err) {
      console.error('❌ Dashboard fetch error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading enhanced dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {error || 'Failed to load dashboard data'}
          </p>
          <button
            onClick={fetchDashboardData}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { overview, education, performance, activity, system } = data;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 lg:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              South African Educational Management System
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-slate-500">Last updated</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {lastUpdated?.toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={fetchDashboardData}
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Students"
          value={overview.totalStudents}
          icon={Users}
          change={`${overview.genderDistribution.male}M / ${overview.genderDistribution.female}F`}
          changeType="neutral"
          color="blue"
          onClick={() => router.push('/admin/students')}
        />
        <MetricCard
          title="Teachers"
          value={overview.totalTeachers}
          icon={GraduationCap}
          change={`${overview.totalSubjects} subjects`}
          changeType="positive"
          color="green"
          onClick={() => router.push('/admin/teachers')}
        />
        <MetricCard
          title="Classes"
          value={overview.totalClasses}
          icon={School}
          change={`${Math.round(overview.totalStudents / overview.totalClasses)} avg per class`}
          changeType="neutral"
          color="purple"
          onClick={() => router.push('/admin/classes')}
        />
        <MetricCard
          title="Overall Average"
          value={`${overview.overallAverage}%`}
          icon={Target}
          change={`${overview.attendanceRate}% attendance`}
          changeType={overview.overallAverage >= 70 ? 'positive' : 'negative'}
          color={overview.overallAverage >= 70 ? 'green' : 'orange'}
        />
      </div>

      {/* Education Phase Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Grade Distribution
            </h3>
            <PieChart className="w-5 h-5 text-purple-500" />
          </div>
          <div className="space-y-3">
            {education.gradeDistribution.map(grade => (
              <div key={grade.grade} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      Grade {grade.grade} ({grade.phase})
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{grade.count}</p>
                  <p className="text-xs text-slate-500">{grade.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <AchievementLevelCard data={education.achievementLevels} />

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">CAPS Insights</h3>
            <BookOpen className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Total Subjects</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {education.capsInsights.totalSubjects}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Core Subjects</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {education.capsInsights.coreSubjects}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Elective Subjects</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {education.capsInsights.electiveSubjects}
              </span>
            </div>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Overall Pass Rate
                </span>
                <span
                  className={`text-sm font-bold ${
                    education.capsInsights.overallPassRate >= 70
                      ? 'text-green-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {education.capsInsights.overallPassRate}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SubjectPerformanceCard data={performance.subjectAnalytics} />
        <TopPerformersCard data={performance.topPerformers} />
      </div>

      {/* Activity and System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RecentActivityCard
          enrollments={activity.recentEnrollments}
          results={activity.recentResults}
        />

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">System Health</h3>
            <Monitor className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Status</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-bold text-green-600 capitalize">
                  {system.health.status}
                </span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Uptime</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {system.health.uptime}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Active Users</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {system.health.activeUsers.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Response Time</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {system.health.responseTime}ms
              </span>
            </div>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Data Completeness
                </span>
                <span
                  className={`text-sm font-bold ${
                    system.dataQuality.completenessScore >= 80
                      ? 'text-green-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {system.dataQuality.completenessScore}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trends Overview */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Performance Trends
          </h3>
          <TrendingUp className="w-5 h-5 text-blue-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-600">
              {performance.overallTrends.improving}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Improving Students</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-blue-600">{performance.overallTrends.stable}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Stable Performance</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-red-600">{performance.overallTrends.declining}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Needs Attention</p>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      {activity.upcomingEvents.length > 0 && (
        <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Upcoming Events
            </h3>
            <Calendar className="w-5 h-5 text-purple-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {activity.upcomingEvents.slice(0, 4).map(event => (
              <div
                key={event.id}
                className="border border-slate-200 dark:border-slate-700 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {event.title}
                  </h4>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      event.priority === 'high'
                        ? 'bg-red-500'
                        : event.priority === 'medium'
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                    }`}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 mb-2">{event.description}</p>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  {new Date(event.startTime).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
