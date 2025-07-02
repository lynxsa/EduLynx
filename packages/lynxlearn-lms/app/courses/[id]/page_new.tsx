'use client';

import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Play,
  Star,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Badge } from '../../../components/ui/badge';
import { Card } from '../../../components/ui/card';
import { Progress } from '../../../components/ui/progress';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: {
    name: string;
    avatar: string;
    bio: string;
  };
  progress: number;
  totalLessons: number;
  completedLessons: number;
  duration: string;
  startDate: string;
  endDate: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  enrolledStudents: number;
  lessons: Lesson[];
  schedule: ScheduleItem[];
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'video' | 'reading' | 'quiz' | 'assignment';
  completed: boolean;
  locked: boolean;
}

interface ScheduleItem {
  day: string;
  time: string;
  topic: string;
}

// Mock course data with CAPS-aligned content
const mockCourse: Course = {
  id: '1',
  title: 'Grade 10 Mathematics - Algebra & Functions',
  description:
    'Comprehensive coverage of Grade 10 Mathematics focusing on algebraic expressions, functions, and their applications according to CAPS curriculum.',
  instructor: {
    name: 'Ms. Sarah Ndlovu',
    avatar: '/instructor-avatar.jpg',
    bio: 'Experienced Mathematics educator with 8+ years in CAPS curriculum delivery.',
  },
  progress: 67,
  totalLessons: 24,
  completedLessons: 16,
  duration: '12 weeks',
  startDate: '2024-01-15',
  endDate: '2024-04-08',
  difficulty: 'Intermediate',
  rating: 4.8,
  enrolledStudents: 156,
  lessons: [
    {
      id: '1',
      title: 'Introduction to Algebra',
      description: 'Basic algebraic concepts and terminology',
      duration: '45 min',
      type: 'video',
      completed: true,
      locked: false,
    },
    {
      id: '2',
      title: 'Linear Equations',
      description: 'Solving linear equations in one variable',
      duration: '60 min',
      type: 'video',
      completed: true,
      locked: false,
    },
    {
      id: '3',
      title: 'Functions and Relations',
      description: 'Understanding functions, domain, and range',
      duration: '50 min',
      type: 'video',
      completed: false,
      locked: false,
    },
    {
      id: '4',
      title: 'Quadratic Functions',
      description: 'Exploring quadratic functions and their graphs',
      duration: '70 min',
      type: 'video',
      completed: false,
      locked: true,
    },
  ],
  schedule: [
    { day: 'Monday', time: '09:00 - 10:30', topic: 'Algebra Fundamentals' },
    { day: 'Wednesday', time: '09:00 - 10:30', topic: 'Function Analysis' },
    { day: 'Friday', time: '09:00 - 10:30', topic: 'Problem Solving Workshop' },
  ],
};

export default function CoursePage() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // In a real app, this would fetch from an API
    setCourse(mockCourse);
  }, [id]);

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="w-4 h-4" />;
      case 'reading':
        return <BookOpen className="w-4 h-4" />;
      case 'quiz':
        return <CheckCircle className="w-4 h-4" />;
      case 'assignment':
        return <FileText className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link
              href="/courses"
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Courses
            </Link>
          </div>
        </div>
      </div>

      {/* Course Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-4 mb-4">
                <Badge className={getDifficultyColor(course.difficulty)}>{course.difficulty}</Badge>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="text-sm">{course.rating}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span className="text-sm">{course.enrolledStudents} students</span>
                </div>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg opacity-90 mb-6">{course.description}</p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="block opacity-75">Duration</span>
                  <span className="font-semibold">{course.duration}</span>
                </div>
                <div>
                  <span className="block opacity-75">Lessons</span>
                  <span className="font-semibold">{course.totalLessons}</span>
                </div>
                <div>
                  <span className="block opacity-75">Start Date</span>
                  <span className="font-semibold">
                    {new Date(course.startDate).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="block opacity-75">End Date</span>
                  <span className="font-semibold">
                    {new Date(course.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Course Progress</h3>
                    <span className="text-sm opacity-75">
                      {course.completedLessons}/{course.totalLessons}
                    </span>
                  </div>
                  <Progress value={course.progress} className="mb-4" />
                  <p className="text-sm opacity-75 mb-4">{course.progress}% Complete</p>

                  {/* Instructor Info */}
                  <div className="border-t border-white/20 pt-4">
                    <h4 className="font-semibold mb-2">Instructor</h4>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold">
                          {course.instructor.name
                            .split(' ')
                            .map(n => n[0])
                            .join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{course.instructor.name}</p>
                        <p className="text-xs opacity-75">{course.instructor.bio}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: BookOpen },
              { id: 'lessons', name: 'Lessons', icon: Play },
              { id: 'schedule', name: 'Schedule', icon: Calendar },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="prose dark:prose-invert max-w-none">
            <h2>Course Overview</h2>
            <p>
              This comprehensive Grade 10 Mathematics course covers essential algebraic concepts and
              functions as outlined in the CAPS curriculum. Students will develop problem-solving
              skills and mathematical reasoning through interactive lessons, practical exercises,
              and real-world applications.
            </p>

            <h3>Learning Outcomes</h3>
            <ul>
              <li>Master fundamental algebraic manipulations and equation solving</li>
              <li>Understand function notation, domain, and range concepts</li>
              <li>Analyze linear and quadratic functions graphically and algebraically</li>
              <li>Apply mathematical concepts to solve real-world problems</li>
            </ul>

            <h3>Prerequisites</h3>
            <p>Students should have completed Grade 9 Mathematics with a solid understanding of:</p>
            <ul>
              <li>Basic arithmetic operations</li>
              <li>Integer operations and number properties</li>
              <li>Elementary geometric concepts</li>
            </ul>
          </div>
        )}

        {activeTab === 'lessons' && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Course Lessons</h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {course.completedLessons} of {course.totalLessons} completed
              </div>
            </div>

            <ul className="space-y-4">
              {course.lessons.map((lesson, index) => (
                <Card key={lesson.id} className="overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            lesson.completed
                              ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                              : lesson.locked
                                ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600'
                                : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                          }`}
                        >
                          {lesson.completed ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <span className="text-sm font-semibold">{index + 1}</span>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                              {lesson.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center text-gray-500 dark:text-gray-400">
                                {getTypeIcon(lesson.type)}
                                <Badge variant="outline" className="text-xs ml-1">
                                  {lesson.type}
                                </Badge>
                              </div>
                              <div className="flex items-center text-gray-500 dark:text-gray-400">
                                <Clock className="w-4 h-4 mr-1" />
                                <span className="text-sm">{lesson.duration}</span>
                              </div>
                              {lesson.completed && <Badge variant="default">✓ Done</Badge>}
                            </div>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {lesson.description}
                          </p>
                        </div>
                      </div>

                      <Link
                        href={lesson.locked ? '#' : `/courses/${course.id}/lesson/${lesson.id}`}
                        className={`${
                          lesson.locked
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-600'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        } text-sm px-4 py-1 rounded transition-colors`}
                        onClick={e => lesson.locked && e.preventDefault()}
                      >
                        {lesson.locked ? 'Locked' : lesson.completed ? 'Review' : 'Start'}
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </ul>
          </section>
        )}

        {activeTab === 'schedule' && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Weekly Schedule</h2>
            <div className="grid gap-4">
              {course.schedule.map((item, index) => (
                <Card key={index}>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{item.day}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{item.topic}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Live Session</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
