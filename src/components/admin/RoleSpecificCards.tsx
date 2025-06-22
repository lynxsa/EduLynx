'use client';
import { LucideIcon } from 'lucide-react';
import {
  Users,
  GraduationCap,
  UserCheck,
  School,
  TrendingUp,
  TrendingDown,
  Crown,
  BookOpen,
  Award,
  Calendar,
} from 'lucide-react';

interface RoleCardData {
  role: 'admin' | 'teacher' | 'parent' | 'student';
  count: number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  details: Array<{ label: string; value: string | number }>;
  actions: Array<{ label: string; onClick: () => void }>;
}

interface RoleSpecificCardsProps {
  data: {
    admins: RoleCardData;
    teachers: RoleCardData;
    parents: RoleCardData;
    students: RoleCardData;
  };
  className?: string;
}

const roleConfig = {
  admin: {
    icon: Crown,
    color: 'bg-purple-500',
    lightColor: 'bg-purple-50',
    textColor: 'text-purple-900',
    iconColor: 'text-purple-600',
    title: 'Administrators',
  },
  teacher: {
    icon: GraduationCap,
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-900',
    iconColor: 'text-blue-600',
    title: 'Teachers',
  },
  parent: {
    icon: Users,
    color: 'bg-green-500',
    lightColor: 'bg-green-50',
    textColor: 'text-green-900',
    iconColor: 'text-green-600',
    title: 'Parents',
  },
  student: {
    icon: School,
    color: 'bg-orange-500',
    lightColor: 'bg-orange-50',
    textColor: 'text-orange-900',
    iconColor: 'text-orange-600',
    title: 'Students',
  },
};

function RoleCard({ role, data }: { role: keyof typeof roleConfig; data: RoleCardData }) {
  const config = roleConfig[role];
  const Icon = config.icon;
  const TrendIcon = data.trend === 'up' ? TrendingUp : data.trend === 'down' ? TrendingDown : null;

  return (
    <div
      className={`${config.lightColor} rounded-xl border-l-4 ${config.color.replace('bg-', 'border-')} p-4 sm:p-6 hover:shadow-lg transition-all duration-200`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className={`p-2 sm:p-3 ${config.color} rounded-lg`}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h3 className={`text-base sm:text-lg font-semibold ${config.textColor}`}>
              {config.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">Active in system</p>
          </div>
        </div>

        <div className="text-right">
          <p className={`text-2xl sm:text-3xl font-bold ${config.textColor}`}>{data.count}</p>
          {data.change !== undefined && TrendIcon && (
            <div className="flex items-center gap-1 justify-end">
              <TrendIcon
                className={`w-3 h-3 sm:w-4 sm:h-4 ${data.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}
              />
              <span
                className={`text-xs sm:text-sm ${data.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}
              >
                {Math.abs(data.change)}%
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {data.details.map((detail, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-xs sm:text-sm text-gray-600">{detail.label}</span>
            <span className={`text-xs sm:text-sm font-medium ${config.textColor}`}>
              {detail.value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {data.actions.slice(0, 2).map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-full ${config.color} text-white hover:opacity-90 transition-opacity`}
          >
            {action.label}
          </button>
        ))}
        {data.actions.length > 2 && (
          <button className="px-2 sm:px-3 py-1 text-xs font-medium rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">
            +{data.actions.length - 2} more
          </button>
        )}
      </div>
    </div>
  );
}

export function RoleSpecificCards({ data, className = '' }: RoleSpecificCardsProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 ${className}`}>
      <RoleCard role="admin" data={data.admins} />
      <RoleCard role="teacher" data={data.teachers} />
      <RoleCard role="parent" data={data.parents} />
      <RoleCard role="student" data={data.students} />
    </div>
  );
}
