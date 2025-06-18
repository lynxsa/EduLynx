import React, { Suspense } from 'react';

async function fetchClasses() {
  const res = await fetch('/api/classes', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch classes');
  return res.json();
}

function ClassesTable({ classes }: { classes: any[] }) {
  if (!classes.length) return <div className="text-gray-500">No classes found.</div>;
  return (
    <table className="min-w-full border mt-4">
      <thead>
        <tr>
          <th className="border px-2 py-1">ID</th>
          <th className="border px-2 py-1">Name</th>
          <th className="border px-2 py-1">Grade</th>
        </tr>
      </thead>
      <tbody>
        {classes.map((c) => (
          <tr key={c.id}>
            <td className="border px-2 py-1">{c.id}</td>
            <td className="border px-2 py-1">{c.name}</td>
            <td className="border px-2 py-1">{c.gradeId}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function TeacherClassesPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Classes</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <ClassesList />
      </Suspense>
    </div>
  );
}

async function ClassesList() {
  let classes: any[] = [];
  let error = null;
  try {
    classes = await fetchClasses();
  } catch (e: any) {
    error = e.message;
  }
  if (error) return <div className="text-red-500">Error: {error}</div>;
  return <ClassesTable classes={classes} />;
}
