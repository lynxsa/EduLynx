'use client';

import { ModernTable } from '@/components/ui/ModernTable';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Calendar, Clock, FileText, GraduationCap, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type ExamRow = {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  lesson?: {
    subject?: { name: string };
    class?: { name: string };
    teacher?: { name: string };
  } | null;
};

const ExamsPage = () => {
  const [exams, setExams] = useState<ExamRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalExams, setTotalExams] = useState(0);
  const [upcomingExams, setUpcomingExams] = useState(0);
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Redirect if not authenticated or authorized
  useEffect(() => {
    if (!isLoading && (!user || !['ADMIN', 'TEACHER'].includes(user.role))) {
      router.push('/sign-in');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        // **ROLE-BASED ACCESS**: Use role and userId for filtered data
        const roleParam = user?.role ? `role=${user.role}` : '';
        const userIdParam = user?.id ? `userId=${user.id}` : '';
        const params = [roleParam, userIdParam].filter(Boolean).join('&');

        console.log(`🔄 [${user?.role} Exams] Fetching live exam data...`);
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/exams${params ? `?${params}` : ''}`);
        if (!response.ok) {
          throw new Error('Failed to fetch exams');
        }
        const data = await response.json();
        console.log(`✅ [${user?.role} Exams] API Response:`, data);
        console.log(`✅ [${user?.role} Exams] Loaded ${data.length} exams from database`);

        setExams(data.data || data);
        setTotalExams(data.length);

        // Calculate upcoming exams
        const now = new Date();
        const upcoming = data.filter((exam: ExamRow) => new Date(exam.startTime) > now).length;
        setUpcomingExams(upcoming);

        setLoading(false);
      } catch (err) {
        console.error(`❌ [${user?.role} Exams] Error fetching exams:`, err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    // Only fetch if user is authenticated and authorized
    if (!isLoading && user && ['ADMIN', 'TEACHER'].includes(user.role)) {
      fetchExams();
    }
  }, [user, isLoading]);

  const columns = [
    {
      key: 'title',
      label: 'Exam',
      sortable: true,
      render: (exam: ExamRow) => (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">{exam.title}</div>
            {exam.lesson?.subject?.name && (
              <div className="text-sm text-gray-500">{exam.lesson.subject.name}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'subject',
      label: 'Subject',
      sortable: true,
      render: (exam: ExamRow) => (
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-900">{exam.lesson?.subject?.name || 'N/A'}</span>
        </div>
      ),
    },
    {
      key: 'class',
      label: 'Class',
      sortable: true,
      render: (exam: ExamRow) => (
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-900">{exam.lesson?.class?.name || 'N/A'}</span>
        </div>
      ),
    },
    {
      key: 'teacher',
      label: 'Teacher',
      sortable: true,
      render: (exam: ExamRow) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-900">{exam.lesson?.teacher?.name || 'N/A'}</span>
        </div>
      ),
    },
    {
      key: 'startTime',
      label: 'Start Time',
      sortable: true,
      render: (exam: ExamRow) => {
        const date = new Date(exam.startTime);
        return (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {date.toLocaleDateString('en-ZA')}
              </p>
              <p className="text-xs text-gray-500">
                {date.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'endTime',
      label: 'End Time',
      sortable: true,
      render: (exam: ExamRow) => {
        const date = new Date(exam.endTime);
        const startDate = new Date(exam.startTime);
        const duration = Math.round((date.getTime() - startDate.getTime()) / (1000 * 60));

        return (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {date.toLocaleDateString('en-ZA')}
              </p>
              <p className="text-xs text-gray-500">
                {date.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })} (
                {duration}min)
              </p>
            </div>
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
          <p className="mt-4 text-gray-600">Loading exams...</p>
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Exams</p>
              <p className="text-2xl font-semibold text-gray-900">{totalExams}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Exams</p>
              <p className="text-2xl font-semibold text-gray-900">{upcomingExams}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Exams</p>
              <p className="text-2xl font-semibold text-gray-900">{totalExams - upcomingExams}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-semibold text-gray-900">
                {
                  exams.filter(exam => {
                    const examDate = new Date(exam.startTime);
                    const now = new Date();
                    return (
                      examDate.getMonth() === now.getMonth() &&
                      examDate.getFullYear() === now.getFullYear()
                    );
                  }).length
                }
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <ModernTable
        data={exams}
        columns={columns}
        title="Exams"
        description="Manage examination schedules and assessments"
        searchableFields={[
          'title',
          'lesson.subject.name',
          'lesson.class.name',
          'lesson.teacher.name',
        ]}
        onView={(exam: ExamRow) => {
          console.log('View exam:', exam);
          // Navigate to view page
        }}
        onEdit={(exam: ExamRow) => {
          console.log('Edit exam:', exam);
          // Navigate to edit page
        }}
        onDelete={(exam: ExamRow) => {
          if (window.confirm('Are you sure you want to delete this exam?')) {
            console.log('Delete exam:', exam);
            // Handle delete
          }
        }}
      />
    </div>
  );
};

export default ExamsPage;
