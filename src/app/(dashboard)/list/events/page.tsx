'use client';

import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Table from "@/components/Table";
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import FormModal from "@/components/FormModal";

type EventRow = {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  class?: { name: string } | null;
};

const columns = [
  { header: "Event Title", accessor: "title", sortable: true },
  { header: "Class", accessor: "class", className: "table-cell", sortable: true },
  { header: "Start Time", accessor: "startTime", className: "hidden md:table-cell", sortable: true },
  { header: "End Time", accessor: "endTime", className: "hidden md:table-cell", sortable: true },
  { header: "Actions", accessor: "actions", className: "table-cell" },
];

const EventList = () => {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const ITEMS_PER_PAGE = 15;

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/events?page=${page}&limit=${ITEMS_PER_PAGE}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch events');
        return res.json();
      })
      .then(data => {
        setEvents(data.data);
        setTotal(data.total);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Unknown error');
        setLoading(false);
      });
  }, [page]);

  const filteredEvents = events.filter(e =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.class?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderRow = (item: EventRow) => (
    <tr key={item.id} role="row">
      <td className="flex items-center gap-4 p-3" role="cell">
        <div className="flex items-center gap-2">
          <Image src="/calendar.png" alt="Event" width={24} height={24} />
          <span className="font-semibold">{item.title}</span>
        </div>
      </td>
      <td className="md:table-cell" role="cell">{item.class?.name || '-'}</td>
      <td className="hidden md:table-cell" role="cell">{new Date(item.startTime).toLocaleString()}</td>
      <td className="hidden md:table-cell" role="cell">{new Date(item.endTime).toLocaleString()}</td>
      <td className="table-cell" role="cell">
        <div className="flex items-center gap-2">
          <Link href={`/list/events/${item.id}`} aria-label={`View details for event ${item.title}`} tabIndex={0}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-LYNXLight" aria-label="View event details">
              <Image src="/view.png" alt="View" width={16} height={16} />
            </button>
          </Link>
          <FormModal table="events" type="update" data={item} aria-label={`Edit event ${item.title}`} />
          <FormModal table="events" type="delete" id={item.id} aria-label={`Delete event ${item.title}`} />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Events</h1>
        <div className="flex flex-col justify-center md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch value={searchTerm} onChange={setSearchTerm} placeholder="Search events..." />
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
        <div className="p-4 text-center">Loading events...</div>
      ) : error ? (
        <div className="p-4 text-center text-red-500">{error}</div>
      ) : (
        <Table columns={columns} renderRow={renderRow} data={filteredEvents} emptyMessage="No events found." />
      )}
      <Pagination page={page} count={total} />
    </div>
  );
};

export default EventList;