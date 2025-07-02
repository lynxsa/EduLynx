import { Card } from '@edulynx/ui-primitives';
import { BarChart3, TrendingUp } from 'lucide-react';

interface WeeklyStatsCardProps {
  studyHours: number;
  completedTasks: number;
  weeklyGoal: number;
}

export const WeeklyStatsCard = ({
  studyHours,
  completedTasks,
  weeklyGoal,
}: WeeklyStatsCardProps) => {
  const progressPercentage = Math.min((studyHours / weeklyGoal) * 100, 100);

  return (
    <Card className="p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <span>Weekly Stats</span>
        </h2>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Study Hours
            </span>
          </div>
          <span className="text-lg font-bold text-blue-600">
            {studyHours}/{weeklyGoal}h
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{completedTasks}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Tasks Completed</p>
        </div>
      </div>
    </Card>
  );
};
