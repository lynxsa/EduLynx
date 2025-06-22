import React, { Suspense } from 'react';

async function fetchAttendance() {
  const res = await fetch('/api/attendance', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch attendance');
  return res.json();
}

function AttendanceTable({ attendance }: { attendance: any[] }) {
  if (!attendance.length) return <div className="text-gray-500">No attendance records found.</div>;
  return (
    <table className="min-w-full border mt-4">
      <thead>
        <tr>
          <th className="border px-2 py-1">ID</th>
          <th className="border px-2 py-1">Student</th>
          <th className="border px-2 py-1">Lesson</th>
          <th className="border px-2 py-1">Present</th>
        </tr>
      </thead>
      <tbody>
        {attendance.map(a => (
          <tr key={a.id}>
            <td className="border px-2 py-1">{a.id}</td>
            <td className="border px-2 py-1">{a.studentId}</td>
            <td className="border px-2 py-1">{a.lessonId}</td>
            <td className="border px-2 py-1">{a.present ? 'Yes' : 'No'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function TeacherAttendancePage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Attendance</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <AttendanceList />
      </Suspense>
    </div>
  );
}

async function AttendanceList() {
  let attendance: any[] = [];
  let error = null;
  try {
    attendance = await fetchAttendance();
  } catch (e: any) {
    error = e.message;
  }
  if (error) return <div className="text-red-500">Error: {error}</div>;
  return <AttendanceTable attendance={attendance} />;
}
