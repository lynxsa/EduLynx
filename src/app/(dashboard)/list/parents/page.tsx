'use client';

import { ModernTable } from '@/components/ui/ModernTable';
import {
  Activity,
  Briefcase,
  GraduationCap,
  Heart,
  Mail,
  MapPin,
  Phone,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
  const router = useRouter();

  useEffect(() => {
    const fetchParents = async () => {
      try {
        // Request all parents with a high limit to show full data instead of paginated
        const response = await fetch('/api/parents?limit=2000&page=1');
        if (!response.ok) {
          throw new Error('Failed to fetch parents');
        }
        const data = await response.json();

        console.log('Parents API Response:', data);

        // Handle response structure
        const parentsData = data.data?.data || data.data || data;
        console.log(`✅ Loaded ${parentsData.length} parents from database`);
        setParents(parentsData);
      } catch (err) {
        console.error('Error fetching parents:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchParents();
  }, []);

  const columns = [
    {
      key: 'name',
      label: 'Parent',
      sortable: true,
      render: (parent: Parent) => (
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
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 font-medium text-sm">
                  {parent.name[0]}
                  {parent.surname[0]}
                </span>
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {parent.name} {parent.surname}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">@{parent.username}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Contact',
      render: (parent: Parent) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Mail className="w-4 h-4" />
            <span className="truncate max-w-32">{parent.email}</span>
          </div>
          {parent.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Phone className="w-4 h-4" />
              <span>{parent.phone}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'students',
      label: 'Children',
      sortable: true,
      render: (parent: Parent) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="font-medium">{parent.students?.length || 0} children</span>
          </div>
          {parent.students?.slice(0, 2).map(student => (
            <div key={student.id} className="text-xs text-gray-600 dark:text-gray-300">
              {student.name} {student.surname} ({student.class.name})
            </div>
          ))}
          {parent.students?.length > 2 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              +{parent.students.length - 2} more
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'occupation',
      label: 'Details',
      render: (parent: Parent) => (
        <div className="space-y-1">
          {parent.occupation && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Briefcase className="w-4 h-4 text-green-500" />
              <span className="truncate max-w-24">{parent.occupation}</span>
            </div>
          )}
          {parent.relationship && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Heart className="w-4 h-4 text-red-500" />
              <span>{parent.relationship}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'address',
      label: 'Address',
      render: (parent: Parent) => (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <MapPin className="w-4 h-4 text-purple-500" />
          <span className="truncate max-w-32">{parent.address}</span>
        </div>
      ),
    },
  ];

  const handleView = (parent: Parent) => {
    router.push(`/list/parents/${parent.id}`);
  };

  const handleEdit = (parent: Parent) => {
    // TODO: Implement edit functionality
    console.log('Edit parent:', parent);
  };

  const handleDelete = (parent: Parent) => {
    // TODO: Implement delete functionality
    console.log('Delete parent:', parent);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 text-lg">{error}</p>
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{parents.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Parents</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {parents.reduce((acc, p) => acc + (p.students?.length || 0), 0)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Children</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {parents.filter(p => p.students && p.students.length > 0).length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Parents</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Heart className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {parents.length > 0
                    ? (
                        parents.reduce((acc, p) => acc + (p.students?.length || 0), 0) /
                        parents.length
                      ).toFixed(1)
                    : 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Children per Parent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Table */}
        <ModernTable
          data={parents}
          columns={columns}
          searchableFields={['name', 'surname', 'email', 'username', 'occupation', 'address']}
          loading={loading}
          title="Parent Directory"
          description="Manage parent and guardian information"
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          itemsPerPage={15}
        />
      </div>
    </div>
  );
};

export default ParentsPage;
