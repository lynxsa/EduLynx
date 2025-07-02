'use client';

import { motion } from 'framer-motion';
import {
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronRight,
  Clock,
  GraduationCap,
  Search,
  Star,
  Target,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import NSCLayout from '../layout/NSCLayout';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const gradeInfo = {
  8: {
    phase: 'Senior Phase',
    description: 'Foundation year building core skills',
    color: 'from-green-500 to-emerald-600',
  },
  9: {
    phase: 'Senior Phase',
    description: 'Preparation for FET Phase',
    color: 'from-blue-500 to-blue-600',
  },
  10: {
    phase: 'FET Phase',
    description: 'Foundation year for NSC preparation',
    color: 'from-purple-500 to-purple-600',
  },
  11: {
    phase: 'FET Phase',
    description: 'Intermediate year for NSC preparation',
    color: 'from-indigo-500 to-indigo-600',
  },
  12: {
    phase: 'FET Phase',
    description: 'Final NSC examination year',
    color: 'from-red-500 to-red-600',
  },
};

export default function ModernCoursesPage() {
  const [viewMode, setViewMode] = useState<'grade' | 'subject'>('grade');
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [expandedGrades, setExpandedGrades] = useState<Set<number>>(new Set([8, 9, 10, 11, 12]));
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch real data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [coursesRes, subjectsRes] = await Promise.all([
          fetch('/api/courses?limit=200'), // Request more courses to get all of them
          fetch('/api/subjects'),
        ]);

        if (coursesRes.ok && subjectsRes.ok) {
          const coursesData = await coursesRes.json();
          const subjectsData = await subjectsRes.json();
          setCourses(coursesData.data || coursesData.courses || []);
          setSubjects(subjectsData.data || subjectsData.subjects || []);
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setCourses([]);
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Group courses by grade
  const coursesByGrade = courses.reduce((acc, course) => {
    const grade = course.grade;
    if (!acc[grade]) acc[grade] = [];
    acc[grade].push(course);
    return acc;
  }, {});

  // Group courses by subject
  const coursesBySubject = courses.reduce((acc, course) => {
    const subjectName = course.subject?.name || 'Unknown';
    if (!acc[subjectName]) acc[subjectName] = [];
    acc[subjectName].push(course);
    return acc;
  }, {});

  // Filter courses based on search and selections
  const filteredCourses = courses.filter(course => {
    const matchesSearch =
      !searchTerm ||
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.subject?.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGrade = selectedGrade === 'all' || course.grade === selectedGrade;
    const matchesSubject = selectedSubject === 'all' || course.subject?.name === selectedSubject;

    return matchesSearch && matchesGrade && matchesSubject;
  });

  const toggleGradeExpansion = (grade: number) => {
    const newExpanded = new Set(expandedGrades);
    if (newExpanded.has(grade)) {
      newExpanded.delete(grade);
    } else {
      newExpanded.add(grade);
    }
    setExpandedGrades(newExpanded);
  };

  const stats = {
    totalCourses: courses.length,
    totalSubjects: subjects.length,
    grades: Object.keys(coursesByGrade).length,
    avgCoursesPerGrade:
      Object.keys(coursesByGrade).length > 0
        ? Math.round(courses.length / Object.keys(coursesByGrade).length)
        : 0,
  };

  if (loading) {
    return (
      <NSCLayout bgGradient="from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-900 dark:via-blue-900/10 dark:to-indigo-900/5">
        <div className="animate-pulse space-y-6">
          <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded-3xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </NSCLayout>
    );
  }

  return (
    <NSCLayout bgGradient="from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-900 dark:via-blue-900/10 dark:to-indigo-900/5">
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl shadow-blue-500/5"
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              CAPS Curriculum
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
              Complete South African Curriculum and Assessment Policy Statements
            </p>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                Grades 8-12
              </span>
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                NSC Aligned
              </span>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">
                DoE Approved
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl text-white">
              <BookOpen className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.totalCourses}</div>
              <div className="text-sm opacity-90">Total Courses</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-2xl text-white">
              <Target className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.totalSubjects}</div>
              <div className="text-sm opacity-90">Subjects</div>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 rounded-2xl text-white">
              <GraduationCap className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.grades}</div>
              <div className="text-sm opacity-90">Grade Levels</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl text-white">
              <Calendar className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.avgCoursesPerGrade}</div>
              <div className="text-sm opacity-90">Avg/Grade</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        variants={itemVariants}
        className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg"
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">View by:</span>
            <div className="flex rounded-lg bg-slate-100 dark:bg-slate-700 p-1">
              <button
                onClick={() => setViewMode('grade')}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  viewMode === 'grade'
                    ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <GraduationCap className="w-4 h-4 inline mr-2" />
                Grade
              </button>
              <button
                onClick={() => setViewMode('subject')}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  viewMode === 'subject'
                    ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-4 h-4 inline mr-2" />
                Subject
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-64"
              />
            </div>

            {/* Grade Filter */}
            <select
              value={selectedGrade}
              onChange={e =>
                setSelectedGrade(e.target.value === 'all' ? 'all' : parseInt(e.target.value))
              }
              className="px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Grades</option>
              {Object.keys(coursesByGrade)
                .sort()
                .map(grade => (
                  <option key={grade} value={grade}>
                    Grade {grade}
                  </option>
                ))}
            </select>

            {/* Subject Filter */}
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Subjects</option>
              {Object.keys(coursesBySubject)
                .sort()
                .map(subject => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Course Display */}
      {viewMode === 'grade' ? (
        // Grade-organized view
        <div className="space-y-6">
          {Object.keys(coursesByGrade)
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
                                <div className="text-2xl" style={{ color: course.subject?.color }}>
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
    </NSCLayout>
  );
}
