'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface TodoCardProps {
  title: string;
  count: number;
  urgency: 'high' | 'medium' | 'low';
  href: string;
  icon: LucideIcon;
}

export const TodoCard = ({ title, count, urgency, href, icon: Icon }: TodoCardProps) => {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          text: 'text-red-600',
          count: 'bg-red-500',
        };
      case 'medium':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          border: 'border-yellow-200 dark:border-yellow-800',
          text: 'text-yellow-600',
          count: 'bg-yellow-500',
        };
      case 'low':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-200 dark:border-green-800',
          text: 'text-green-600',
          count: 'bg-green-500',
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-900/20',
          border: 'border-gray-200 dark:border-gray-800',
          text: 'text-gray-600',
          count: 'bg-gray-500',
        };
    }
  };

  const colors = getUrgencyColor(urgency);

  return (
    <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} className="group">
      <Link href={href}>
        <div
          className={`relative overflow-hidden ${colors.bg} border ${colors.border} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 ${colors.bg} border ${colors.border} rounded-xl flex items-center justify-center`}
            >
              <Icon className={`w-6 h-6 ${colors.text}`} />
            </div>

            <div
              className={`w-8 h-8 ${colors.count} text-white rounded-full flex items-center justify-center text-sm font-bold`}
            >
              {count > 99 ? '99+' : count}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {urgency === 'high' ? 'Urgent' : urgency === 'medium' ? 'Moderate' : 'Low Priority'}
              </span>
              <span className={`text-xs font-medium ${colors.text}`}>{urgency.toUpperCase()}</span>
            </div>
          </div>

          {/* Urgency Indicator */}
          {urgency === 'high' && (
            <div className="absolute top-2 right-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </div>
          )}

          {/* Hover Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>
    </motion.div>
  );
};
