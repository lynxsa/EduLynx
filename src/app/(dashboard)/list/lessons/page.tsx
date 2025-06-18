'use client';

import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Table from "@/components/Table";
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import FormModal from "@/components/FormModal";

type LessonRow = {
  id: number;
  subject: { name: string };
  class: { name: string };
  teacher: { name: string };
  day: string;
  startTime: string;
  endTime: string;
};

const columns = [
  { header: "Subject Name", accessor: "subject", sortable: true },
  { header: "Class", accessor: "class", className: "hidden md:table-cell", sortable: true },
  { header: "Teacher", accessor: "teacher", className: "hidden md:table-cell", sortable: true },
  { header: "Day", accessor: "day", className: "hidden md:table-cell", sortable: true },
  { header: "Start Time", accessor: "startTime", className: "hidden md:table-cell", sortable: true },
  { header: "End Time", accessor: "endTime", className: "hidden md:table-cell", sortable: true },
  { header: "Actions", accessor: "actions", className: "table-cell" },
];

const LessonList = () => {
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const ITEMS_PER_PAGE = 15;

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/lessons?page=${page}&limit=${ITEMS_PER_PAGE}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch lessons');
        return res.json();
      })
      .then(data => {
        setLessons(data.data);
        setTotal(data.total);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Unknown error');
        setLoading(false);
      });
  }, [page]);

  const filteredLessons = lessons.filter(l =>
    l.subject?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.class?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.teacher?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderRow = (item: LessonRow) => (
    <tr key={item.id} role="row">
      <td className="flex items-center gap-4 p-3" role="cell">
        <div className="flex items-center gap-2">
          <Image src="/lesson.png" alt="Lesson" width={20} height={20} />
          <span className="font-semibold">{item.subject?.name || '-'}</span>
        </div>
      </td>
      <td className="hidden md:table-cell" role="cell">{item.class?.name || '-'}</td>
      <td className="hidden md:table-cell" role="cell">{item.teacher?.name || '-'}</td>
      <td className="hidden md:table-cell" role="cell">{item.day}</td>
      <td className="hidden md:table-cell" role="cell">{item.startTime}</td>
      <td className="hidden md:table-cell" role="cell">{item.endTime}</td>
      <td className="table-cell" role="cell">
        <div className="flex items-center gap-2">
          <Link href={`/list/lessons/${item.id}`} aria-label={`View details for lesson ${item.subject?.name}`} tabIndex={0}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-LYNXLight" aria-label="View lesson details">
              <Image src="/view.png" alt="View" width={16} height={16} />
            </button>
          </Link>
          <FormModal table="lessons" type="update" data={item} aria-label={`Edit lesson ${item.subject?.name}`} />
          <FormModal table="lessons" type="delete" id={item.id} aria-label={`Delete lesson ${item.subject?.name}`} />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Lessons</h1>
        <div className="flex flex-col justify-center md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch value={searchTerm} onChange={setSearchTerm} placeholder="Search lessons..." />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-LYNXLavendar">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-LYNXLavendar">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="p-4 text-center">Loading lessons...</div>
      ) : error ? (
        <div className="p-4 text-center text-red-500">{error}</div>
      ) : (
        <Table columns={columns} renderRow={renderRow} data={filteredLessons} emptyMessage="No lessons found." />
      )}
      <Pagination page={page} count={total} />
    </div>
  );
};

export default LessonList;