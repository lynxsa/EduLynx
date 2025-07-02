'use client';

import { useEffect, useState } from 'react';
import { ModernTable } from '@/components/ui/ModernTable';
import { BookOpen, Clock, GraduationCap, User, Calendar } from 'lucide-react';

type LessonRow = {
  id: number;
  name: string;
  subject: { name: string };
  class: { name: string };
  teacher: { name: string };
  day: string;
  startTime: string;
  endTime: string;
};

const LessonsPage = () => {
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch('/api/lessons');
        if (!response.ok) {
          throw new Error('Failed to fetch lessons');
        }
        const data = await response.json();
        setLessons(data.data || data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  const columns = [
    {
      key: 'subject',
      label: 'Subject',
      sortable: true,
      render: (lesson: LessonRow) => (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">{lesson.subject.name}</div>
            {lesson.name && <div className="text-sm text-gray-500">{lesson.name}</div>}
          </div>
        </div>
      ),
    },
    {
      key: 'class',
      label: 'Class',
      sortable: true,
      render: (lesson: LessonRow) => (
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-900">{lesson.class.name}</span>
        </div>
      ),
    },
    {
      key: 'teacher',
      label: 'Teacher',
      sortable: true,
      render: (lesson: LessonRow) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-900">{lesson.teacher.name}</span>
        </div>
      ),
    },
    {
      key: 'day',
      label: 'Day',
      sortable: true,
      render: (lesson: LessonRow) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-900">{lesson.day}</span>
        </div>
      ),
    },
    {
      key: 'time',
      label: 'Time',
      sortable: true,
      render: (lesson: LessonRow) => {
        const startTime = new Date(`1970-01-01T${lesson.startTime}`);
        const endTime = new Date(`1970-01-01T${lesson.endTime}`);
        const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));

        return (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {startTime.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })} -{' '}
                {endTime.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-xs text-gray-500">{duration} minutes</p>
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
          <p className="mt-4 text-gray-600">Loading lessons...</p>
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
        data={lessons}
        columns={columns}
        title="Lessons"
        description="Manage lesson schedules and timetables"
        searchableFields={['subject.name', 'class.name', 'teacher.name', 'day']}
        onView={(lesson: LessonRow) => {
          console.log('View lesson:', lesson);
          // Navigate to view page
        }}
        onEdit={(lesson: LessonRow) => {
          console.log('Edit lesson:', lesson);
          // Navigate to edit page
        }}
        onDelete={(lesson: LessonRow) => {
          if (window.confirm('Are you sure you want to delete this lesson?')) {
            console.log('Delete lesson:', lesson);
            // Handle delete
          }
        }}
      />
    </div>
  );
};

export default LessonsPage;
