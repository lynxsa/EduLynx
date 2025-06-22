'use client';
import { motion } from 'framer-motion';
import { PieChart } from 'lucide-react';

interface GenderChartCardProps {
  title: string;
}

export const GenderChartCard = ({ title }: GenderChartCardProps) => {
  const data = [
    { label: 'Male', value: 52, color: 'bg-blue-500' },
    { label: 'Female', value: 48, color: 'bg-pink-500' },
  ];

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <PieChart className="w-5 h-5 mr-2 text-indigo-600" />
          {title}
        </h3>
      </div>

      <div className="flex items-center justify-center mb-6">
        {/* Simple pie chart representation */}
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="transparent" stroke="#e5e7eb" strokeWidth="20" />
            <motion.circle
              cx="60"
              cy="60"
              r="50"
              fill="transparent"
              stroke="#3b82f6"
              strokeWidth="20"
              strokeDasharray={`${2 * Math.PI * 50 * 0.52} ${2 * Math.PI * 50}`}
              strokeLinecap="round"
              initial={{ strokeDasharray: '0 314' }}
              animate={{ strokeDasharray: `${2 * Math.PI * 50 * 0.52} ${2 * Math.PI * 50}` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
            <motion.circle
              cx="60"
              cy="60"
              r="50"
              fill="transparent"
              stroke="#ec4899"
              strokeWidth="20"
              strokeDasharray={`${2 * Math.PI * 50 * 0.48} ${2 * Math.PI * 50}`}
              strokeDashoffset={`${2 * Math.PI * 50 * 0.52}`}
              strokeLinecap="round"
              initial={{ strokeDasharray: '0 314' }}
              animate={{ strokeDasharray: `${2 * Math.PI * 50 * 0.48} ${2 * Math.PI * 50}` }}
              transition={{ duration: 1, delay: 0.4 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">1,248</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {data.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.6 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.label}
              </span>
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{item.value}%</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
