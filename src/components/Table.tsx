import React, { useState } from "react";

interface TableProps {
  columns?: { header: string; accessor: string; className?: string; sortable?: boolean }[];
  renderRow: (item: any) => React.ReactNode;
  data?: any[];
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
}

const Table = ({
  columns = [],
  renderRow,
  data = [],
  loading = false,
  error = null,
  emptyMessage = "No data found."
}: TableProps) => {
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (accessor: string) => {
    if (sortCol === accessor) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(accessor);
      setSortDir('asc');
    }
  };

  let sortedData = [...data];
  if (sortCol) {
    sortedData.sort((a, b) => {
      const aVal = a[sortCol];
      const bVal = b[sortCol];
      if (aVal === undefined || bVal === undefined) return 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }

  return (
    <div className="overflow-x-auto rounded-2xl shadow bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {loading ? (
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      ) : error ? (
        <div className="p-4 text-red-500">{error}</div>
      ) : data.length === 0 ? (
        <div className="p-4 text-gray-500">{emptyMessage}</div>
      ) : (
        <table className="w-full mt-4" role="table" aria-label="Data table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.accessor}
                  className={`table-header ${col.className || ''}`}
                  onClick={() => col.sortable && handleSort(col.accessor)}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, index) => (
              <tr key={index} className="table-row">
                {renderRow(item)}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Table;