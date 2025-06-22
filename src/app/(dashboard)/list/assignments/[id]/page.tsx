'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface AssignmentDetail {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  class?: { name: string } | null;
  classId: string;
  teacher?: { name: string } | null;
  teacherId: string;
}

export default function AssignmentDetailPage() {
  const { id } = useParams();
  const [assignment, setAssignment] = useState<AssignmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/assignments?id=${id}`)
      .then(async res => {
        if (!res.ok) throw new Error('Failed to fetch assignment');
        return res.json();
      })
      .then(data => {
        setAssignment(data);
        setError(null);
      })
      .catch(err => {
        setError(err.message);
        setAssignment(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!assignment) return <div className="p-8 text-center">Assignment not found.</div>;

  return (
    <div
      className="max-w-3xl mx-auto p-8 bg-white rounded shadow mt-8"
      role="main"
      aria-labelledby="assignment-detail-heading"
    >
      <h1 id="assignment-detail-heading" className="text-2xl font-bold mb-4">
        Assignment Details
      </h1>
      <div className="space-y-2" role="region" aria-label="Assignment information">
        <div>
          <span className="font-semibold">ID:</span> {assignment.id}
        </div>
        <div>
          <span className="font-semibold">Title:</span> {assignment.title}
        </div>
        <div>
          <span className="font-semibold">Description:</span> {assignment.description || '-'}
        </div>
        <div>
          <span className="font-semibold">Due Date:</span>{' '}
          {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : '-'}
        </div>
        <div>
          <span className="font-semibold">Class:</span>{' '}
          {assignment.class?.name || assignment.classId}
        </div>
        <div>
          <span className="font-semibold">Teacher:</span>{' '}
          {assignment.teacher?.name || assignment.teacherId}
        </div>
      </div>
      {/* Future: Edit/Delete buttons here */}
    </div>
  );
}
