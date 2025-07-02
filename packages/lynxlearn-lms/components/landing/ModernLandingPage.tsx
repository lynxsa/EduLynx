'use client';

import {
  BookOpen,
  Brain,
  ChevronRight,
  Globe,
  GraduationCap,
  MessageSquare,
  Moon,
  Play,
  Sparkles,
  Star,
  Sun,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/use-auth';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  rating: number;
  students: number;
  duration: string;
  thumbnail: string;
  category: string;
  level: string;
  featured: boolean;
}

// Enhanced featured courses with South African content
const featuredCourses: Course[] = [
  {
    id: '1',
    title: 'Grade 12 Mathematics: NSC Success',
    description:
      'Master calculus, algebra, and geometry with ProfLynx AI guidance for 100% pass rate.',
    instructor: 'Dr. Nomsa Mthembu',
    rating: 4.9,
    students: 3247,
    duration: '12 weeks',
    thumbnail:
      'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Mathematics',
    level: 'Grade 12',
    featured: true,
  },
  {
    id: '2',
    title: 'Physical Sciences: Chemistry & Physics',
    description:
      'Complete CAPS-aligned course with practical experiments and AI-powered problem solving.',
    instructor: 'Prof. Ahmed Hassan',
    rating: 4.8,
    students: 2156,
    duration: '14 weeks',
    thumbnail:
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Physical Sciences',
    level: 'Grade 11-12',
    featured: true,
  },
  {
    id: '3',
    title: 'English Home Language: Literature & Writing',
    description:
      'Develop critical thinking and writing skills with personalized feedback from ProfLynx AI.',
    instructor: 'Mrs. Jane Williams',
    rating: 4.7,
    students: 1892,
    duration: '10 weeks',
    thumbnail:
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Languages',
    level: 'Grade 10-12',
    featured: true,
  },
];

// Enhanced features highlighting ProfLynx AI
const features = [
  {
    icon: <GraduationCap className="h-8 w-8" />,
    title: 'CAPS-Aligned Curriculum',
    description:
      'Comprehensive content aligned with the South African National Curriculum and Assessment Policy.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: <Brain className="h-8 w-8" />,
    title: 'ProfLynx AI Tutor',
    description:
      'Get instant answers, explanations, and personalized learning paths with our advanced AI assistant.',
    gradient: 'from-purple-500 to-pink-500',
    featured: true,
  },
  {
    icon: <Globe className="h-8 w-8" />,
    title: 'Multilingual Support',
    description:
      'Learn in any of the 11 official South African languages with real-time translation.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: 'Offline Access',
    description:
      'Download lessons and study materials for offline learning, perfect for load-shedding.',
    gradient: 'from-orange-500 to-red-500',
  },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Auto-redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/dashboard';
    }
  }, [isAuthenticated]);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    setIsDarkMode(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % featuredCourses.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  // Don't render if authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-purple-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">LynxLearn</span>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <Link
                href="/auth/signin"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Sign In
              </Link>

              <Link
                href="/auth/signin"
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Course Slider */}
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-semibold px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Powered by ProfLynx AI</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
              Master Your
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600">
                NSC Success
              </span>
            </h1>

            <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Join thousands of South African students achieving academic excellence with our
              AI-powered learning platform. Get personalized support, expert instruction, and
              guaranteed results.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                href="/auth/signin"
                className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center space-x-2"
              >
                <Play className="h-5 w-5" />
                <span>Start Learning Now</span>
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-300">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">4.9/5</span>
                </div>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
                <div className="flex items-center space-x-1">
                  <Users className="h-5 w-5" />
                  <span>12,000+ Students</span>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Course Slider */}
          <div className="relative max-w-5xl mx-auto">
            <div className="overflow-hidden rounded-2xl shadow-2xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {featuredCourses.map((course, index) => (
                  <div key={course.id} className="w-full flex-shrink-0">
                    <div className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 p-8 md:p-12">
                      <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="order-2 md:order-1">
                          <div className="inline-block bg-white/20 text-white text-sm font-semibold px-3 py-1 rounded-full mb-4">
                            {course.category} • {course.level}
                          </div>

                          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                            {course.title}
                          </h3>

                          <p className="text-blue-100 text-lg mb-6 leading-relaxed">
                            {course.description}
                          </p>

                          <div className="flex items-center space-x-6 mb-6 text-blue-100">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-300 fill-current" />
                              <span>{course.rating}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{course.students.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <BookOpen className="h-4 w-4" />
                              <span>{course.duration}</span>
                            </div>
                          </div>

                          <Link
                            href="/auth/signin"
                            className="inline-flex items-center space-x-2 bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                          >
                            <span>Start Learning</span>
                            <ChevronRight className="h-5 w-5" />
                          </Link>
                        </div>

                        <div className="order-1 md:order-2">
                          <div className="relative">
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-full h-64 md:h-80 object-cover rounded-xl shadow-lg"
                            />
                            <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
                              <button className="bg-white/90 text-purple-600 p-4 rounded-full hover:bg-white transition-colors shadow-lg">
                                <Play className="h-8 w-8 ml-1" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center space-x-2 mt-6">
              {featuredCourses.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ProfLynx AI Showcase */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-semibold px-4 py-2 rounded-full mb-6">
              <Brain className="h-4 w-4" />
              <span>Introducing ProfLynx AI</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Your Personal AI Learning Assistant
            </h2>

            <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Get instant help, summaries, clarifications, and personalized learning paths 24/7.
              ProfLynx understands South African curriculum and speaks your language.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mb-3">
                      <p className="text-gray-800 dark:text-gray-200">
                        "Can you explain quadratic equations in simple terms?"
                      </p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border-l-4 border-purple-500">
                      <p className="text-gray-800 dark:text-gray-200">
                        <strong>ProfLynx:</strong> Sure! Think of quadratic equations like finding
                        where a ball lands when you throw it. The equation ax² + bx + c = 0 helps us
                        find those exact points. Let me show you with a visual example...
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <Sparkles className="h-4 w-4" />
                  <span>Powered by advanced AI • Available in 11 languages</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                  <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Instant Explanations
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Get complex concepts broken down into easy-to-understand explanations tailored
                    to your level.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Personalized Learning Paths
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Adaptive learning that adjusts to your pace and identifies areas where you need
                    more practice.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                  <Globe className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Multilingual Support
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Ask questions in any South African language and get responses in your preferred
                    language.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Everything You Need to Succeed
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              Comprehensive learning tools designed specifically for South African students.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:-translate-y-2 ${
                  feature.featured
                    ? 'ring-2 ring-purple-500 ring-offset-2 dark:ring-offset-gray-900'
                    : ''
                }`}
              >
                {feature.featured && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      FEATURED
                    </div>
                  </div>
                )}

                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${feature.gradient} text-white mb-6 group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                <Link
                  href="/auth/signin"
                  className="inline-flex items-center space-x-2 text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  <span>Learn More</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Preview Grid */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Explore Our Courses
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              CAPS-aligned curriculum covering all NSC subjects with expert instruction and AI
              support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map(course => (
              <div
                key={course.id}
                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:-translate-y-2"
              >
                <div className="relative">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 text-xs font-semibold px-2 py-1 rounded-full">
                      {course.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="bg-white/90 text-purple-600 p-3 rounded-full hover:bg-white transition-colors">
                      <Play className="h-6 w-6 ml-1" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {course.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{course.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{course.students.toLocaleString()}</span>
                    </div>
                    <span>{course.duration}</span>
                  </div>

                  <Link
                    href="/auth/signin"
                    className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    View Course
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/auth/signin"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 border-2 border-purple-600 dark:border-purple-400 rounded-xl font-semibold hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span>View All Courses</span>
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-3xl p-12 md:p-16 text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Excel in Your NSC?</h2>

            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Join thousands of successful students who've achieved their academic goals with
              LynxLearn. Start your journey to excellence today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signin"
                className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Start Learning Free
              </Link>

              <Link
                href="/auth/signin"
                className="px-8 py-4 bg-white/20 text-white border-2 border-white/30 rounded-xl font-semibold hover:bg-white/30 transition-colors"
              >
                Watch Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <GraduationCap className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold">LynxLearn</span>
          </div>

          <p className="text-gray-400 mb-6">
            Empowering South African students to achieve academic excellence through innovative
            technology.
          </p>

          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact Us
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-gray-400 text-sm">
            © 2025 LynxLearn. All rights reserved. A product of LYNX Consulting South Africa (Pty)
            Ltd.
          </div>
        </div>
      </footer>
    </div>
  );
}
