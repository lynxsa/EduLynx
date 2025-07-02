'use client';

import { BookOpen, Clock, Filter, Search, Star, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

const mockCourses = [
  {
    id: 1,
    title: 'Mathematics Grade 12',
    description: 'Advanced mathematics covering calculus, algebra, and trigonometry',
    subject: 'Mathematics',
    grade: 12,
    instructor: 'Dr. Sarah Mthembu',
    duration: '36 weeks',
    students: 245,
    rating: 4.8,
    image: '/images/subjects/mathematics.jpg',
    tags: ['CAPS Aligned', 'NSC Prep', 'Advanced'],
  },
  {
    id: 2,
    title: 'Physical Sciences Grade 11',
    description: 'Physics and Chemistry fundamentals for Grade 11 learners',
    subject: 'Physical Sciences',
    grade: 11,
    instructor: 'Prof. Thabo Molefe',
    duration: '32 weeks',
    students: 189,
    rating: 4.6,
    image: '/images/subjects/physical-sciences.jpg',
    tags: ['CAPS Aligned', 'Practical Work', 'Laboratory'],
  },
  {
    id: 3,
    title: 'English Home Language Grade 10',
    description: 'Comprehensive English language and literature curriculum',
    subject: 'English',
    grade: 10,
    instructor: 'Ms. Nomsa Khumalo',
    duration: '30 weeks',
    students: 312,
    rating: 4.7,
    image: '/images/subjects/english.jpg',
    tags: ['CAPS Aligned', 'Literature', 'Writing Skills'],
  },
  {
    id: 4,
    title: 'Life Sciences Grade 9',
    description: 'Biology fundamentals and life processes',
    subject: 'Life Sciences',
    grade: 9,
    instructor: 'Dr. Mpho Radebe',
    duration: '28 weeks',
    students: 198,
    rating: 4.5,
    image: '/images/subjects/life-sciences.jpg',
    tags: ['CAPS Aligned', 'Biology', 'Ecosystems'],
  },
  {
    id: 5,
    title: 'History Grade 12',
    description: 'South African and world history for matric learners',
    subject: 'History',
    grade: 12,
    instructor: 'Mr. John Sibeko',
    duration: '34 weeks',
    students: 167,
    rating: 4.4,
    image: '/images/subjects/history.jpg',
    tags: ['CAPS Aligned', 'NSC Prep', 'Essays'],
  },
  {
    id: 6,
    title: 'Accounting Grade 11',
    description: 'Financial accounting and business principles',
    subject: 'Accounting',
    grade: 11,
    instructor: 'Ms. Priya Patel',
    duration: '30 weeks',
    students: 134,
    rating: 4.3,
    image: '/images/subjects/accounting.jpg',
    tags: ['CAPS Aligned', 'Business', 'Financial Literacy'],
  },
];

const subjects = [
  'All Subjects',
  'Mathematics',
  'Physical Sciences',
  'Life Sciences',
  'English',
  'Afrikaans',
  'History',
  'Geography',
  'Accounting',
  'Business Studies',
  'Economics',
  'Tourism',
];

const grades = ['All Grades', '8', '9', '10', '11', '12'];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedGrade, setSelectedGrade] = useState('All Grades');
  const [filteredCourses, setFilteredCourses] = useState(mockCourses);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let filtered = mockCourses;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        course =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by subject
    if (selectedSubject !== 'All Subjects') {
      filtered = filtered.filter(course => course.subject === selectedSubject);
    }

    // Filter by grade
    if (selectedGrade !== 'All Grades') {
      filtered = filtered.filter(course => course.grade.toString() === selectedGrade);
    }

    setFilteredCourses(filtered);
  }, [searchQuery, selectedSubject, selectedGrade]);

  const CourseCard = ({ course }: { course: (typeof mockCourses)[0] }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="relative h-48 bg-gradient-to-br from-purple-500 to-blue-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between text-white">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
              Grade {course.grade}
            </span>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{course.rating}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
            {course.title}
          </h3>
          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-md">
            {course.subject}
          </span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>

        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{course.students} students</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {course.instructor
                  .split(' ')
                  .map(n => n[0])
                  .join('')}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-700">{course.instructor}</span>
          </div>

          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
            View Course
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {course.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Hero Section with Search */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Course</h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Discover CAPS-aligned courses designed for South African high school learners
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="relative mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for courses, subjects, or instructors..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button className="absolute right-3 top-3">
                <Search className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>

              {subjects.slice(1, 6).map(subject => (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedSubject === subject
                      ? 'bg-white text-purple-600'
                      : 'bg-white/10 backdrop-blur-sm hover:bg-white/20'
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={e => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                <select
                  value={selectedGrade}
                  onChange={e => setSelectedGrade(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {grades.map(grade => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedSubject('All Subjects');
                    setSelectedGrade('All Grades');
                    setSearchQuery('');
                  }}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredCourses.length} Course{filteredCourses.length !== 1 ? 's' : ''} Found
            </h2>
            <p className="text-gray-600 mt-1">
              {searchQuery && `Results for "${searchQuery}"`}
              {selectedSubject !== 'All Subjects' && ` in ${selectedSubject}`}
              {selectedGrade !== 'All Grades' && ` for Grade ${selectedGrade}`}
            </p>
          </div>

          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            <option>Sort by Relevance</option>
            <option>Sort by Rating</option>
            <option>Sort by Students</option>
            <option>Sort by Duration</option>
          </select>
        </div>

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or browse all available courses.
            </p>
            <button
              onClick={() => {
                setSelectedSubject('All Subjects');
                setSelectedGrade('All Grades');
                setSearchQuery('');
              }}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Browse All Courses
            </button>
          </div>
        )}

        {/* Load More Button */}
        {filteredCourses.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Load More Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
