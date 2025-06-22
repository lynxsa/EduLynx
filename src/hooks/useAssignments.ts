import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface AssignmentData {
  total: number;
  dueToday: number;
  overdue: number;
  completed: number;
  assignments: Array<{
    id: number;
    title: string;
    dueDate: string;
    subject: string;
    class: string;
  }>;
}

export function useAssignmentsDue() {
  const { data, error, isLoading } = useSWR<AssignmentData>('/api/assignments/due', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 120000, // 2 minutes
  });

  return {
    dueToday: data?.dueToday || 0,
    overdue: data?.overdue || 0,
    assignments: data?.assignments || [],
    isLoading,
    error,
  };
}

export function useChildAssignments() {
  const { data, error, isLoading } = useSWR('/api/parents/child-assignments', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 180000, // 3 minutes
  });

  return {
    upcoming: data?.upcoming || [],
    overdue: data?.overdue || [],
    isLoading,
    error,
  };
}
