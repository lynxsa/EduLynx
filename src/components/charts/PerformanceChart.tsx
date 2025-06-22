'use client';
import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus, Eye } from 'lucide-react';

interface PerformanceData {
  name: string;
  subjects: { [key: string]: number };
  overall: number;
  attendance: number;
  trend?: 'improving' | 'declining' | 'stable';
}

interface PerformanceChartProps {
  data: PerformanceData[];
  selectedChild?: string | null;
  onChildSelect?: (childName: string) => void;
  chartType?: 'bar' | 'line' | 'area' | 'radar';
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  data,
  selectedChild,
  onChildSelect,
  chartType = 'bar',
}) => {
  // Transform data for charts
  const chartData = data.map(child => {
    const subjectEntries = Object.entries(child.subjects);
    return {
      name: child.name.split(' ')[0], // First name only for space
      overall: child.overall,
      attendance: child.attendance,
      trend: child.trend,
      ...child.subjects, // Spread all subjects as separate data points
    };
  });

  // Get all unique subjects
  const allSubjects = Array.from(new Set(data.flatMap(child => Object.keys(child.subjects))));

  // Color palette for subjects
  const subjectColors = [
    '#8884d8',
    '#82ca9d',
    '#ffc658',
    '#ff7c7c',
    '#8dd1e1',
    '#d084d0',
    '#ffb347',
    '#87ceeb',
    '#dda0dd',
    '#98fb98',
  ];

  const getSubjectColor = (index: number) => subjectColors[index % subjectColors.length];

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(10px)',
                }}
              />
              <Line
                type="monotone"
                dataKey="overall"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#8b5cf6', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="attendance"
                stroke="#10b981"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="overallGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Area
                type="monotone"
                dataKey="overall"
                stroke="#8b5cf6"
                fillOpacity={1}
                fill="url(#overallGradient)"
              />
              <Area
                type="monotone"
                dataKey="attendance"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#attendanceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'radar':
        // Transform data for radar chart
        const radarData = allSubjects.map(subject => {
          const subjectData: any = { subject };
          data.forEach(child => {
            subjectData[child.name.split(' ')[0]] = child.subjects[subject] || 0;
          });
          return subjectData;
        });

        return (
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e0e7ff" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#64748b' }} />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: '#64748b' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                }}
              />
              {data.map((child, index) => (
                <Radar
                  key={child.name}
                  name={child.name.split(' ')[0]}
                  dataKey={child.name.split(' ')[0]}
                  stroke={getSubjectColor(index)}
                  fill={getSubjectColor(index)}
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              ))}
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        );

      default: // bar chart
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(10px)',
                }}
              />
              <Bar dataKey="overall" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Overall Score" />
              <Bar dataKey="attendance" fill="#10b981" radius={[4, 4, 0, 0]} name="Attendance %" />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

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
            className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg"
          >
            <BarChart className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Performance Analytics</h3>
            <p className="text-sm text-gray-600">Track academic progress and attendance</p>
          </div>
        </div>

        {/* Chart Type Selector */}
        <div className="flex gap-2">
          {['bar', 'line', 'area', 'radar'].map(type => (
            <motion.button
              key={type}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {}} // Chart type switching can be implemented
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                chartType === type
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="mb-6">{renderChart()}</div>

      {/* Legend/Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((child, index) => (
          <motion.div
            key={child.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -2 }}
            className={`bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border transition-all cursor-pointer ${
              selectedChild === child.name
                ? 'border-purple-300 shadow-lg ring-2 ring-purple-100'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
            onClick={() => onChildSelect?.(child.name)}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">{child.name}</h4>
              <div className="flex items-center gap-2">
                {getTrendIcon(child.trend)}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center"
                >
                  <Eye className="w-3 h-3 text-purple-600" />
                </motion.button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Overall:</span>
                <span className="font-semibold text-purple-600">{child.overall}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Attendance:</span>
                <span className="font-semibold text-green-600">{child.attendance}%</span>
              </div>
            </div>

            {/* Subject mini-bars */}
            <div className="mt-3 space-y-1">
              {Object.entries(child.subjects)
                .slice(0, 3)
                .map(([subject, score]) => (
                  <div key={subject} className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500 w-16 truncate">{subject}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                      />
                    </div>
                    <span className="font-medium text-gray-700 w-8">{score}%</span>
                  </div>
                ))}
              {Object.keys(child.subjects).length > 3 && (
                <div className="text-xs text-gray-400 text-center">
                  +{Object.keys(child.subjects).length - 3} more subjects
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PerformanceChart;
