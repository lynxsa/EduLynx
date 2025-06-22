import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from 'recharts';

interface PassRateSubjectBarChartProps {
  data: { subject: string; passRate: number }[];
}

export default function PassRateSubjectBarChart({ data }: PassRateSubjectBarChartProps) {
  return (
    <div className="w-full h-72 bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4 flex flex-col animate-fade-in hover:shadow-xl transition-shadow duration-200">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-md font-semibold text-LYNXPurple">Pass Rate per Subject</h3>
        <div
          className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full cursor-pointer"
          data-tooltip-id="passrate-tooltip"
          data-tooltip-content="Shows percentage of students passing each subject (≥50%)"
        >
          📊
        </div>
      </div>
      {data.length === 0 ? (
        <div className="animate-pulse h-full w-full bg-gray-100 rounded-xl" />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="subject"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              angle={-20}
              textAnchor="end"
              interval={0}
            />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#6b7280' }} />
            <Tooltip
              formatter={(value: number) => `${value}%`}
              contentStyle={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
              }}
              cursor={{ fill: 'rgba(124, 58, 237, 0.1)' }}
            />
            <Bar dataKey="passRate" fill="#7c3aed" radius={[8, 8, 0, 0]}>
              <LabelList dataKey="passRate" position="top" formatter={(v: number) => `${v}%`} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
