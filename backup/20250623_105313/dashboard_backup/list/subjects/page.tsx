'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ModernTable } from '@/components/ui/ModernTable';
import { BookOpen, Users, Clock, Award, TrendingUp, Activity, Hash } from 'lucide-react';

interface Subject {
  id: number;
  name: string;
  code?: string;
  description?: string;
  category?: string;
  creditHours?: number;
  difficulty?: string;
  teachers: Array<{
    id: string;
    name: string;
    surname: string;
  }>;
  lessons: Array<{
    id: string;
    title: string;
    class: {
      name: string;
    };
  }>;
  _count?: {
    teachers: number;
    lessons: number;
    students: number;
  };
}

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch('/api/subjects');
        if (!response.ok) {
          throw new Error('Failed to fetch subjects');
        }
        const data = await response.json();
        setSubjects(data.data || data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const getCategoryColor = (category?: string) => {
    const categoryColors: Record<string, string> = {
      Science: 'bg-blue-100 text-blue-800',
      Mathematics: 'bg-green-100 text-green-800',
      Language: 'bg-purple-100 text-purple-800',
      Arts: 'bg-pink-100 text-pink-800',
      'Physical Education': 'bg-orange-100 text-orange-800',
      'Social Studies': 'bg-indigo-100 text-indigo-800',
    };
    return categoryColors[category || 'Other'] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Subject',
      sortable: true,
      render: (subject: Subject) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{subject.name}</p>
            <div className="flex items-center gap-2 mt-1">
              {subject.code && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  {subject.code}
                </span>
              )}
              {subject.category && (
                <span className={`px-2 py-1 text-xs rounded ${getCategoryColor(subject.category)}`}>
                  {subject.category}
                </span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'teachers',
      label: 'Teachers',
      sortable: true,
      render: (subject: Subject) => {
        const teacherCount = subject._count?.teachers || subject.teachers?.length || 0;
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-green-500" />
              <span className="font-medium text-gray-900">{teacherCount} teachers</span>
            </div>
            {subject.teachers?.slice(0, 2).map(teacher => (
              <div key={teacher.id} className="text-xs text-gray-600">
                {teacher.name} {teacher.surname}
              </div>
            ))}
            {subject.teachers?.length > 2 && (
              <span className="text-xs text-gray-500">+{subject.teachers.length - 2} more</span>
            )}
          </div>
        );
      },
    },
    {
      key: 'lessons',
      label: 'Lessons',
      sortable: true,
      render: (subject: Subject) => {
        const lessonCount = subject._count?.lessons || subject.lessons?.length || 0;
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-500" />
              <span className="font-medium text-gray-900">{lessonCount} lessons</span>
            </div>
            {subject.lessons?.slice(0, 2).map(lesson => (
              <div key={lesson.id} className="text-xs text-gray-600">
                {lesson.class.name} - {lesson.title}
              </div>
            ))}
            {subject.lessons?.length > 2 && (
              <span className="text-xs text-gray-500">+{subject.lessons.length - 2} more</span>
            )}
          </div>
        );
      },
    },
    {
      key: 'students',
      label: 'Students',
      sortable: true,
      render: (subject: Subject) => {
        const studentCount = subject._count?.students || 0;
        return (
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-gray-900">{studentCount} students</span>
          </div>
        );
      },
    },
    {
      key: 'details',
      label: 'Details',
      render: (subject: Subject) => (
        <div className="space-y-1">
          {subject.creditHours && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Hash className="w-4 h-4 text-green-500" />
              <span>{subject.creditHours} credits</span>
            </div>
          )}
          {subject.difficulty && (
            <span
              className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(subject.difficulty)}`}
            >
              {subject.difficulty}
            </span>
          )}
          {subject.description && (
            <p className="text-xs text-gray-500 truncate max-w-32 mt-1">{subject.description}</p>
          )}
        </div>
      ),
    },
  ];

  const handleView = (subject: Subject) => {
    router.push(`/list/subjects/${subject.id}`);
  };

  const handleEdit = (subject: Subject) => {
    // TODO: Implement edit functionality
    console.log('Edit subject:', subject);
  };

  const handleDelete = (subject: Subject) => {
    // TODO: Implement delete functionality
    console.log('Delete subject:', subject);
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
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{subjects.length}</p>
                <p className="text-sm text-gray-600">Total Subjects</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {subjects.reduce(
                    (acc, s) => acc + (s._count?.teachers || s.teachers?.length || 0),
                    0
                  )}
                </p>
                <p className="text-sm text-gray-600">Total Teachers</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {subjects.reduce(
                    (acc, s) => acc + (s._count?.lessons || s.lessons?.length || 0),
                    0
                  )}
                </p>
                <p className="text-sm text-gray-600">Total Lessons</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Award className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {subjects.reduce((acc, s) => acc + (s.creditHours || 0), 0)}
                </p>
                <p className="text-sm text-gray-600">Total Credits</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Table */}
        <ModernTable
          data={subjects}
          columns={columns}
          searchableFields={['name', 'code', 'description', 'category']}
          loading={loading}
          title="Subject Management"
          description="Manage curriculum subjects and course offerings"
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          itemsPerPage={15}
        />
      </div>
    </div>
  );
};

export default SubjectsPage;
