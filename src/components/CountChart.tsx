'use client';
import Image from 'next/image';
import React from 'react';
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface CountChartProps {
  data?: Array<{ month: string; students: number }>;
}

const CountChart: React.FC<CountChartProps> = ({ data = [] }) => {
  // Radial data for summary
  const chartData = [
    {
      name: 'Total',
      count: data.reduce((sum, item) => sum + item.students, 0),
      fill: '#ffffff',
    },
    {
      name: 'Recent',
      count: data.slice(-3).reduce((sum, item) => sum + item.students, 0),
      fill: '#3726a6',
    },
    {
      name: 'Previous',
      count: data.slice(0, -3).reduce((sum, item) => sum + item.students, 0),
      fill: '#a096e7',
    },
  ];

  // Line chart data for monthly trend
  const lineData = data.map(item => ({
    month: item.month,
    students: item.students,
  }));

  const style = {
    top: '50%',
    right: 0,
    transform: 'translate(0, -50%)',
    lineHeight: '24px',
  };

  return (
    <div
      className="w-full h-full bg-white rounded-xl p-4 flex flex-col gap-4 animate-fade-in shadow-md hover:shadow-xl transition-shadow duration-200"
      aria-label="Student Growth Chart"
      role="region"
    >
      {/* Title */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold text-LYNXPurple">Students</h1>
        <p className="text-sm text-gray-500">Monthly enrollment trends and summary.</p>
        <Image src="/moreDark.png" alt="more" width={20} height={20} />
      </div>
      {/* Radial Chart */}
      <div className="w-full h-48 relative">
        {data.length === 0 ? (
          <div className="animate-pulse h-full w-full bg-gray-100 rounded-xl" />
        ) : (
          <ResponsiveContainer>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="40%"
              outerRadius="100%"
              barSize={32}
              data={chartData}
            >
              <RadialBar dataKey="count" cornerRadius={10} fill="#3726a6" />
              <Legend iconSize={18} layout="vertical" verticalAlign="middle" wrapperStyle={style} />
            </RadialBarChart>
          </ResponsiveContainer>
        )}
        <Image
          src="/malefemale.png"
          alt="students"
          width={40}
          height={40}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      {/* Monthly Growth Line Chart */}
      <div className="w-full h-32">
        {data.length === 0 ? (
          <div className="animate-pulse h-full w-full bg-gray-100 rounded-xl" />
        ) : (
          <ResponsiveContainer>
            <LineChart data={lineData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fill: '#3726a6' }} />
              <YAxis tick={{ fill: '#a096e7' }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="students"
                stroke="#3726a6"
                strokeWidth={3}
                dot={{ r: 5, fill: '#a096e7' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      {/* Bottom */}
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 bg-LYNXPurple rounded-full" />
          <h1 className="font-bold">{chartData[1]?.count || 0}</h1>
          <h2 className="text-xs text-gray-400">Recent (70%)</h2>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 bg-LYNXLavendar rounded-full" />
          <h1 className="font-bold">{chartData[2]?.count || 0}</h1>
          <h2 className="text-xs text-gray-400">Previous (30%)</h2>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
