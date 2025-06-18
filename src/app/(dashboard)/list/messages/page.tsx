// Force dynamic rendering to prevent static generation issues with functions in columns
export const dynamic = 'force-dynamic';

import React from 'react';
import DataTable from '@/components/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { 
  MessageCircle, 
  Send, 
  Inbox, 
  Archive, 
  Star,
  Clock,
  User
} from 'lucide-react';

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

// Mock messages data
const messagesData: Message[] = [
  {
    id: '1',
    from: 'Dr. Sarah Johnson',
    to: 'Admin',
    subject: 'Grade 12 Final Exam Schedule',
    preview: 'Please review the proposed exam schedule for Grade 12 students...',
    timestamp: '2024-01-15 09:30',
    read: false,
    starred: true,
    priority: 'high',
    type: 'inbox'
  },
  {
    id: '2',
    from: 'Michael Chen',
    to: 'Admin',
    subject: 'Parent-Teacher Conference Request',
    preview: 'I would like to schedule a meeting to discuss my child\'s progress...',
    timestamp: '2024-01-14 14:15',
    read: true,
    starred: false,
    priority: 'normal',
    type: 'inbox'
  },
  {
    id: '3',
    from: 'Admin',
    to: 'All Teachers',
    subject: 'New Educational Policy Updates',
    preview: 'Please find attached the latest policy updates from the education department...',
    timestamp: '2024-01-14 11:00',
    read: true,
    starred: false,
    priority: 'normal',
    type: 'sent'
  },
  {
    id: '4',
    from: 'Lisa Anderson',
    to: 'Admin',
    subject: 'Student Absence Notification',
    preview: 'My daughter Emily will be absent from school due to medical appointment...',
    timestamp: '2024-01-13 16:45',
    read: true,
    starred: false,
    priority: 'low',
    type: 'inbox'
  },
  {
    id: '5',
    from: 'David Wilson',
    to: 'Admin',
    subject: 'Equipment Request for Science Lab',
    preview: 'We need to order new laboratory equipment for the upcoming semester...',
    timestamp: '2024-01-12 10:20',
    read: false,
    starred: true,
    priority: 'high',
    type: 'inbox'
  }
];

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
    size: 40
  },
  {
    accessorKey: 'from',
    header: 'From',
    cell: ({ row }) => (
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 font-medium text-sm">
            {row.original.from.split(' ').map((n: string) => n[0]).join('')}
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
    cell: ({ row }) => (
      <span className="text-sm text-gray-500">{row.original.timestamp}</span>
    ),
  },
];

const MessagesPage = () => {
  const columns: ColumnDef<Message>[] = [
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
      size: 40
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
          <span className={`font-medium ${!row.original.read ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
            {row.original.from}
          </span>
        </div>
      )
    },
    {
      id: 'subject',
      header: 'Subject',
      accessorKey: 'subject',
      cell: ({ row }) => (
        <div>
          <div className={`${!row.original.read ? 'font-bold text-gray-900' : 'text-gray-700'} mb-1`}>
            {row.original.subject}
          </div>
          <div className="text-sm text-gray-500 truncate max-w-xs">
            {row.original.preview}
          </div>
        </div>
      )
    },
    {
      id: 'priority',
      header: 'Priority',
      accessorKey: 'priority',
      cell: ({ row }) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          row.original.priority === 'high' 
            ? 'bg-red-100 text-red-800'
            : row.original.priority === 'normal'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {row.original.priority}
        </span>
      )
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
      )
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${
            !row.original.read ? 'bg-blue-500' : 'bg-gray-300'
          }`} />
          <span className="text-xs text-gray-500">
            {!row.original.read ? 'New' : 'Read'}
          </span>
        </div>
      )
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
      size: 120
    }
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
              <p className="text-2xl font-bold text-gray-900">12</p>
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
              <p className="text-2xl font-bold text-red-600">3</p>
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
              <p className="text-2xl font-bold text-yellow-600">2</p>
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
              <p className="text-2xl font-bold text-gray-600">8</p>
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
          <button className="border-b-2 border-blue-500 text-blue-600 py-2 px-1 text-sm font-medium">
            All Messages
          </button>
          <button className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-2 px-1 text-sm font-medium">
            Inbox
          </button>
          <button className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-2 px-1 text-sm font-medium">
            Sent
          </button>
          <button className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-2 px-1 text-sm font-medium">
            Starred
          </button>
          <button className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-2 px-1 text-sm font-medium">
            Archive
          </button>
        </nav>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <DataTable
          data={messagesData}
          columns={columns}
          searchPlaceholder="Search messages..."
          onEdit={(message: Message) => console.log('Edit message:', message)}
          onDelete={(message: Message) => console.log('Delete message:', message)}
          onView={(message: Message) => console.log('View message:', message)}
        />
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
