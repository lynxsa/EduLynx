import React, { Suspense } from 'react';

async function fetchQuizzes() {
  const res = await fetch('/api/quizzes', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch quizzes');
  return res.json();
}

function QuizzesTable({ quizzes }: { quizzes: any[] }) {
  if (!quizzes.length) return <div className="text-gray-500">No quizzes found.</div>;
  return (
    <table className="min-w-full border mt-4">
      <thead>
        <tr>
          <th className="border px-2 py-1">ID</th>
          <th className="border px-2 py-1">Title</th>
          <th className="border px-2 py-1">Start</th>
          <th className="border px-2 py-1">End</th>
        </tr>
      </thead>
      <tbody>
        {quizzes.map((q) => (
          <tr key={q.id}>
            <td className="border px-2 py-1">{q.id}</td>
            <td className="border px-2 py-1">{q.title}</td>
            <td className="border px-2 py-1">{q.startDate?.slice(0, 10)}</td>
            <td className="border px-2 py-1">{q.endDate?.slice(0, 10)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function StudentQuizzesPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Quizzes</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <QuizzesList />
      </Suspense>
    </div>
  );
}

async function QuizzesList() {
  let quizzes: any[] = [];
  let error = null;
  try {
    quizzes = await fetchQuizzes();
  } catch (e: any) {
    error = e.message;
  }
  if (error) return <div className="text-red-500">Error: {error}</div>;
  return <QuizzesTable quizzes={quizzes} />;
}
