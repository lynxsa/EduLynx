'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Maximize2, X } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { useTheme } from '../../styles/theme';
import { tokens } from '../../styles/tokens';

interface ExpandableCardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  expandable?: boolean;
  className?: string;
  headerContent?: ReactNode;
  footerContent?: ReactNode;
  height?: 'sm' | 'md' | 'lg' | 'xl' | 'auto';
  loading?: boolean;
  error?: string | null;
  onExpand?: () => void;
  onCollapse?: () => void;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

// Modal component for expanded cards
function Modal({ isOpen, onClose, children, title }: ModalProps) {
  const { actualTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ zIndex: tokens.zIndex.modal }}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`absolute inset-0 ${actualTheme === 'dark' ? 'bg-black/70' : 'bg-black/50'}`}
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className={`relative w-full max-w-6xl max-h-[90vh] m-4 overflow-hidden rounded-xl shadow-2xl ${
            actualTheme === 'dark'
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-gray-200'
          }`}
        >
          {/* Modal Header */}
          <div
            className={`flex items-center justify-between p-4 border-b ${
              actualTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            <h2
              className={`text-xl font-semibold ${
                actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              {title || 'Expanded View'}
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                actualTheme === 'dark'
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="overflow-auto max-h-[calc(90vh-80px)]">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Loading skeleton for cards
function CardSkeleton({ height = 'md' }: { height?: string }) {
  const { actualTheme } = useTheme();

  return (
    <div
      className={`animate-pulse p-6 rounded-xl h-[var(--card-height-${height})] ${
        actualTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
      }`}
    >
      <div
        className={`h-4 rounded mb-4 ${actualTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}
        style={{ width: '60%' }}
      ></div>
      <div
        className={`h-3 rounded mb-2 ${actualTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}
        style={{ width: '40%' }}
      ></div>
      <div
        className={`h-20 rounded mt-4 ${actualTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}
      ></div>
    </div>
  );
}

// Error state for cards
function CardError({ error, onRetry }: { error: string; onRetry?: () => void }) {
  const { actualTheme } = useTheme();

  return (
    <div
      className={`p-6 rounded-xl border ${
        actualTheme === 'dark'
          ? 'bg-red-900/20 border-red-800 text-red-400'
          : 'bg-red-50 border-red-200 text-red-600'
      }`}
    >
      <h3 className="font-semibold mb-2">Error Loading Data</h3>
      <p className="text-sm mb-4">{error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            actualTheme === 'dark'
              ? 'bg-red-800 hover:bg-red-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export function ExpandableCard({
  children,
  title,
  subtitle,
  expandable = true,
  className = '',
  headerContent,
  footerContent,
  height = 'md',
  loading = false,
  error = null,
  onExpand,
  onCollapse,
}: ExpandableCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { actualTheme } = useTheme();

  const handleExpand = () => {
    setIsExpanded(true);
    onExpand?.();
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    onCollapse?.();
  };

  const heightClass = height === 'auto' ? 'h-auto' : `h-[var(--card-height-${height})]`;

  if (loading) {
    return <CardSkeleton height={height} />;
  }

  if (error) {
    return <CardError error={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <>
      <motion.div
        layout
        className={`
          ${heightClass}
          rounded-xl shadow-sm border transition-all duration-300
          ${
            actualTheme === 'dark'
              ? 'bg-gray-800 border-gray-700 hover:shadow-lg hover:shadow-gray-900/20'
              : 'bg-white border-gray-200 hover:shadow-lg hover:shadow-gray-500/10'
          }
          ${className}
        `}
        whileHover={{ y: -2 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Card Header */}
        {(title || subtitle || expandable || headerContent) && (
          <div
            className={`flex items-center justify-between p-6 ${footerContent ? 'border-b' : ''} ${
              actualTheme === 'dark' ? 'border-gray-700' : 'border-gray-100'
            }`}
          >
            <div className="flex-1">
              {title && (
                <h3
                  className={`text-lg font-semibold ${
                    actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {title}
                </h3>
              )}
              {subtitle && (
                <p
                  className={`text-sm mt-1 ${
                    actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {subtitle}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {headerContent}
              {expandable && (
                <motion.button
                  onClick={handleExpand}
                  className={`p-2 rounded-lg transition-colors ${
                    actualTheme === 'dark'
                      ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                      : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Maximize2 size={18} />
                </motion.button>
              )}
            </div>
          </div>
        )}

        {/* Card Content */}
        <div
          className={`${
            title || subtitle || headerContent ? 'p-6 pt-0' : 'p-6'
          } ${footerContent ? 'pb-0' : ''} flex-1 overflow-hidden`}
        >
          {children}
        </div>

        {/* Card Footer */}
        {footerContent && (
          <div
            className={`p-6 pt-0 border-t ${
              actualTheme === 'dark' ? 'border-gray-700' : 'border-gray-100'
            }`}
          >
            {footerContent}
          </div>
        )}
      </motion.div>

      {/* Expanded Modal */}
      <Modal isOpen={isExpanded} onClose={handleCollapse} title={title}>
        <div className="p-6">{children}</div>
      </Modal>
    </>
  );
}

// Dashboard Grid Component
interface DashboardGridProps {
  children: ReactNode;
  columns?: string;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function DashboardGrid({
  children,
  columns = 'repeat(auto-fit, minmax(300px, 1fr))',
  gap = 'md',
  className = '',
}: DashboardGridProps) {
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  };

  return (
    <div
      className={`grid ${gapClasses[gap]} ${className}`}
      style={{ gridTemplateColumns: columns }}
    >
      {children}
    </div>
  );
}

export default ExpandableCard;
