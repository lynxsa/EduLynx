'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin,
  GraduationCap,
  Calendar,
  Activity
} from 'lucide-react';

interface Teacher {
  id: string;
  username: string;
  name: string;
  surname: string;
  email: string;
  phone?: string;
  address: string;
  img?: string;
  sex: string;
  birthday: string;
  department?: string;
  specialization?: string;
  yearsOfExperience?: number;
  qualification?: string;
  employmentStatus?: string;
  subjects: Array<{
    id: number;
    name: string;
  }>;
  classes: Array<{
    id: number;
    name: string;
    capacity: number;
  }>;
  _count?: {
    subjects: number;
    classes: number;
  };
}

const TeachersPage = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch('/api/teachers');
        if (!response.ok) {
          throw new Error('Failed to fetch teachers');
        }
        const data = await response.json();
        setTeachers(data.data || data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (teacher.department && teacher.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading teachers...</p>
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
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Teaching Staff</h1>
          <p className="text-gray-600">Manage and monitor all teaching personnel</p>
        </div>

        {/* Search and Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Add Teacher
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Teachers Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {filteredTeachers.length === 0 ? (
            <div className="p-12 text-center">
              <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No teachers found</p>
              <p className="text-gray-400">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xs text-gray-600 uppercase bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 font-medium">Teacher</th>
                    <th className="px-6 py-4 font-medium hidden md:table-cell">Contact</th>
                    <th className="px-6 py-4 font-medium hidden lg:table-cell">Department</th>
                    <th className="px-6 py-4 font-medium hidden lg:table-cell">Experience</th>
                    <th className="px-6 py-4 font-medium hidden xl:table-cell">Subjects</th>
                    <th className="px-6 py-4 font-medium hidden xl:table-cell">Classes</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTeachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Image
                              src={teacher.img || '/noAvatar.png'}
                              alt={`${teacher.name} ${teacher.surname}`}
                              width={40}
                              height={40}
                              className="rounded-full object-cover"
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {teacher.name} {teacher.surname}
                            </p>
                            <p className="text-sm text-gray-500">@{teacher.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span className="truncate max-w-32">{teacher.email}</span>
                          </div>
                          {teacher.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-4 h-4" />
                              <span>{teacher.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div>
                          <p className="font-medium text-gray-900">{teacher.department || 'General'}</p>
                          <p className="text-sm text-gray-500">{teacher.specialization || 'Multiple Subjects'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {teacher.yearsOfExperience || 0} years
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden xl:table-cell">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {teacher._count?.subjects || teacher.subjects?.length || 0} subjects
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden xl:table-cell">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {teacher._count?.classes || teacher.classes?.length || 0} classes
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          teacher.employmentStatus === 'Active' || !teacher.employmentStatus
                            ? 'bg-green-100 text-green-800'
                            : teacher.employmentStatus === 'On Leave'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {teacher.employmentStatus || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/list/teachers/${teacher.id}`}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats Footer */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <GraduationCap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{filteredTeachers.length}</p>
                <p className="text-sm text-gray-600">Total Teachers</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredTeachers.filter(t => t.employmentStatus === 'Active' || !t.employmentStatus).length}
                </p>
                <p className="text-sm text-gray-600">Active</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Calendar className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredTeachers.filter(t => t.employmentStatus === 'On Leave').length}
                </p>
                <p className="text-sm text-gray-600">On Leave</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(filteredTeachers.reduce((acc, t) => acc + (t.yearsOfExperience || 0), 0) / filteredTeachers.length || 0)}
                </p>
                <p className="text-sm text-gray-600">Avg Experience</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeachersPage;
