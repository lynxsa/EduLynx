import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export interface Project {
  id: string;
  title: string;
  description?: string;
  type: 'INDIVIDUAL' | 'GROUP' | 'CLASS';
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'SUBMITTED' | 'GRADED';
  startDate: string;
  dueDate: string;
  grade?: number;
  feedback?: string;
  requirements?: string;
  resources?: string;
  subject?: {
    id: number;
    name: string;
  };
  class?: {
    id: number;
    name: string;
  };
  teacher?: {
    id: string;
    name: string;
    surname: string;
  };
  students?: {
    id: string;
    name: string;
    surname: string;
  }[];
  _count?: {
    students: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProjectStats {
  total: number;
  byStatus: { status: string; count: number }[];
  byType: { type: string; count: number }[];
  overdue: number;
  recentlySubmitted: number;
  upcomingDeadlines: number;
  completionRate: number;
  summary: {
    active: number;
    pending: number;
    completed: number;
    graded: number;
  };
}

export function useProjects() {
  const { data, error, isLoading, mutate } = useSWR('/api/projects', fetcher);

  return {
    projects: data?.success ? (data.data as Project[]) : [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useProjectStats() {
  const { data, error, isLoading, mutate } = useSWR('/api/projects/stats', fetcher);

  return {
    stats: data?.success ? (data.data as ProjectStats) : null,
    isLoading,
    isError: error,
    mutate,
  };
}
