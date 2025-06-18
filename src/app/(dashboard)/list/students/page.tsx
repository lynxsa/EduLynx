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
  Activity,
  Heart,
  BookOpen,
  Users
} from 'lucide-react';

interface StudentItem {
  id: string;
  username: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  img?: string;
  bloodType: string;
  sex: string;
  gender: string;
  allergies?: string | null;
  medicalInfo?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  status?: string | null;
  birthday: string;
  parent: { id: string; name: string };
  class: { id: number; name: string };
  grade: { id: number; level: number };
  attendancePercent?: number | null;
  avgScore?: number | null;
}

const StudentsPage = () => {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/students');
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }
        const data = await response.json();
        setStudents(data.data || data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading students...</p>
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

  const getStatusColor = (status: string | null | undefined) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getGradeColor = (score: number | null | undefined) => {
    if (!score) return 'bg-gray-100 text-gray-800';
    if (score >= 75) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Student Records</h1>
          <p className="text-gray-600">Comprehensive student information and academic tracking</p>
        </div>

        {/* Search and Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search students..."
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
                Add Student
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {filteredStudents.length === 0 ? (
            <div className="p-12 text-center">
              <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No students found</p>
              <p className="text-gray-400">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xs text-gray-600 uppercase bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 font-medium">Student</th>
                    <th className="px-6 py-4 font-medium hidden md:table-cell">Grade & Class</th>
                    <th className="px-6 py-4 font-medium hidden lg:table-cell">Contact</th>
                    <th className="px-6 py-4 font-medium hidden lg:table-cell">Performance</th>
                    <th className="px-6 py-4 font-medium hidden xl:table-cell">Health Info</th>
                    <th className="px-6 py-4 font-medium hidden xl:table-cell">Parent</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            {student.img ? (
                              <Image
                                src={student.img}
                                alt={`${student.name} ${student.surname}`}
                                width={40}
                                height={40}
                                className="rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <span className="text-purple-600 font-medium text-sm">
                                  {student.name[0]}{student.surname[0]}
                                </span>
                              </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 border-2 border-white rounded-full"></div>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {student.name} {student.surname}
                            </p>
                            <p className="text-sm text-gray-500">@{student.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div>
                          <p className="font-medium text-gray-900">Grade {student.grade.level}</p>
                          <p className="text-sm text-gray-500">{student.class.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span className="truncate max-w-32">{student.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>{student.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${student.attendancePercent || 0}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600">{student.attendancePercent || 0}%</span>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${getGradeColor(student.avgScore)}`}>
                            Avg: {student.avgScore || 0}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden xl:table-cell">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Heart className="w-4 h-4 text-red-500" />
                            <span>{student.bloodType}</span>
                          </div>
                          {student.allergies && (
                            <p className="text-xs text-orange-600 truncate max-w-24">
                              {student.allergies}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden xl:table-cell">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 truncate max-w-24">
                            {student.parent.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(student.status)}`}>
                          {student.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/list/students/${student.id}`}
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
                <p className="text-2xl font-bold text-gray-900">{filteredStudents.length}</p>
                <p className="text-sm text-gray-600">Total Students</p>
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
                  {filteredStudents.filter(s => s.status === 'Active' || !s.status).length}
                </p>
                <p className="text-sm text-gray-600">Active</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(filteredStudents.reduce((acc, s) => acc + (s.avgScore || 0), 0) / filteredStudents.length || 0)}%
                </p>
                <p className="text-sm text-gray-600">Avg Score</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(filteredStudents.reduce((acc, s) => acc + (s.attendancePercent || 0), 0) / filteredStudents.length || 0)}%
                </p>
                <p className="text-sm text-gray-600">Avg Attendance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsPage;