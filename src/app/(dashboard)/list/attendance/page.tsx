"use client";

import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface AttendanceItem {
  id: number;
  date: string;
  present: boolean;
  student: { id: string; name: string; surname: string; img?: string };
  lesson: { id: number; name: string };
}

const columns = [
  { header: "Student", accessor: "student", sortable: true },
  { header: "Lesson", accessor: "lesson", sortable: true },
  { header: "Date", accessor: "date", className: "hidden md:table-cell", sortable: true },
  { header: "Present", accessor: "present", sortable: true },
  { header: "Actions", accessor: "actions", className: "table-cell" },
];

function getInitials(name: string, surname: string) {
  return (name?.[0] || "") + (surname?.[0] || "");
}

const AttendancePage = () => {
  const [attendance, setAttendance] = useState<AttendanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("/api/attendance")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch attendance");
        return res.json();
      })
      .then((data) => {
        setAttendance(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Unknown error");
        setLoading(false);
      });
  }, []);

  const filteredAttendance = attendance.filter((a) =>
    a.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.student.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.lesson.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderRow = (item: AttendanceItem) => (
    <tr key={item.id}>
      <td className="flex items-center gap-2 py-3">
        {item.student.img ? (
          <Image src={item.student.img} alt="avatar" width={32} height={32} className="rounded-full w-8 h-8 object-cover" />
        ) : (
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-LYNXLavendar text-white font-bold">
            {getInitials(item.student.name, item.student.surname)}
          </span>
        )}
        <span>{item.student.name} {item.student.surname}</span>
      </td>
      <td className="flex items-center gap-2 py-3">
        <Image src="/attendance.png" alt="lesson" width={24} height={24} className="inline-block" />
        <span>{item.lesson.name}</span>
      </td>
      <td className="hidden md:table-cell py-3">{new Date(item.date).toLocaleDateString()}</td>
      <td className="py-3">
        <span className={item.present ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
          {item.present ? "Present" : "Absent"}
        </span>
      </td>
      <td className="py-3">
        {/* Actions (edit/delete) can be added here */}
      </td>
    </tr>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Image src="/attendance.png" alt="Attendance" width={32} height={32} />
        Attendance
      </h1>
      <TableSearch value={searchTerm} onChange={setSearchTerm} placeholder="Search attendance..." />
      <Table
        columns={columns}
        renderRow={renderRow}
        data={filteredAttendance}
        loading={loading}
        error={error}
        emptyMessage="No attendance records found."
      />
    </div>
  );
};

export default AttendancePage;
