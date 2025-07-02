'use client';

import { motion } from 'framer-motion';
import {
  BarChart3,
  BookOpen,
  ChevronRight,
  Clock,
  Filter,
  Grid3X3,
  List,
  Play,
  Search,
  Star,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ModernLayout } from '../ui/modern-layout';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ModernCoursesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [coursesRes, subjectsRes] = await Promise.all([
          fetch('/api/courses'),
          fetch('/api/subjects')
        ]);
        
        if (coursesRes.ok && subjectsRes.ok) {
          const coursesData = await coursesRes.json();
          const subjectsData = await subjectsRes.json();
          setCourses(coursesData.courses || []);
          setSubjects(subjectsData.subjects || []);
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        // Fallback to mock data if API fails
        setCourses([]);
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = {
    totalCourses: courses.length,
    completedCourses: courses.filter(c => c.progress >= 100).length,
    inProgress: courses.filter(c => c.progress > 0 && c.progress < 100).length,
    averageProgress: courses.length > 0 ? Math.round(
      courses.reduce((acc, c) => acc + (c.progress || 0), 0) / courses.length
    ) : 0,
  };

  const filters = [
    { id: 'all', label: 'All Subjects', count: courses.length },
    { id: 'mathematics', label: 'Mathematics', count: courses.filter(c => c.subjectId === 'mathematics').length },
    { id: 'physics', label: 'Physical Sciences', count: courses.filter(c => c.subjectId === 'physics').length },
    { id: 'biology', label: 'Life Sciences', count: courses.filter(c => c.subjectId === 'biology').length },
    { id: 'english', label: 'Languages', count: courses.filter(c => c.subjectId === 'english').length },
  ];

  const filteredCourses = selectedFilter === 'all' 
    ? courses 
    : courses.filter(course => course.subjectId === selectedFilter);

  if (loading) {
    return (
      <ModernLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="animate-pulse space-y-6">
              <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ModernLayout>
    );
  }

  return (
    <ModernLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6"
        >
          {/* Enhanced Header Section */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6 text-white"
          >
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-2">NSC Courses</h1>
                  <p className="text-blue-100 text-lg mb-4">
                    Master your matric subjects with our comprehensive South African curriculum
                  </p>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-2xl font-bold">{stats.totalCourses}</div>
                      <div className="text-blue-100 text-sm">Available Courses</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-2xl font-bold">{stats.averageProgress}%</div>
                      <div className="text-blue-100 text-sm">Avg Progress</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-2xl font-bold">{stats.inProgress}</div>
                      <div className="text-blue-100 text-sm">In Progress</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-2xl font-bold">{stats.completedCourses}</div>
                      <div className="text-blue-100 text-sm">Completed</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
      bgGradient: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      nextLesson: 'Biology: Genetics & Heredity',
      category: 'science',
      skills: ['Research', 'Observation', 'Analysis'],
      lastAccessed: '3 hours ago',
    },
    {
      id: 4,
      name: 'English Home Language',
      description: 'Enhance language skills, literature analysis and communication',
      progress: 71,
      totalLessons: 36,
      completedLessons: 26,
      difficulty: 'Intermediate',
      estimatedTime: '90 hours',
      instructor: 'Ms. Sarah Johnson',
      rating: 4.6,
      students: 1156,
      icon: '📚',
      image:
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=240&fit=crop&crop=top',
      gradient: 'from-indigo-500 to-blue-600',
      bgGradient: 'from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20',
      nextLesson: 'Poetry Analysis: Metaphors',
      category: 'language',
      skills: ['Communication', 'Critical Reading', 'Writing'],
      lastAccessed: '5 hours ago',
    },
    {
      id: 5,
      name: 'Accounting',
      description: 'Learn financial principles and business accounting practices',
      progress: 45,
      totalLessons: 44,
      completedLessons: 20,
      difficulty: 'Intermediate',
      estimatedTime: '110 hours',
      instructor: 'Mr. David Nkomo',
      rating: 4.5,
      students: 634,
      icon: '💼',
      image:
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=240&fit=crop&crop=top',
      gradient: 'from-yellow-500 to-orange-600',
      bgGradient: 'from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
      nextLesson: 'Financial Statements',
      category: 'commerce',
      skills: ['Financial Literacy', 'Analysis', 'Problem Solving'],
      lastAccessed: '1 week ago',
    },
    {
      id: 6,
      name: 'Geography',
      description: 'Explore physical and human geography for NSC preparation',
      progress: 58,
      totalLessons: 38,
      completedLessons: 22,
      difficulty: 'Basic',
      estimatedTime: '85 hours',
      instructor: 'Dr. Lerato Molefe',
      rating: 4.4,
      students: 567,
      icon: '🌍',
      image:
        'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=240&fit=crop&crop=top',
      gradient: 'from-teal-500 to-green-600',
      bgGradient: 'from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20',
      nextLesson: 'Climate Change Effects',
      category: 'social',
      skills: ['Spatial Thinking', 'Environmental Awareness', 'Data Interpretation'],
      lastAccessed: '2 days ago',
    },
    {
      id: 7,
      name: 'History',
      description: 'Discover South African and world history for NSC excellence',
      progress: 42,
      totalLessons: 35,
      completedLessons: 15,
      difficulty: 'Intermediate',
      estimatedTime: '95 hours',
      instructor: 'Prof. Mandla Sithole',
      rating: 4.3,
      students: 423,
      icon: '📜',
      image:
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=240&fit=crop&crop=center',
      gradient: 'from-amber-500 to-red-600',
      bgGradient: 'from-amber-50 to-red-50 dark:from-amber-900/20 dark:to-red-900/20',
      nextLesson: 'Apartheid Era Analysis',
      category: 'social',
      skills: ['Critical Analysis', 'Research', 'Writing'],
      lastAccessed: '4 days ago',
    },
    {
      id: 8,
      name: 'Computer Applications Technology',
      description: 'Master digital skills and computer applications for the modern world',
      progress: 89,
      totalLessons: 42,
      completedLessons: 37,
      difficulty: 'Basic',
      estimatedTime: '75 hours',
      instructor: 'Ms. Priya Naidoo',
      rating: 4.7,
      students: 678,
      icon: '💻',
      image:
        'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=240&fit=crop&crop=center',
      gradient: 'from-cyan-500 to-blue-600',
      bgGradient: 'from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20',
      nextLesson: 'Advanced Spreadsheet Functions',
      category: 'technology',
      skills: ['Digital Literacy', 'Data Management', 'Problem Solving'],
      lastAccessed: '1 hour ago',
    },
    {
      id: 9,
      name: 'Business Studies',
      description: 'Learn business principles, entrepreneurship and economics',
      progress: 67,
      totalLessons: 39,
      completedLessons: 26,
      difficulty: 'Intermediate',
      estimatedTime: '105 hours',
      instructor: 'Mr. Tshepo Mahole',
      rating: 4.5,
      students: 534,
      icon: '📊',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=240&fit=crop&crop=center',
      gradient: 'from-emerald-500 to-blue-600',
      bgGradient: 'from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20',
      nextLesson: 'Marketing Strategies',
      category: 'commerce',
      skills: ['Strategic Thinking', 'Leadership', 'Communication'],
      lastAccessed: '6 hours ago',
    },
    {
      id: 10,
      name: 'Afrikaans First Additional Language',
      description: 'Develop proficiency in Afrikaans language and literature',
      progress: 35,
      totalLessons: 28,
      completedLessons: 10,
      difficulty: 'Intermediate',
      estimatedTime: '80 hours',
      instructor: 'Mnr. Johan van der Merwe',
      rating: 4.2,
      students: 298,
      icon: '🗣️',
      image:
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=240&fit=crop&crop=center',
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
      nextLesson: 'Comprehension Skills',
      category: 'language',
      skills: ['Language Skills', 'Cultural Understanding', 'Communication'],
      lastAccessed: '1 week ago',
    },
  ];

  const filters = [
    { id: 'all', label: 'All Subjects', count: courses.length },
    {
      id: 'core',
      label: 'Core Subjects',
      count: courses.filter(c => c.category === 'core').length,
    },
    {
      id: 'science',
      label: 'Sciences',
      count: courses.filter(c => c.category === 'science').length,
    },
    {
      id: 'language',
      label: 'Languages',
      count: courses.filter(c => c.category === 'language').length,
    },
    {
      id: 'commerce',
      label: 'Commerce',
      count: courses.filter(c => c.category === 'commerce').length,
    },
    {
      id: 'social',
      label: 'Social Sciences',
      count: courses.filter(c => c.category === 'social').length,
    },
    {
      id: 'technology',
      label: 'Technology',
      count: courses.filter(c => c.category === 'technology').length,
    },
  ];

  const filteredCourses =
    selectedFilter === 'all'
      ? courses
      : courses.filter(course => course.category === selectedFilter);

  const stats = {
    totalCourses: courses.length,
    completedCourses: courses.filter(c => c.progress === 100).length,
    inProgress: courses.filter(c => c.progress > 0 && c.progress < 100).length,
    averageProgress: Math.round(
      courses.reduce((acc, course) => acc + course.progress, 0) / courses.length
    ),
  };

  return (
    <ModernLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6"
        >
          {/* Enhanced Header Section */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6 text-white"
          >
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-2">NSC Courses</h1>
                  <p className="text-blue-100 text-lg mb-4">
                    Master your matric subjects with our comprehensive curriculum
                  </p>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-2xl font-bold">{stats.totalCourses}</div>
                      <div className="text-blue-100 text-sm">Total Subjects</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-2xl font-bold">{stats.inProgress}</div>
                      <div className="text-blue-100 text-sm">In Progress</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-2xl font-bold">{stats.averageProgress}%</div>
                      <div className="text-blue-100 text-sm">Avg Progress</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-2xl font-bold">A</div>
                      <div className="text-blue-100 text-sm">Target Grade</div>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block ml-4">
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <BookOpen className="w-8 h-8" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Search and Controls */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 rounded-xl p-6"
          >
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search subjects, topics, or ask AI..."
                    className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>

                {/* Filter Button */}
                <button className="flex items-center space-x-2 px-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors">
                  <Filter className="w-5 h-5" />
                  <span>Filter</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Filter Tabs */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedFilter === filter.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 border border-white/20'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </motion.div>

          {/* Courses Grid/List */}
          <motion.div variants={itemVariants}>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {filteredCourses.map(course => (
                  <motion.div
                    key={course.id}
                    variants={itemVariants}
                    className="group relative overflow-hidden rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 hover:shadow-xl transition-all duration-300 cursor-pointer"
                  >
                    {/* Course Image */}
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={course.image}
                        alt={course.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                      {/* Course Icon & Rating - Overlay */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <div
                          className={`w-10 h-10 rounded-lg bg-gradient-to-r ${course.gradient} flex items-center justify-center text-lg shadow-lg backdrop-blur-sm`}
                        >
                          {course.icon}
                        </div>
                        <div className="flex items-center space-x-1 text-sm bg-black/30 backdrop-blur-sm rounded-md px-2 py-1 text-white">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="font-medium">{course.rating}</span>
                        </div>
                      </div>

                      {/* Progress Badge */}
                      <div className="absolute bottom-3 right-3">
                        <div className="bg-black/30 backdrop-blur-sm rounded-lg px-2 py-1">
                          <span className="text-white text-sm font-bold">{course.progress}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Course Content */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                        {course.name}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 line-clamp-2">
                        {course.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full bg-gradient-to-r ${course.gradient}`}
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Course Details */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                            <BookOpen className="w-4 h-4" />
                            <span>
                              {course.completedLessons}/{course.totalLessons} lessons
                            </span>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              course.difficulty === 'Advanced'
                                ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                                : course.difficulty === 'Intermediate'
                                  ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                                  : 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                            }`}
                          >
                            {course.difficulty}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                            <Clock className="w-4 h-4" />
                            <span>{course.estimatedTime}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                            <Users className="w-4 h-4" />
                            <span>{course.students.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Next Lesson */}
                      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 mb-3">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                          Next Lesson
                        </p>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {course.nextLesson}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/courses/${course.id}`}
                          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-gradient-to-r ${course.gradient} text-white rounded-lg hover:shadow-lg transition-all`}
                        >
                          <Play className="w-4 h-4" />
                          <span>Continue</span>
                        </Link>
                        <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                          <BarChart3 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </motion.div>
                ))}
              </div>
            ) : (
              /* List View with Images */
              <div className="space-y-3">
                {filteredCourses.map(course => (
                  <motion.div
                    key={course.id}
                    variants={itemVariants}
                    className="group flex items-center space-x-4 p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 rounded-xl hover:shadow-lg transition-all cursor-pointer"
                  >
                    {/* Course Image */}
                    <div className="relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={course.image}
                        alt={course.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      <div
                        className={`absolute top-1 left-1 w-6 h-6 rounded bg-gradient-to-r ${course.gradient} flex items-center justify-center text-xs`}
                      >
                        {course.icon}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                          {course.name}
                        </h3>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1 text-sm">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="font-medium">{course.rating}</span>
                          </div>
                          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            {course.progress}%
                          </span>
                        </div>
                      </div>

                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">
                        {course.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center space-x-1">
                            <BookOpen className="w-4 h-4" />
                            <span>
                              {course.completedLessons}/{course.totalLessons} lessons
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{course.estimatedTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{course.students.toLocaleString()}</span>
                          </div>
                        </div>

                        <Link
                          href={`/courses/${course.id}`}
                          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <Play className="w-3 h-3" />
                          <span>Continue</span>
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-2">
                        <div
                          className={`h-1.5 rounded-full bg-gradient-to-r ${course.gradient}`}
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Load More */}
          <motion.div variants={itemVariants} className="text-center">
            <button className="px-8 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors">
              Load More Subjects
            </button>
          </motion.div>
        </motion.div>
      </div>
    </ModernLayout>
  );
}
