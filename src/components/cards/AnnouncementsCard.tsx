'use client';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

interface AnnouncementsCardProps {
  title: string;
}

export const AnnouncementsCard = ({ title }: AnnouncementsCardProps) => {
  const announcements = [
    {
      title: 'New COVID-19 Guidelines',
      content: 'Updated health and safety protocols for the upcoming semester.',
      time: '2 hours ago',
      priority: 'high',
    },
    {
      title: 'Library Hours Extended',
      content: 'The library will now be open until 8 PM on weekdays.',
      time: '1 day ago',
      priority: 'medium',
    },
    {
      title: 'Summer Reading Program',
      content: 'Sign up for our exciting summer reading challenge.',
      time: '3 days ago',
      priority: 'low',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Bell className="w-5 h-5 mr-2 text-purple-600" />
          {title}
        </h3>
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
      </div>

      <div className="space-y-4">
        {announcements.map((announcement, index) => (
          <motion.div
            key={announcement.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                {announcement.title}
              </h4>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}
              >
                {announcement.priority}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{announcement.content}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">{announcement.time}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-4">
        <button className="w-full py-2 text-sm text-purple-600 hover:text-purple-700 font-medium">
          View All Announcements
        </button>
      </div>
    </div>
  );
};
