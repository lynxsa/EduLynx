'use client';

import React, { useState, useEffect, useCallback } from 'react';
import DataTable from '@/components/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { MessageCircle, Send, Inbox, Archive, Star, Clock, User } from 'lucide-react';

interface Message {
  id: string;
  from: string;
  to: string;
  subject: string;
  preview: string;
  timestamp: string;
  read: boolean;
  starred: boolean;
  priority: 'low' | 'normal' | 'high';
  type: 'inbox' | 'sent' | 'archived';
}

interface MessageStats {
  inbox: number;
  unread: number;
  starred: number;
  archived: number;
}

// Define columns outside the component to avoid server/client issues
const messageColumns: ColumnDef<Message>[] = [
  {
    id: 'starred',
    header: '',
    cell: ({ row }) => (
      <button className="p-1 hover:bg-gray-100 rounded">
        <Star
          className={`w-4 h-4 ${
            row.original.starred
              ? 'text-yellow-500 fill-current'
              : 'text-gray-400 hover:text-yellow-500'
          }`}
        />
      </button>
    ),
    enableSorting: false,
    size: 40,
  },
  {
    accessorKey: 'from',
    header: 'From',
    cell: ({ row }) => (
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 font-medium text-sm">
            {row.original.from
              .split(' ')
              .map((n: string) => n[0])
              .join('')}
          </span>
        </div>
        <span className="font-medium text-gray-900">{row.original.from}</span>
      </div>
    ),
  },
  {
    accessorKey: 'subject',
    header: 'Subject',
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-gray-900">{row.original.subject}</p>
        <p className="text-sm text-gray-500 truncate max-w-xs">{row.original.preview}</p>
      </div>
    ),
  },
  {
    accessorKey: 'timestamp',
    header: 'Time',
    cell: ({ row }) => <span className="text-sm text-gray-500">{row.original.timestamp}</span>,
  },
];

const MessagesPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<MessageStats>({
    inbox: 0,
    unread: 0,
    starred: 0,
    archived: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  // For demo purposes, using a hardcoded user ID. In a real app, this would come from auth context
  const userId = '1'; // This should be replaced with actual user ID from authentication

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/messages?userId=${userId}&type=${activeTab}`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      setMessages(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [userId, activeTab]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/messages/stats?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch message stats');
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchStats();
  }, [fetchMessages]);

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await fetch('/api/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, read: true }),
      });
      fetchMessages();
      fetchStats();
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const handleStarToggle = async (messageId: string, starred: boolean) => {
    try {
      await fetch('/api/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, starred: !starred }),
      });
      fetchMessages();
      fetchStats();
    } catch (err) {
      console.error('Error toggling star:', err);
    }
  };
  const columns: ColumnDef<Message>[] = [
    {
      id: 'starred',
      header: '',
      cell: ({ row }) => (
        <button
          className="p-1 hover:bg-gray-100 rounded"
          onClick={() => handleStarToggle(row.original.id, row.original.starred)}
        >
          <Star
            className={`w-4 h-4 ${
              row.original.starred
                ? 'text-yellow-500 fill-current'
                : 'text-gray-400 hover:text-yellow-500'
            }`}
          />
        </button>
      ),
      enableSorting: false,
      size: 40,
    },
    {
      id: 'from',
      header: 'From',
      accessorKey: 'from',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <span
            className={`font-medium ${!row.original.read ? 'font-bold text-gray-900' : 'text-gray-700'}`}
          >
            {row.original.from}
          </span>
        </div>
      ),
    },
    {
      id: 'subject',
      header: 'Subject',
      accessorKey: 'subject',
      cell: ({ row }) => (
        <div className="cursor-pointer" onClick={() => handleMarkAsRead(row.original.id)}>
          <div
            className={`${!row.original.read ? 'font-bold text-gray-900' : 'text-gray-700'} mb-1`}
          >
            {row.original.subject}
          </div>
          <div className="text-sm text-gray-500 truncate max-w-xs">{row.original.preview}</div>
        </div>
      ),
    },
    {
      id: 'priority',
      header: 'Priority',
      accessorKey: 'priority',
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            row.original.priority === 'high'
              ? 'bg-red-100 text-red-800'
              : row.original.priority === 'normal'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
          }`}
        >
          {row.original.priority}
        </span>
      ),
    },
    {
      id: 'timestamp',
      header: 'Time',
      accessorKey: 'timestamp',
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Clock className="w-3 h-3" />
          {new Date(row.original.timestamp).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <div
            className={`w-2 h-2 rounded-full ${!row.original.read ? 'bg-blue-500' : 'bg-gray-300'}`}
          />
          <span className="text-xs text-gray-500">{!row.original.read ? 'New' : 'Read'}</span>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => console.log('Reply to:', row.original)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            title="Reply"
          >
            <Send className="w-4 h-4" />
          </button>
          <button
            onClick={() => console.log('Forward:', row.original)}
            className="p-1 text-green-600 hover:bg-green-50 rounded"
            title="Forward"
          >
            <Send className="w-4 h-4 transform rotate-45" />
          </button>
          <button
            onClick={() => console.log('Archive:', row.original)}
            className="p-1 text-gray-600 hover:bg-gray-50 rounded"
            title="Archive"
          >
            <Archive className="w-4 h-4" />
          </button>
        </div>
      ),
      enableSorting: false,
      size: 120,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">Manage your communications</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Send className="w-4 h-4" />
            Compose
          </button>
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Mark All Read
          </button>
        </div>
      </div>

      {/* Message Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inbox</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inbox}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <Inbox className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-red-600">{stats.unread}</p>
            </div>
            <div className="bg-red-100 p-2 rounded-full">
              <MessageCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Starred</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.starred}</p>
            </div>
            <div className="bg-yellow-100 p-2 rounded-full">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Archived</p>
              <p className="text-2xl font-bold text-gray-600">{stats.archived}</p>
            </div>
            <div className="bg-gray-100 p-2 rounded-full">
              <Archive className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`border-b-2 py-2 px-1 text-sm font-medium ${
              activeTab === 'all'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('all')}
          >
            All Messages
          </button>
          <button
            className={`border-b-2 py-2 px-1 text-sm font-medium ${
              activeTab === 'inbox'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('inbox')}
          >
            Inbox
          </button>
          <button
            className={`border-b-2 py-2 px-1 text-sm font-medium ${
              activeTab === 'sent'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('sent')}
          >
            Sent
          </button>
          <button
            className={`border-b-2 py-2 px-1 text-sm font-medium ${
              activeTab === 'starred'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('starred')}
          >
            Starred
          </button>
          <button
            className={`border-b-2 py-2 px-1 text-sm font-medium ${
              activeTab === 'archived'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('archived')}
          >
            Archive
          </button>
        </nav>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading messages...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <p className="text-red-600 text-lg">{error}</p>
              <button
                onClick={fetchMessages}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <DataTable
            data={messages}
            columns={columns}
            searchPlaceholder="Search messages..."
            onEdit={(message: Message) => console.log('Edit message:', message)}
            onDelete={(message: Message) => console.log('Delete message:', message)}
            onView={(message: Message) => console.log('View message:', message)}
          />
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Send className="w-5 h-5 text-blue-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Send Announcement</div>
              <div className="text-sm text-gray-500">Broadcast to all users</div>
            </div>
          </button>

          <button className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <MessageCircle className="w-5 h-5 text-green-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Parent Update</div>
              <div className="text-sm text-gray-500">Send to all parents</div>
            </div>
          </button>

          <button className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Archive className="w-5 h-5 text-purple-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Clean Archive</div>
              <div className="text-sm text-gray-500">Manage old messages</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
