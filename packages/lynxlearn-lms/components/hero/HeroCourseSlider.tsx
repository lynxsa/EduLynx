'use client';

import { ChevronLeft, ChevronRight, Clock, Play, Star, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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

// Mock featured courses data - in real app, this would come from API
const featuredCourses: Course[] = [
  {
    id: '1',
    title: 'Grade 12 Mathematics: Master Calculus',
    description:
      'Complete calculus mastery for NSC success with step-by-step guidance and practice.',
    instructor: 'Dr. Sarah Johnson',
    rating: 4.9,
    students: 2847,
    duration: '12 weeks',
    thumbnail:
      'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Mathematics',
    level: 'Advanced',
    featured: true,
  },
  {
    id: '2',
    title: 'Physical Sciences: Chemistry Fundamentals',
    description: 'Master organic chemistry, acids, bases, and electrochemistry for NSC.',
    instructor: 'Prof. Michael Chen',
    rating: 4.8,
    students: 1923,
    duration: '10 weeks',
    thumbnail:
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Physical Sciences',
    level: 'Intermediate',
    featured: true,
  },
  {
    id: '3',
    title: 'English Home Language: Literary Analysis',
    description: 'Analyze South African literature including prescribed works for NSC success.',
    instructor: 'Ms. Nomsa Mthembu',
    rating: 4.7,
    students: 3156,
    duration: '8 weeks',
    thumbnail:
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'English',
    level: 'Core',
    featured: true,
  },
  {
    id: '4',
    title: 'Life Sciences: Human Biology & Ecology',
    description: 'Comprehensive coverage of human systems, genetics, and environmental studies.',
    instructor: 'Dr. John Sibeko',
    rating: 4.8,
    students: 2341,
    duration: '12 weeks',
    thumbnail:
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Life Sciences',
    level: 'Intermediate',
    featured: true,
  },
  {
    id: '5',
    title: 'History: South African History Deep Dive',
    description: 'From early civilizations to democracy - master SA history for NSC.',
    instructor: 'Prof. David Malan',
    rating: 4.6,
    students: 1567,
    duration: '9 weeks',
    thumbnail:
      'https://images.unsplash.com/photo-1461360370896-922624d12aa1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'History',
    level: 'Core',
    featured: true,
  },
];

export default function HeroCourseSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % featuredCourses.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % featuredCourses.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + featuredCourses.length) % featuredCourses.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentCourse = featuredCourses[currentSlide];

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-2xl shadow-2xl group">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={currentCourse.thumbnail}
          alt={currentCourse.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-2xl p-8 md:p-12">
          {/* Category Badge */}
          <div className="inline-block bg-purple-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
            {currentCourse.category} • {currentCourse.level}
          </div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {currentCourse.title}
          </h2>

          {/* Description */}
          <p className="text-gray-200 text-lg mb-6 leading-relaxed">{currentCourse.description}</p>

          {/* Course Meta */}
          <div className="flex items-center space-x-6 mb-8 text-gray-300">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="font-semibold">{currentCourse.rating}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>{currentCourse.students.toLocaleString()} students</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>{currentCourse.duration}</span>
            </div>
          </div>

          {/* Instructor */}
          <div className="mb-8">
            <p className="text-gray-300 text-sm">Instructor</p>
            <p className="text-white font-semibold text-lg">{currentCourse.instructor}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Link
              href={`/courses/${currentCourse.id}`}
              className="group inline-flex items-center justify-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Learning
            </Link>
            <Link
              href={`/courses/${currentCourse.id}`}
              className="inline-flex items-center justify-center px-8 py-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold rounded-xl border border-white/30 transition-all duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {featuredCourses.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-6 right-6 bg-black/30 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
        {currentSlide + 1} / {featuredCourses.length}
      </div>
    </div>
  );
}
