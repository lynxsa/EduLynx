import useSWR from 'swr';

interface SubjectScore {
  id: string;
  name: string;
  averageScore: number;
  studentCount: number;
  totalAssignments: number;
  completedAssignments: number;
}

interface SubjectScoresResponse {
  subjects: SubjectScore[];
  overallAverage: number;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useSubjectScores() {
  const { data, error, isLoading } = useSWR<SubjectScoresResponse>(
    '/api/subjects/scores',
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: false,
    }
  );

  return {
    subjectScores: data?.subjects || [],
    overallAverage: data?.overallAverage || 0,
    isLoading,
    error,
  };
}
