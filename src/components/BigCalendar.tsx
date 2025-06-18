"use client"
import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar';
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState, useEffect } from 'react';

interface BigCalendarProps {
  teacherId?: string;
  studentId?: string;
}

const localizer = momentLocalizer(moment);

const BigCalendar = ({ teacherId, studentId }: BigCalendarProps) => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    let url = "/api/lessons";
    if (teacherId) url += `?teacherId=${teacherId}`;
    if (studentId) url += `?studentId=${studentId}`;
    fetch(url)
      .then(res => res.json())
      .then(data => setEvents(data.data || []));
  }, [teacherId, studentId]);

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      views={["work_week", "day"]}
      view={view}
      style={{ height: "98%" }}
      onView={handleOnChangeView}
      min={new Date(2025, 1, 1, 8, 0, 0)}
      max={new Date(2025, 1, 1, 17, 0, 0)}
    />
  );
};

export default BigCalendar;