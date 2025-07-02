'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  Calendar,
  CheckCircle,
  FileText,
  MessageSquare,
  MoreHorizontal,
  Trophy,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'assignment' | 'grade' | 'message' | 'calendar' | 'system' | 'achievement';
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
  onClick: (notification: Notification) => void;
}

function NotificationItem({
  notification,
  onMarkAsRead,
  onRemove,
  onClick,
}: NotificationItemProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return FileText;
      case 'grade':
        return Trophy;
      case 'message':
        return MessageSquare;
      case 'calendar':
        return Calendar;
      case 'achievement':
        return Trophy;
      default:
        return Bell;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'assignment':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'grade':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'message':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      case 'calendar':
        return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
      case 'achievement':
        return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getPriorityIndicator = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const Icon = getIcon(notification.type);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`notification-item p-4 border-l-4 ${
        notification.isRead ? 'border-gray-200' : getPriorityIndicator(notification.priority)
      } bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-r-lg hover:shadow-lg transition-all duration-300 cursor-pointer`}
      onClick={() => onClick(notification)}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
          <Icon className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h4
              className={`text-sm font-medium ${
                notification.isRead
                  ? 'text-gray-600 dark:text-gray-400'
                  : 'text-gray-900 dark:text-white'
              }`}
            >
              {notification.title}
            </h4>

            <div className="flex items-center gap-2 ml-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {formatTimeAgo(notification.createdAt)}
              </span>

              <div className="flex items-center gap-1">
                {!notification.isRead && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={e => {
                      e.stopPropagation();
                      onMarkAsRead(notification.id);
                    }}
                    className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded transition-colors"
                    title="Mark as read"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={e => {
                    e.stopPropagation();
                    onRemove(notification.id);
                  }}
                  className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                  title="Remove notification"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>

          <p
            className={`text-sm ${
              notification.isRead
                ? 'text-gray-500 dark:text-gray-500'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            {notification.message}
          </p>

          {!notification.isRead && (
            <div className="mt-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
  onNotificationClick: (notification: Notification) => void;
}

export function NotificationCenter({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onRemove,
  onClearAll,
  onNotificationClick,
}: NotificationCenterProps) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const types = ['all', ...Array.from(new Set(notifications.map(n => n.type)))];

  const filteredNotifications = notifications
    .filter(notification => {
      const matchesReadFilter = filter === 'all' || !notification.isRead;
      const matchesTypeFilter = typeFilter === 'all' || notification.type === typeFilter;
      return matchesReadFilter && matchesTypeFilter;
    })
    .sort((a, b) => {
      // Sort by priority and then by date
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="notification-center max-w-md mx-auto">
      {/* Header */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-t-xl border border-gray-200/50 dark:border-gray-700/50 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-primary text-white text-xs rounded-full">
                {unreadCount}
              </span>
            )}
          </h3>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-xs text-primary hover:text-primary/80 transition-colors"
              >
                Mark all read
              </button>
            )}

            <button
              onClick={onClearAll}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Clear all"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={e => setFilter(e.target.value as 'all' | 'unread')}
            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-sm rounded-lg border-0 focus:ring-2 focus:ring-primary"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
          </select>

          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-sm rounded-lg border-0 focus:ring-2 focus:ring-primary"
          >
            {types.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50 rounded-b-xl">
        <AnimatePresence>
          {filteredNotifications.length > 0 ? (
            <div className="p-2 space-y-2">
              {filteredNotifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={onMarkAsRead}
                  onRemove={onRemove}
                  onClick={onNotificationClick}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-gray-500 dark:text-gray-400"
            >
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface NotificationBellProps {
  notifications: Notification[];
  onToggle: () => void;
  isOpen: boolean;
}

export function NotificationBell({ notifications, onToggle, isOpen }: NotificationBellProps) {
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const hasHighPriority = notifications.some(n => !n.isRead && n.priority === 'high');

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className={`relative p-3 rounded-xl transition-all duration-300 ${
        isOpen
          ? 'bg-primary text-white shadow-lg'
          : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50'
      }`}
    >
      <Bell className={`w-5 h-5 ${hasHighPriority ? 'animate-pulse' : ''}`} />

      {unreadCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </motion.div>
      )}

      {hasHighPriority && (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full opacity-75"
        />
      )}
    </motion.button>
  );
}

interface ToastNotificationProps {
  notification: Notification;
  onDismiss: () => void;
  onAction?: () => void;
}

export function ToastNotification({ notification, onDismiss, onAction }: ToastNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return FileText;
      case 'grade':
        return Trophy;
      case 'message':
        return MessageSquare;
      case 'calendar':
        return Calendar;
      case 'achievement':
        return Trophy;
      default:
        return Bell;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'assignment':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-900/30';
      case 'grade':
        return 'border-green-500 bg-green-50 dark:bg-green-900/30';
      case 'message':
        return 'border-purple-500 bg-purple-50 dark:bg-purple-900/30';
      case 'calendar':
        return 'border-orange-500 bg-orange-50 dark:bg-orange-900/30';
      case 'achievement':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30';
      default:
        return 'border-gray-500 bg-gray-50 dark:bg-gray-900/30';
    }
  };

  const Icon = getIcon(notification.type);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.3 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.5 }}
          className={`toast-notification fixed top-4 right-4 z-50 max-w-sm w-full p-4 rounded-lg border-l-4 shadow-lg backdrop-blur-md ${getTypeColor(notification.type)}`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                {notification.title}
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">{notification.message}</p>

              {notification.actionUrl && onAction && (
                <button
                  onClick={onAction}
                  className="mt-2 text-xs text-primary hover:text-primary/80 font-medium"
                >
                  View Details
                </button>
              )}
            </div>

            <button
              onClick={() => setIsVisible(false)}
              className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    setNotifications(prev => [newNotification, ...prev]);
    return newNotification;
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  };
}

const NotificationComponents = {
  NotificationCenter,
  NotificationBell,
  ToastNotification,
  useNotifications,
};

export default NotificationComponents;
