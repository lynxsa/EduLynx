import { Card } from '@edulynx/ui-primitives';
import Link from 'next/link';

export const UpcomingDeadlinesCard = ({ upcomingDeadlines }) => (
  <Card className="p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Upcoming Deadlines</h2>
      <Link
        href="/assignments"
        className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
      >
        View all
      </Link>
    </div>
    <div className="space-y-4">
      {upcomingDeadlines.map(deadline => (
        <div
          key={deadline.id}
          className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
        >
          <div className="flex items-center space-x-3">
            <div
              className={`w-3 h-3 rounded-full ${deadline.priority === 'high' ? 'bg-red-500' : deadline.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}
            />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">{deadline.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{deadline.subject}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {deadline.dueDate}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{deadline.type}</p>
          </div>
        </div>
      ))}
    </div>
  </Card>
);
