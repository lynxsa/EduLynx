import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface TeacherData {
  total: number;
  active: number;
  subjectDistribution: Array<{ subject: string; count: number }>;
}

export function useActiveTeachers() {
  const { data, error, isLoading } = useSWR<TeacherData>('/api/teachers/stats', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 180000, // 3 minutes
  });

  return {
    totalTeachers: data?.total || 0,
    activeTeachers: data?.active || 0,
    subjectDistribution: data?.subjectDistribution || [],
    isLoading,
    error,
  };
}

export function useMyClasses() {
  const { data, error, isLoading } = useSWR('/api/teachers/my-classes', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000, // 5 minutes
  });

  return {
    classes: data?.classes || [],
    todayClasses: data?.todayClasses || [],
    isLoading,
    error,
  };
}

export function usePendingGrading() {
  const { data, error, isLoading } = useSWR('/api/teachers/pending-grading', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 120000, // 2 minutes
  });

  return {
    pendingCount: data?.count || 0,
    assignments: data?.assignments || [],
    exams: data?.exams || [],
    isLoading,
    error,
  };
}

export function useClassScores() {
  const { data, error, isLoading } = useSWR('/api/teachers/class-scores', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000, // 5 minutes
  });

  return {
    averageScores: data?.averageScores || [],
    isLoading,
    error,
  };
}
