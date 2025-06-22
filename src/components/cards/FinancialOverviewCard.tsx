'use client';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, Eye } from 'lucide-react';
import Link from 'next/link';

interface FinancialOverviewCardProps {
  title: string;
}

export const FinancialOverviewCard = ({ title }: FinancialOverviewCardProps) => {
  const monthlyData = [
    { month: 'Jan', expenses: 85000, revenue: 95000 },
    { month: 'Feb', expenses: 78000, revenue: 92000 },
    { month: 'Mar', expenses: 92000, revenue: 98000 },
    { month: 'Apr', expenses: 88000, revenue: 105000 },
    { month: 'May', expenses: 85000, revenue: 102000 },
    { month: 'Jun', expenses: 91000, revenue: 108000 },
  ];

  const currentMonth = monthlyData[monthlyData.length - 1];
  const profit = currentMonth.revenue - currentMonth.expenses;
  const profitMargin = ((profit / currentMonth.revenue) * 100).toFixed(1);

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-green-600" />
          {title}
        </h3>
        <div className="flex items-center space-x-2 text-green-600">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">+{profitMargin}%</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            ${currentMonth.revenue.toLocaleString()}
          </div>
          <div className="text-sm text-green-700 dark:text-green-400">Revenue</div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            ${currentMonth.expenses.toLocaleString()}
          </div>
          <div className="text-sm text-red-700 dark:text-red-400">Expenses</div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">${profit.toLocaleString()}</div>
          <div className="text-sm text-blue-700 dark:text-blue-400">Profit</div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-64 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <div className="flex items-end justify-between h-full space-x-2">
          {monthlyData.map((data, index) => (
            <div key={data.month} className="flex-1 flex flex-col items-center space-y-1">
              <div className="w-full flex flex-col space-y-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.revenue / 120000) * 100}%` }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  className="bg-green-500 rounded-t min-h-[4px]"
                />
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.expenses / 120000) * 100}%` }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
                  className="bg-red-500 rounded-t min-h-[4px]"
                />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                {data.month}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6 mt-4 mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Revenue</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Expenses</span>
        </div>
      </div>

      {/* View More Button */}
      <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
        <Link href="/finance">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-medium text-sm shadow-lg"
          >
            <Eye className="w-4 h-4" />
            View Financial Reports
          </motion.button>
        </Link>
      </div>
    </div>
  );
};
