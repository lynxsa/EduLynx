'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface Notification {
  id: number;
  type: 'event' | 'announcement';
  title: string;
  description: string;
  date: string;
  className?: string;
}

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNotifications() {
      setLoading(true);
      setError(null);
      try {
        const [eventsRes, announcementsRes] = await Promise.all([
          fetch('/api/events'),
          fetch('/api/announcements?page=1&limit=5'),
        ]);
        if (!eventsRes.ok || !announcementsRes.ok) throw new Error('Failed to fetch notifications');
        const events = (await eventsRes.json()) || [];
        const announcements = (await announcementsRes.json()).data || [];
        const eventNotifications = events.map((e: any) => ({
          id: e.id,
          type: 'event',
          title: e.title,
          description: e.description,
          date: e.startTime,
        }));
        const announcementNotifications = announcements.map((a: any) => ({
          id: a.id,
          type: 'announcement',
          title: a.title,
          description: a.description,
          date: a.date,
        }));
        setNotifications(
          [...eventNotifications, ...announcementNotifications].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
        );
      } catch (err) {
        setNotifications([]);
        setError('Could not load notifications.');
      }
      setLoading(false);
    }
    fetchNotifications();
  }, []);

  return (
    <div
      className="rounded-2xl shadow-md p-5 flex flex-col gap-2 min-w-[250px] max-w-md bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 outline-none focus:outline-LYNXPurple/80"
      tabIndex={0}
      aria-label="Notifications and Events"
      role="region"
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-200">
          Notifications & Events
        </h2>
        <Image src="/calendar.png" alt="Calendar" width={20} height={20} />
      </div>
      {loading ? (
        <div className="text-gray-400 p-4">Loading...</div>
      ) : error ? (
        <div className="text-red-500 p-4">{error}</div>
      ) : notifications.length === 0 ? (
        <div className="text-gray-400 p-4">No notifications</div>
      ) : (
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {notifications.slice(0, 5).map(n => (
            <li key={n.type + n.id} className="py-2 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Image
                  src={n.type === 'event' ? '/event.png' : '/announcement.png'}
                  alt={n.type}
                  width={16}
                  height={16}
                />
                <span className="font-medium text-sm">{n.title}</span>
                <span className="ml-auto text-xs text-gray-400">
                  {new Date(n.date).toLocaleDateString()}
                </span>
              </div>
              <div className="text-xs text-gray-500 pl-6">{n.description}</div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-2 text-right">
        <a href="/dashboard/list/events" className="text-LYNXPurple text-xs hover:underline">
          View all events
        </a>
      </div>
    </div>
  );
}
