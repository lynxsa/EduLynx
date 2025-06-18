'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface QuizDetail {
  id: string;
  title: string;
  description?: string;
  class?: { name: string } | null;
  classId: string;
  teacher?: { name: string } | null;
  teacherId: string;
  questions?: any[];
}

export default function QuizDetailPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/quizzes?id=${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch quiz');
        return res.json();
      })
      .then((data) => {
        setQuiz(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setQuiz(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!quiz) return <div className="p-8 text-center">Quiz not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4">Quiz Details</h1>
      <div className="space-y-2">
        <div><span className="font-semibold">ID:</span> {quiz.id}</div>
        <div><span className="font-semibold">Title:</span> {quiz.title}</div>
        <div><span className="font-semibold">Description:</span> {quiz.description || '-'}</div>
        <div><span className="font-semibold">Class:</span> {quiz.class?.name || quiz.classId}</div>
        <div><span className="font-semibold">Teacher:</span> {quiz.teacher?.name || quiz.teacherId}</div>
        {/* Future: Render questions here */}
      </div>
      {/* Future: Edit/Delete buttons here */}
    </div>
  );
}
