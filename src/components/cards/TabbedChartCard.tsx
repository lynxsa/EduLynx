'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  type: string;
}

interface TabbedChartCardProps {
  title: string;
  tabs: Tab[];
  icon: LucideIcon;
}

export const TabbedChartCard = ({ title, tabs, icon: Icon }: TabbedChartCardProps) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Icon className="w-5 h-5 mr-2 text-indigo-600" />
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

      {/* Chart Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-lg"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {tabs[activeTab].label}
          </h4>
          <p className="text-gray-600 dark:text-gray-400">
            {tabs[activeTab].type} chart visualization will be displayed here
          </p>
        </div>
      </motion.div>

      {/* Sample Data Display */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Current', value: '87%' },
          { label: 'Previous', value: '84%' },
          { label: 'Target', value: '90%' },
          { label: 'Trend', value: '+3%' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            <div className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
