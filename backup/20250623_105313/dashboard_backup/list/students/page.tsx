'use client';

import ProgressBar from '@/components/ProgressBar';
import StandardLoadingScreen from '@/components/StandardLoadingScreen';
import { ModernTable } from '@/components/ui/ModernTable';
import { useAuth } from '@/contexts/AuthContext';
import {
  Activity,
  BookOpen,
  Calendar,
  GraduationCap,
  Heart,
  Mail,
  Phone,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface StudentItem {
  id: string;
  username: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  img?: string;
  bloodType: string;
  sex: string;
  gender: string;
  allergies?: string | null;
  medicalInfo?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  status?: string | null;
  birthday: string;
  parent?: { id: string; name: string; surname?: string } | null;
  class?: { id: number; name: string } | null;
  grade?: { id: number; level: number } | null;
  attendancePercent?: number | null;
  avgScore?: number | null;
}

const StudentsPage = () => {
  const [students, setStudents] = useState<StudentItem[]>([]);
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

  // Fetch students data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/students');
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }
        const result = await response.json();

        // Handle paginated response structure
        if (result.success && result.data) {
          // If it's a paginated response, extract the data array
          const studentsData = result.data.data || result.data;
          setStudents(Array.isArray(studentsData) ? studentsData : []);
        } else {
          // Fallback for direct array response
          setStudents(Array.isArray(result) ? result : []);
        }
      } catch (err) {
        console.error('Error fetching students:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setStudents([]); // Ensure students is always an array
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if user is authenticated and authorized
    if (!isLoading && user && ['ADMIN', 'TEACHER'].includes(user.role)) {
      fetchStudents();
    }
  }, [user, isLoading]);

  // Show loading page while checking authentication
  if (isLoading) {
    return <StandardLoadingScreen message="Loading students..." />;
  }

  // Redirect if not authorized
  if (!user || !['ADMIN', 'TEACHER'].includes(user.role)) {
    return null;
  }

  const getStatusColor = (status: string | null | undefined) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200';
      case 'inactive':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200';
      case 'suspended':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200';
      default:
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200';
    }
  };

  const getGradeColor = (score: number | null | undefined) => {
    if (!score) return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    if (score >= 75) return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200';
    if (score >= 60)
      return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200';
    return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200';
  };

  const columns = [
    {
      key: 'name',
      label: 'Student',
      sortable: true,
      render: (student: StudentItem) => (
        <div className="flex items-center gap-3">
          {' '}
          <div className="relative">
            {student.img ? (
              <Image
                src={student.img}
                alt={`${student.name} ${student.surname}`}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 font-medium text-sm">
                  {student.name[0]}
                  {student.surname[0]}
                </span>
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {student.name} {student.surname}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">@{student.username}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'grade.level',
      label: 'Grade & Class',
      sortable: true,
      render: (student: StudentItem) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            Grade {student.grade?.level || 'N/A'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {student.class?.name || 'No Class'}
          </p>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Contact',
      render: (student: StudentItem) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Mail className="w-4 h-4" />
            <span className="truncate max-w-32">{student.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Phone className="w-4 h-4" />
            <span>{student.phone}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'attendancePercent',
      label: 'Performance',
      sortable: true,
      render: (student: StudentItem) => (
        <div className="space-y-2">
          <ProgressBar
            value={student.attendancePercent || 0}
            size="sm"
            color="green"
            showLabel={true}
            className="w-16"
          />
          <span className={`px-2 py-1 text-xs rounded-full ${getGradeColor(student.avgScore)}`}>
            Avg: {student.avgScore || 0}%
          </span>
        </div>
      ),
    },
    {
      key: 'bloodType',
      label: 'Health Info',
      render: (student: StudentItem) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Heart className="w-4 h-4 text-red-500" />
            <span>{student.bloodType}</span>
          </div>
          {student.allergies && (
            <p className="text-xs text-orange-600 dark:text-orange-400 truncate max-w-24">
              {student.allergies}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'parent.name',
      label: 'Parent',
      sortable: true,
      render: (student: StudentItem) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-24">
            {student.parent
              ? `${student.parent.name} ${student.parent.surname || ''}`.trim()
              : 'No Parent'}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (student: StudentItem) => (
        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(student.status)}`}>
          {student.status || 'Active'}
        </span>
      ),
    },
  ];

  const handleView = (student: StudentItem) => {
    router.push(`/list/students/${student.id}`);
  };

  const handleEdit = (student: StudentItem) => {
    // TODO: Implement edit functionality
    console.log('Edit student:', student);
  };

  const handleDelete = (student: StudentItem) => {
    // TODO: Implement delete functionality
    console.log('Delete student:', student);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 p-6">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Array.isArray(students) ? students.length : 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Array.isArray(students)
                    ? students.filter(s => s.status === 'Active' || !s.status).length
                    : 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Array.isArray(students) && students.length > 0
                    ? Math.round(
                        students.reduce((acc, s) => acc + (s.avgScore || 0), 0) / students.length
                      )
                    : 0}
                  %
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Score</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Array.isArray(students) && students.length > 0
                    ? Math.round(
                        students.reduce((acc, s) => acc + (s.attendancePercent || 0), 0) /
                          students.length
                      )
                    : 0}
                  %
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Attendance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Table */}
        <ModernTable
          data={students}
          columns={columns}
          searchableFields={['name', 'surname', 'email', 'username']}
          loading={loading}
          title="Student Records"
          description="Comprehensive student information and academic tracking"
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          itemsPerPage={15}
        />
      </div>
    </div>
  );
};

export default StudentsPage;
