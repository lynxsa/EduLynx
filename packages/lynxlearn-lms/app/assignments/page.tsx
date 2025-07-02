'use client';

import { AlertCircle, Calendar, CheckCircle, FileText } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { assignments } from './data';

export default function AssignmentsPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredAssignments = assignments.filter(assignment => {
    if (selectedFilter === 'all') return true;
    return assignment.status === selectedFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'submitted':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const openAssignments = assignments.filter(a => a.status === 'open');
  const submittedAssignments = assignments.filter(a => a.status === 'submitted');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-violet-50/20 dark:from-slate-900 dark:via-purple-900/10 dark:to-violet-900/5">
      <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
        {/* Header */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl shadow-purple-500/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Assignments
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
                Track, complete, and submit your assignments efficiently
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {openAssignments.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {submittedAssignments.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
          <div className="flex flex-wrap gap-4">
            {['all', 'open', 'submitted'].map(filter => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                  selectedFilter === filter
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                {filter === 'open' ? 'pending' : filter}
              </button>
            ))}
          </div>
        </div>

        {/* Assignments List */}
        <div className="space-y-6">
          {filteredAssignments.map(assignment => {
            const daysUntilDue = Math.ceil(
              (new Date(assignment.dueDate).getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            );

            return (
              <div
                key={assignment.id}
                className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl shadow-purple-500/5 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                        <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                          {assignment.title}
                        </h2>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-purple-600 dark:text-purple-400 font-medium">
                            {assignment.course}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {assignment.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assignment.status)}`}
                      >
                        {assignment.status === 'open' ? 'pending' : assignment.status}
                      </span>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-4">
                    <div className="text-right">
                      {daysUntilDue > 0 && assignment.status !== 'submitted' && (
                        <div
                          className={`text-sm ${
                            daysUntilDue <= 1
                              ? 'text-red-600 dark:text-red-400'
                              : daysUntilDue <= 3
                                ? 'text-yellow-600 dark:text-yellow-400'
                                : 'text-green-600 dark:text-green-400'
                          }`}
                        >
                          {daysUntilDue === 0
                            ? 'Due today'
                            : daysUntilDue === 1
                              ? 'Due tomorrow'
                              : `${daysUntilDue} days left`}
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-3">
                      {assignment.status === 'submitted' ? (
                        <button className="px-6 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg font-medium">
                          <CheckCircle className="w-4 h-4 inline mr-2" />
                          Submitted
                        </button>
                      ) : (
                        <Link href={`/assignments/${assignment.id}`}>
                          <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all duration-200 shadow-lg shadow-purple-500/25 font-medium">
                            Submit Assignment
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAssignments.length === 0 && (
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-12 border border-white/20 dark:border-slate-700/50 shadow-xl text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No assignments found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              No assignments match your current filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
