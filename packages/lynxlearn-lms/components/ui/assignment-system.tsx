'use client';

import { motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  MapPin,
  Paperclip,
  Star,
  User,
  Users,
} from 'lucide-react';
import { useState } from 'react';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: string;
  dueDate: string;
  createdDate: string;
  points: number;
  type: 'essay' | 'quiz' | 'project' | 'presentation' | 'worksheet';
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'not-started' | 'in-progress' | 'submitted' | 'graded';
  submission?: {
    submittedAt: string;
    fileUrl?: string;
    content?: string;
    grade?: number;
    feedback?: string;
  };
  resources?: string[];
  instructions: string;
  rubric?: {
    criteria: string;
    points: number;
  }[];
}

interface AssignmentCardProps {
  assignment: Assignment;
  onViewDetails: (assignment: Assignment) => void;
  onStartWork: (assignment: Assignment) => void;
}

export function AssignmentCard({ assignment, onViewDetails, onStartWork }: AssignmentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'graded':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'hard':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'essay':
        return FileText;
      case 'quiz':
        return CheckCircle;
      case 'project':
        return Users;
      case 'presentation':
        return User;
      default:
        return FileText;
    }
  };

  const formatTimeRemaining = (dueDateString: string) => {
    const dueDate = new Date(dueDateString);
    const now = new Date();
    const diffInHours = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 0) return 'Overdue';
    if (diffInHours < 24) return `${diffInHours}h remaining`;
    if (diffInHours < 168) return `${Math.ceil(diffInHours / 24)}d remaining`;
    return `${Math.ceil(diffInHours / 168)}w remaining`;
  };

  const isOverdue =
    new Date(assignment.dueDate) < new Date() &&
    assignment.status !== 'submitted' &&
    assignment.status !== 'graded';
  const isDueSoon =
    new Date(assignment.dueDate).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000;

  const TypeIcon = getTypeIcon(assignment.type);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`assignment-card glass-card p-6 rounded-xl border ${
        isOverdue
          ? 'border-red-200 dark:border-red-800/50 bg-red-50/80 dark:bg-red-900/20'
          : isDueSoon
            ? 'border-yellow-200 dark:border-yellow-800/50 bg-yellow-50/80 dark:bg-yellow-900/20'
            : 'border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80'
      } backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 text-primary rounded-lg">
            <TypeIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs font-medium">
              {assignment.subject} • Grade {assignment.grade}
            </span>
          </div>
        </div>

        <span
          className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(assignment.status)}`}
        >
          {assignment.status.replace('-', ' ')}
        </span>
      </div>

      {/* Title and Description */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {assignment.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
        {assignment.description}
      </p>

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>{new Date(assignment.dueDate).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Star className="w-4 h-4" />
          <span>{assignment.points} points</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4" />
          <span
            className={
              isOverdue
                ? 'text-red-600'
                : isDueSoon
                  ? 'text-yellow-600'
                  : 'text-gray-600 dark:text-gray-400'
            }
          >
            {formatTimeRemaining(assignment.dueDate)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <MapPin className={`w-4 h-4 ${getDifficultyColor(assignment.difficulty)}`} />
          <span className={getDifficultyColor(assignment.difficulty)}>{assignment.difficulty}</span>
        </div>
      </div>

      {/* Grade Display */}
      {assignment.submission?.grade && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-green-800 dark:text-green-400">
              Grade: {assignment.submission.grade}%
            </span>
            <span className="text-xs text-green-600 dark:text-green-500">
              {assignment.submission.grade >= 80
                ? '🎉 Excellent!'
                : assignment.submission.grade >= 70
                  ? '👍 Good work!'
                  : assignment.submission.grade >= 60
                    ? '📈 Keep improving!'
                    : '💪 Keep trying!'}
            </span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => onViewDetails(assignment)}
          className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          View Details
        </button>

        {assignment.status === 'not-started' || assignment.status === 'in-progress' ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onStartWork(assignment)}
            className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors"
          >
            {assignment.status === 'not-started' ? 'Start Work' : 'Continue'}
          </motion.button>
        ) : (
          <button
            onClick={() => onViewDetails(assignment)}
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg"
          >
            View Submission
          </button>
        )}
      </div>
    </motion.div>
  );
}

interface AssignmentListProps {
  assignments: Assignment[];
  onAssignmentClick: (assignment: Assignment) => void;
  onStartWork: (assignment: Assignment) => void;
}

export function AssignmentList({
  assignments,
  onAssignmentClick,
  onStartWork,
}: AssignmentListProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'created' | 'status' | 'points'>('dueDate');

  const filterOptions = [
    { value: 'all', label: 'All Assignments' },
    { value: 'pending', label: 'Pending' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'graded', label: 'Graded' },
  ];

  const sortOptions = [
    { value: 'dueDate', label: 'Due Date' },
    { value: 'created', label: 'Created Date' },
    { value: 'status', label: 'Status' },
    { value: 'points', label: 'Points' },
  ];

  const filteredAssignments = assignments
    .filter(assignment => {
      switch (filter) {
        case 'pending':
          return assignment.status === 'not-started' || assignment.status === 'in-progress';
        case 'submitted':
          return assignment.status === 'submitted';
        case 'graded':
          return assignment.status === 'graded';
        default:
          return true;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'created':
          return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
        case 'status':
          return a.status.localeCompare(b.status);
        case 'points':
          return b.points - a.points;
        default:
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
    });

  const getStatusCounts = () => {
    return {
      all: assignments.length,
      pending: assignments.filter(a => a.status === 'not-started' || a.status === 'in-progress')
        .length,
      submitted: assignments.filter(a => a.status === 'submitted').length,
      graded: assignments.filter(a => a.status === 'graded').length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Assignments</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your assignments, submissions, and grades
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {filterOptions.map(option => (
          <motion.div
            key={option.value}
            whileHover={{ scale: 1.02 }}
            className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
              filter === option.value
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md hover:shadow-lg'
            }`}
            onClick={() => setFilter(option.value as any)}
          >
            <div className="text-2xl font-bold mb-1">
              {statusCounts[option.value as keyof typeof statusCounts]}
            </div>
            <div className="text-sm font-medium">{option.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <select
          value={filter}
          onChange={e => setFilter(e.target.value as any)}
          className="px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
        >
          {filterOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as any)}
          className="px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              Sort by {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Assignments Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAssignments.map(assignment => (
          <AssignmentCard
            key={assignment.id}
            assignment={assignment}
            onViewDetails={onAssignmentClick}
            onStartWork={onStartWork}
          />
        ))}
      </div>

      {filteredAssignments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No assignments found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {filter === 'all'
              ? "You don't have any assignments yet."
              : `No ${filter} assignments at the moment.`}
          </p>
        </div>
      )}
    </div>
  );
}

interface AssignmentDetailProps {
  assignment: Assignment;
  onBack: () => void;
  onSubmit: (submission: { content?: string; fileUrl?: string }) => void;
  onStartWork: () => void;
}

export function AssignmentDetail({
  assignment,
  onBack,
  onSubmit,
  onStartWork,
}: AssignmentDetailProps) {
  const [submissionContent, setSubmissionContent] = useState(assignment.submission?.content || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!submissionContent.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ content: submissionContent });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'graded':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const isOverdue =
    new Date(assignment.dueDate) < new Date() &&
    assignment.status !== 'submitted' &&
    assignment.status !== 'graded';
  const canSubmit = assignment.status === 'not-started' || assignment.status === 'in-progress';

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
      >
        ← Back to Assignments
      </button>

      {/* Assignment Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-medium">
              {assignment.subject} • Grade {assignment.grade} • {assignment.type}
            </span>
          </div>
          <span
            className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(assignment.status)}`}
          >
            {assignment.status.replace('-', ' ')}
          </span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {assignment.title}
        </h1>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Due Date</div>
              <div
                className={`text-sm ${isOverdue ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}`}
              >
                {new Date(assignment.dueDate).toLocaleDateString()}
                {isOverdue && ' (Overdue)'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-gray-400" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Points</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {assignment.points} points
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-gray-400" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Difficulty</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {assignment.difficulty}
              </div>
            </div>
          </div>
        </div>

        {assignment.submission?.grade && (
          <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-green-800 dark:text-green-400">
                  Grade: {assignment.submission.grade}%
                </div>
                {assignment.submission.feedback && (
                  <div className="text-sm text-green-700 dark:text-green-500 mt-1">
                    {assignment.submission.feedback}
                  </div>
                )}
              </div>
              <div className="text-2xl">
                {assignment.submission.grade >= 80
                  ? '🎉'
                  : assignment.submission.grade >= 70
                    ? '👍'
                    : assignment.submission.grade >= 60
                      ? '📈'
                      : '💪'}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Assignment Details */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Instructions and Resources */}
        <div className="space-y-6">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Description
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {assignment.description}
              </p>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Instructions
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {assignment.instructions}
              </p>
            </div>
          </div>

          {assignment.resources && assignment.resources.length > 0 && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Paperclip className="w-5 h-5" />
                Resources
              </h2>
              <div className="space-y-2">
                {assignment.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <span className="text-primary hover:underline">{resource}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {assignment.rubric && assignment.rubric.length > 0 && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Rubric</h2>
              <div className="space-y-3">
                {assignment.rubric.map((criterion, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-start p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <span className="text-gray-700 dark:text-gray-300">{criterion.criteria}</span>
                    <span className="font-medium text-primary ml-4">{criterion.points} pts</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Submission */}
        <div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {assignment.status === 'not-started'
                ? 'Submit Your Work'
                : assignment.status === 'in-progress'
                  ? 'Continue Working'
                  : 'Your Submission'}
            </h2>

            {canSubmit ? (
              <div className="space-y-4">
                <textarea
                  value={submissionContent}
                  onChange={e => setSubmissionContent(e.target.value)}
                  placeholder="Write your submission here..."
                  className="w-full h-64 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary"
                />

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    disabled={!submissionContent.trim() || isSubmitting}
                    className="flex-1 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
                  </motion.button>

                  {assignment.status === 'not-started' && (
                    <button
                      onClick={onStartWork}
                      className="px-6 py-3 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Save Draft
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    Submitted on{' '}
                    {assignment.submission?.submittedAt &&
                      new Date(assignment.submission.submittedAt).toLocaleDateString()}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {assignment.submission?.content}
                  </p>
                </div>

                {assignment.status === 'submitted' && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-blue-800 dark:text-blue-400 text-center">
                      🕒 Waiting for grading...
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const AssignmentComponents = {
  AssignmentList,
  AssignmentCard,
  AssignmentDetail,
};

export default AssignmentComponents;
