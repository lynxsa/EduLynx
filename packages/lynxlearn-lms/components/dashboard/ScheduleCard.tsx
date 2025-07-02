import { Card } from '@edulynx/ui-primitives';
import { Calendar, Clock } from 'lucide-react';
import Link from 'next/link';

interface ScheduleCardProps {
  nextClass: {
    subject: string;
    time: string;
    room: string;
  };
  todayClasses: number;
}

export const ScheduleCard = ({ nextClass, todayClasses }: ScheduleCardProps) => (
  <Card className="p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
        <Calendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        <span>Today's Schedule</span>
      </h2>
      <Link
        href="/calendar"
        className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
      >
        View all
      </Link>
    </div>
    <div className="space-y-3">
      <div className="flex items-center space-x-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
        <Clock className="w-5 h-5 text-emerald-600" />
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Next: {nextClass.subject}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {nextClass.time} • {nextClass.room}
          </p>
        </div>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        {todayClasses} classes remaining today
      </p>
    </div>
  </Card>
);
