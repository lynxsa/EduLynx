'use client';
import { Button } from '@/components/ui/button';
import {
  UserPlus,
  BookOpen,
  Calendar,
  FileText,
  Upload,
  RefreshCw,
  Users,
  BarChart3,
} from 'lucide-react';

export function QuickActions() {
  const primaryActions = [
    {
      label: 'New Student',
      icon: UserPlus,
      onClick: () => {
        /* Navigate to add student */
      },
      gradient: 'from-indigo-500 to-indigo-600',
    },
    {
      label: 'New Assignment',
      icon: FileText,
      onClick: () => {
        /* Navigate to create assignment */
      },
      gradient: 'from-violet-500 to-violet-600',
    },
    {
      label: 'New Project',
      icon: BookOpen,
      onClick: () => {
        /* Navigate to create project */
      },
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      label: 'Schedule Event',
      icon: Calendar,
      onClick: () => {
        /* Navigate to schedule event */
      },
      gradient: 'from-blue-500 to-blue-600',
    },
  ];

  const secondaryActions = [
    {
      label: 'Import CSV',
      icon: Upload,
      onClick: () => {
        /* Navigate to import CSV */
      },
    },
    {
      label: 'Refresh All',
      icon: RefreshCw,
      onClick: () => window.location.reload(),
    },
    {
      label: 'Create Class',
      icon: Users,
      onClick: () => {
        /* Navigate to create class */
      },
    },
    {
      label: 'Analytics',
      icon: BarChart3,
      onClick: () => {
        /* Navigate to analytics */
      },
    },
  ];

  return (
    <div className="w-full bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl shadow-lg border border-indigo-100 dark:border-gray-600">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Frequently used admin functions
          </p>
        </div>
        <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium">Ready</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {/* Primary Actions */}
        <div className="flex flex-wrap gap-3">
          {primaryActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={index}
                onClick={action.onClick}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r ${action.gradient} hover:scale-105 hover:shadow-lg transition-all duration-200 rounded-lg border-0`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{action.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-10 bg-gray-300 dark:bg-gray-600"></div>

        {/* Secondary Actions */}
        <div className="flex flex-wrap gap-2">
          {secondaryActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                onClick={action.onClick}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105 transition-all duration-200 rounded-lg"
              >
                <IconComponent className="w-4 h-4" />
                <span>{action.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
