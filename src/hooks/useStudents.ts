import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface StudentData {
  total: number;
  active: number;
  enrolled: number;
  genderDistribution: Array<{ gender: string; count: number }>;
  gradeDistribution: Array<{ grade: string; count: number }>;
  gradeDistributionDetailed: Array<{ grade: string; total: number; male: number; female: number }>;
}

export function useTotalStudents() {
  const { data, error, isLoading } = useSWR<StudentData>('/api/students/stats', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 180000, // 3 minutes
  });

  return {
    totalStudents: data?.total || 0,
    activeStudents: data?.active || 0,
    enrolledStudents: data?.enrolled || 0,
    genderDistribution: data?.genderDistribution || [],
    gradeDistribution: data?.gradeDistributionDetailed || [],
    isLoading,
    error,
  };
}

export function useAtRiskStudents() {
  const { data, error, isLoading } = useSWR('/api/students/at-risk', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000, // 5 minutes
  });

  return {
    atRiskStudents: data?.students || [],
    count: data?.count || 0,
    isLoading,
    error,
  };
}

export function useDropoutRisk() {
  const { data, error, isLoading } = useSWR('/api/analytics/dropout-risk', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 600000, // 10 minutes
  });

  return {
    dropoutRisk: data?.riskByClass || [],
    isLoading,
    error,
  };
}

interface RegistrationData {
  dailyStats: Array<{ date: string; count: number }>;
  thisWeekTotal: number;
  previousWeekTotal: number;
  monthlyTotal: number;
}

export function useNewRegistrations() {
  const { data, error, isLoading } = useSWR<RegistrationData>(
    '/api/students/registrations',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
    }
  );

  return {
    registrations: data,
    thisWeekTotal: data?.thisWeekTotal || 0,
    previousWeekTotal: data?.previousWeekTotal || 0,
    monthlyTotal: data?.monthlyTotal || 0,
    isLoading,
    error,
  };
}
