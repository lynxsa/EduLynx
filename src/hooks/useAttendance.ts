import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface AttendanceData {
  overall: {
    rate: number;
    total: number;
    present: number;
  };
  today: {
    rate: number;
    total: number;
    present: number;
  };
}

export function useAttendance() {
  const { data, error, isLoading, mutate } = useSWR<AttendanceData>('/api/attendance', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 120000, // 2 minutes
    errorRetryCount: 3,
    errorRetryInterval: 5000,
  });

  return {
    attendance: data,
    isLoading,
    error,
    refetch: mutate,
  };
}

export function useAttendanceTrend() {
  const { data, error, isLoading } = useSWR('/api/attendance/trend', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000, // 5 minutes
  });

  return {
    trend: data?.trend || [],
    isLoading,
    error,
  };
}
