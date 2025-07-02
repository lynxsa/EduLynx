'use client';

import { useEffect, useState } from 'react';
import { ModernTable } from '@/components/ui/ModernTable';
import { BookOpen, Calendar, Clock, User, GraduationCap } from 'lucide-react';

// Assignment type based on Prisma model
interface Assignment {
  id: number;
  title: string;
  startDate: string;
  dueDate: string;
  lesson: {
    id: number;
    name: string;
    subject?: { name: string };
    class?: { name: string };
    teacher?: { name: string };
  };
}

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch('/api/assignments');
        if (!response.ok) {
          throw new Error('Failed to fetch assignments');
        }
        const data = await response.json();
        setAssignments(data.data || data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const columns = [
    {
      key: 'title',
      label: 'Assignment',
      sortable: true,
      render: (assignment: Assignment) => (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{assignment.title}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{assignment.lesson.name}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'lesson',
      label: 'Subject & Class',
      sortable: true,
      render: (assignment: Assignment) => (
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-gray-900 dark:text-white">
              {assignment.lesson.subject?.name || 'N/A'}
            </span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Class: {assignment.lesson.class?.name || 'N/A'}
          </div>
        </div>
      ),
    },
    {
      key: 'teacher',
      label: 'Teacher',
      sortable: true,
      render: (assignment: Assignment) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-900 dark:text-white">
            {assignment.lesson.teacher?.name || 'N/A'}
          </span>
        </div>
      ),
    },
    {
      key: 'startDate',
      label: 'Start Date',
      sortable: true,
      render: (assignment: Assignment) => {
        const date = new Date(assignment.startDate);
        return (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {date.toLocaleDateString('en-ZA')}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {date.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      sortable: true,
      render: (assignment: Assignment) => {
        const date = new Date(assignment.dueDate);
        const now = new Date();
        const isOverdue = date < now;
        const diffTime = Math.abs(date.getTime() - now.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <div>
              <p
                className={`text-sm font-medium ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}
              >
                {date.toLocaleDateString('en-ZA')}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isOverdue
                  ? `Overdue by ${diffDays} days`
                  : diffDays === 0
                    ? 'Due today'
                    : `${diffDays} days left`}
              </p>
            </div>
          </div>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading assignments...</p>
        </div>
      </div>
    );
  }

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
      <ModernTable
        data={assignments}
        columns={columns}
        title="Assignments"
        description="Manage assignment tasks and deadlines"
        searchableFields={['title', 'lesson.name', 'lesson.subject.name', 'lesson.teacher.name']}
        onView={(assignment: Assignment) => {
          console.log('View assignment:', assignment);
          // Navigate to view page
        }}
        onEdit={(assignment: Assignment) => {
          console.log('Edit assignment:', assignment);
          // Navigate to edit page
        }}
        onDelete={(assignment: Assignment) => {
          if (window.confirm('Are you sure you want to delete this assignment?')) {
            console.log('Delete assignment:', assignment);
            // Handle delete
          }
        }}
      />
    </div>
  );
};

export default AssignmentsPage;
