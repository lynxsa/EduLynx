'use client';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface ClassDetail {
  id: string;
  name: string;
  teacher?: { name: string } | null;
  teacherId: string;
  // Add more fields as needed
}

export default function ClassDetailPage() {
  const { id } = useParams();
  const [classDetail, setClassDetail] = useState<ClassDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/classes?id=${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch class');
        return res.json();
      })
      .then((data) => {
        setClassDetail(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setClassDetail(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!classDetail) return <div className="p-8 text-center">Class not found.</div>;

  return (
    <ErrorBoundary>
      <div className="max-w-3xl mx-auto p-8 bg-white rounded shadow mt-8" role="main" aria-labelledby="class-detail-heading">
        <h1 id="class-detail-heading" className="text-2xl font-bold mb-4">Class Details</h1>
        <div className="space-y-2" role="region" aria-label="Class information">
          <div><span className="font-semibold">ID:</span> {classDetail.id}</div>
          <div><span className="font-semibold">Name:</span> {classDetail.name}</div>
          <div><span className="font-semibold">Teacher:</span> {classDetail.teacher?.name || classDetail.teacherId}</div>
        </div>
        {/* Future: Edit/Delete buttons here */}
      </div>
    </ErrorBoundary>
  );
}
