import { useCallback, useEffect, useState } from 'react';

interface DashboardMetrics {
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  totalClasses: number;
  totalSubjects: number;
  attendancePercentage: number;
  performanceAverage: number;
  genderDistribution: {
    male: number;
    female: number;
  };
  teachersBySubject: Array<{
    subject: string;
    teachers: number;
  }>;
}

interface UseDashboardMetricsOptions {
  dashboardType?: 'admin' | 'teacher' | 'parent' | 'student';
  period?: 'week' | 'month' | 'semester';
  refreshInterval?: number;
}

export function useDashboardMetrics(options: UseDashboardMetricsOptions = {}) {
  const { dashboardType = 'admin', period = 'month', refreshInterval = 30000 } = options;
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/dashboard/${dashboardType}?period=${period}&timestamp=${Date.now()}`,
        {
          method: 'GET',
          headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch metrics: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch metrics');
      }

      // Extract live metrics from database
      const liveMetrics: DashboardMetrics = {
        totalStudents: data.data?.metrics?.totalStudents || 0,
        totalTeachers: data.data?.metrics?.totalTeachers || 0,
        totalParents: data.data?.metrics?.totalParents || 0,
        totalClasses: data.data?.metrics?.totalClasses || 0,
        totalSubjects: data.data?.metrics?.totalSubjects || 0,
        attendancePercentage: data.data?.metrics?.averageAttendance || 0,
        performanceAverage: data.data?.metrics?.schoolPerformance || 0,
        genderDistribution: {
          male: data.data?.metrics?.genderDistribution?.male || 0,
          female: data.data?.metrics?.genderDistribution?.female || 0,
        },
        teachersBySubject: data.data?.metrics?.teachersBySubject || [],
      };

      console.log('📊 Live Dashboard Metrics Loaded:', liveMetrics);
      setMetrics(liveMetrics);
    } catch (err) {
      console.error('❌ Error fetching dashboard metrics:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [dashboardType, period]);

  useEffect(() => {
    fetchMetrics();

    // Set up auto-refresh
    const interval = setInterval(fetchMetrics, refreshInterval);
    return () => clearInterval(interval);
  }, [period, refreshInterval, dashboardType, fetchMetrics]);

  return {
    metrics,
    loading,
    error,
    refresh: fetchMetrics,
  };
}

// Shared metric card components for consistency
export interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    positive: boolean;
  };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  loading?: boolean;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'blue',
  loading = false,
}: MetricCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-600',
    green: 'from-green-500 to-emerald-600',
    purple: 'from-purple-500 to-indigo-600',
    orange: 'from-orange-500 to-red-600',
    red: 'from-red-500 to-pink-600',
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {subtitle && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={`text-sm font-medium ${
                  trend.positive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.positive ? '+' : '-'}
                {Math.abs(trend.value)}%
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">{trend.label}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-lg bg-gradient-to-r ${colorClasses[color]} text-white`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
