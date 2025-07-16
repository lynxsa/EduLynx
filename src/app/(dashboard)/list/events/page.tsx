'use client';

import { ModernTable } from '@/components/ui/ModernTable';
import { Calendar, Clock, GraduationCap, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

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
  const [totalEvents, setTotalEvents] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log('🔄 [Admin Events] Fetching live events data...');
        setLoading(true);
        setError(null);

        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();

        console.log('✅ [Admin Events] API Response:', data);
        console.log(`✅ [Admin Events] Loaded ${data.length} events from database`);

        setEvents(data);
        setTotalEvents(data.length);

        // Calculate upcoming events
        const now = new Date();
        const upcoming = data.filter((event: EventRow) => new Date(event.startTime) > now).length;
        setUpcomingEvents(upcoming);

        setLoading(false);
      } catch (err) {
        console.error('❌ [Admin Events] Error fetching events:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-semibold text-gray-900">{totalEvents}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
              <p className="text-2xl font-semibold text-gray-900">{upcomingEvents}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Past Events</p>
              <p className="text-2xl font-semibold text-gray-900">{totalEvents - upcomingEvents}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-semibold text-gray-900">
                {
                  events.filter(event => {
                    const eventDate = new Date(event.startTime);
                    const now = new Date();
                    return (
                      eventDate.getMonth() === now.getMonth() &&
                      eventDate.getFullYear() === now.getFullYear()
                    );
                  }).length
                }
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

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
