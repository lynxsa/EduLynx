'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ModernTable } from '@/components/ui/ModernTable';
import {
  School,
  Users,
  GraduationCap,
  User,
  Calendar,
  BookOpen,
  TrendingUp,
  MapPin,
  Clock,
} from 'lucide-react';

interface Class {
  id: number;
  name: string;
  capacity: number;
  description?: string;
  room?: string;
  schedule?: string;
  grade: {
    id: number;
    level: number;
  };
  supervisor: {
    id: string;
    name: string;
    surname: string;
  } | null;
  students: Array<{
    id: string;
    name: string;
    surname: string;
  }>;
  lessons: Array<{
    id: string;
    title: string;
    subject: {
      name: string;
    };
  }>;
  _count?: {
    students: number;
    lessons: number;
  };
}

const ClassesPage = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('/api/classes');
        if (!response.ok) {
          throw new Error('Failed to fetch classes');
        }
        const data = await response.json();
        setClasses(data.data || data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const columns = [
    {
      key: 'name',
      label: 'Class',
      sortable: true,
      render: (classItem: Class) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <School className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{classItem.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                Grade {classItem.grade.level}
              </span>
              {classItem.room && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  Room {classItem.room}
                </span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'supervisor',
      label: 'Class Teacher',
      render: (classItem: Class) => {
        const supervisor = classItem.supervisor;
        return supervisor ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <User className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">
                {supervisor.name} {supervisor.surname}
              </p>
              <p className="text-xs text-gray-500">Class Supervisor</p>
            </div>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">No supervisor assigned</span>
        );
      },
    },
    {
      key: 'students',
      label: 'Students',
      sortable: true,
      render: (classItem: Class) => {
        const studentCount = classItem._count?.students || classItem.students?.length || 0;
        const utilizationPercent =
          classItem.capacity > 0 ? (studentCount / classItem.capacity) * 100 : 0;
        const utilizationColor =
          utilizationPercent > 90
            ? 'text-red-600'
            : utilizationPercent > 75
              ? 'text-yellow-600'
              : 'text-green-600';

        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="font-medium text-gray-900">
                {studentCount}/{classItem.capacity}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${utilizationPercent > 90 ? 'bg-red-500' : utilizationPercent > 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                ></div>
              </div>
              <span className={`text-xs font-medium ${utilizationColor}`}>
                {Math.round(utilizationPercent)}%
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: 'lessons',
      label: 'Lessons',
      sortable: true,
      render: (classItem: Class) => {
        const lessonCount = classItem._count?.lessons || classItem.lessons?.length || 0;
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-500" />
              <span className="font-medium text-gray-900">{lessonCount} lessons</span>
            </div>
            {classItem.lessons?.slice(0, 2).map(lesson => (
              <div key={lesson.id} className="text-xs text-gray-600">
                {lesson.subject.name}
              </div>
            ))}
            {classItem.lessons?.length > 2 && (
              <span className="text-xs text-gray-500">+{classItem.lessons.length - 2} more</span>
            )}
          </div>
        );
      },
    },
    {
      key: 'schedule',
      label: 'Details',
      render: (classItem: Class) => (
        <div className="space-y-1">
          {classItem.schedule && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-green-500" />
              <span className="truncate max-w-24">{classItem.schedule}</span>
            </div>
          )}
          {classItem.description && (
            <p className="text-xs text-gray-500 truncate max-w-32">{classItem.description}</p>
          )}
        </div>
      ),
    },
  ];

  const handleView = (classItem: Class) => {
    router.push(`/list/classes/${classItem.id}`);
  };

  const handleEdit = (classItem: Class) => {
    // TODO: Implement edit functionality
    console.log('Edit class:', classItem);
  };

  const handleDelete = (classItem: Class) => {
    // TODO: Implement delete functionality
    console.log('Delete class:', classItem);
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <School className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{classes.length}</p>
                <p className="text-sm text-gray-600">Total Classes</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {classes.reduce(
                    (acc, c) => acc + (c._count?.students || c.students?.length || 0),
                    0
                  )}
                </p>
                <p className="text-sm text-gray-600">Total Students</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {classes.length > 0
                    ? Math.round(
                        (classes.reduce(
                          (acc, c) => acc + (c._count?.students || c.students?.length || 0),
                          0
                        ) /
                          classes.reduce((acc, c) => acc + c.capacity, 0)) *
                          100
                      )
                    : 0}
                  %
                </p>
                <p className="text-sm text-gray-600">Avg Utilization</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {classes.reduce(
                    (acc, c) => acc + (c._count?.lessons || c.lessons?.length || 0),
                    0
                  )}
                </p>
                <p className="text-sm text-gray-600">Total Lessons</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Table */}
        <ModernTable
          data={classes}
          columns={columns}
          searchableFields={[
            'name',
            'room',
            'description',
            'supervisor.name',
            'supervisor.surname',
          ]}
          loading={loading}
          title="Class Management"
          description="Monitor and manage all classroom activities"
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          itemsPerPage={15}
        />
      </div>
    </div>
  );
};

export default ClassesPage;
