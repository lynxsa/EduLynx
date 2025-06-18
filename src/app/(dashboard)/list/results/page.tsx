'use client';

import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Table from "@/components/Table";
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import FormModal from "@/components/FormModal";

type ResultRow = {
  id: number;
  score: number;
  exam?: { lesson?: { subject?: { name: string }, class?: { name: string } } } | null;
  assignment?: { lesson?: { subject?: { name: string }, class?: { name: string } } } | null;
  student?: { name: string } | null;
};

const columns = [
  { header: "Subject Name", accessor: "subject", sortable: true },
  { header: "Student", accessor: "student", className: "table-cell", sortable: true },
  { header: "Class", accessor: "class", className: "hidden md:table-cell", sortable: true },
  { header: "Score", accessor: "score", className: "table-cell", sortable: true },
  { header: "Type", accessor: "type", className: "table-cell", sortable: true },
  { header: "Actions", accessor: "actions", className: "table-cell" },
];

const ResultList = () => {
  const [results, setResults] = useState<ResultRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const ITEMS_PER_PAGE = 15;

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/results?page=${page}&limit=${ITEMS_PER_PAGE}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch results');
        return res.json();
      })
      .then(data => {
        setResults(data.data);
        setTotal(data.total);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Unknown error');
        setLoading(false);
      });
  }, [page]);

  const filteredResults = results.filter(r => {
    let subject = r.exam?.lesson?.subject?.name || r.assignment?.lesson?.subject?.name || "";
    let student = r.student?.name || "";
    return (
      subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const renderRow = (item: ResultRow) => {
    let type = '-';
    let subject = '-';
    let className = '-';
    if (item.exam) {
      type = 'Exam';
      subject = item.exam.lesson?.subject?.name || '-';
      className = item.exam.lesson?.class?.name || '-';
    } else if (item.assignment) {
      type = 'Assignment';
      subject = item.assignment.lesson?.subject?.name || '-';
      className = item.assignment.lesson?.class?.name || '-';
    }
    return (
      <tr key={item.id} className="border-b-gray-200 p-2 hover:bg-LYNXLavendar even:bg-slate-50 odd:bg-white">
        <td className="flex items-center gap-4 p-3">
          <Image src="/result.png" alt="Result" width={24} height={24} className="inline-block" />
          <span>{subject}</span>
        </td>
        <td className="table-cell">{item.student?.name || '-'}</td>
        <td className="hidden md:table-cell">{className}</td>
        <td className="table-cell">{item.score}</td>
        <td className="table-cell">{type}</td>
        <td className="table-cell">
          <div className="flex items-center gap-2">
            <Link href={`/list/results/${item.id}`}>
              <button className="w-7 h-7 flex items-center justify-center rounded-full bg-LYNXLight">
                <Image src="/view.png" alt="View" width={16} height={16} />
              </button>
            </Link>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Results</h1>
        <div className="flex flex-col justify-center md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch value={searchTerm} onChange={setSearchTerm} placeholder="Search results..." />
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
        <div className="p-4 text-center">Loading results...</div>
      ) : error ? (
        <div className="p-4 text-center text-red-500">{error}</div>
      ) : (
        <Table columns={columns} renderRow={renderRow} data={filteredResults} emptyMessage="No results found." />
      )}
      <Pagination page={page} count={total} />
    </div>
  );
};

export default ResultList;