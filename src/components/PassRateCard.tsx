import React from 'react';

interface PassRateCardProps {
  passRate: number;
}

export default function PassRateCard({ passRate }: PassRateCardProps) {
  return (
    <div className="h-56 w-full bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4 flex flex-col items-center justify-center">
      <h3 className="text-md font-semibold text-LYNXPurple mb-2">Pass Rate</h3>
      <div className="relative flex items-center justify-center h-32 w-32">
        <svg className="absolute top-0 left-0" width="128" height="128">
          <circle cx="64" cy="64" r="56" fill="none" stroke="#e5e7eb" strokeWidth="12" />
          <circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke="#7c3aed"
            strokeWidth="12"
            strokeDasharray={2 * Math.PI * 56}
            strokeDashoffset={2 * Math.PI * 56 * (1 - passRate / 100)}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(.4,2,.6,1)' }}
          />
        </svg>
        <span className="text-3xl font-bold text-LYNXPurple z-10">{passRate}%</span>
      </div>
      <span className="text-xs text-gray-500 mt-2">% of students passing</span>
    </div>
  );
}
