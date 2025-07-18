'use client';

import { addWeeks, eachDayOfInterval, endOfWeek, format, startOfWeek, subWeeks } from 'date-fns';
import { BookOpen, Calendar, ChevronLeft, ChevronRight, Clock, MapPin, User } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Lesson {
  id: number;
  name?: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: {
    name: string;
    id: number;
  };
  class: {
    name: string;
    id: number;
    roomNumber?: string;
  };
  teacher: {
    name: string;
    surname: string;
    id: string;
  };
}

interface TimetableProps {
  teacherId?: string;
  classId?: number;
  view?: 'day' | 'week';
  showControls?: boolean;
}

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
const TIME_SLOTS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
];

export default function ModernTimetable({
  teacherId,
  classId,
  view = 'week',
  showControls = true,
}: TimetableProps) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<'day' | 'week'>(view);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true);
        let endpoint = '/api/lessons';
        const params = new URLSearchParams();

        if (teacherId) params.append('teacherId', teacherId);
        if (classId) params.append('classId', classId.toString());

        if (params.toString()) {
          endpoint += `?${params.toString()}`;
        }

        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('Failed to fetch timetable');

        const data = await response.json();
        setLessons(data.lessons || data || []);
      } catch (error) {
        console.error('Error fetching timetable:', error);
        setLessons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, [teacherId, classId]);

  const getWeekDays = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end }).filter(day => day.getDay() >= 1 && day.getDay() <= 5);
  };

  const getLessonsForDay = (day: string) => {
    return lessons.filter(lesson => lesson.day === day.toUpperCase());
  };

  const formatTime = (timeString: string) => {
    try {
      // Handle both ISO datetime and time-only strings
      if (timeString.includes('T') || timeString.includes('Z')) {
        // It's an ISO datetime string
        const date = new Date(timeString);
        return format(date, 'HH:mm');
      } else {
        // It's a time-only string like "08:00:00"
        const [hours, minutes] = timeString.split(':');
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
      }
    } catch {
      return timeString;
    }
  };

  const getTimeSlotPosition = (startTime: string, endTime: string) => {
    const start = formatTime(startTime);
    const end = formatTime(endTime);
    const startHour = parseInt(start.split(':')[0]);
    const endHour = parseInt(end.split(':')[0]);
    const startMinutes = parseInt(start.split(':')[1]);
    const endMinutes = parseInt(end.split(':')[1]);

    const startPosition = (startHour - 8) * 60 + startMinutes;
    const duration = (endHour - startHour) * 60 + (endMinutes - startMinutes);

    return {
      top: `${(startPosition / 60) * 4}rem`,
      height: `${(duration / 60) * 4}rem`,
    };
  };

  const LessonCard = ({ lesson }: { lesson: Lesson }) => {
    const position = getTimeSlotPosition(lesson.startTime, lesson.endTime);

    return (
      <div
        className="absolute left-1 right-1 bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-r-lg p-2 shadow-sm hover:shadow-md transition-shadow duration-200"
        style={position}
      >
        <div className="space-y-1">
          <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">
            {lesson.subject.name}
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{lesson.class.name}</p>
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
            <Clock className="w-3 h-3" />
            <span>
              {formatTime(lesson.startTime)} - {formatTime(lesson.endTime)}
            </span>
          </div>
          {lesson.class.roomNumber && (
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
              <MapPin className="w-3 h-3" />
              <span>Room {lesson.class.roomNumber}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const WeekView = () => {
    const weekDays = getWeekDays();

    return (
      <div className="grid grid-cols-6 gap-2">
        {/* Time column */}
        <div className="space-y-4">
          <div className="h-12 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-400">
            Time
          </div>
          {TIME_SLOTS.map(time => (
            <div
              key={time}
              className="h-16 flex items-center justify-center text-sm text-gray-500 dark:text-gray-500"
            >
              {time}
            </div>
          ))}
        </div>

        {/* Days columns */}
        {weekDays.map(day => {
          const dayName = format(day, 'EEEE').toUpperCase();
          const dayLessons = getLessonsForDay(dayName);

          return (
            <div key={day.toISOString()} className="space-y-4">
              <div className="h-12 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {format(day, 'EEE')}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{format(day, 'dd')}</div>
              </div>

              <div className="relative" style={{ height: `${TIME_SLOTS.length * 4}rem` }}>
                {/* Time grid lines */}
                {TIME_SLOTS.map((_, index) => (
                  <div
                    key={index}
                    className="absolute left-0 right-0 border-t border-gray-200 dark:border-gray-700"
                    style={{ top: `${index * 4}rem` }}
                  />
                ))}

                {/* Lessons */}
                {dayLessons.map(lesson => (
                  <LessonCard key={lesson.id} lesson={lesson} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const DayView = () => {
    const dayName = format(currentDate, 'EEEE').toUpperCase();
    const dayLessons = getLessonsForDay(dayName);

    return (
      <div className="max-w-2xl mx-auto">
        <div className="grid grid-cols-2 gap-4">
          {/* Time column */}
          <div className="space-y-4">
            <div className="h-16 flex items-center justify-center text-lg font-medium text-gray-900 dark:text-white">
              {format(currentDate, 'EEEE, MMMM d')}
            </div>
            {TIME_SLOTS.map(time => (
              <div
                key={time}
                className="h-20 flex items-center justify-center text-sm text-gray-500 dark:text-gray-500"
              >
                {time}
              </div>
            ))}
          </div>

          {/* Lessons column */}
          <div className="space-y-4">
            <div className="h-16 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-400">
              Schedule
            </div>

            <div className="relative" style={{ height: `${TIME_SLOTS.length * 5}rem` }}>
              {/* Time grid lines */}
              {TIME_SLOTS.map((_, index) => (
                <div
                  key={index}
                  className="absolute left-0 right-0 border-t border-gray-200 dark:border-gray-700"
                  style={{ top: `${index * 5}rem` }}
                />
              ))}

              {/* Lessons */}
              {dayLessons.map(lesson => (
                <div
                  key={lesson.id}
                  className="absolute left-1 right-1 bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-r-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-200"
                  style={{
                    top: getTimeSlotPosition(lesson.startTime, lesson.endTime).top,
                    height: getTimeSlotPosition(lesson.startTime, lesson.endTime).height,
                  }}
                >
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {lesson.subject.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{lesson.class.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>
                        {formatTime(lesson.startTime)} - {formatTime(lesson.endTime)}
                      </span>
                    </div>
                    {lesson.class.roomNumber && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>Room {lesson.class.roomNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                      <User className="w-4 h-4" />
                      <span>
                        {lesson.teacher.name} {lesson.teacher.surname}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
      {showControls && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Timetable
              </h2>

              {/* View Toggle */}
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setCurrentView('day')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    currentView === 'day'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Day
                </button>
                <button
                  onClick={() => setCurrentView('week')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    currentView === 'week'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Week
                </button>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setCurrentDate(
                    currentView === 'week'
                      ? subWeeks(currentDate, 1)
                      : new Date(currentDate.getTime() - 24 * 60 * 60 * 1000)
                  )
                }
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="text-sm font-medium text-gray-900 dark:text-white min-w-32 text-center">
                {currentView === 'week'
                  ? `${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM d')} - ${format(endOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM d, yyyy')}`
                  : format(currentDate, 'MMMM d, yyyy')}
              </div>

              <button
                onClick={() =>
                  setCurrentDate(
                    currentView === 'week'
                      ? addWeeks(currentDate, 1)
                      : new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
                  )
                }
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4">
        {lessons.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No lessons scheduled</p>
          </div>
        ) : currentView === 'week' ? (
          <WeekView />
        ) : (
          <DayView />
        )}
      </div>
    </div>
  );
}
