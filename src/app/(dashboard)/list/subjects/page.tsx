'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { BookOpen, Users, Clock, Award, TrendingUp, Activity } from 'lucide-react';

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

  const columns: ColumnDef<Subject>[] = [
    {
      accessorKey: "name",
      header: "Subject",
      enableSorting: true,
      cell: ({ row }) => {
        const subject = row.original;
        const categoryColors = {
          'Science': 'bg-blue-100 text-blue-800',
          'Mathematics': 'bg-green-100 text-green-800', 
          'Language': 'bg-purple-100 text-purple-800',
          'Arts': 'bg-pink-100 text-pink-800',
          'Physical Education': 'bg-orange-100 text-orange-800',
          'Social Studies': 'bg-indigo-100 text-indigo-800',
        };
        
        return (
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
                  <span className={`px-2 py-1 text-xs rounded ${
                    categoryColors[subject.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-600'
                  }`}>
                    {subject.category}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.original.description;
        return (
          <div className="max-w-48">
            <p className="text-sm text-gray-600 truncate" title={description}>
              {description || 'No description available'}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "teachers",
      header: "Teachers",
      cell: ({ row }) => {
        const teachers = row.original.teachers || [];
        const count = row.original._count?.teachers || teachers.length;
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-green-500" />
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                {count} {count === 1 ? 'teacher' : 'teachers'}
              </span>
            </div>
            {teachers.length > 0 && (
              <div className="text-xs text-gray-500">
                {teachers.slice(0, 2).map((teacher, index) => (
                  <div key={teacher.id}>
                    {teacher.name} {teacher.surname}
                  </div>
                ))}
                {teachers.length > 2 && (
                  <div>+{teachers.length - 2} more</div>
                )}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "lessons",
      header: "Lessons",
      cell: ({ row }) => {
        const lessons = row.original.lessons || [];
        const count = row.original._count?.lessons || lessons.length;
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {count} {count === 1 ? 'lesson' : 'lessons'}
              </span>
            </div>
            {lessons.length > 0 && (
              <div className="text-xs text-gray-500">
                {lessons.slice(0, 2).map((lesson, index) => (
                  <div key={lesson.id}>
                    {lesson.title} ({lesson.class.name})
                  </div>
                ))}
                {lessons.length > 2 && (
                  <div>+{lessons.length - 2} more</div>
                )}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "creditHours",
      header: "Credits",
      enableSorting: true,
      cell: ({ row }) => {
        const credits = row.original.creditHours;
        return (
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-yellow-500" />
            <span className="font-medium text-gray-900">
              {credits || 0} hrs
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "difficulty",
      header: "Difficulty",
      enableSorting: true,
      cell: ({ row }) => {
        const difficulty = row.original.difficulty;
        const difficultyColors = {
          'Beginner': 'bg-green-100 text-green-800',
          'Intermediate': 'bg-yellow-100 text-yellow-800',
          'Advanced': 'bg-red-100 text-red-800',
        };
        
        return (
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            <span className={`px-2 py-1 text-xs rounded-full ${
              difficultyColors[difficulty as keyof typeof difficultyColors] || 'bg-gray-100 text-gray-600'
            }`}>
              {difficulty || 'Not specified'}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "_count.students",
      header: "Enrolled",
      enableSorting: true,
      cell: ({ row }) => {
        const studentCount = row.original._count?.students || 0;
        return (
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-500" />
            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
              {studentCount} students
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
          <p className="mt-4 text-gray-600">Loading subjects...</p>
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
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <DataTable 
          columns={columns} 
          data={subjects}
          title="Subject Management"
          description="Manage curriculum subjects and course information"
          searchPlaceholder="Search subjects..."
          onView={(subject) => console.log('View subject:', subject)}
          onEdit={(subject) => console.log('Edit subject:', subject)}
          onDelete={(subject) => console.log('Delete subject:', subject)}
          onAdd={() => console.log('Add new subject')}
          onExport={() => console.log('Export subjects')}
        />
      </div>
    </div>
  );
};

export default SubjectsPage;