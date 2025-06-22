'use client';

import Announcements from '@/components/Announcement';
import BigCalendar from '@/components/BigCalendar';
import FormModal from '@/components/FormModal';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { Teacher } from '@/types/models';

const Performance = dynamic(() => import('@/components/Performance'), { ssr: false });

const SingleTeacherPage = () => {
  const { id } = useParams();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/teachers/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch teacher');
        return res.json();
      })
      .then(data => {
        setTeacher(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Unknown error');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!teacher) return <div className="p-8 text-center text-gray-400">Teacher not found.</div>;

  return (
    <ErrorBoundary>
      <div
        className="flex-1 p-4 flex flex-col gap-4 xl:flex-row"
        role="main"
        aria-labelledby="teacher-detail-heading"
      >
        {/*  Left */}
        <div className="w-full xl:w-2/3">
          {/*  Top */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* User Info Card */}
            <div
              className="bg-LYNXLavendar py-6 px-4 rounded-xl flex-1 flex gap-4"
              role="region"
              aria-label="Teacher profile"
            >
              {/* Image */}
              <div className="w-1/3">
                <Image
                  src={teacher.img || '/noAvatar.png'}
                  alt={`${teacher.name} profile photo`}
                  width={144}
                  height={144}
                  className="w-36 h-36 rounded-full object-cover"
                />
              </div>
              {/* Info */}
              <div className="w-2/3 flex flex-col justify-between gap-4 text-gray-500">
                <h1 id="teacher-detail-heading" className="text-xl font-semibold text-gray-800">
                  {teacher.name} {teacher.surname}
                </h1>
                <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                  <div className="w-full md:w-1/3 lg:w-full 2xl:w-2/3 flex items-center gap-2">
                    <Image src="/mail.png" alt="Email" width={14} height={14} />
                    <span>{teacher.email}</span>
                  </div>
                  <div className="w-full md:w-1/3 lg:w-full 2xl:w-2/3 flex items-center gap-2">
                    <Image src="/phone.png" alt="Phone" width={14} height={14} />
                    <span>{teacher.phone}</span>
                  </div>
                  <div className="w-full md:w-1/3 lg:w-full 2xl:w-2/3 flex items-center gap-2">
                    <Image src="/blood.png" alt="Blood type" width={14} height={14} />
                    <span>{teacher.bloodType}</span>
                  </div>
                  <div className="w-full md:w-1/3 lg:w-full 2xl:w-2/3 flex items-center gap-2">
                    <Image src="/date.png" alt="Date of birth" width={14} height={14} />
                    <span>{new Date(teacher.birthday).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Small Card */}
            <div className="flex-1 flex gap-4 justify-between flex-wrap" aria-label="Teacher stats">
              {/* Card  */}
              <div
                className="bg-slate-200 p-4 rounded-md gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]"
                aria-label="Attendance"
              >
                <Image
                  src="/singleAttendance.png"
                  alt="Attendance icon"
                  width={24}
                  height={40}
                  className="w-6 h-6"
                />
                <div className="">
                  <h1 className="text-xl font-semibold">100%</h1>
                  <span className="text-xs text-gray-500">Attendance</span>
                </div>
              </div>
              {/* Card  */}
              <div
                className="bg-slate-200 p-4 rounded-md gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]"
                aria-label="Subjects"
              >
                <Image
                  src="/singleBranch.png"
                  alt="Subjects icon"
                  width={24}
                  height={40}
                  className="w-6 h-6"
                />
                <div className="">
                  <h1 className="text-xl font-semibold">3</h1>
                  <span className="text-xs text-gray-500">Subjects</span>
                </div>
              </div>
              {/* Card  */}
              <div
                className="bg-slate-200 p-4 rounded-md gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]"
                aria-label="Lessons per day"
              >
                <Image
                  src="/singleLesson.png"
                  alt="Lessons icon"
                  width={24}
                  height={40}
                  className="w-6 h-6"
                />
                <div className="">
                  <h1 className="text-xl font-semibold">6</h1>
                  <span className="text-xs text-gray-500">Lessons Per day</span>
                </div>
              </div>
              {/* Card  */}
              <div
                className="bg-slate-200 p-4 rounded-md gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]"
                aria-label="Classes"
              >
                <Image
                  src="/singleClass.png"
                  alt="Classes icon"
                  width={24}
                  height={40}
                  className="w-6 h-6"
                />
                <div className="">
                  <h1 className="text-xl font-semibold">6</h1>
                  <span className="text-xs text-gray-500">Classes</span>
                </div>
              </div>
            </div>
          </div>
          {/* Bottom */}
          <div
            className="mt-4 bg-slate-100 rounded-md p-4 h-[800px]"
            aria-label="Teacher's schedule"
          >
            <h1> Teacher&apos;s Schedule</h1>
            <BigCalendar teacherId={teacher.id} />
          </div>
        </div>
        {/*  Right */}
        <div className="w-full xl:w-1/3 flex flex-col gap-4">
          <div className="bg-slate-100 p-4 rounded-xl" aria-label="Shortcuts">
            <h1 className="text-xl font-semibold">Shortcuts</h1>
            <div className="mt-4 flex gap-4 flex-wrap text-xs text-white p-2">
              <Link className="bg-LYNXPurple rounded-xl" href="/" aria-label="Teacher's Classes">
                <p className="p-2">Teacher&apos;s Classes</p>
              </Link>
              <Link className="bg-LYNXMauve rounded-xl" href="/" aria-label="Teacher's Students">
                <p className="p-2">Teacher&apos;s Students</p>
              </Link>
              <Link className="bg-LYNXThistle rounded-xl" href="/" aria-label="Teacher's Lessons">
                <p className="p-2">Teacher&apos;s Lessons</p>
              </Link>
              <Link className="bg-LYNXHelio rounded-xl" href="/" aria-label="Teacher's Exams">
                <p className="p-2">Teacher&apos;s Exams</p>
              </Link>
              <Link className="bg-LYNXLight rounded-xl" href="/" aria-label="Teacher's Assignments">
                <p className="p-2">Teacher&apos;s Assignments</p>
              </Link>
            </div>
            <Performance />
            <Announcements />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default SingleTeacherPage;
