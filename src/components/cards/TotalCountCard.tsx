'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface TotalCountCardProps {
  title: string;
  count: number;
  href: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  trend: string;
}

export const TotalCountCard = ({
  title,
  count,
  href,
  icon: Icon,
  color,
  bgColor,
  trend,
}: TotalCountCardProps) => {
  return (
    <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} className="group">
      <Link href={href}>
        <div className="relative overflow-hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          {/* Content */}
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 ${bgColor} dark:bg-gray-700 rounded-xl flex items-center justify-center`}
            >
              <Icon className={`w-6 h-6 ${color} dark:text-gray-300`} />
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {count.toLocaleString()}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400 font-medium">{trend}</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">{title}</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">View details</span>
              <svg
                className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transform group-hover:translate-x-1 transition-all duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>

          {/* Hover Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>
    </motion.div>
  );
};
