'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface AnnouncementDetail {
  id: string;
  title: string;
  content: string;
  date?: string;
  author?: { name: string } | null;
  authorId?: string;
}

export default function AnnouncementDetailPage() {
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState<AnnouncementDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/announcements?id=${id}`)
      .then(async res => {
        if (!res.ok) throw new Error('Failed to fetch announcement');
        return res.json();
      })
      .then(data => {
        setAnnouncement(data);
        setError(null);
      })
      .catch(err => {
        setError(err.message);
        setAnnouncement(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!announcement) return <div className="p-8 text-center">Announcement not found.</div>;

  return (
    <div
      className="max-w-3xl mx-auto p-8 bg-white rounded shadow mt-8"
      role="main"
      aria-labelledby="announcement-detail-heading"
    >
      <h1 id="announcement-detail-heading" className="text-2xl font-bold mb-4">
        Announcement Details
      </h1>
      <div className="space-y-2" role="region" aria-label="Announcement information">
        <div>
          <span className="font-semibold">ID:</span> {announcement.id}
        </div>
        <div>
          <span className="font-semibold">Title:</span> {announcement.title}
        </div>
        <div>
          <span className="font-semibold">Content:</span> {announcement.content}
        </div>
        <div>
          <span className="font-semibold">Date:</span>{' '}
          {announcement.date ? new Date(announcement.date).toLocaleDateString() : '-'}
        </div>
        <div>
          <span className="font-semibold">Author:</span>{' '}
          {announcement.author?.name || announcement.authorId || '-'}
        </div>
      </div>
      {/* Future: Edit/Delete buttons here */}
    </div>
  );
}
