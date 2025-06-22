'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ModernTable } from '@/components/ui/ModernTable';
import {
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Calendar,
  Activity,
  BookOpen,
  Users,
  Award,
  Briefcase,
} from 'lucide-react';

interface Teacher {
  id: string;
  username: string;
  name: string;
  surname: string;
  email: string;
  phone?: string;
  address: string;
  img?: string;
  sex: string;
  birthday: string;
  department?: string;
  specialization?: string;
  yearsOfExperience?: number;
  qualification?: string;
  employmentStatus?: string;
  subjects: Array<{
    id: number;
    name: string;
  }>;
  classes: Array<{
    id: number;
    name: string;
    capacity: number;
  }>;
  _count?: {
    subjects: number;
    classes: number;
  };
}

const TeachersPage = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch('/api/teachers');
        if (!response.ok) {
          throw new Error('Failed to fetch teachers');
        }
        const data = await response.json();
        setTeachers(data.data || data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const getStatusColor = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case 'full-time':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'part-time':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'contract':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'substitute':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Teacher',
      sortable: true,
      render: (teacher: Teacher) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            {teacher.img ? (
              <Image
                src={teacher.img}
                alt={`${teacher.name} ${teacher.surname}`}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                  {teacher.name[0]}
                  {teacher.surname[0]}
                </span>
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {teacher.name} {teacher.surname}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">@{teacher.username}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      label: 'Department',
      sortable: true,
      render: (teacher: Teacher) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {teacher.department || 'General'}
          </p>
          {teacher.specialization && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{teacher.specialization}</p>
          )}
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Contact',
      render: (teacher: Teacher) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Mail className="w-4 h-4" />
            <span className="truncate max-w-32">{teacher.email}</span>
          </div>
          {teacher.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Phone className="w-4 h-4" />
              <span>{teacher.phone}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'subjects',
      label: 'Subjects & Classes',
      render: (teacher: Teacher) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <BookOpen className="w-4 h-4 text-purple-500" />
            <span className="font-medium">{teacher.subjects?.length || 0} subjects</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="font-medium">{teacher.classes?.length || 0} classes</span>
          </div>
          {teacher.subjects?.slice(0, 2).map(subject => (
            <span
              key={subject.id}
              className="inline-block px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded mr-1"
            >
              {subject.name}
            </span>
          ))}
          {teacher.subjects?.length > 2 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              +{teacher.subjects.length - 2} more
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'qualification',
      label: 'Qualifications',
      render: (teacher: Teacher) => (
        <div className="space-y-1">
          {teacher.qualification && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Award className="w-4 h-4 text-yellow-500" />
              <span className="truncate max-w-24">{teacher.qualification}</span>
            </div>
          )}
          {teacher.yearsOfExperience && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Calendar className="w-4 h-4 text-green-500" />
              <span>{teacher.yearsOfExperience} years exp.</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'employmentStatus',
      label: 'Status',
      sortable: true,
      render: (teacher: Teacher) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${getStatusColor(teacher.employmentStatus)}`}
        >
          {teacher.employmentStatus || 'Full-time'}
        </span>
      ),
    },
  ];

  const handleView = (teacher: Teacher) => {
    router.push(`/list/teachers/${teacher.id}`);
  };

  const handleEdit = (teacher: Teacher) => {
    // TODO: Implement edit functionality
    console.log('Edit teacher:', teacher);
  };

  const handleDelete = (teacher: Teacher) => {
    // TODO: Implement delete functionality
    console.log('Delete teacher:', teacher);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 text-lg">{error}</p>
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {teachers.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Teachers</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {
                    teachers.filter(t => t.employmentStatus === 'Full-time' || !t.employmentStatus)
                      .length
                  }
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Full-time</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {teachers.reduce((acc, t) => acc + (t.subjects?.length || 0), 0)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Subjects</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Briefcase className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {teachers.length > 0
                    ? Math.round(
                        teachers.reduce((acc, t) => acc + (t.yearsOfExperience || 0), 0) /
                          teachers.length
                      )
                    : 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Experience</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Table */}
        <ModernTable
          data={teachers}
          columns={columns}
          searchableFields={[
            'name',
            'surname',
            'email',
            'username',
            'department',
            'specialization',
          ]}
          loading={loading}
          title="Teaching Staff"
          description="Manage and monitor all teaching personnel"
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          itemsPerPage={15}
        />
      </div>
    </div>
  );
};

export default TeachersPage;
