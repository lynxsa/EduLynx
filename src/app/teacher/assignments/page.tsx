import React, { Suspense } from 'react';

async function fetchAssignments() {
  const res = await fetch('/api/assignments', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch assignments');
  return res.json();
}

function AssignmentsTable({ assignments }: { assignments: any[] }) {
  if (!assignments.length) return <div className="text-gray-500">No assignments found.</div>;
  return (
    <table className="min-w-full border mt-4">
      <thead>
        <tr>
          <th className="border px-2 py-1">ID</th>
          <th className="border px-2 py-1">Title</th>
          <th className="border px-2 py-1">Due Date</th>
        </tr>
      </thead>
      <tbody>
        {assignments.map((a) => (
          <tr key={a.id}>
            <td className="border px-2 py-1">{a.id}</td>
            <td className="border px-2 py-1">{a.title}</td>
            <td className="border px-2 py-1">{a.dueDate?.slice(0, 10)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function TeacherAssignmentsPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Assignments</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <AssignmentsList />
      </Suspense>
    </div>
  );
}

async function AssignmentsList() {
  let assignments: any[] = [];
  let error = null;
  try {
    assignments = await fetchAssignments();
  } catch (e: any) {
    error = e.message;
  }
  if (error) return <div className="text-red-500">Error: {error}</div>;
  return <AssignmentsTable assignments={assignments} />;
}
