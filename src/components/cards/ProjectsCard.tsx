'use client';
import { useProjectStats } from '@/hooks/useProjects';
import { CardSkeleton } from '@/components/Skeletons';
import { BookOpen, Clock, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';

export function ProjectsCard() {
  const { stats, isLoading, isError } = useProjectStats();

  if (isLoading) return <CardSkeleton />;
  if (isError || !stats) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
            <p className="text-sm text-gray-500">Failed to load data</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'GRADED':
        return 'text-green-600 bg-green-50';
      case 'SUBMITTED':
        return 'text-blue-600 bg-blue-50';
      case 'IN_PROGRESS':
        return 'text-yellow-600 bg-yellow-50';
      case 'PLANNING':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatStatus = (status: string) => {
    return status
      .replace('_', ' ')
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
            <p className="text-sm text-gray-500">Track project progress</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-500">Total</div>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Completion Rate</span>
          <span className="text-sm font-bold text-purple-600">{stats.completionRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${stats.completionRate}%` }}
          ></div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-800">Active</span>
          </div>
          <div className="text-xl font-bold text-blue-900">{stats.summary.active}</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-xs font-medium text-red-800">Overdue</span>
          </div>
          <div className="text-xl font-bold text-red-900">{stats.overdue}</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-yellow-600" />
            <span className="text-xs font-medium text-yellow-800">Due This Week</span>
          </div>
          <div className="text-xl font-bold text-yellow-900">{stats.upcomingDeadlines}</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-xs font-medium text-green-800">Completed</span>
          </div>
          <div className="text-xl font-bold text-green-900">{stats.summary.completed}</div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Project Status</h4>
        <div className="space-y-2">
          {stats.byStatus.map(statusItem => (
            <div key={statusItem.status} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${getStatusColor(statusItem.status).split(' ')[1]}`}
                ></div>
                <span className="text-sm text-gray-600">{formatStatus(statusItem.status)}</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{statusItem.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Project Types */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">By Type</h4>
        <div className="flex justify-between text-sm">
          {stats.byType.map((typeItem, index) => (
            <div key={typeItem.type} className="text-center">
              <div className="font-bold text-gray-900">{typeItem.count}</div>
              <div className="text-xs text-gray-500 capitalize">{typeItem.type.toLowerCase()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
