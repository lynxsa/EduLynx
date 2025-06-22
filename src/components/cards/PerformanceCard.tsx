'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
}

interface PerformanceCardProps {
  title: string;
  tabs: Tab[];
  icon: LucideIcon;
}

export const PerformanceCard = ({ title, tabs, icon: Icon }: PerformanceCardProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const sampleData = [
    { name: 'Emma Wilson', score: 98, class: '12A' },
    { name: 'James Rodriguez', score: 96, class: '11B' },
    { name: 'Sophia Chen', score: 94, class: '12A' },
    { name: 'Michael Brown', score: 92, class: '10C' },
    { name: 'Isabella Davis', score: 90, class: '11A' },
  ];

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Icon className="w-5 h-5 mr-2 text-yellow-600" />
          {title}
        </h3>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-6">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(index)}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === index
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Top Performers List */}
      <div className="space-y-3">
        {sampleData.map((student, index) => (
          <motion.div
            key={student.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  index === 0
                    ? 'bg-yellow-500'
                    : index === 1
                      ? 'bg-gray-400'
                      : index === 2
                        ? 'bg-orange-600'
                        : 'bg-blue-500'
                }`}
              >
                {index + 1}
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{student.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Class {student.class}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900 dark:text-white">{student.score}%</div>
              <div className="text-sm text-green-600 dark:text-green-400">Excellent</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
