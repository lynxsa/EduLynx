'use client';
import { motion } from 'framer-motion';
import { BarChart } from 'lucide-react';

interface SubjectChartCardProps {
  title: string;
}

export const SubjectChartCard = ({ title }: SubjectChartCardProps) => {
  const subjects = [
    { name: 'Mathematics', teachers: 12, color: 'bg-blue-500' },
    { name: 'English', teachers: 10, color: 'bg-green-500' },
    { name: 'Science', teachers: 8, color: 'bg-purple-500' },
    { name: 'History', teachers: 6, color: 'bg-orange-500' },
    { name: 'Arts', teachers: 4, color: 'bg-pink-500' },
  ];

  const maxTeachers = Math.max(...subjects.map(s => s.teachers));

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <BarChart className="w-5 h-5 mr-2 text-purple-600" />
          {title}
        </h3>
      </div>

      <div className="space-y-4">
        {subjects.map((subject, index) => (
          <motion.div
            key={subject.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {subject.name}
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {subject.teachers}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(subject.teachers / maxTeachers) * 100}%` }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
                className={`h-2 rounded-full ${subject.color}`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Total: {subjects.reduce((sum, s) => sum + s.teachers, 0)} teachers across all subjects
        </p>
      </div>
    </div>
  );
};
