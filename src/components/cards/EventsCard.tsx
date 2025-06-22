'use client';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

interface EventsCardProps {
  title: string;
}

export const EventsCard = ({ title }: EventsCardProps) => {
  const events = [
    { title: 'Parent-Teacher Conference', date: 'June 25', time: '9:00 AM', type: 'meeting' },
    { title: 'Science Fair', date: 'June 28', time: '2:00 PM', type: 'academic' },
    { title: 'Sports Day', date: 'July 2', time: '8:00 AM', type: 'sports' },
    { title: 'Summer Break Begins', date: 'July 5', time: 'All Day', type: 'holiday' },
  ];

  const getEventColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-800';
      case 'academic':
        return 'bg-purple-100 text-purple-800';
      case 'sports':
        return 'bg-green-100 text-green-800';
      case 'holiday':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-blue-600" />
          {title}
        </h3>
      </div>

      <div className="space-y-3">
        {events.map((event, index) => (
          <motion.div
            key={event.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">{event.title}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {event.date} • {event.time}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getEventColor(event.type)}`}
              >
                {event.type}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4">
        <button className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All Events
        </button>
      </div>
    </div>
  );
};
