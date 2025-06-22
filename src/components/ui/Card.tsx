import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral' | 'warning';
  className?: string;
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  changeType = 'neutral',
  className = '',
  children,
}) => {
  const changeColor = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-muted-foreground',
    warning: 'text-yellow-600',
  }[changeType];

  return (
    <div
      className={`bg-card text-card-foreground rounded-2xl shadow-sm border p-6 hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          {change && <p className={`text-sm mt-1 ${changeColor}`}>{change}</p>}
        </div>
        <div className="flex-shrink-0">
          <Icon className="w-8 h-8 text-primary" />
        </div>
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, children, className = '' }) => {
  return (
    <div
      className={`bg-card text-card-foreground rounded-2xl shadow-sm border p-6 hover:shadow-md transition-shadow ${className}`}
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      {children}
    </div>
  );
};
