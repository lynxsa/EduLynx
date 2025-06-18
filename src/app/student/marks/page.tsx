import React, { Suspense } from 'react';

// Placeholder for marks API (implement /api/results as needed)
async function fetchMarks() {
  const res = await fetch('/api/results', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch marks');
  return res.json();
}

function MarksTable({ marks }: { marks: any[] }) {
  if (!marks.length) return <div className="text-gray-500">No marks found.</div>;
  return (
    <table className="min-w-full border mt-4">
      <thead>
        <tr>
          <th className="border px-2 py-1">ID</th>
          <th className="border px-2 py-1">Subject</th>
          <th className="border px-2 py-1">Score</th>
        </tr>
      </thead>
      <tbody>
        {marks.map((m) => (
          <tr key={m.id}>
            <td className="border px-2 py-1">{m.id}</td>
            <td className="border px-2 py-1">{m.subjectId}</td>
            <td className="border px-2 py-1">{m.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function StudentMarksPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Marks</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <MarksList />
      </Suspense>
    </div>
  );
}

async function MarksList() {
  let marks: any[] = [];
  let error = null;
  try {
    marks = await fetchMarks();
  } catch (e: any) {
    error = e.message;
  }
  if (error) return <div className="text-red-500">Error: {error}</div>;
  return <MarksTable marks={marks} />;
}
