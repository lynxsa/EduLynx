'use client';

import { BookOpen, Clock, GraduationCap, Play, Star, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import useSWR from 'swr';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Progress } from '../../../components/ui/progress';
import { courses as relatedCourses } from '../data';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  duration: string;
  completed: boolean;
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  type: 'video' | 'reading' | 'quiz' | 'assignment';
  description: string;
}

// Enhanced mock course data with CAPS-aligned modules
const mockCourse = {
  id: '1',
  title: 'Grade 12 Mathematics: NSC Success',
  description:
    'Complete NSC Mathematics curriculum covering all essential topics for matric success. Includes calculus, algebra, geometry, and statistics with ProfLynx AI support.',
  instructor: 'Dr. Nomsa Mthembu',
  rating: 4.9,
  students: 3247,
  duration: '12 weeks',
  level: 'Grade 12',
  language: 'English/Afrikaans',
  thumbnail:
    'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  progress: 37.5,
  enrolled: true,
  modules: [
    {
      id: '1',
      title: 'Module 1: Functions and Algebra',
      description: 'Master functions, equations, and algebraic manipulation.',
      duration: '3 weeks',
      completed: true,
      lessons: [
        {
          id: '1',
          title: 'Introduction to Functions',
          duration: '45 min',
          completed: true,
          type: 'video',
          description: 'Understanding function notation and basic properties',
        },
        {
          id: '2',
          title: 'Linear Functions and Graphs',
          duration: '60 min',
          completed: true,
          type: 'video',
          description: 'Graphing linear functions and interpreting slopes',
        },
        {
          id: '3',
          title: 'Quadratic Functions',
          duration: '75 min',
          completed: true,
          type: 'video',
          description: 'Working with parabolas and quadratic equations',
        },
        {
          id: '4',
          title: 'Functions Quiz',
          duration: '30 min',
          completed: true,
          type: 'quiz',
          description: 'Test your understanding of functions',
        },
      ],
    },
    {
      id: '2',
      title: 'Module 2: Calculus Fundamentals',
      description: 'Introduction to limits, derivatives, and basic calculus concepts.',
      duration: '4 weeks',
      completed: false,
      lessons: [
        {
          id: '5',
          title: 'Introduction to Limits',
          duration: '60 min',
          completed: true,
          type: 'video',
          description: 'Understanding the concept of limits',
        },
        {
          id: '6',
          title: 'Calculating Derivatives',
          duration: '75 min',
          completed: false,
          type: 'video',
          description: 'Learn differentiation rules and techniques',
        },
        {
          id: '7',
          title: 'Applications of Derivatives',
          duration: '90 min',
          completed: false,
          type: 'video',
          description: 'Real-world applications of calculus',
        },
        {
          id: '8',
          title: 'Calculus Practice Problems',
          duration: '45 min',
          completed: false,
          type: 'assignment',
          description: 'Solve calculus problems with step-by-step guidance',
        },
      ],
    },
    {
      id: '3',
      title: 'Module 3: Geometry and Trigonometry',
      description: 'Explore geometric relationships and trigonometric functions.',
      duration: '3 weeks',
      completed: false,
      lessons: [
        {
          id: '9',
          title: 'Circle Geometry',
          duration: '60 min',
          completed: false,
          type: 'video',
          description: 'Properties of circles and geometric proofs',
        },
        {
          id: '10',
          title: 'Trigonometric Functions',
          duration: '75 min',
          completed: false,
          type: 'video',
          description: 'Understanding sin, cos, and tan functions',
        },
        {
          id: '11',
          title: 'Solving Triangles',
          duration: '60 min',
          completed: false,
          type: 'video',
          description: 'Using trigonometry to solve triangle problems',
        },
      ],
    },
    {
      id: '4',
      title: 'Module 4: Statistics and Probability',
      description: 'Data analysis and probability for NSC requirements.',
      duration: '2 weeks',
      completed: false,
      lessons: [
        {
          id: '12',
          title: 'Data Analysis',
          duration: '60 min',
          completed: false,
          type: 'video',
          description: 'Interpreting graphs and statistical measures',
        },
        {
          id: '13',
          title: 'Probability Basics',
          duration: '45 min',
          completed: false,
          type: 'video',
          description: 'Understanding probability concepts',
        },
        {
          id: '14',
          title: 'Final Assessment',
          duration: '120 min',
          completed: false,
          type: 'quiz',
          description: 'Comprehensive NSC-style examination',
        },
      ],
    },
  ],
};

export default function CourseDetailPage() {
  const { id } = useParams();
  const [activeModule, setActiveModule] = useState<string | null>(null);

  // Fetch course data
  const { data: course, error: courseError } = useSWR(`/api/courses/${id}`, fetcher, {
    fallbackData: mockCourse,
  });

  if (!course)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );

  if (courseError) return <div className="p-6 text-center text-red-500">Error loading course</div>;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="w-4 h-4" />;
      case 'quiz':
        return <GraduationCap className="w-4 h-4" />;
      case 'assignment':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-blue-100 text-blue-800';
      case 'quiz':
        return 'bg-green-100 text-green-800';
      case 'assignment':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalLessons = course.modules.reduce(
    (total: number, module: Module) => total + module.lessons.length,
    0
  );
  const completedLessons = course.modules.reduce(
    (total: number, module: Module) =>
      total + module.lessons.filter((lesson: Lesson) => lesson.completed).length,
    0
  );
  const overallProgress = (completedLessons / totalLessons) * 100;

  // Select 3 random related courses
  const suggestions = relatedCourses
    .filter(c => c.id !== id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {course.level}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  CAPS Aligned
                </Badge>
              </div>

              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-purple-100 mb-6 leading-relaxed">{course.description}</p>

              <div className="flex flex-wrap items-center gap-6 text-purple-100">
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  <span>{course.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 mr-2 fill-current" />
                  <span>{course.rating} rating</span>
                </div>
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Course Progress</span>
                  <span className="text-sm">{Math.round(overallProgress)}%</span>
                </div>
                <Progress value={overallProgress} className="h-2 bg-white/20" />
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Instructor</h3>
                  <p className="text-purple-100">{course.instructor}</p>
                </div>

                {course.enrolled ? (
                  <Button className="w-full bg-white text-purple-600 hover:bg-gray-100">
                    Continue Learning
                  </Button>
                ) : (
                  <Button className="w-full bg-green-600 hover:bg-green-700">Enroll Now</Button>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Modules</h2>

            <div className="space-y-6">
              {course.modules.map((module: Module, index: number) => (
                <Card key={module.id} className="overflow-hidden">
                  <div className="p-6">
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setActiveModule(activeModule === module.id ? null : module.id)}
                      role="button"
                      aria-expanded={activeModule === module.id}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            module.completed
                              ? 'bg-green-100 text-green-600'
                              : 'bg-purple-100 text-purple-600'
                          }`}
                        >
                          <span className="font-semibold">{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                          <p className="text-gray-600">{module.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <Badge variant={module.completed ? 'default' : 'secondary'}>
                          {module.completed ? 'Completed' : 'In Progress'}
                        </Badge>
                        <span className="text-sm text-gray-500">{module.duration}</span>
                      </div>
                    </div>

                    {activeModule === module.id && (
                      <div className="mt-6 border-t pt-6">
                        <div className="space-y-3">
                          {module.lessons.map((lesson: Lesson) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-center space-x-4">
                                <div className={`p-2 rounded-lg ${getTypeColor(lesson.type)}`}>
                                  {getTypeIcon(lesson.type)}
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                                  <p className="text-sm text-gray-600">{lesson.description}</p>
                                  <div className="flex items-center space-x-4 mt-1">
                                    <span className="text-xs text-gray-500">{lesson.duration}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {lesson.type}
                                    </Badge>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                {lesson.completed && <Badge variant="default">✓ Done</Badge>}
                                <Link href={`/courses/${id}/lesson/${lesson.id}`}>
                                  <Button
                                    size="sm"
                                    variant={lesson.completed ? 'outline' : 'default'}
                                  >
                                    {lesson.completed ? 'Review' : 'Start'}
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Progress Summary */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Overall Progress</span>
                    <span>{Math.round(overallProgress)}%</span>
                  </div>
                  <Progress value={overallProgress} />
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{completedLessons}</div>
                    <div className="text-xs text-gray-600">Completed</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">
                      {totalLessons - completedLessons}
                    </div>
                    <div className="text-xs text-gray-600">Remaining</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Course Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Language:</span>
                  <span className="font-medium">{course.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Level:</span>
                  <span className="font-medium">{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Students:</span>
                  <span className="font-medium">{course.students.toLocaleString()}</span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Download Resources
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Join Study Group
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Take Practice Test
                </Button>
              </div>
            </Card>
            {/* AI Features */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Features</h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                {course.aiFeatures?.map((feat, idx) => (
                  <li key={idx} className="text-gray-600">
                    {feat}
                  </li>
                ))}
              </ul>
            </Card>
            {/* Related Courses */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">You Might Also Like</h3>
              <ul className="space-y-3">
                {suggestions.map(c => (
                  <li key={c.id}>
                    <Link
                      href={`/courses/${c.id}`}
                      className="flex items-center space-x-3 hover:text-purple-600"
                    >
                      <Image
                        src={c.image}
                        alt={c.title}
                        width={40}
                        height={40}
                        className="rounded"
                      />
                      <span className="text-sm font-medium text-gray-900">{c.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
