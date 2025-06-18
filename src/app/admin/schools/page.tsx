import React, { Suspense } from 'react';

async function fetchSchools() {
  const res = await fetch('/api/schools', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch schools');
  return res.json();
}

function SchoolsTable({ schools }: { schools: any[] }) {
  if (!schools.length) return <div className="text-gray-500">No schools found.</div>;
  return (
    <table className="min-w-full border mt-4">
      <thead>
        <tr>
          <th className="border px-2 py-1">ID</th>
          <th className="border px-2 py-1">Name</th>
          <th className="border px-2 py-1">City</th>
        </tr>
      </thead>
      <tbody>
        {schools.map((s) => (
          <tr key={s.id}>
            <td className="border px-2 py-1">{s.id}</td>
            <td className="border px-2 py-1">{s.name}</td>
            <td className="border px-2 py-1">{s.city}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function AdminSchoolsPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">All Schools</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <SchoolsList />
      </Suspense>
    </div>
  );
}

async function SchoolsList() {
  let schools: any[] = [];
  let error = null;
  try {
    schools = await fetchSchools();
  } catch (e: any) {
    error = e.message;
  }
  if (error) return <div className="text-red-500">Error: {error}</div>;
  return <SchoolsTable schools={schools} />;
}
