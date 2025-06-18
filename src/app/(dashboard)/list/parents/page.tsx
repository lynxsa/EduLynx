'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import DataTable from '@/components/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Phone, Mail, Users, MapPin, Calendar } from 'lucide-react';

interface Parent {
  id: string;
  username: string;
  name: string;
  surname: string;
  email: string;
  phone?: string;
  address: string;
  img?: string;
  occupation?: string;
  relationship?: string;
  students: Array<{
    id: string;
    name: string;
    surname: string;
    class: {
      name: string;
    };
  }>;
  _count?: {
    students: number;
  };
}

const ParentsPage = () => {
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParents = async () => {
      try {
        const response = await fetch('/api/parents');
        if (!response.ok) {
          throw new Error('Failed to fetch parents');
        }
        const data = await response.json();
        setParents(data.data || data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchParents();
  }, []);

  const columns: ColumnDef<Parent>[] = [
    {
      accessorKey: "name",
      header: "Parent",
      enableSorting: true,
      cell: ({ row }) => {
        const parent = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="relative">
              {parent.img ? (
                <Image
                  src={parent.img}
                  alt={`${parent.name} ${parent.surname}`}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600 font-medium text-sm">
                    {parent.name[0]}{parent.surname[0]}
                  </span>
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {parent.name} {parent.surname}
              </p>
              <p className="text-sm text-gray-500">@{parent.username}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Contact",
      cell: ({ row }) => {
        const parent = row.original;
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              <span className="truncate max-w-32">{parent.email}</span>
            </div>
            {parent.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{parent.phone}</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "occupation",
      header: "Occupation",
      enableSorting: true,
      cell: ({ row }) => {
        const occupation = row.original.occupation;
        return (
          <div>
            <p className="font-medium text-gray-900">{occupation || 'Not specified'}</p>
            <p className="text-sm text-gray-500">{row.original.relationship || 'Parent'}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => {
        const address = row.original.address;
        return (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 truncate max-w-32">{address}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "students",
      header: "Children",
      cell: ({ row }) => {
        const students = row.original.students || [];
        const count = row.original._count?.students || students.length;
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {count} {count === 1 ? 'child' : 'children'}
              </span>
            </div>
            {students.length > 0 && (
              <div className="text-xs text-gray-500">
                {students.slice(0, 2).map((student, index) => (
                  <div key={student.id}>
                    {student.name} {student.surname} ({student.class.name})
                  </div>
                ))}
                {students.length > 2 && (
                  <div>+{students.length - 2} more</div>
                )}
              </div>
            )}
          </div>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading parents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <DataTable 
          columns={columns} 
          data={parents}
          title="Parent Directory"
          description="Manage parent information and communication"
          searchPlaceholder="Search parents..."
          onView={(parent) => console.log('View parent:', parent)}
          onEdit={(parent) => console.log('Edit parent:', parent)}
          onDelete={(parent) => console.log('Delete parent:', parent)}
          onAdd={() => console.log('Add new parent')}
          onExport={() => console.log('Export parents')}
        />
      </div>
    </div>
  );
};

export default ParentsPage;