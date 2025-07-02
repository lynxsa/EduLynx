'use client';

import { useEffect, useState } from 'react';
import { ModernTable } from '@/components/ui/ModernTable';
import {
  Megaphone,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';

interface Announcement {
  id: number;
  title: string;
  description: string;
  date: Date;
  priority?: string;
  status?: string;
  author?: string;
  targetAudience?: string;
  expiryDate?: Date | null;
  isActive?: boolean;
  views?: number;
}

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch('/api/announcements');
        if (!response.ok) {
          throw new Error('Failed to fetch announcements');
        }
        const data = await response.json();
        setAnnouncements(data.data || data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const columns = [
    {
      key: 'title',
      label: 'Announcement',
      sortable: true,
      render: (announcement: Announcement) => (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">{announcement.title}</div>
            <div className="text-sm text-gray-500 truncate max-w-xs">
              {announcement.description}
            </div>
            {announcement.priority && (
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                  announcement.priority === 'High'
                    ? 'bg-red-100 text-red-800'
                    : announcement.priority === 'Medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                }`}
              >
                {announcement.priority} Priority
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'author',
      label: 'Author',
      sortable: true,
      render: (announcement: Announcement) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-900">{announcement.author || 'System'}</span>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Published',
      sortable: true,
      render: (announcement: Announcement) => {
        const date = new Date(announcement.date);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {date.toLocaleDateString('en-ZA')}
              </p>
              <p className="text-xs text-gray-500">
                {diffDays <= 1 ? 'Today' : `${diffDays} days ago`}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (announcement: Announcement) => {
        const isExpired = announcement.expiryDate && new Date(announcement.expiryDate) < new Date();
        const status = isExpired ? 'Expired' : announcement.status || 'Active';

        const statusColors = {
          Active: 'bg-green-100 text-green-800',
          Draft: 'bg-gray-100 text-gray-800',
          Expired: 'bg-red-100 text-red-800',
          Scheduled: 'bg-blue-100 text-blue-800',
        };

        const StatusIcon =
          status === 'Active' ? CheckCircle : status === 'Expired' ? AlertCircle : Clock;

        return (
          <div className="flex items-center gap-2">
            <StatusIcon className="w-4 h-4" />
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-600'
              }`}
            >
              {status}
            </span>
          </div>
        );
      },
    },
    {
      key: 'views',
      label: 'Engagement',
      sortable: true,
      render: (announcement: Announcement) => {
        const views = announcement.views || 0;
        const daysSincePublished = Math.ceil(
          Math.abs(new Date().getTime() - new Date(announcement.date).getTime()) /
            (1000 * 60 * 60 * 24)
        );
        const avgViewsPerDay =
          daysSincePublished > 0 ? Math.round(views / daysSincePublished) : views;

        return (
          <div>
            <p className="font-medium text-gray-900">{views} views</p>
            <p className="text-xs text-gray-500">{avgViewsPerDay}/day avg</p>
          </div>
        );
      },
    },
    {
      key: 'expiryDate',
      label: 'Expires',
      sortable: true,
      render: (announcement: Announcement) => {
        if (!announcement.expiryDate) {
          return <span className="text-gray-500 text-sm">No expiry</span>;
        }

        const expiry = new Date(announcement.expiryDate);
        const now = new Date();
        const isExpired = expiry < now;
        const diffTime = Math.abs(expiry.getTime() - now.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return (
          <div>
            <p className={`font-medium ${isExpired ? 'text-red-600' : 'text-gray-900'}`}>
              {expiry.toLocaleDateString('en-ZA')}
            </p>
            <p className="text-xs text-gray-500">
              {isExpired ? `Expired ${diffDays} days ago` : `${diffDays} days left`}
            </p>
          </div>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading announcements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <ModernTable
        data={announcements}
        columns={columns}
        title="Announcements"
        description="Manage school announcements and communications"
        searchableFields={['title', 'description', 'author']}
        onView={(announcement: Announcement) => {
          console.log('View announcement:', announcement);
          // Navigate to view page
        }}
        onEdit={(announcement: Announcement) => {
          console.log('Edit announcement:', announcement);
          // Navigate to edit page
        }}
        onDelete={(announcement: Announcement) => {
          if (window.confirm('Are you sure you want to delete this announcement?')) {
            console.log('Delete announcement:', announcement);
            // Handle delete
          }
        }}
      />
    </div>
  );
};

export default AnnouncementsPage;
