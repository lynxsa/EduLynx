'use client';

import { useEffect, useState } from 'react';
import { ModernTable } from '@/components/ui/ModernTable';
import { Trophy, User, GraduationCap, BookOpen, TrendingUp, FileText } from 'lucide-react';

type ResultRow = {
  id: number;
  score: number;
  exam?: {
    title?: string;
    lesson?: {
      subject?: { name: string };
      class?: { name: string };
    };
  } | null;
  assignment?: {
    title?: string;
    lesson?: {
      subject?: { name: string };
      class?: { name: string };
    };
  } | null;
  student?: { name: string } | null;
};

const ResultsPage = () => {
  const [results, setResults] = useState<ResultRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('/api/results');
        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }
        const data = await response.json();
        setResults(data.data || data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-blue-600 bg-blue-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getGradeFromScore = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  };

  const columns = [
    {
      key: 'assessment',
      label: 'Assessment',
      sortable: true,
      render: (result: ResultRow) => {
        const isExam = !!result.exam;
        const title = result.exam?.title || result.assignment?.title || 'N/A';
        const subject =
          result.exam?.lesson?.subject?.name || result.assignment?.lesson?.subject?.name || 'N/A';

        return (
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isExam ? 'bg-red-100' : 'bg-purple-100'
                }`}
              >
                {isExam ? (
                  <FileText className="w-5 h-5 text-red-600" />
                ) : (
                  <BookOpen className="w-5 h-5 text-purple-600" />
                )}
              </div>
            </div>
            <div>
              <div className="font-medium text-gray-900">{title}</div>
              <div className="text-sm text-gray-500">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs mr-2 ${
                    isExam ? 'bg-red-100 text-red-800' : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {isExam ? 'Exam' : 'Assignment'}
                </span>
                {subject}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: 'student',
      label: 'Student',
      sortable: true,
      render: (result: ResultRow) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-900">{result.student?.name || 'N/A'}</span>
        </div>
      ),
    },
    {
      key: 'class',
      label: 'Class',
      sortable: true,
      render: (result: ResultRow) => {
        const className =
          result.exam?.lesson?.class?.name || result.assignment?.lesson?.class?.name || 'N/A';
        return (
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-900">{className}</span>
          </div>
        );
      },
    },
    {
      key: 'score',
      label: 'Score & Grade',
      sortable: true,
      render: (result: ResultRow) => {
        const scoreColor = getScoreColor(result.score);
        const grade = getGradeFromScore(result.score);

        return (
          <div className="flex items-center gap-3">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">{result.score}%</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${scoreColor}`}>
                  {grade}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {result.score >= 70 ? 'Pass' : 'Needs Improvement'}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: 'performance',
      label: 'Performance',
      sortable: true,
      render: (result: ResultRow) => {
        const score = result.score;
        let performance = 'Poor';
        let performanceColor = 'text-red-600 bg-red-100';

        if (score >= 90) {
          performance = 'Excellent';
          performanceColor = 'text-green-600 bg-green-100';
        } else if (score >= 80) {
          performance = 'Very Good';
          performanceColor = 'text-green-600 bg-green-100';
        } else if (score >= 70) {
          performance = 'Good';
          performanceColor = 'text-blue-600 bg-blue-100';
        } else if (score >= 60) {
          performance = 'Satisfactory';
          performanceColor = 'text-yellow-600 bg-yellow-100';
        } else if (score >= 50) {
          performance = 'Needs Improvement';
          performanceColor = 'text-orange-600 bg-orange-100';
        }

        return (
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-gray-400" />
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${performanceColor}`}>
              {performance}
            </span>
          </div>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <ModernTable
        data={results}
        columns={columns}
        title="Results"
        description="Manage student assessment results and grades"
        searchableFields={[
          'student.name',
          'exam.title',
          'assignment.title',
          'exam.lesson.subject.name',
          'assignment.lesson.subject.name',
        ]}
        onView={(result: ResultRow) => {
          console.log('View result:', result);
          // Navigate to view page
        }}
        onEdit={(result: ResultRow) => {
          console.log('Edit result:', result);
          // Navigate to edit page
        }}
        onDelete={(result: ResultRow) => {
          if (window.confirm('Are you sure you want to delete this result?')) {
            console.log('Delete result:', result);
            // Handle delete
          }
        }}
      />
    </div>
  );
};

export default ResultsPage;
