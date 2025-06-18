"use client";

import React, { useState, useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { 
  ChevronUp, 
  ChevronDown, 
  Search, 
  Eye, 
  Edit, 
  Trash2,
  Plus,
  Download,
  Filter
} from "lucide-react";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  searchPlaceholder?: string;
  onAdd?: () => void;
  onView?: (row: TData) => void;
  onEdit?: (row: TData) => void;
  onDelete?: (row: TData) => void;
  onExport?: () => void;
  title?: string;
  description?: string;
  showActions?: boolean;
  customActions?: React.ReactNode;
}

const DataTable = <TData,>({ 
  columns, 
  data, 
  searchPlaceholder = "Search...",
  onAdd,
  onView,
  onEdit,
  onDelete,
  onExport,
  title,
  description,
  showActions = true,
  customActions
}: DataTableProps<TData>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Add actions column if handlers are provided
  const enhancedColumns = useMemo(() => {
    if (!showActions || (!onView && !onEdit && !onDelete)) {
      return columns;
    }

    const actionsColumn: ColumnDef<TData> = {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {onView && (
            <button
              onClick={() => onView(row.original)}
              className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(row.original)}
              className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(row.original)}
              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    };

    return [...columns, actionsColumn];
  }, [columns, onView, onEdit, onDelete, showActions]);

  const table = useReactTable({
    data,
    columns: enhancedColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      {(title || description) && (
        <div className="mb-6">
          {title && <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>}
          {description && <p className="text-gray-600">{description}</p>}
        </div>
      )}

      {/* Search and Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              placeholder={searchPlaceholder}
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(String(event.target.value))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="flex gap-2">
            {customActions}
            {onAdd && (
              <button
                onClick={onAdd}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add New
              </button>
            )}
            {onExport && (
              <button
                onClick={onExport}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {table.getRowModel().rows?.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">No results found</p>
            <p className="text-gray-400">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs text-gray-600 uppercase bg-gray-50 border-b border-gray-200">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-6 py-4 font-medium">
                        {header.isPlaceholder ? null : (
                          <div
                            className={`flex items-center gap-2 ${
                              header.column.getCanSort()
                                ? "cursor-pointer select-none hover:text-gray-900"
                                : ""
                            }`}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getCanSort() && (
                              <div className="flex flex-col">
                                <ChevronUp
                                  className={`w-3 h-3 ${
                                    header.column.getIsSorted() === "asc"
                                      ? "text-purple-600"
                                      : "text-gray-400"
                                  }`}
                                />
                                <ChevronDown
                                  className={`w-3 h-3 -mt-1 ${
                                    header.column.getIsSorted() === "desc"
                                      ? "text-purple-600"
                                      : "text-gray-400"
                                  }`}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 transition-colors duration-200 ease-in-out"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 text-gray-900">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-sm text-gray-600 bg-white rounded-lg p-4 border border-gray-200">
        <div>
          Showing {table.getFilteredRowModel().rows.length} of {data.length} entries
          {globalFilter && (
            <span className="ml-1">
              (filtered from {data.length} total entries)
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {sorting.length > 0 && (
            <span className="text-purple-600">
              Sorted by {sorting.map(s => s.id).join(", ")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataTable;
