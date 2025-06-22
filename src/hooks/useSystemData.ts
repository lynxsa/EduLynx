import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface SystemAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
  resolved: boolean;
}

export function useSystemAlerts() {
  const { data, error, isLoading } = useSWR<{ alerts: SystemAlert[] }>(
    '/api/system/alerts',
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 60000, // 1 minute
    }
  );

  return {
    alerts: data?.alerts || [],
    unresolvedCount: data?.alerts?.filter(a => !a.resolved).length || 0,
    isLoading,
    error,
  };
}

export function useRevenueStats() {
  const { data, error, isLoading } = useSWR('/api/finance/revenue-stats', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000, // 5 minutes
  });

  return {
    monthlyRevenue: data?.monthly || 0,
    yearlyRevenue: data?.yearly || 0,
    pendingPayments: data?.pending || 0,
    trend: data?.trend || [],
    isLoading,
    error,
  };
}

export function useSchedule() {
  const { data, error, isLoading } = useSWR('/api/students/schedule', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000, // 5 minutes
  });

  return {
    todaySchedule: data?.today || [],
    upcomingClasses: data?.upcoming || [],
    isLoading,
    error,
  };
}

export function useChildGrade() {
  const { data, error, isLoading } = useSWR('/api/parents/child-grade', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 180000, // 3 minutes
  });

  return {
    currentGrade: data?.grade || 'N/A',
    gpa: data?.gpa || 0,
    trend: data?.trend || [],
    isLoading,
    error,
  };
}

export function useRevenue() {
  const { data, error, isLoading } = useSWR('/api/analytics/revenue', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 1800000, // 30 minutes
  });

  return {
    revenue: {
      total: data?.total || 0,
      previous: data?.previous || 0,
      target: data?.target || 0,
      tuitionFees: data?.tuitionFees || 0,
      sources: data?.sources || [],
    },
    isLoading,
    error,
  };
}
