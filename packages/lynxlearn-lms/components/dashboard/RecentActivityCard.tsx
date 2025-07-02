import { Card } from '@edulynx/ui-primitives';
import { BookOpen, Calendar, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface RecentActivityCardProps {
  activities: {
    id: number;
    type: 'course' | 'assignment' | 'quiz' | 'discussion';
    title: string;
    subject: string;
    timestamp: string;
    progress?: number;
  }[];
}

export const RecentActivityCard = ({ activities }: RecentActivityCardProps) => (
  <Card className="p-6 rounded-2xl shadow-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
        <TrendingUp className="w-6 h-6 text-LYNXPurple dark:text-LYNXLight" />
        <span>Recent Activity</span>
      </h2>
      <Link
        href="/activity"
        className="text-sm font-medium text-LYNXPurple dark:text-LYNXLight hover:underline"
      >
        View all
      </Link>
    </div>
    <div className="space-y-3">
      {activities.slice(0, 5).map(activity => (
        <div
          key={activity.id}
          className="flex items-center space-x-3 p-3 bg-LYNXLightLavendar/40 dark:bg-LYNXPurple/10 backdrop-blur-sm rounded-lg border border-LYNXLight/20"
        >
          <div className="w-8 h-8 rounded-lg bg-LYNXMauve/60 flex items-center justify-center">
            {activity.type === 'course' && <BookOpen className="w-4 h-4 text-LYNXPurple" />}
            {activity.type === 'assignment' && <Calendar className="w-4 h-4 text-LYNXPurple" />}
            {activity.type === 'quiz' && <Clock className="w-4 h-4 text-LYNXPurple" />}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{activity.title}</p>
            <p className="text-xs text-LYNXPurple dark:text-LYNXLight">
              {activity.subject} • {activity.timestamp}
            </p>
            {activity.progress && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-1">
                <div
                  className="h-1 rounded-full bg-gradient-to-r from-LYNXPurple to-LYNXHelio"
                  style={{ width: `${activity.progress}%` }}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </Card>
);
