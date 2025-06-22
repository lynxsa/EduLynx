import { notFound } from 'next/navigation';
import BigCalendar from '@/components/BigCalendar';
import Image from 'next/image';
import { Suspense } from 'react';

async function getParent(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/parents/${id}`, {
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function ParentProfilePage({ params }: { params: { id: string } }) {
  const parentData = await getParent(params.id);
  if (!parentData || !parentData.data) return notFound();
  const parent = parentData.data;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start bg-white rounded-xl shadow-lg p-6">
        <div className="flex-shrink-0">
          <Image
            src={parent.img || '/noAvatar.png'}
            alt={parent.name}
            width={120}
            height={120}
            className="rounded-full border-4 border-primary object-cover"
          />
        </div>
        <div className="flex-1 w-full">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            {parent.name} {parent.surname}
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded ml-2">Parent</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div>
              <span className="font-semibold">Email:</span> {parent.email}
            </div>
            <div>
              <span className="font-semibold">Phone:</span> {parent.phone}
            </div>
            <div>
              <span className="font-semibold">Address:</span> {parent.address}
            </div>
            <div>
              <span className="font-semibold">Sex:</span> {parent.sex || 'N/A'}
            </div>
            <div>
              <span className="font-semibold">Joined:</span>{' '}
              {parent.createdAt ? new Date(parent.createdAt).toLocaleDateString() : 'N/A'}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Children & Schedules</h3>
        {Array.isArray(parent.children) && parent.children.length > 0 ? (
          <div className="space-y-8">
            {parent.children.map((childId: string) => (
              <Suspense
                key={childId}
                fallback={<div className="text-gray-500">Loading child info...</div>}
              >
                <ChildSchedule studentId={childId} />
              </Suspense>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">No children found for this parent.</div>
        )}
      </div>
    </div>
  );
}

async function getStudent(studentId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/students/${studentId}`, {
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

async function ChildSchedule({ studentId }: { studentId: string }) {
  const studentData = await getStudent(studentId);
  if (!studentData || !studentData.data) return null;
  const student = studentData.data;
  return (
    <div className="bg-gray-50 rounded-lg p-4 shadow">
      <div className="flex items-center gap-4 mb-2">
        <Image
          src={student.img || '/noAvatar.png'}
          alt={student.name}
          width={48}
          height={48}
          className="rounded-full border"
        />
        <div>
          <div className="font-semibold">
            {student.name} {student.surname}
          </div>
          <div className="text-xs text-gray-500">Student</div>
        </div>
      </div>
      <div>
        <BigCalendar studentId={student.id} />
      </div>
    </div>
  );
}
