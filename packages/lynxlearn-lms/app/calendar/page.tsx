'use client';

import { Card } from '@edulynx/ui-primitives';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { useState } from 'react';
import { eventsData } from './data';

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // generate all calendar days (including leading/trailing)
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);
  const daysInMonth = eachDayOfInterval({ start: calStart, end: calEnd });

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handleSelectDate = (date: Date) => setSelectedDate(date);

  const selectedKey = format(selectedDate, 'yyyy-MM-dd');
  const selectedDateEvents = eventsData[selectedKey] || [];
  const formattedSelectedDate = format(selectedDate, 'EEEE, MMMM d, yyyy');

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Calendar</h1>
        <div className="flex items-center space-x-3">
          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="month">Month View</option>
            <option value="week">Week View</option>
            <option value="day">Day View</option>
            <option value="agenda">Agenda</option>
          </select>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
            Add Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="md:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex space-x-4 items-center">
                <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <h2 className="text-xl font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
                <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              <div>
                <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                  Today
                </button>
              </div>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day names */}
              {dayNames.map((day, i) => (
                <div key={i} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}

              {/* Days */}
              {daysInMonth.map(day => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                const isToday = isSameDay(day, new Date());
                const isSelected = isSameDay(day, selectedDate);
                const eventsCount = eventsData[dateStr]?.length || 0;
                return (
                  <div
                    key={dateStr}
                    onClick={() => isCurrentMonth && handleSelectDate(day)}
                    className={`
                      aspect-square flex flex-col rounded-lg p-2 border cursor-pointer
                      ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}
                      ${isSelected ? 'border-blue-500 ring-1 ring-blue-200' : 'border-gray-100 hover:border-blue-200'}
                      ${isToday ? 'bg-blue-50' : ''}
                    `}
                  >
                    <span className={`text-sm ${isToday ? 'font-bold' : ''}`}>
                      {format(day, 'd')}
                    </span>
                    {eventsCount > 0 && (
                      <div className="mt-auto">
                        <div className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full text-center">
                          {eventsCount} {eventsCount === 1 ? 'event' : 'events'}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Events for selected date */}
        <div className="md:col-span-1">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-1">{formattedSelectedDate}</h3>
            <p className="text-sm text-gray-500 mb-4">
              {selectedDateEvents.length} {selectedDateEvents.length === 1 ? 'event' : 'events'}
            </p>

            <div className="space-y-3">
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map(event => (
                  <div
                    key={event.id}
                    className="p-3 rounded-lg border border-gray-100 hover:border-blue-200"
                  >
                    <div className="flex items-start">
                      <div
                        className={`
                        w-2 h-2 rounded-full mt-1.5 mr-2
                        ${event.type === 'class' ? 'bg-blue-500' : ''}
                        ${event.type === 'lab' ? 'bg-purple-500' : ''}
                        ${event.type === 'assignment' ? 'bg-red-500' : ''}
                        ${event.type === 'test' ? 'bg-yellow-500' : ''}
                        ${event.type === 'quiz' ? 'bg-orange-500' : ''}
                        ${event.type === 'meeting' ? 'bg-green-500' : ''}
                      `}
                      ></div>
                      <div className="flex-1">
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-gray-500">{event.time}</p>
                        <div className="mt-2 flex items-center">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              event.type === 'class'
                                ? 'bg-blue-100 text-blue-800'
                                : event.type === 'lab'
                                  ? 'bg-purple-100 text-purple-800'
                                  : event.type === 'assignment'
                                    ? 'bg-red-100 text-red-800'
                                    : event.type === 'test'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : event.type === 'quiz'
                                        ? 'bg-orange-100 text-orange-800'
                                        : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p>No events scheduled for this day</p>
                  <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">
                    + Add New Event
                  </button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
