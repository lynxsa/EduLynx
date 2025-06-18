'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { School, Users, GraduationCap, User, Calendar, BookOpen, TrendingUp } from 'lucide-react';

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

  const columns: ColumnDef<Class>[] = [
    {
      accessorKey: "name",
      header: "Class",
      enableSorting: true,
      cell: ({ row }) => {
        const classItem = row.original;
        return (
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
        );
      },
    },
    {
      accessorKey: "supervisor",
      header: "Class Teacher",
      cell: ({ row }) => {
        const supervisor = row.original.supervisor;
        return (
          <div className="flex items-center gap-2">
            {supervisor ? (
              <>
                <User className="w-4 h-4 text-green-500" />
                <div>
                  <p className="font-medium text-gray-900">
                    {supervisor.name} {supervisor.surname}
                  </p>
                  <p className="text-sm text-gray-500">Class Teacher</p>
                </div>
              </>
            ) : (
              <span className="text-gray-500 text-sm">No supervisor assigned</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "students",
      header: "Students",
      enableSorting: true,
      cell: ({ row }) => {
        const students = row.original.students || [];
        const studentCount = row.original._count?.students || students.length;
        const capacity = row.original.capacity;
        const utilizationPercent = capacity ? Math.round((studentCount / capacity) * 100) : 0;
        
        const getUtilizationColor = (percent: number) => {
          if (percent >= 90) return 'text-red-600';
          if (percent >= 75) return 'text-yellow-600';
          return 'text-green-600';
        };
        
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {studentCount} / {capacity} students
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${utilizationPercent}%` }}
                ></div>
              </div>
              <span className={`text-xs font-medium ${getUtilizationColor(utilizationPercent)}`}>
                {utilizationPercent}%
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "lessons",
      header: "Subjects",
      cell: ({ row }) => {
        const lessons = row.original.lessons || [];
        const lessonCount = row.original._count?.lessons || lessons.length;
        const uniqueSubjects = Array.from(new Set(lessons.map(lesson => lesson.subject.name)));
        
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-green-500" />
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                {uniqueSubjects.length} subjects
              </span>
            </div>
            {uniqueSubjects.length > 0 && (
              <div className="text-xs text-gray-500">
                {uniqueSubjects.slice(0, 3).map((subject, index) => (
                  <div key={index}>{subject}</div>
                ))}
                {uniqueSubjects.length > 3 && (
                  <div>+{uniqueSubjects.length - 3} more</div>
                )}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "schedule",
      header: "Schedule",
      cell: ({ row }) => {
        const schedule = row.original.schedule;
        return (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span className="text-sm text-gray-600">
              {schedule || 'Not specified'}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "capacity",
      header: "Capacity",
      enableSorting: true,
      cell: ({ row }) => {
        const capacity = row.original.capacity;
        const studentCount = row.original._count?.students || row.original.students?.length || 0;
        const isOverCapacity = studentCount > capacity;
        
        return (
          <div className="flex items-center gap-2">
            <TrendingUp className={`w-4 h-4 ${isOverCapacity ? 'text-red-500' : 'text-gray-400'}`} />
            <span className={`font-medium ${isOverCapacity ? 'text-red-600' : 'text-gray-900'}`}>
              {capacity} max
            </span>
            {isOverCapacity && (
              <span className="px-1 py-0.5 bg-red-100 text-red-600 text-xs rounded">
                Overcapacity
              </span>
            )}
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
          <p className="mt-4 text-gray-600">Loading classes...</p>
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
          data={classes}
          title="Class Management"
          description="Manage class information, enrollment, and scheduling"
          searchPlaceholder="Search classes..."
          onView={(classItem) => console.log('View class:', classItem)}
          onEdit={(classItem) => console.log('Edit class:', classItem)}
          onDelete={(classItem) => console.log('Delete class:', classItem)}
          onAdd={() => console.log('Add new class')}
          onExport={() => console.log('Export classes')}
        />
      </div>
    </div>
  );
};

export default ClassesPage;