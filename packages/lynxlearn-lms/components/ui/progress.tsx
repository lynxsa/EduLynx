// Enhanced Progress Component for LynxLearn LMS
'use client';

import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Progress = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: number;
    max?: number;
    variant?: 'default' | 'success' | 'warning' | 'destructive' | 'purple';
    size?: 'sm' | 'default' | 'lg';
    showLabel?: boolean;
    label?: string;
  }
>(
  (
    {
      className,
      value = 0,
      max = 100,
      variant = 'default',
      size = 'default',
      showLabel = false,
      label,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const variants = {
      default: 'bg-gradient-to-r from-purple-500 to-blue-500',
      success: 'bg-gradient-to-r from-green-500 to-emerald-500',
      warning: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      destructive: 'bg-gradient-to-r from-red-500 to-pink-500',
      purple: 'bg-gradient-to-r from-purple-600 to-violet-600',
    };

    const sizes = {
      sm: 'h-1',
      default: 'h-2',
      lg: 'h-3',
    };

    return (
      <div className="w-full space-y-2">
        {showLabel && (
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {label || 'Progress'}
            </span>
            <span className="text-gray-500 dark:text-gray-400">{Math.round(percentage)}%</span>
          </div>
        )}

        <div
          ref={ref}
          className={cn(
            'w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden',
            sizes[size],
            className
          )}
          {...props}
        >
          <div
            className={cn(
              'h-full transition-all duration-500 ease-out rounded-full',
              variants[variant]
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = 'Progress';

// Specialized progress components for education
export function CourseProgress({
  completed,
  total,
  courseName,
}: {
  completed: number;
  total: number;
  courseName: string;
}) {
  const percentage = (completed / total) * 100;

  return (
    <div className="space-y-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-gray-900 dark:text-white">{courseName}</h4>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {completed}/{total} lessons
        </span>
      </div>

      <Progress
        value={percentage}
        variant={percentage === 100 ? 'success' : 'purple'}
        size="default"
        showLabel
        label="Course Progress"
      />

      {percentage === 100 && (
        <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 text-sm">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium">Course Completed!</span>
        </div>
      )}
    </div>
  );
}

export function SkillProgress({
  skills,
}: {
  skills: Array<{ name: string; level: number; maxLevel: number }>;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Skill Development</h3>

      {skills.map((skill, index) => {
        const percentage = (skill.level / skill.maxLevel) * 100;
        let variant: 'destructive' | 'warning' | 'default' | 'success' = 'destructive';

        if (percentage >= 80) variant = 'success';
        else if (percentage >= 60) variant = 'default';
        else if (percentage >= 40) variant = 'warning';

        return (
          <div key={index} className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
              <span className="text-gray-500 dark:text-gray-400">
                Level {skill.level}/{skill.maxLevel}
              </span>
            </div>
            <Progress value={percentage} variant={variant} size="sm" />
          </div>
        );
      })}
    </div>
  );
}

export { Progress };
