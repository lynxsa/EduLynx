'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StudentsChartProps {
  data: Array<{
    grade: string;
    total: number;
    male: number;
    female: number;
  }>;
}

export function StudentsChart({ data }: StudentsChartProps) {
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="grade" stroke="#666" fontSize={12} tickLine={false} />
          <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="text-sm font-medium text-gray-900">Grade {label}</p>
                    <p className="text-sm text-blue-600">Male: {payload[0]?.value}</p>
                    <p className="text-sm text-pink-600">Female: {payload[1]?.value}</p>
                    <p className="text-sm text-gray-600">
                      Total: {Number(payload[0]?.value || 0) + Number(payload[1]?.value || 0)}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="male" stackId="students" fill="#3b82f6" radius={[0, 0, 4, 4]} />
          <Bar dataKey="female" stackId="students" fill="#ec4899" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
