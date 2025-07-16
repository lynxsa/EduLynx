'use client';

import { ModernTable } from '@/components/ui/ModernTable';
import { useAuth } from '@/contexts/AuthContext';
import {
  Calendar,
  CheckCircle,
  Clock,
  GraduationCap,
  User,
  UserCheck,
  Users,
  XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface AttendanceItem {
  id: number;
  date: string;
  present: boolean;
  student: {
    id: string;
    name: string;
    surname: string;
    img?: string;
  };
  lesson: {
    id: number;
    name: string;
    subject?: { name: string };
    class?: { name: string };
    teacher?: { name: string; surname: string };
  };
}

const AttendancePage = () => {
  const [attendance, setAttendance] = useState<AttendanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Redirect if not authenticated or authorized
  useEffect(() => {
    if (!isLoading && (!user || !['ADMIN', 'TEACHER'].includes(user.role))) {
      router.push('/sign-in');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        // **ROLE-BASED ACCESS**: Use role and userId for filtered data
        const roleParam = user?.role ? `role=${user.role}` : '';
        const userIdParam = user?.id ? `userId=${user.id}` : '';
        const params = [roleParam, userIdParam].filter(Boolean).join('&');

        console.log(`🔄 [${user?.role} Attendance] Fetching live attendance data...`);
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/attendance${params ? `?${params}` : ''}`);
        if (!response.ok) {
          throw new Error('Failed to fetch attendance');
        }

        const data = await response.json();
        console.log(`✅ [${user?.role} Attendance] API Response:`, data);
        console.log(
          `✅ [${user?.role} Attendance] Loaded ${data.length} attendance records from database`
        );
        setAttendance(data);
      } catch (err) {
        console.error(`❌ [${user?.role} Attendance] Error fetching attendance:`, err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if user is authenticated and authorized
    if (!isLoading && user && ['ADMIN', 'TEACHER'].includes(user.role)) {
      fetchAttendance();
    }
  }, [user, isLoading]);

  // Show loading if auth is still loading
  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  // Show error if exists
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalRecords = attendance.length;
  const presentCount = attendance.filter(a => a.present).length;
  const absentCount = totalRecords - presentCount;
  const attendanceRate = totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0;

  const columns = [
    {
      key: 'student',
      label: 'Student',
      sortable: true,
      render: (record: AttendanceItem) => (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {record.student.name} {record.student.surname}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'lesson',
      label: 'Lesson Details',
      sortable: true,
      render: (record: AttendanceItem) => (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {record.lesson.subject?.name || 'Unknown Subject'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {record.lesson.class?.name || 'Unknown Class'} •{' '}
              {record.lesson.teacher?.name || 'Unknown Teacher'}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (record: AttendanceItem) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-900 dark:text-gray-100">
            {new Date(record.date).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      key: 'present',
      label: 'Status',
      sortable: true,
      render: (record: AttendanceItem) => (
        <div className="flex items-center gap-2">
          {record.present ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                Present
              </span>
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200">
                Absent
              </span>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Attendance Records
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {user?.role === 'TEACHER'
              ? 'Your lesson attendance records'
              : 'Manage student attendance across all classes'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {totalRecords} total records
          </span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Records</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalRecords}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Present</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {presentCount}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Absent</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{absentCount}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Attendance Rate
              </p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {attendanceRate}%
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <ModernTable
          data={attendance}
          columns={columns}
          searchableFields={[
            'student.name',
            'student.surname',
            'lesson.subject.name',
            'lesson.class.name',
          ]}
        />
      </div>
    </div>
  );
};

export default AttendancePage;
