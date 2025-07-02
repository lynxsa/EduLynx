'use client';

import { Bell } from 'lucide-react';
import { useState } from 'react';
import { NotificationCenter } from '../../components/ui/notification-system';
import type { Notification as DataNotification } from './data';
import { notifications as dataNotifications } from './data';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<DataNotification[]>(dataNotifications);

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(
      notifications.map(n => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (notification: DataNotification) => {
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1 className="page-title">
          <Bell className="w-8 h-8 mr-3 text-brand-primary" />
          Notifications
        </h1>
      </header>
      <div className="page-content">
        <NotificationCenter
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onRemove={handleDeleteNotification}
          onClearAll={handleClearAll}
          onNotificationClick={handleNotificationClick}
        />
      </div>
    </div>
  );
}
