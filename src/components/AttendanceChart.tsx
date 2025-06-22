'use client';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Image from 'next/image';

interface AttendanceDay {
  day: string;
  present: number;
  absent: number;
}

interface AttendanceChartProps {
  data: AttendanceDay[];
}

const AttendanceChart: React.FC<AttendanceChartProps> = ({ data }) => {
  // Transform API data to recharts format
  const chartData = data.map(day => ({
    name: day.day,
    Present: day.present,
    Absent: day.absent,
  }));

  return (
    <div
      className="w-full h-full bg-white rounded-lg p-4 animate-fade-in shadow-md hover:shadow-xl transition-shadow duration-200"
      aria-label="Attendance Chart"
      role="region"
    >
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold text-LYNXPurple">Attendance</h1>
          <p className="text-sm text-gray-500">
            Daily attendance breakdown by presence and absence.
          </p>
        </div>
        <Image
          src="/moreDark.png"
          alt="more"
          width={20}
          height={20}
          className="cursor-pointer hover:scale-110 transition-transform duration-150"
        />
      </div>
      {/* Chart */}
      {data.length === 0 ? (
        <div className="animate-pulse h-64 w-full bg-gray-100 rounded-xl mt-4" />
      ) : (
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="name" axisLine={false} tick={{ fill: '#3726a6' }} tickLine={false} />
            <YAxis axisLine={false} tick={{ fill: '#a096e7' }} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
              }}
              cursor={{ fill: 'rgba(55, 38, 166, 0.1)' }}
            />
            <Legend />
            <Bar dataKey="Present" fill="#3726a6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Absent" fill="#a096e7" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default AttendanceChart;
