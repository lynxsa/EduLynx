import React from 'react';
import Link from 'next/link';
import { Tooltip } from 'react-tooltip';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: React.ReactNode;
  colorClass?: string;
  className?: string;
  href?: string;
  ariaLabel?: string;
  children?: React.ReactNode;
  description?: string;
}

const DashboardCard = ({ title, value, icon, trend, colorClass = 'bg-white', className = '', href, ariaLabel, children, description }: DashboardCardProps) => {
  const cardContent = (
    <div
      className={`rounded-2xl shadow-md p-5 flex flex-col gap-2 min-w-[150px] min-h-[110px] ${colorClass} ${className} transition-all duration-200 hover:scale-[1.03] hover:shadow-2xl focus-within:ring-2 focus-within:ring-LYNXPurple/70 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 outline-none focus:outline-LYNXPurple/80 animate-fade-in`}
      tabIndex={0}
      aria-label={ariaLabel || title}
      role="region"
      data-tooltip-id={description ? `tooltip-${title}` : undefined}
      data-tooltip-content={description}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase">{title}</span>
        {icon && <span className="ml-2 text-xl flex items-center">{icon}</span>}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-3xl font-extrabold text-gray-800 dark:text-white">{value}</span>
        {trend && <span className="text-xs">{trend}</span>}
      </div>
      {description && <Tooltip id={`tooltip-${title}`} />}
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
  return href ? (
    <Link href={href} tabIndex={0} aria-label={title} className="focus:outline-none">{cardContent}</Link>
  ) : cardContent;
};

export default DashboardCard;
