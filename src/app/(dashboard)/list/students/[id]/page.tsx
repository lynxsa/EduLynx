"use client";

import Announcements from "@/components/Announcement";
import BigCalendar from "@/components/BigCalendar";
import dynamic from 'next/dynamic';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import LoadingSpinner from '@/components/LoadingSpinner';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Student } from "@/types/models";

const Performance = dynamic(() => import('@/components/Performance'), { ssr: false });

const SingleStudentPage = () => {
    const { id } = useParams();
    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        fetch(`/api/students/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch student");
                return res.json();
            })
            .then(data => {
                setStudent(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message || "Unknown error");
                setLoading(false);
            });
    }, [id]);

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!student) return <div className="p-8 text-center text-gray-400">Student not found.</div>;

    return(
        <ErrorBoundary>
        <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row" role="main" aria-labelledby="student-detail-heading">
            {/*  Left */}
            <div className="w-full xl:w-2/3">
             {/*  Top */}
             <div className="flex flex-col lg:flex-row gap-4">
                  {/* User Info Card */}
                  <div className="bg-LYNXLavendar py-6 px-4 rounded-xl flex-1 flex gap-4" role="region" aria-label="Student profile">
                        {/* Image */}
                        <div className='w-1/3'>
                            <Image src={student.profileImage || student.img || "/noAvatar.png"} 
                            alt={`${student.name} ${student.surname} profile photo`} 
                            width={144} 
                            height={144} 
                            className="w-36 h-36 rounded-full object-cover"/>
                        </div>
                        {/* Info */}
                        <div className="w-2/3 flex flex-col justify-between gap-4 text-gray-500">
                            <h1 id="student-detail-heading" className="text-xl font-semibold text-gray-800">{student.name} {student.surname}</h1>
                            <p className="text-sm">{student.status ? `Status: ${student.status}` : null}</p>
                            <div className='flex items-center justify-between gap-2 flex-wrap text-xs font-medium'>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-2/3 flex items-center gap-2">
                                    <Image src="/blood.png" alt="Blood type" width={14} height={14} />
                                    <span>{student.bloodType}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-2/3 flex items-center gap-2">
                                    <Image src="/date.png" alt="Date of birth" width={14} height={14} />
                                    <span>{new Date(student.birthday).toLocaleDateString()}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-2/3 flex items-center gap-2">
                                    <Image src="/mail.png" alt="Email" width={14} height={14} />
                                    <span>{student.email}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-2/3 flex items-center gap-2">
                                    <Image src="/phone.png" alt="Phone" width={14} height={14} />
                                    <span>{student.phone}</span>
                                </div>
                            </div>
                        </div>
                  </div>
                  {/* Small Card */}
                  <div className="flex-1 flex gap-4 justify-between flex-wrap" aria-label="Student stats">
                      {/* Card  */}
                      <div className="bg-slate-200 p-4 rounded-md gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]" aria-label="Attendance">
                        <Image src='/singleAttendance.png' alt="Attendance icon" width={24} height={40} className="w-6 h-6" />
                        <div className="">
                        <h1 className="text-xl font-semibold">--</h1>
                        <span className="text-xs text-gray-500">Attendance</span>
                        </div>
                      </div>
                       {/* Card  */}
                       <div className="bg-slate-200 p-4 rounded-md gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]" aria-label="Grade">
                        <Image src='/singleBranch.png' alt="Grade icon" width={24} height={40} className="w-6 h-6" />
                        <div className="">
                        <h1 className="text-xl font-semibold">{student.grade?.level || '--'}</h1>
                        <span className="text-xs text-gray-500">Grade</span>
                        </div>
                      </div>
                        {/* Card  */}
                        <div className="bg-slate-200 p-4 rounded-md gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]" aria-label="Lessons this week">
                        <Image src='/singleLesson.png' alt="Lessons icon" width={24} height={40} className="w-6 h-6" />
                        <div className="">
                        <h1 className="text-xl font-semibold">--</h1>
                        <span className="text-xs text-gray-500">This Week</span>
                        </div>
                      </div>
                       {/* Card  */}
                       <div className="bg-slate-200 p-4 rounded-md gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]" aria-label="Class">
                        <Image src='/singleClass.png' alt="Class icon" width={24} height={40} className="w-6 h-6" />
                        <div className="">
                        <h1 className="text-xl font-semibold">{student.class?.name || '--'}</h1>
                        <span className="text-xs text-gray-500">Class</span>
                        </div>
                      </div>
                  </div>
              </div>
              {/* Health & Personal Info Section */}
              <div className="mt-4 bg-slate-100 rounded-md p-4" aria-label="Student health and personal info">
                <h2 className="text-lg font-semibold mb-2">Health & Personal Info</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><b>Gender:</b> {student.gender}</div>
                  <div><b>Sex:</b> {student.sex}</div>
                  <div><b>Home Language:</b> {student.homeLanguage || '--'}</div>
                  <div><b>Allergies:</b> {student.allergies || '--'}</div>
                  <div><b>Medical Info:</b> {student.medicalInfo || '--'}</div>
                  <div><b>Special Needs:</b> {student.specialNeeds || '--'}</div>
                  <div><b>Extracurriculars:</b> {student.extracurriculars || '--'}</div>
                  <div><b>Admission Year:</b> {student.admissionYear || '--'}</div>
                  <div><b>Status:</b> {student.status || '--'}</div>
                </div>
                <h2 className="text-lg font-semibold mt-4 mb-2">Emergency Contact</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><b>Name:</b> {student.emergencyContactName || '--'}</div>
                  <div><b>Phone:</b> {student.emergencyContactPhone || '--'}</div>
                  <div><b>Guardian Relationship:</b> {student.guardianRelationship || '--'}</div>
                </div>
              </div>
              {/* Bottom */}
              <div className="mt-4 bg-slate-100 rounded-md p-4 h-[800px]" aria-label="Teacher's schedule">
                <h1> Teacher&apos;s Schedule</h1> 
                <BigCalendar studentId={student.id} />
              </div>
            </div>
            {/*  Right */}
            <div className="w-full xl:w-1/3 flex flex-col gap-4">
            <div className="bg-slate-100 p-4 rounded-xl" aria-label="Shortcuts">
                <h1 className="text-xl font-semibold">Shortcuts</h1>
                <div className="mt-4 flex gap-4 flex-wrap text-xs text-white p-2">
                    <Link className="bg-LYNXPurple rounded-xl" href="/" aria-label="Student's Classes"><p className="p-2">Student&apos;s Classes</p></Link>
                    <Link className="bg-LYNXMauve rounded-xl" href={`/list/teachers?classId=${student.classId || ''}`} aria-label="Student's Teachers"><p className="p-2">Student&apos;s Teachers</p></Link>
                    <Link className="bg-LYNXThistle rounded-xl" href="/" aria-label="Student's Lessons"><p className="p-2">Student&apos;s Lessons</p></Link>
                    <Link className="bg-LYNXHelio rounded-xl" href="/" aria-label="Student's Exams"><p className="p-2">Student&apos;s Exams</p></Link>
                    <Link className="bg-LYNXLight rounded-xl" href="/" aria-label="Student's Assignments"><p className="p-2">Student&apos;s Assignments</p></Link>
            </div>
            <Performance/>
            <Announcements/>
            </div>
        </div>
        </div>
        </ErrorBoundary>
    )
}



export default SingleStudentPage;