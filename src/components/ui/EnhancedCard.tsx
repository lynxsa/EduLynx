import { AnimatePresence, motion } from 'framer-motion';
import { Eye, Minus, MoreHorizontal, TrendingDown, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';

interface EnhancedCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  tabs?: Array<{
    id: string;
    label: string;
    content: React.ReactNode;
  }>;
  chart?: React.ReactNode;
  onViewMore?: () => void;
  isLive?: boolean;
  height?: 'small' | 'medium' | 'large' | 'xl';
}

const EnhancedCard: React.FC<EnhancedCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  className = '',
  children,
  tabs,
  chart,
  onViewMore,
  isLive = true,
  height = 'medium',
}) => {
  const [activeTab, setActiveTab] = useState(tabs?.[0]?.id || '');
  const [isExpanded, setIsExpanded] = useState(false);

  const getHeightClass = () => {
    switch (height) {
      case 'small':
        return 'min-h-[200px]';
      case 'medium':
        return 'min-h-[320px]'; // Increased from default
      case 'large':
        return 'min-h-[420px]';
      case 'xl':
        return 'min-h-[520px]';
      default:
        return 'min-h-[320px]';
    }
  };

  const getTrendIcon = () => {
    switch (trend?.direction) {
      case 'up':
        return <TrendingUp className="w-3 h-3" />;
      case 'down':
        return <TrendingDown className="w-3 h-3" />;
      default:
        return <Minus className="w-3 h-3" />;
    }
  };

  const getTrendColor = () => {
    switch (trend?.direction) {
      case 'up':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      case 'down':
        return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700
        hover:shadow-lg transition-all duration-300 overflow-hidden
        ${getHeightClass()}
        ${className}
      `}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">{icon}</div>}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                {isLive && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                      LIVE
                    </span>
                  </div>
                )}
              </div>
              {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {trend && (
              <div
                className={`
                flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                ${getTrendColor()}
              `}
              >
                {getTrendIcon()}
                <span>{trend.value}</span>
              </div>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Value */}
      <div className="px-6 py-4">
        <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
      </div>

      {/* Tabs */}
      {tabs && tabs.length > 0 && (
        <div className="px-6">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all
                  ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-6 py-4 flex-1">
        <AnimatePresence mode="wait">
          {tabs && tabs.length > 0 ? (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {tabs.find(tab => tab.id === activeTab)?.content}
            </motion.div>
          ) : chart ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-48">
              {chart}
            </motion.div>
          ) : children ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {children}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Footer with View More */}
      {onViewMore && (
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={onViewMore}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            View More
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default EnhancedCard;
