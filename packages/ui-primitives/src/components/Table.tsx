import * as React from 'react';
import { cn } from '../lib/utils';

export interface TableProps<T> extends React.TableHTMLAttributes<HTMLTableElement> {
  columns: { header: React.ReactNode; accessor: keyof T }[];
  data: T[];
}

export function Table<T>({ columns, data, className, ...props }: TableProps<T>) {
  return (
    <table className={cn('min-w-full divide-y divide-border', className)} {...props}>
      <thead className="bg-muted">
        <tr>
          {columns.map((col, idx) => (
            <th key={idx} className="px-4 py-2 text-left text-sm font-medium text-foreground">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {data.map((row, idx) => (
          <tr key={idx} className="hover:bg-accent/10">
            {columns.map((col, cidx) => (
              <td key={cidx} className="px-4 py-2 text-sm text-foreground">
                {String(row[col.accessor] ?? '')}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
