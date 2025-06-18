'use client';

import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Table from "@/components/Table";
import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { role } from "@/lib/data";
import FormModal from "@/components/FormModal";
import { useRouter, useSearchParams } from "next/navigation";

// Assignment type based on Prisma model
interface Assignment {
  id: number;
  title: string;
  startDate: string;
  dueDate: string;
  lesson: {
    id: number;
    name: string;
  };
}

const columns = [
  { header: "Title", accessor: "title", sortable: true },
  { header: "Lesson", accessor: "lesson", className: "hidden md:table-cell", sortable: true },
  { header: "Start Date", accessor: "startDate", className: "hidden md:table-cell", sortable: true },
  { header: "Due Date", accessor: "dueDate", className: "hidden md:table-cell", sortable: true },
  { header: "Actions", accessor: "actions", className: "table-cell" },
];

function AssignmentsPageImpl() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const ITEMS_PER_PAGE = 15;

  const fetchAssignments = () => {
    setLoading(true);
    setError(null);
    fetch(`/api/assignments?page=${page}&limit=${ITEMS_PER_PAGE}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch assignments");
        return res.json();
      })
      .then((data) => {
        setAssignments(data.data);
        setTotal(data.total);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Unknown error");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleRefresh = () => {
    fetchAssignments();
  };

  const filteredAssignments = assignments.filter(a =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.lesson?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderRow = (item: Assignment) => (
    <tr key={item.id} role="row">
      <td className="flex items-center gap-4 p-3" role="cell">
        <div className="flex items-center gap-2">
          <Image src="/assignment.png" alt="Assignment" width={20} height={20} />
          <span className="font-semibold">{item.title}</span>
        </div>
      </td>
      <td className="hidden md:table-cell" role="cell">{item.lesson?.name || '-'}</td>
      <td className="hidden md:table-cell" role="cell">{item.startDate ? new Date(item.startDate).toLocaleDateString() : '-'}</td>
      <td className="hidden md:table-cell" role="cell">{item.dueDate ? new Date(item.dueDate).toLocaleDateString() : '-'}</td>
      <td className="table-cell" role="cell">
        <div className="flex items-center gap-2">
          <Link href={`/list/assignments/${item.id}`} aria-label={`View details for assignment ${item.title}`} tabIndex={0}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-LYNXLight" aria-label="View assignment details">
              <Image src="/view.png" alt="View" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <>
              <FormModal table="assignments" type="update" data={item} onSuccess={fetchAssignments} aria-label={`Edit assignment ${item.title}`} />
              <FormModal table="assignments" type="delete" id={item.id} onSuccess={fetchAssignments} aria-label={`Delete assignment ${item.title}`} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0" role="region" aria-labelledby="assignments-heading">
      {/* Top */}
      <div className="flex items-center justify-between">
        <h1 id="assignments-heading" className="hidden md:block text-lg font-semibold">All Assignments</h1>
        <div className="flex flex-col justify-center md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch value={searchTerm} onChange={setSearchTerm} placeholder="Search assignments..." />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-LYNXLavendar" aria-label="Filter assignments">
              <Image src="/filter.png" alt="Filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-LYNXLavendar" aria-label="Sort assignments">
              <Image src="/sort.png" alt="Sort" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="assignments" type="create" onSuccess={fetchAssignments} />}
          </div>
        </div>
      </div>
      {loading ? (
        <Table columns={columns} renderRow={renderRow} data={[]} loading={true} />
      ) : error ? (
        <Table columns={columns} renderRow={renderRow} data={[]} error={error} />
      ) : (
        <Table columns={columns} renderRow={renderRow} data={filteredAssignments} emptyMessage="No assignments found." />
      )}
      <Pagination page={page} count={total} />
    </div>
  );
}

export default function AssignmentsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AssignmentsPageImpl />
    </Suspense>
  );
}