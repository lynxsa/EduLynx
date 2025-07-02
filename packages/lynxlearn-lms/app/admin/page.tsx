'use client';

import {
  AlertCircle,
  BarChart,
  BookOpen,
  CheckCircle,
  Clock,
  Download,
  Edit,
  Eye,
  FileText,
  PlusCircle,
  Settings,
  Trash2,
  Upload,
  Users,
} from 'lucide-react';
import { useState } from 'react';

// Mock data for demonstration
const mockCourses = [
  {
    id: 1,
    title: 'Mathematics Grade 12',
    subject: 'Mathematics',
    grade: 12,
    status: 'published',
    students: 245,
    lessons: 24,
    lastUpdated: '2024-06-20',
    instructor: 'Dr. Sarah Mthembu',
  },
  {
    id: 2,
    title: 'Physical Sciences Grade 11',
    subject: 'Physical Sciences',
    grade: 11,
    status: 'draft',
    students: 0,
    lessons: 18,
    lastUpdated: '2024-06-22',
    instructor: 'Prof. Thabo Molefe',
  },
  {
    id: 3,
    title: 'English Home Language Grade 10',
    subject: 'English',
    grade: 10,
    status: 'review',
    students: 312,
    lessons: 20,
    lastUpdated: '2024-06-21',
    instructor: 'Ms. Nomsa Khumalo',
  },
];

const mockUsers = [
  {
    id: 1,
    name: 'Sipho Mahlangu',
    email: 'sipho.mahlangu@student.edu',
    role: 'student',
    grade: 12,
    courses: 6,
    lastActive: '2024-06-24',
  },
  {
    id: 2,
    name: 'Dr. Sarah Mthembu',
    email: 'sarah.mthembu@instructor.edu',
    role: 'instructor',
    grade: null,
    courses: 3,
    lastActive: '2024-06-24',
  },
  {
    id: 3,
    name: 'Nomsa Khumalo',
    email: 'nomsa.khumalo@instructor.edu',
    role: 'instructor',
    grade: null,
    courses: 2,
    lastActive: '2024-06-23',
  },
];

const stats = [
  {
    label: 'Total Students',
    value: '1,247',
    change: '+12%',
    icon: Users,
    color: 'blue',
  },
  {
    label: 'Active Courses',
    value: '45',
    change: '+3%',
    icon: BookOpen,
    color: 'green',
  },
  {
    label: 'Total Instructors',
    value: '18',
    change: '+2%',
    icon: Users,
    color: 'purple',
  },
  {
    label: 'Course Completion',
    value: '87%',
    change: '+5%',
    icon: BarChart,
    color: 'orange',
  },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const StatusBadge = ({ status }: { status: string }) => {
    const colors = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      review: 'bg-blue-100 text-blue-800',
    };

    const icons = {
      published: CheckCircle,
      draft: Clock,
      review: AlertCircle,
    };

    const Icon = icons[status as keyof typeof icons];

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}
      >
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const UploadModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Upload Course Content</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter course title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>Mathematics</option>
                <option>Physical Sciences</option>
                <option>Life Sciences</option>
                <option>English</option>
                <option>History</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>8</option>
                <option>9</option>
                <option>10</option>
                <option>11</option>
                <option>12</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Files</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Drag and drop files here, or click to select</p>
              <p className="text-xs text-gray-500 mt-1">Supports: PDF, MP4, ZIP (Max 100MB)</p>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => setShowUploadModal(false)}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Upload Course
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your LMS content and users</p>
            </div>

            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Course</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart },
              { id: 'courses', label: 'Courses', icon: BookOpen },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'content', label: 'Content', icon: FileText },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                      </div>
                      <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                        <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    'New student enrolled in Mathematics Grade 12',
                    'Physical Sciences Grade 11 course updated',
                    'Dr. Sarah Mthembu uploaded new lesson content',
                    'Student completed English Home Language assignment',
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700">{activity}</span>
                      <span className="text-sm text-gray-500 ml-auto">2 hours ago</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Course Management</h2>
              <div className="flex space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  <Upload className="w-4 h-4" />
                  <span>Bulk Upload</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Course</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Instructor</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Students</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Last Updated</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockCourses.map(course => (
                    <tr key={course.id} className="border-t hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{course.title}</p>
                          <p className="text-sm text-gray-500">
                            {course.subject} • Grade {course.grade} • {course.lessons} lessons
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-700">{course.instructor}</td>
                      <td className="py-4 px-4">
                        <StatusBadge status={course.status} />
                      </td>
                      <td className="py-4 px-4 text-gray-700">{course.students}</td>
                      <td className="py-4 px-4 text-gray-700">{course.lastUpdated}</td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button className="p-1 text-gray-500 hover:text-blue-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-500 hover:text-green-600">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-500 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">User Management</h2>
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option>All Roles</option>
                  <option>Students</option>
                  <option>Instructors</option>
                  <option>Admins</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Courses</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Last Active</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.map(user => (
                    <tr key={user.id} className="border-t hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {user.name
                                .split(' ')
                                .map(n => n[0])
                                .join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'student'
                              ? 'bg-blue-100 text-blue-800'
                              : user.role === 'instructor'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                        {user.grade && (
                          <span className="ml-2 text-sm text-gray-500">Grade {user.grade}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-gray-700">{user.courses}</td>
                      <td className="py-4 px-4 text-gray-700">{user.lastActive}</td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button className="p-1 text-gray-500 hover:text-blue-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-500 hover:text-green-600">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Content Management</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center space-x-3 mb-4">
                  <Upload className="w-8 h-8 text-purple-600" />
                  <div>
                    <h3 className="font-semibold">Bulk Upload</h3>
                    <p className="text-sm text-gray-600">Upload multiple courses via CSV</p>
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  Upload CSV
                </button>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center space-x-3 mb-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">Content Library</h3>
                    <p className="text-sm text-gray-600">Manage shared resources</p>
                  </div>
                </div>
                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Browse Library
                </button>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center space-x-3 mb-4">
                  <BarChart className="w-8 h-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold">Analytics</h3>
                    <p className="text-sm text-gray-600">Course performance metrics</p>
                  </div>
                </div>
                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  View Reports
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">System Settings</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="font-semibold mb-4">General Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform Name
                    </label>
                    <input
                      type="text"
                      defaultValue="LYNXLearn LMS"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Language
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      <option>English</option>
                      <option>Afrikaans</option>
                      <option>Zulu</option>
                      <option>Xhosa</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="font-semibold mb-4">Email Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SMTP Server
                    </label>
                    <input
                      type="text"
                      placeholder="smtp.example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From Email
                    </label>
                    <input
                      type="email"
                      placeholder="noreply@lynxlearn.edu"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && <UploadModal />}
    </div>
  );
}
