'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

interface ResultDetail {
  id: string;
  student?: { name: string } | null;
  studentId: string;
  class?: { name: string } | null;
  classId: string;
  subject?: { name: string } | null;
  subjectId: string;
  score: number;
  grade: string;
  date?: string | null;
}

export default function ResultDetailPage() {
  const { id } = useParams();
  const [result, setResult] = useState<ResultDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/results?id=${id}`)
      .then(async res => {
        if (!res.ok) throw new Error('Failed to fetch result');
        return res.json();
      })
      .then(data => {
        setResult(data);
        setError(null);
      })
      .catch(err => {
        setError(err.message);
        setResult(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!result) return <div className="p-8 text-center">Result not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4">Result Details</h1>
      <div className="space-y-2">
        <div>
          <span className="font-semibold">ID:</span> {result.id}
        </div>
        <div>
          <span className="font-semibold">Student:</span> {result.student?.name || result.studentId}
        </div>
        <div>
          <span className="font-semibold">Class:</span> {result.class?.name || result.classId}
        </div>
        <div>
          <span className="font-semibold">Subject:</span> {result.subject?.name || result.subjectId}
        </div>
        <div>
          <span className="font-semibold">Score:</span> {result.score}
        </div>
        <div>
          <span className="font-semibold">Grade:</span> {result.grade}
        </div>
        <div>
          <span className="font-semibold">Date:</span>{' '}
          {result.date ? new Date(result.date).toLocaleDateString() : '-'}
        </div>
      </div>
      {/* Future: Edit/Delete buttons here */}
    </div>
  );
}
