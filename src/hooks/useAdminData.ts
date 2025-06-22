import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface DropoutRiskStudent {
  id: string;
  name: string;
  surname: string;
  attendanceRate: number;
  averageScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  riskScore: number;
}

interface DropoutRiskData {
  stats: {
    total: number;
    highRisk: number;
    mediumRisk: number;
    lowRisk: number;
  };
  students: DropoutRiskStudent[];
}

export function useDropoutRisk() {
  const { data, error, isLoading, mutate } = useSWR<DropoutRiskData>(
    '/api/students/dropout-risk',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 600000, // 10 minutes
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  return {
    dropoutData: data,
    isLoading,
    error,
    refetch: mutate,
  };
}

interface AssignmentsDueData {
  stats: {
    dueThisWeek: number;
    overdue: number;
    totalPending: number;
    avgSubmissionRate: number;
  };
  upcoming: Array<{
    id: number;
    title: string;
    dueDate: Date;
    subject: string;
    class: string;
    totalStudents: number;
    submitted: number;
    pending: number;
    submissionRate: number;
  }>;
  overdue: Array<{
    id: number;
    title: string;
    dueDate: Date;
    subject: string;
    class: string;
    totalStudents: number;
    submitted: number;
    pending: number;
  }>;
}

export function useAssignmentsDue() {
  const { data, error, isLoading, mutate } = useSWR<AssignmentsDueData>(
    '/api/assignments/due',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  return {
    assignmentsData: data,
    isLoading,
    error,
    refetch: mutate,
  };
}

interface SystemAlert {
  id: string;
  type: 'WARNING' | 'INFO' | 'SUCCESS' | 'ERROR';
  title: string;
  message: string;
  timestamp: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface SystemAlertsData {
  stats: {
    total: number;
    critical: number;
    warning: number;
    info: number;
    unread: number;
  };
  alerts: SystemAlert[];
}

export function useSystemAlerts() {
  const { data, error, isLoading, mutate } = useSWR<SystemAlertsData>(
    '/api/system/alerts',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  return {
    alertsData: data,
    isLoading,
    error,
    refetch: mutate,
  };
}

interface PendingGradingData {
  stats: {
    totalPending: number;
    assignments: number;
    exams: number;
    oldestPending: any;
  };
  pending: Array<{
    id: number | string;
    title: string;
    type: 'assignment' | 'exam';
    subject: string;
    class: string;
    dueDate?: Date;
    examDate?: Date;
    pendingCount: number;
    submissions: Array<{
      studentName: string;
      submittedAt?: Date;
    }>;
  }>;
}

export function usePendingGrading(teacherId?: string) {
  const { data, error, isLoading, mutate } = useSWR<PendingGradingData>(
    teacherId ? `/api/teachers/pending-grading?teacherId=${teacherId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  return {
    gradingData: data,
    isLoading,
    error,
    refetch: mutate,
  };
}
