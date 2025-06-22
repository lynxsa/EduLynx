import useSWR from 'swr';

interface InsightsData {
  byClass: Array<{ name: string; studentCount: number }>;
  bySubject: Array<{ name: string; averageScore: number }>;
  byGender: Array<{ name: string; count: number }>;
  gradeProgress: Array<{ month: string; averageScore: number }>;
  summary: {
    totalRecords: number;
    averagePerformance: number;
  };
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useInsights() {
  const { data, error, isLoading } = useSWR<InsightsData>('/api/analytics/insights', fetcher, {
    refreshInterval: 60000, // Refresh every minute
    revalidateOnFocus: false,
  });

  return {
    insights: data,
    isLoading,
    error,
  };
}
