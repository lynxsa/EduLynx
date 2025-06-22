'use client';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

interface MessagesCardProps {
  title: string;
}

export const MessagesCard = ({ title }: MessagesCardProps) => {
  const messages = [
    {
      from: 'Dr. Sarah Johnson',
      subject: 'Grade Review Request',
      preview: 'Could we schedule a meeting to discuss...',
      time: '30 min ago',
      unread: true,
    },
    {
      from: 'Mark Wilson',
      subject: 'Student Absence',
      preview: 'My daughter will be absent tomorrow due to...',
      time: '2 hours ago',
      unread: true,
    },
    {
      from: 'Lisa Chen',
      subject: 'Parent-Teacher Conference',
      preview: 'Thank you for the productive meeting...',
      time: '1 day ago',
      unread: false,
    },
  ];

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-green-600" />
          {title}
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
            {messages.filter(m => m.unread).length}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {messages.map((message, index) => (
          <motion.div
            key={message.subject}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow duration-200 cursor-pointer ${
              message.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-1">
              <h4
                className={`font-medium text-sm ${
                  message.unread
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {message.from}
              </h4>
              <div className="flex items-center space-x-2">
                {message.unread && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                <span className="text-xs text-gray-500 dark:text-gray-500">{message.time}</span>
              </div>
            </div>
            <h5
              className={`text-sm mb-1 ${
                message.unread
                  ? 'font-medium text-gray-900 dark:text-white'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {message.subject}
            </h5>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{message.preview}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-4">
        <button className="w-full py-2 text-sm text-green-600 hover:text-green-700 font-medium">
          View All Messages
        </button>
      </div>
    </div>
  );
};
