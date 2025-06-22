'use client';

import { useEffect, useState } from 'react';
import { ModernTable } from '@/components/ui/ModernTable';
import { Calendar, Clock, GraduationCap, MapPin } from 'lucide-react';

type EventRow = {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  description?: string;
  location?: string;
  class?: { name: string } | null;
};

const EventsPage = () => {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data.data || data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const columns = [
    {
      key: 'title',
      label: 'Event',
      sortable: true,
      render: (event: EventRow) => (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">{event.title}</div>
            {event.description && (
              <div className="text-sm text-gray-500 truncate max-w-xs">{event.description}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'class',
      label: 'Class',
      sortable: true,
      render: (event: EventRow) => (
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-900">{event.class?.name || 'All Classes'}</span>
        </div>
      ),
    },
    {
      key: 'startTime',
      label: 'Start Time',
      sortable: true,
      render: (event: EventRow) => {
        const date = new Date(event.startTime);
        return (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {date.toLocaleDateString('en-ZA')}
              </p>
              <p className="text-xs text-gray-500">
                {date.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'endTime',
      label: 'End Time',
      sortable: true,
      render: (event: EventRow) => {
        const date = new Date(event.endTime);
        return (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {date.toLocaleDateString('en-ZA')}
              </p>
              <p className="text-xs text-gray-500">
                {date.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'location',
      label: 'Location',
      sortable: true,
      render: (event: EventRow) => {
        if (!event.location) {
          return <span className="text-gray-500 text-sm">No location</span>;
        }

        return (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-900">{event.location}</span>
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
          <p className="mt-4 text-gray-600">Loading events...</p>
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
        data={events}
        columns={columns}
        title="Events"
        description="Manage school events and activities"
        searchableFields={['title', 'description', 'location', 'class.name']}
        onView={(event: EventRow) => {
          console.log('View event:', event);
          // Navigate to view page
        }}
        onEdit={(event: EventRow) => {
          console.log('Edit event:', event);
          // Navigate to edit page
        }}
        onDelete={(event: EventRow) => {
          if (window.confirm('Are you sure you want to delete this event?')) {
            console.log('Delete event:', event);
            // Handle delete
          }
        }}
      />
    </div>
  );
};

export default EventsPage;
