'use client';
import type { Announcement as AnnouncementType } from '@/components/Announcement';
import Announcements from '@/components/Announcement';
import DashboardCard from '@/components/DashboardCard';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import type { EventItem as EventItemType } from '@/components/EventCalendar';
import GenderPieChart from '@/components/GenderPieChart';
import PassRateSubjectBarChart from '@/components/PassRateSubjectBarChart';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const BigCalendar = dynamic(() => import('@/components/BigCalendar'), { ssr: false });
const EventCalendar = dynamic(() => import('@/components/EventCalendar'), { ssr: false });

const StudentPage = () => {
  const [metrics, setMetrics] = useState({
    totalAssignments: 0,
    totalExams: 0,
    attendancePercentage: 0,
    totalResults: 0,
    className: '',
  });
  const [upcomingAssignments, setUpcomingAssignments] = useState<any[]>([]);
  const [recentResults, setRecentResults] = useState<any[]>([]);
  const [student, setStudent] = useState<any>(null);
  const [events, setEvents] = useState<EventItemType[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: Replace with real studentId from session/cookie
        const response = await fetch('/api/dashboard/student?studentId=student1');
        if (response.ok) {
          const data = await response.json();
          setMetrics(data.metrics);
          setUpcomingAssignments(data.upcomingAssignments || []);
          setRecentResults(data.recentResults || []);
          setStudent(data.student);
          setEvents(
            (data.events || []).map((event: any) => ({
              ...event,
              time:
                event.time ??
                (event.startTime
                  ? new Date(event.startTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : ''),
              description: event.description ?? '',
            }))
          );
          setAnnouncements(
            (data.announcements || []).map((a: any) => ({
              ...a,
              time:
                a.time ??
                (a.date
                  ? new Date(a.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : ''),
              description: a.description ?? '',
            }))
          );
        }
      } catch (error) {
        console.error('Failed to fetch student data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Example data for charts (replace with real API data as available)
  const genderPieData = [
    { id: 'Male', label: 'Male', value: student?.gender === 'Male' ? 1 : 0, color: '#2563eb' },
    {
      id: 'Female',
      label: 'Female',
      value: student?.gender === 'Female' ? 1 : 0,
      color: '#f472b6',
    },
  ];
  const passRatePerSubject: { subject: string; passRate: number }[] = [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-lg text-gray-600">Loading student dashboard...</span>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {/* Row 1: Key Metrics */}
        <div className="col-span-1 md:col-span-2 lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <DashboardCard title="Assignments" value={metrics.totalAssignments} />
          <DashboardCard title="Exams" value={metrics.totalExams} />
          <DashboardCard title="Attendance (%)" value={metrics.attendancePercentage + '%'} />
          <DashboardCard title="Results" value={metrics.totalResults} />
        </div>
        {/* Row 2: Gender, Pass Rate by Subject */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <DashboardCard
            title="Gender Ratio"
            value={genderPieData[0].value + ':' + genderPieData[1].value}
          >
            <GenderPieChart data={genderPieData} />
          </DashboardCard>
          <DashboardCard title="Pass Rate by Subject" value={''}>
            <PassRateSubjectBarChart data={passRatePerSubject} />
          </DashboardCard>
        </div>
        {/* Row 3: Announcements & Events */}
        <div className="col-span-1 md:col-span-2 lg:col-span-4">
          <DashboardCard title="Announcements & Events" value={''}>
            <Announcements announcements={announcements} />
            <EventCalendar events={events} />
          </DashboardCard>
        </div>
        {/* Row 4: Progress Overview */}
        <div className="col-span-1 md:col-span-2 lg:col-span-4">
          <DashboardCard title="Progress Overview" value={''}>
            <div className="h-40 flex items-center justify-center text-gray-400">
              [Charts coming soon]
            </div>
          </DashboardCard>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default StudentPage;
