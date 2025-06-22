import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'green' | 'blue' | 'red' | 'yellow' | 'purple' | 'dynamic';
  showLabel?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  color = 'green',
  showLabel = false,
  className = '',
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const colorClasses = {
    green: 'bg-green-600',
    blue: 'bg-blue-600',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-600',
  };

  const dynamicColorClass =
    percentage > 90 ? colorClasses.red : percentage > 75 ? colorClasses.yellow : colorClasses.green;

  const progressBarClass = `
    ${color === 'dynamic' ? dynamicColorClass : colorClasses[color]} 
    ${sizeClasses[size]} 
    rounded-full 
    transition-all 
    duration-300 
    ease-in-out
  `;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`bg-gray-200 dark:bg-gray-700 rounded-full relative overflow-hidden ${sizeClasses[size]} flex-1`}
      >
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <div className={`${progressBarClass}`} style={{ width: `${percentage}%` }} />
      </div>
      {showLabel && (
        <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
