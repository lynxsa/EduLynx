'use client';

import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Download,
  Eye,
  Search,
  Share2,
  Star,
  Trophy,
  User,
} from 'lucide-react';
import { useState } from 'react';

// Mock data for certificates
const mockCertificates = [
  {
    id: 1,
    courseTitle: 'Mathematics Grade 12',
    subject: 'Mathematics',
    grade: 12,
    completionDate: '2024-06-15',
    instructor: 'Dr. Sarah Mthembu',
    score: 95,
    credentialId: 'LYNX-MATH-12-2024-001',
    status: 'issued',
    skills: ['Calculus', 'Algebra', 'Trigonometry', 'Statistics'],
  },
  {
    id: 2,
    courseTitle: 'Physical Sciences Grade 11',
    subject: 'Physical Sciences',
    grade: 11,
    completionDate: '2024-05-28',
    instructor: 'Prof. Thabo Molefe',
    score: 88,
    credentialId: 'LYNX-PHYS-11-2024-002',
    status: 'issued',
    skills: ['Physics', 'Chemistry', 'Laboratory Skills', 'Problem Solving'],
  },
  {
    id: 3,
    courseTitle: 'English Home Language Grade 10',
    subject: 'English',
    grade: 10,
    completionDate: '2024-06-10',
    instructor: 'Ms. Nomsa Khumalo',
    score: 92,
    credentialId: 'LYNX-ENG-10-2024-003',
    status: 'issued',
    skills: ['Literature Analysis', 'Essay Writing', 'Grammar', 'Comprehension'],
  },
  {
    id: 4,
    courseTitle: 'Life Sciences Grade 12',
    subject: 'Life Sciences',
    grade: 12,
    completionDate: '2024-06-20',
    instructor: 'Dr. Mpho Radebe',
    score: 90,
    credentialId: 'LYNX-LIFE-12-2024-004',
    status: 'processing',
    skills: ['Biology', 'Genetics', 'Ecology', 'Research Methods'],
  },
];

const achievements = [
  {
    title: 'CAPS Achiever',
    description: 'Completed 5+ CAPS-aligned courses',
    icon: Trophy,
    earned: true,
    date: '2024-06-20',
  },
  {
    title: 'Science Excellence',
    description: 'Average 90+ in science subjects',
    icon: Star,
    earned: true,
    date: '2024-06-15',
  },
  {
    title: 'Consistent Learner',
    description: '30 days of continuous learning',
    icon: Calendar,
    earned: false,
    date: null,
  },
  {
    title: 'Peer Mentor',
    description: 'Helped 10+ fellow students',
    icon: User,
    earned: false,
    date: null,
  },
];

export default function CertificatesPage() {
  const [selectedCertificate, setSelectedCertificate] = useState<
    (typeof mockCertificates)[0] | null
  >(null);
  const [showPreview, setShowPreview] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCertificates = mockCertificates.filter(cert => {
    const matchesSearch =
      cert.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || cert.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleDownload = (certificate: (typeof mockCertificates)[0]) => {
    // In a real implementation, this would generate and download a PDF
    console.log('Downloading certificate:', certificate.credentialId);
    alert(`Certificate ${certificate.credentialId} would be downloaded as PDF`);
  };

  const handleShare = (certificate: (typeof mockCertificates)[0]) => {
    const shareUrl = `https://lynxlearn.edu/verify/${certificate.credentialId}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Verification link copied to clipboard!');
  };

  const CertificatePreview = ({ certificate }: { certificate: (typeof mockCertificates)[0] }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Certificate Design */}
        <div className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 text-white p-8">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 w-16 h-16 border-2 border-white rounded-full"></div>
            <div className="absolute top-4 right-4 w-12 h-12 border-2 border-white rounded-full"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-2 border-white rounded-full"></div>
            <div className="absolute bottom-4 right-4 w-20 h-20 border-2 border-white rounded-full"></div>
          </div>

          <div className="relative text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h1 className="text-3xl font-bold mb-2">LYNXLearn Certificate</h1>
              <p className="text-purple-100">of Course Completion</p>
            </div>

            <div className="mb-8">
              <p className="text-lg mb-2">This is to certify that</p>
              <h2 className="text-4xl font-bold mb-2">Student Name</h2>
              <p className="text-lg">has successfully completed</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
              <h3 className="text-2xl font-bold mb-2">{certificate.courseTitle}</h3>
              <p className="text-purple-100 mb-4">
                {certificate.subject} • Grade {certificate.grade}
              </p>
              <div className="flex items-center justify-center space-x-8 text-sm">
                <div className="text-center">
                  <p className="font-medium">Final Score</p>
                  <p className="text-xl font-bold">{certificate.score}%</p>
                </div>
                <div className="text-center">
                  <p className="font-medium">Completion Date</p>
                  <p className="text-xl font-bold">
                    {new Date(certificate.completionDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 text-sm">
              <div>
                <p className="font-medium mb-1">Instructor</p>
                <p>{certificate.instructor}</p>
              </div>
              <div>
                <p className="font-medium mb-1">Credential ID</p>
                <p className="font-mono">{certificate.credentialId}</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-xs text-purple-100">
                Verify this certificate at lynxlearn.edu/verify/{certificate.credentialId}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-gray-50 flex justify-between">
          <button
            onClick={() => setShowPreview(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
          >
            Close
          </button>
          <div className="flex space-x-3">
            <button
              onClick={() => handleShare(certificate)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button
              onClick={() => handleDownload(certificate)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <Award className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your Certificates & Achievements
            </h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Showcase your learning achievements and download official certificates
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {mockCertificates.filter(c => c.status === 'issued').length}
            </h3>
            <p className="text-gray-600">Certificates Earned</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{mockCertificates.length}</h3>
            <p className="text-gray-600">Courses Completed</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {Math.round(
                mockCertificates.reduce((sum, cert) => sum + cert.score, 0) /
                  mockCertificates.length
              )}
              %
            </h3>
            <p className="text-gray-600">Average Score</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {achievements.filter(a => a.earned).length}
            </h3>
            <p className="text-gray-600">Achievements</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Certificates List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">My Certificates</h2>
                  <div className="flex space-x-3">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search certificates..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <select
                      value={filter}
                      onChange={e => setFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="issued">Issued</option>
                      <option value="processing">Processing</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="divide-y">
                {filteredCertificates.map(certificate => (
                  <div key={certificate.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {certificate.courseTitle}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              certificate.status === 'issued'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {certificate.status === 'issued' ? 'Ready' : 'Processing'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <span className="font-medium">Subject:</span> {certificate.subject}
                          </div>
                          <div>
                            <span className="font-medium">Grade:</span> {certificate.grade}
                          </div>
                          <div>
                            <span className="font-medium">Score:</span> {certificate.score}%
                          </div>
                          <div>
                            <span className="font-medium">Date:</span>{' '}
                            {new Date(certificate.completionDate).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {certificate.skills.slice(0, 3).map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md"
                            >
                              {skill}
                            </span>
                          ))}
                          {certificate.skills.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                              +{certificate.skills.length - 3} more
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-500 font-mono">
                          ID: {certificate.credentialId}
                        </p>
                      </div>

                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => {
                            setSelectedCertificate(certificate);
                            setShowPreview(true);
                          }}
                          className="p-2 text-gray-500 hover:text-blue-600 border border-gray-300 rounded-lg hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {certificate.status === 'issued' && (
                          <>
                            <button
                              onClick={() => handleShare(certificate)}
                              className="p-2 text-gray-500 hover:text-green-600 border border-gray-300 rounded-lg hover:bg-green-50"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDownload(certificate)}
                              className="p-2 text-gray-500 hover:text-purple-600 border border-gray-300 rounded-lg hover:bg-purple-50"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">Achievements</h3>
              </div>
              <div className="p-6 space-y-4">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 p-3 rounded-lg ${
                        achievement.earned
                          ? 'bg-yellow-50 border border-yellow-200'
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          achievement.earned
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4
                          className={`font-medium ${
                            achievement.earned ? 'text-gray-900' : 'text-gray-500'
                          }`}
                        >
                          {achievement.title}
                        </h4>
                        <p
                          className={`text-sm ${
                            achievement.earned ? 'text-gray-600' : 'text-gray-400'
                          }`}
                        >
                          {achievement.description}
                        </p>
                        {achievement.earned && achievement.date && (
                          <p className="text-xs text-yellow-600 mt-1">
                            Earned on {new Date(achievement.date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center space-x-3 px-4 py-3 text-left border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Download className="w-5 h-5 text-gray-600" />
                    <span>Download All Certificates</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-3 text-left border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Share2 className="w-5 h-5 text-gray-600" />
                    <span>Share Profile</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-3 text-left border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Eye className="w-5 h-5 text-gray-600" />
                    <span>View Transcript</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Preview Modal */}
      {showPreview && selectedCertificate && (
        <CertificatePreview certificate={selectedCertificate} />
      )}
    </div>
  );
}
