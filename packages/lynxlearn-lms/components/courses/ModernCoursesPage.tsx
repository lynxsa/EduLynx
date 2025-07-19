'use client';

import { motion } from 'framer-motion';
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Clock,
  Filter,
  Grid3X3,
  List,
  Search,
  Sparkles,
  Star,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { courses as courseData } from '../../app/courses/data';
import NSCLayout from '../layout/NSCLayout';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: string;
  enrolled: number;
  rating: number;
  image: string;
  category: string;
  price: number;
  badge?: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  grade: number;
  subject?: {
    name: string;
    code: string;
    color: string;
    icon: string;
  };
  modules?: Array<{
    id: string;
    title: string;
    description: string;
    duration: string;
    lessons: Array<{
      id: string;
      title: string;
      duration: string;
      type: 'video' | 'reading' | 'exercise';
    }>;
  }>;
  estimatedHours?: number;
  prerequisites?: string[];
  outcomes?: string[];
}

// Grade information with enhanced styling
const gradeInfo = {
  8: {
    phase: 'Senior Phase',
    description: 'Foundation building year',
    color: 'from-emerald-500 to-emerald-600',
  },
  9: {
    phase: 'Senior Phase',
    description: 'Core concepts mastery',
    color: 'from-blue-500 to-blue-600',
  },
  10: {
    phase: 'FET Phase',
    description: 'FET foundation year',
    color: 'from-purple-500 to-purple-600',
  },
  11: {
    phase: 'FET Phase',
    description: 'Advanced preparation',
    color: 'from-orange-500 to-orange-600',
  },
  12: {
    phase: 'Matric Year',
    description: 'Final NSC preparation',
    color: 'from-red-500 to-red-600',
  },
};

// Subject definitions with enhanced styling
const subjects = [
  { name: 'Mathematics', code: 'MATH', color: '#3B82F6', icon: '📐' },
  { name: 'Mathematical Literacy', code: 'MLIT', color: '#06B6D4', icon: '🔢' },
  { name: 'Physical Sciences', code: 'PHYS', color: '#8B5CF6', icon: '⚡' },
  { name: 'Life Sciences', code: 'LIFE', color: '#10B981', icon: '🧬' },
  { name: 'Geography', code: 'GEOG', color: '#F59E0B', icon: '🌍' },
  { name: 'History', code: 'HIST', color: '#EF4444', icon: '📜' },
  { name: 'English Home Language', code: 'EHL', color: '#EC4899', icon: '📚' },
  { name: 'Afrikaans Home Language', code: 'AHL', color: '#F97316', icon: '📖' },
  { name: 'Life Orientation', code: 'LO', color: '#84CC16', icon: '🌟' },
  { name: 'Business Studies', code: 'BUS', color: '#6366F1', icon: '💼' },
  { name: 'Economics', code: 'ECON', color: '#8B5CF6', icon: '📈' },
  { name: 'Accounting', code: 'ACC', color: '#059669', icon: '💰' },
  { name: 'Tourism', code: 'TOUR', color: '#0891B2', icon: '✈️' },
  { name: 'Information Technology', code: 'IT', color: '#7C3AED', icon: '💻' },
  { name: 'Computer Applications Technology', code: 'CAT', color: '#2563EB', icon: '🖥️' },
  { name: 'Consumer Studies', code: 'CONS', color: '#DC2626', icon: '🛍️' },
  { name: 'Hospitality Studies', code: 'HOSP', color: '#D97706', icon: '🍽️' },
  { name: 'Visual Arts', code: 'ARTS', color: '#BE185D', icon: '🎨' },
  { name: 'Dramatic Arts', code: 'DRAMA', color: '#7C2D12', icon: '🎭' },
  { name: 'Music', code: 'MUSIC', color: '#1E40AF', icon: '🎵' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function ModernCoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grade' | 'subject'>('grade');
  const [expandedGrades, setExpandedGrades] = useState<Set<number>>(new Set([8, 9, 10, 11, 12]));
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    // Simulate loading and set courses data
    setTimeout(() => {
      setCourses(courseData);
      setLoading(false);
    }, 500);
  }, []);

  const toggleGradeExpansion = (grade: number) => {
    const newExpanded = new Set(expandedGrades);
    if (newExpanded.has(grade)) {
      newExpanded.delete(grade);
    } else {
      newExpanded.add(grade);
    }
    setExpandedGrades(newExpanded);
  };

  // Filter courses based on search and filters
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch =
        searchTerm === '' ||
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.subject?.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGrade = selectedGrade === 'all' || course.grade.toString() === selectedGrade;
      const matchesSubject = selectedSubject === 'all' || course.subject?.name === selectedSubject;

      return matchesSearch && matchesGrade && matchesSubject;
    });
  }, [courses, searchTerm, selectedGrade, selectedSubject]);

  // Group courses by grade
  const coursesByGrade = useMemo(() => {
    const grouped: { [key: number]: Course[] } = {};
    filteredCourses.forEach(course => {
      if (!grouped[course.grade]) {
        grouped[course.grade] = [];
      }
      grouped[course.grade].push(course);
    });
    return grouped;
  }, [filteredCourses]);

  // Group courses by subject
  const coursesBySubject = useMemo(() => {
    const grouped: { [key: string]: Course[] } = {};
    filteredCourses.forEach(course => {
      const subjectName = course.subject?.name || 'Other';
      if (!grouped[subjectName]) {
        grouped[subjectName] = [];
      }
      grouped[subjectName].push(course);
    });
    return grouped;
  }, [filteredCourses]);

  const availableGrades = useMemo(() => {
    return [...new Set(courses.map(course => course.grade.toString()))].sort();
  }, [courses]);

  const availableSubjects = useMemo(() => {
    return [...new Set(courses.map(course => course.subject?.name).filter(Boolean))].sort();
  }, [courses]);

  if (loading) {
    return (
      <NSCLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Loading comprehensive CAPS curriculum...
            </p>
          </div>
        </div>
      </NSCLayout>
    );
  }

  return (
    <NSCLayout>
      <motion.div
        className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div className="text-center" variants={itemVariants}>
              <div className="flex justify-center items-center gap-2 mb-4">
                <Sparkles className="w-8 h-8 text-yellow-300" />
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  CAPS Courses
                </h1>
                <Sparkles className="w-8 h-8 text-yellow-300" />
              </div>
              <p className="text-xl md:text-2xl text-blue-100 mb-2">
                Comprehensive South African School Curriculum
              </p>
              <p className="text-lg text-blue-200 mb-8">
                Master every subject from Grade 8 to Matric with our CAPS-aligned courses
              </p>

              {/* Course Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{courses.length}</div>
                  <div className="text-sm text-blue-200">Total Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">5</div>
                  <div className="text-sm text-blue-200">Grade Levels</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{subjects.length}</div>
                  <div className="text-sm text-blue-200">Subjects</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">100%</div>
                  <div className="text-sm text-blue-200">CAPS Aligned</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Animated Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-300/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <motion.div
          className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-700/50"
          variants={itemVariants}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search courses, subjects, or topics..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-3 items-center flex-wrap">
                {/* Grade Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-slate-500" />
                  <select
                    value={selectedGrade}
                    onChange={e => setSelectedGrade(e.target.value)}
                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Grades</option>
                    {availableGrades.map(grade => (
                      <option key={grade} value={grade}>
                        Grade {grade}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject Filter */}
                <select
                  value={selectedSubject}
                  onChange={e => setSelectedSubject(e.target.value)}
                  className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Subjects</option>
                  {availableSubjects.map(subject => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>

                {/* View Mode Toggle */}
                <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grade')}
                    className={`px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
                      viewMode === 'grade'
                        ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                    <span className="hidden sm:inline">By Grade</span>
                  </button>
                  <button
                    onClick={() => setViewMode('subject')}
                    className={`px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
                      viewMode === 'subject'
                        ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <List className="w-4 h-4" />
                    <span className="hidden sm:inline">By Subject</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedGrade !== 'all' || selectedSubject !== 'all' || searchTerm) && (
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="text-sm text-slate-600 dark:text-slate-400">Active filters:</span>
                {selectedGrade !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                    Grade {selectedGrade}
                    <button
                      onClick={() => setSelectedGrade('all')}
                      className="ml-1 hover:text-blue-600"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedSubject !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm">
                    {selectedSubject}
                    <button
                      onClick={() => setSelectedSubject('all')}
                      className="ml-1 hover:text-purple-600"
                    >
                      ×
                    </button>
                  </span>
                )}
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm">
                    "{searchTerm}"
                    <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-green-600">
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSelectedGrade('all');
                    setSelectedSubject('all');
                    setSearchTerm('');
                  }}
                  className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Course Results Summary */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between text-slate-600 dark:text-slate-400 mb-6"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <span>
                Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
                {searchTerm && ` for "${searchTerm}"`}
                {selectedGrade !== 'all' && ` in Grade ${selectedGrade}`}
                {selectedSubject !== 'all' && ` for ${selectedSubject}`}
              </span>
            </div>
            <div className="text-sm">
              Organized by {viewMode === 'grade' ? 'Grade Level' : 'Subject Area'}
            </div>
          </motion.div>
        </div>

        {/* Courses Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {viewMode === 'grade' ? (
            // Grade-organized view
            <div className="space-y-8">
              {Object.keys(coursesByGrade)
                .map(grade => parseInt(grade))
                .sort((a, b) => parseInt(a) - parseInt(b))
                .map(grade => {
                  const gradeNum = parseInt(grade);
                  const gradeCourses = coursesByGrade[gradeNum];
                  const info = gradeInfo[gradeNum];
                  const isExpanded = expandedGrades.has(gradeNum);

                  return (
                    <motion.div
                      key={grade}
                      variants={itemVariants}
                      className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-lg overflow-hidden"
                    >
                      {/* Grade Header */}
                      <div
                        className={`bg-gradient-to-r ${info?.color || 'from-blue-500 to-blue-600'} p-6 cursor-pointer`}
                        onClick={() => toggleGradeExpansion(gradeNum)}
                      >
                        <div className="flex items-center justify-between text-white">
                          <div className="flex items-center gap-4">
                            <div className="text-4xl font-bold">Grade {grade}</div>
                            <div>
                              <div className="text-lg font-semibold">{info?.phase}</div>
                              <div className="text-sm opacity-90">{info?.description}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold">{gradeCourses.length}</div>
                              <div className="text-sm opacity-90">Subjects</div>
                            </div>
                            {isExpanded ? (
                              <ChevronDown className="w-6 h-6" />
                            ) : (
                              <ChevronRight className="w-6 h-6" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Grade Courses */}
                      {isExpanded && (
                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {gradeCourses.map(course => (
                              <Link key={course.id} href={`/courses/${course.id}`}>
                                <motion.div
                                  variants={itemVariants}
                                  className="group bg-slate-50 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-700 rounded-xl p-4 border border-slate-200/50 dark:border-slate-600/50 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                                >
                                  <div className="flex items-start gap-3">
                                    <div
                                      className="text-2xl"
                                      style={{ color: course.subject?.color }}
                                    >
                                      {course.subject?.icon || '📚'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1 truncate">
                                        {course.subject?.name}
                                      </h4>
                                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                                        {course.description}
                                      </p>
                                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
                                        <Clock className="w-3 h-3" />
                                        <span>{course.estimatedHours || 160}h</span>
                                        <span>•</span>
                                        <span
                                          className={`px-2 py-1 rounded-full ${
                                            course.difficulty === 'BEGINNER'
                                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                              : course.difficulty === 'INTERMEDIATE'
                                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                          }`}
                                        >
                                          {course.difficulty}
                                        </span>
                                      </div>
                                      {course.modules && course.modules.length > 0 && (
                                        <div className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                                          {course.modules.length} modules
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
            </div>
          ) : (
            // Subject-organized view
            <div className="space-y-6">
              {Object.keys(coursesBySubject)
                .sort()
                .map(subjectName => {
                  const subjectCourses = coursesBySubject[subjectName];
                  const subject = subjects.find(s => s.name === subjectName);

                  return (
                    <motion.div
                      key={subjectName}
                      variants={itemVariants}
                      className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg"
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className="text-3xl" style={{ color: subject?.color }}>
                          {subject?.icon || '📚'}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                            {subjectName}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400">
                            {subjectCourses.length} courses across grades{' '}
                            {Math.min(...subjectCourses.map(c => c.grade))}-
                            {Math.max(...subjectCourses.map(c => c.grade))}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {subjectCourses
                          .sort((a, b) => a.grade - b.grade)
                          .map(course => (
                            <Link key={course.id} href={`/courses/${course.id}`}>
                              <motion.div
                                variants={itemVariants}
                                className="group bg-slate-50 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-700 rounded-xl p-4 border border-slate-200/50 dark:border-slate-600/50 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${gradeInfo[course.grade]?.color || 'from-gray-500 to-gray-600'} text-white`}
                                  >
                                    Grade {course.grade}
                                  </span>
                                  <div className="flex items-center gap-1 text-yellow-500">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="text-sm font-medium">4.8</span>
                                  </div>
                                </div>
                                <h4 className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                                  {course.title}
                                </h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                                  {course.description}
                                </p>
                                <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-500">
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{course.estimatedHours || 160}h</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4" />
                                    <span>{course.modules?.length || 0} modules</span>
                                  </div>
                                </div>
                              </motion.div>
                            </Link>
                          ))}
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          )}

          {/* No Results */}
          {filteredCourses.length === 0 && !loading && (
            <motion.div
              variants={itemVariants}
              className="text-center py-12 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50"
            >
              <BookOpen className="mx-auto h-16 w-16 text-slate-400 mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                No courses found
              </h3>
              <p className="text-slate-500 dark:text-slate-500 mb-4">
                {courses.length === 0
                  ? 'Loading comprehensive CAPS curriculum...'
                  : 'Try adjusting your search or filter criteria.'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Clear search
                </button>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </NSCLayout>
  );
}
