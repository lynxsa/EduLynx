'use client';
import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import React from 'react';
import Image from 'next/image';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export interface EventItem {
  id: number;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  classId?: number;
}

interface EventCalendarProps {
  events?: EventItem[];
  schoolId?: number;
  classId?: number;
}

const EventCalendar = ({ events = [], schoolId, classId }: EventCalendarProps) => {
  const [value, onChange] = useState<Value>(new Date());
  const [calendarEvents, setCalendarEvents] = useState<EventItem[]>(events);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (schoolId) params.append('schoolId', schoolId.toString());
        if (classId) params.append('classId', classId.toString());

        const response = await fetch(`/api/events?${params.toString()}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }

        const data = await response.json();
        if (data.success) {
          // Convert date strings to Date objects
          const formattedEvents = data.data.map((event: any) => ({
            ...event,
            startTime: new Date(event.startTime),
            endTime: new Date(event.endTime),
          }));
          setCalendarEvents(formattedEvents);
        } else {
          setError(data.error || 'Failed to load events');
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have events prop (use as fallback) or need to fetch from API
    if (events.length === 0) {
      fetchEvents();
    }
  }, [schoolId, classId, events.length]);

  // Format time for display
  const formatTime = (startTime: Date, endTime: Date) => {
    const formatOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };

    return `${startTime.toLocaleTimeString('en-US', formatOptions)} - ${endTime.toLocaleTimeString('en-US', formatOptions)}`;
  };

  // Check if event is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Get events for today or upcoming events
  const getDisplayEvents = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return calendarEvents
      .filter(event => {
        const eventDate = new Date(
          event.startTime.getFullYear(),
          event.startTime.getMonth(),
          event.startTime.getDate()
        );
        return eventDate >= today;
      })
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
      .slice(0, 5); // Show only next 5 events
  };

  const displayEvents = getDisplayEvents();

  return (
    <div className="bg-white p-4 rounded-2xl">
      <Calendar
        onChange={onChange}
        value={value}
        className="w-full"
        tileClassName={({ date }) => {
          // Highlight dates with events
          const hasEvent = calendarEvents.some(event => {
            const eventDate = new Date(
              event.startTime.getFullYear(),
              event.startTime.getMonth(),
              event.startTime.getDate()
            );
            return eventDate.toDateString() === date.toDateString();
          });
          return hasEvent ? 'has-event' : '';
        }}
      />

      <div className="flex items-center justify-between mt-6">
        <h1 className="text-xl font-semibold">Events</h1>
        <Image src="/moreDark.png" alt="More" width={20} height={20} />
      </div>

      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mt-4">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4 mt-4">
        {displayEvents.length === 0 && !loading ? (
          <div className="text-center py-8 text-gray-500">
            <p>No upcoming events</p>
          </div>
        ) : (
          displayEvents.map((event, index) => (
            <div
              className={`p-5 rounded-md border-2 border-gray-100 border-t-4 text-xs
                                ${index % 2 === 0 ? 'border-t-blue-500' : 'border-t-purple-500'}
                                ${isToday(event.startTime) ? 'bg-blue-50' : ''}
                            `}
              key={event.id}
            >
              <div className="flex items-center justify-between">
                <h1 className="font-semibold text-gray-600">{event.title}</h1>
                <span className="text-xs text-gray-400">
                  {formatTime(event.startTime, event.endTime)}
                </span>
              </div>
              <p className="mt-2 text-gray-600 text-sm">{event.description}</p>
              {isToday(event.startTime) && (
                <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  Today
                </span>
              )}
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        :global(.has-event) {
          background-color: #dbeafe !important;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default EventCalendar;
