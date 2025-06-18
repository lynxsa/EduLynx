import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Users, 
  Award, 
  Target,
  BookOpen,
  Clock
} from 'lucide-react';

// Mock performance data
const performanceData = {
  overallGPA: 3.45,
  passRate: 87.5,
  attendanceRate: 91.2,
  subjectPerformance: [
    { subject: 'Mathematics', average: 78.5, trend: 'up', students: 245 },
    { subject: 'English', average: 82.3, trend: 'up', students: 250 },
    { subject: 'Science', average: 75.8, trend: 'down', students: 238 },
    { subject: 'History', average: 79.2, trend: 'up', students: 220 },
    { subject: 'Geography', average: 73.4, trend: 'down', students: 205 },
    { subject: 'Life Skills', average: 85.6, trend: 'up', students: 255 }
  ],
  gradeDistribution: [
    { grade: 'A (80-100%)', count: 125, percentage: 15.6 },
    { grade: 'B (70-79%)', count: 298, percentage: 37.3 },
    { grade: 'C (60-69%)', count: 245, percentage: 30.6 },
    { grade: 'D (50-59%)', count: 89, percentage: 11.1 },
    { grade: 'F (0-49%)', count: 43, percentage: 5.4 }
  ],
  topPerformers: [
    { name: 'Sarah Johnson', grade: '12A', gpa: 4.0, subjects: 6 },
    { name: 'Michael Chen', grade: '11B', gpa: 3.95, subjects: 6 },
    { name: 'Emily Davis', grade: '12C', gpa: 3.89, subjects: 6 },
    { name: 'David Wilson', grade: '10A', gpa: 3.87, subjects: 5 },
    { name: 'Lisa Anderson', grade: '11A', gpa: 3.85, subjects: 6 }
  ],
  classPerformance: [
    { class: '12A', students: 35, average: 82.4, attendance: 94.2 },
    { class: '12B', students: 33, average: 78.9, attendance: 91.5 },
    { class: '11A', students: 38, average: 80.1, attendance: 92.8 },
    { class: '11B', students: 36, average: 77.3, attendance: 89.7 },
    { class: '10A', students: 40, average: 75.6, attendance: 93.1 },
    { class: '10B', students: 38, average: 73.2, attendance: 88.9 }
  ]
};

const PerformanceInsightsPage = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Performance Insights</h1>
          <p className="text-gray-600 mt-1">Analyze student academic performance and trends</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Generate Report
          </button>
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Export Data
          </button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overall GPA</p>
              <p className="text-2xl font-bold text-gray-900">{performanceData.overallGPA}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +0.15 from last term
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pass Rate</p>
              <p className="text-2xl font-bold text-gray-900">{performanceData.passRate}%</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +2.3% from last term
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-gray-900">{performanceData.attendanceRate}%</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +1.8% from last month
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">800</p>
              <p className="text-sm text-blue-600 flex items-center mt-1">
                <Users className="w-4 h-4 mr-1" />
                Across 6 grades
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Subject Performance & Grade Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Performance */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Performance</h3>
          <div className="space-y-4">
            {performanceData.subjectPerformance.map((subject, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{subject.subject}</p>
                    <p className="text-sm text-gray-500">{subject.students} students</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-2">
                  <div>
                    <p className="font-bold text-gray-900">{subject.average}%</p>
                    <div className="flex items-center">
                      {subject.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                      <span className={`text-xs ml-1 ${
                        subject.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {subject.trend === 'up' ? '+' : '-'}2.5%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h3>
          <div className="space-y-4">
            {performanceData.gradeDistribution.map((grade, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{grade.grade}</span>
                    <span className="text-sm text-gray-600">{grade.count} students</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        index === 0 ? 'bg-green-500' :
                        index === 1 ? 'bg-blue-500' :
                        index === 2 ? 'bg-yellow-500' :
                        index === 3 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${grade.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{grade.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers & Class Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
          <div className="space-y-3">
            {performanceData.topPerformers.map((student, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.grade} • {student.subjects} subjects</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{student.gpa} GPA</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Class Performance */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Class Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-2 text-sm font-medium text-gray-600">Class</th>
                  <th className="py-2 text-sm font-medium text-gray-600">Students</th>
                  <th className="py-2 text-sm font-medium text-gray-600">Average</th>
                  <th className="py-2 text-sm font-medium text-gray-600">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {performanceData.classPerformance.map((classData, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 font-medium text-gray-900">{classData.class}</td>
                    <td className="py-3 text-gray-600">{classData.students}</td>
                    <td className="py-3">
                      <span className={`font-bold ${
                        classData.average >= 80 ? 'text-green-600' :
                        classData.average >= 70 ? 'text-blue-600' :
                        classData.average >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {classData.average}%
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        classData.attendance >= 90 ? 'bg-green-100 text-green-800' :
                        classData.attendance >= 85 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {classData.attendance}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceInsightsPage;
