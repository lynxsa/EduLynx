'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface SubjectDetail {
  id: string;
  name: string;
  code?: string;
  teacher?: { name: string } | null;
  teacherId?: string;
}

export default function SubjectDetailPage() {
  const { id } = useParams();
  const [subject, setSubject] = useState<SubjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/subjects?id=${id}`)
      .then(async res => {
        if (!res.ok) throw new Error('Failed to fetch subject');
        return res.json();
      })
      .then(data => {
        setSubject(data);
        setError(null);
      })
      .catch(err => {
        setError(err.message);
        setSubject(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!subject) return <div className="p-8 text-center">Subject not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4">Subject Details</h1>
      <div className="space-y-2">
        <div>
          <span className="font-semibold">ID:</span> {subject.id}
        </div>
        <div>
          <span className="font-semibold">Name:</span> {subject.name}
        </div>
        <div>
          <span className="font-semibold">Code:</span> {subject.code || '-'}
        </div>
        <div>
          <span className="font-semibold">Teacher:</span>{' '}
          {subject.teacher?.name || subject.teacherId || '-'}
        </div>
      </div>
      {/* Future: Edit/Delete buttons here */}
    </div>
  );
}
