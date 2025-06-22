'use client';
import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { Calendar, TrendingUp, Users, CheckCircle } from 'lucide-react';

interface AttendanceData {
  date: string;
  attendance: number;
  present: number;
  total: number;
}

interface AttendanceChartProps {
  data: AttendanceData[];
  period: 'week' | 'month' | 'semester';
  studentData?: {
    id: string;
    name: string;
    attendancePercent: number;
  }[];
}

const AttendanceChart: React.FC<AttendanceChartProps> = ({ data, period, studentData = [] }) => {
  // Calculate summary statistics
  const totalDays = data.length;
  const averageAttendance =
    totalDays > 0 ? Math.round(data.reduce((sum, day) => sum + day.attendance, 0) / totalDays) : 0;

  const trend =
    data.length >= 2
      ? data[data.length - 1].attendance > data[0].attendance
        ? 'improving'
        : data[data.length - 1].attendance < data[0].attendance
          ? 'declining'
          : 'stable'
      : 'stable';

  const perfectDays = data.filter(day => day.attendance === 100).length;

  // Format date based on period
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    switch (period) {
      case 'week':
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      case 'month':
        return date.toLocaleDateString('en-US', { day: 'numeric' });
      default:
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const chartData = data.map(item => ({
    ...item,
    formattedDate: formatDate(item.date),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-morphism rounded-2xl p-6 shadow-lg border border-white/20"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg"
          >
            <Calendar className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Attendance Tracking</h3>
            <p className="text-sm text-gray-600">Daily attendance patterns and trends</p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{averageAttendance}%</div>
            <div className="text-xs text-gray-500">Average</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{perfectDays}</div>
            <div className="text-xs text-gray-500">Perfect Days</div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
            <XAxis
              dataKey="formattedDate"
              stroke="#64748b"
              fontSize={12}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              domain={[0, 100]}
              tickFormatter={value => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)',
              }}
              formatter={(value: any, name: string) => [
                `${value}%`,
                name === 'attendance' ? 'Attendance Rate' : name,
              ]}
              labelFormatter={label => `Date: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="attendance"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#attendanceGradient)"
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Individual Children Attendance (if available) */}
      {studentData.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Users className="w-4 h-4" />
            Individual Attendance Summary
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {studentData.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -2 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 text-sm">{student.name}</h4>
                  {student.attendancePercent >= 95 && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </motion.div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">
                    {student.attendancePercent}%
                  </span>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      student.attendancePercent >= 95
                        ? 'bg-green-100 text-green-700'
                        : student.attendancePercent >= 85
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {student.attendancePercent >= 95
                      ? 'Excellent'
                      : student.attendancePercent >= 85
                        ? 'Good'
                        : 'Needs Attention'}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 bg-green-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${student.attendancePercent}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Trend Indicator */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <div
            className={`flex items-center gap-1 px-3 py-1 rounded-full ${
              trend === 'improving'
                ? 'bg-green-100 text-green-700'
                : trend === 'declining'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700'
            }`}
          >
            <TrendingUp className={`w-3 h-3 ${trend === 'declining' ? 'rotate-180' : ''}`} />
            <span className="font-medium">
              {trend === 'improving' ? 'Improving' : trend === 'declining' ? 'Declining' : 'Stable'}{' '}
              Trend
            </span>
          </div>
        </div>

        <div className="text-xs text-gray-500">
          Based on {period} data • {totalDays} days tracked
        </div>
      </div>
    </motion.div>
  );
};

export default AttendanceChart;
