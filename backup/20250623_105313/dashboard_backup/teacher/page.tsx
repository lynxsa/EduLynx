'use client';
import DashboardCard from '@/components/DashboardCard';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import GenderPieChart from '@/components/GenderPieChart';
import PassRateSubjectBarChart from '@/components/PassRateSubjectBarChart';
import Table from '@/components/Table';
import TopClassesBarChart from '@/components/TopClassesBarChart';
import { useEffect, useState } from 'react';

interface TeacherMetrics {
  totalAssignments: number;
  totalExams: number;
  totalStudents: number;
  attendancePercentage: number;
  totalSubjects?: number;
  totalClasses?: number;
}

const TeacherPage = () => {
  const [metrics, setMetrics] = useState<TeacherMetrics>({
    totalAssignments: 0,
    totalExams: 0,
    totalStudents: 0,
    attendancePercentage: 0,
    totalSubjects: 0,
    totalClasses: 0,
  });
  const [upcomingLessons, setUpcomingLessons] = useState<any[]>([]);
  const [teacher, setTeacher] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: Replace with real teacherId from session/cookie
        const response = await fetch('/api/dashboard/teacher?teacherId=teacher1');
        if (response.ok) {
          const data = await response.json();
          setMetrics(data.metrics);
          setUpcomingLessons(data.upcomingLessons || []);
          setTeacher(data.teacher);
          setStudents(data.students || []);
        }
      } catch (error) {
        console.error('Failed to fetch teacher data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Example data for charts (replace with real API data as available)
  const genderPieData = [
    {
      id: 'Male',
      label: 'Male',
      value: students.filter(s => s.gender === 'Male').length,
      color: '#2563eb',
    },
    {
      id: 'Female',
      label: 'Female',
      value: students.filter(s => s.gender === 'Female').length,
      color: '#f472b6',
    },
  ];
  const passRatePerSubject: { subject: string; passRate: number }[] = [];
  const topClasses: { className: string; avgScore: number }[] = [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-lg text-gray-600">Loading teacher dashboard...</span>
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
          <DashboardCard title="Students" value={metrics.totalStudents} />
          <DashboardCard title="Attendance (%)" value={metrics.attendancePercentage + '%'} />
        </div>
        {/* Row 2: Gender, Pass Rate, Top Classes */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <DashboardCard
            title="Gender Ratio"
            value={genderPieData[0].value + ':' + genderPieData[1].value}
          >
            <GenderPieChart data={genderPieData} />
          </DashboardCard>
          <DashboardCard title="Pass Rate by Subject" value={''}>
            <PassRateSubjectBarChart data={passRatePerSubject} />
          </DashboardCard>
          <DashboardCard title="Top Classes" value={''}>
            <TopClassesBarChart data={topClasses} />
          </DashboardCard>
        </div>
        {/* Row 3: Upcoming Lessons */}
        <div className="col-span-1 md:col-span-2 lg:col-span-4">
          <DashboardCard title="Upcoming Lessons" value={''}>
            <ul className="bg-white rounded shadow p-4">
              {(upcomingLessons || []).length === 0 && (
                <li className="text-gray-400">No upcoming lessons.</li>
              )}
              {(upcomingLessons || []).map((lesson, idx) => (
                <li key={lesson.id || idx} className="mb-2">
                  <span className="font-semibold">{lesson.name}</span> &mdash; {lesson.class?.name}{' '}
                  ({lesson.subject?.name})<br />
                  <span className="text-xs text-gray-500">
                    {lesson.startTime ? new Date(lesson.startTime).toLocaleString() : ''}
                  </span>
                </li>
              ))}
            </ul>
          </DashboardCard>
        </div>
        {/* Row 4: Student Health & Medical Info */}
        <div className="col-span-1 md:col-span-2 lg:col-span-4">
          <DashboardCard title="Student Health & Medical Info" value={''}>
            <Table
              columns={[
                { header: 'Name', accessor: 'name' },
                { header: 'Class', accessor: 'class' },
                { header: 'Grade', accessor: 'grade' },
                { header: 'Gender', accessor: 'gender' },
                { header: 'Blood Type', accessor: 'bloodType' },
                { header: 'Allergies', accessor: 'allergies' },
                { header: 'Medical Info', accessor: 'medicalInfo' },
                { header: 'Special Needs', accessor: 'specialNeeds' },
                { header: 'Emergency Contact', accessor: 'emergencyContactName' },
                { header: 'Emergency Phone', accessor: 'emergencyContactPhone' },
                { header: 'Status', accessor: 'status' },
              ]}
              data={students.map(s => ({
                name: s.name + ' ' + s.surname,
                class: s.class?.name || '--',
                grade: s.grade?.level || '--',
                gender: s.gender,
                bloodType: s.bloodType,
                allergies: s.allergies || '--',
                medicalInfo: s.medicalInfo || '--',
                specialNeeds: s.specialNeeds || '--',
                emergencyContactName: s.emergencyContactName || '--',
                emergencyContactPhone: s.emergencyContactPhone || '--',
                status: s.status || '--',
              }))}
              renderRow={item => (
                <tr key={item.name + item.class}>
                  <td>{item.name}</td>
                  <td>{item.class}</td>
                  <td>{item.grade}</td>
                  <td>{item.gender}</td>
                  <td>{item.bloodType}</td>
                  <td>{item.allergies}</td>
                  <td>{item.medicalInfo}</td>
                  <td>{item.specialNeeds}</td>
                  <td>{item.emergencyContactName}</td>
                  <td>{item.emergencyContactPhone}</td>
                  <td>{item.status}</td>
                </tr>
              )}
            />
          </DashboardCard>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default TeacherPage;
