// Hero Slider Component for Featured Courses
'use client';

import { BookOpen, ChevronLeft, ChevronRight, Play, Star, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from './button';

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
  {
    id: '4',
    title: 'Life Sciences: Biology for NSC',
    description:
      'Comprehensive biology course covering all NSC requirements with interactive virtual labs.',
    instructor: 'Dr. Mpho Khoza',
    rating: 4.6,
    students: 1654,
    duration: '13 weeks',
    thumbnail:
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Life Sciences',
    level: 'Grade 10-12',
    featured: true,
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % featuredCourses.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % featuredCourses.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + featuredCourses.length) % featuredCourses.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative max-w-6xl mx-auto">
      {/* Main Slider */}
      <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {featuredCourses.map((course, index) => (
            <div key={course.id} className="w-full flex-shrink-0">
              <div className="relative min-h-[500px] p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-8 items-center h-full">
                  {/* Content */}
                  <div className="space-y-6 text-white">
                    <div className="space-y-2">
                      <div className="inline-flex items-center space-x-2 bg-white/20 text-white text-sm font-semibold px-3 py-1 rounded-full">
                        <span>{course.category}</span>
                        <span>•</span>
                        <span>{course.level}</span>
                      </div>

                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                        {course.title}
                      </h2>
                    </div>

                    <p className="text-blue-100 text-lg md:text-xl leading-relaxed max-w-lg">
                      {course.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center space-x-6 text-blue-100">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-300 fill-current" />
                        <span className="font-semibold">{course.rating}</span>
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

                    {/* Instructor */}
                    <p className="text-blue-200">
                      Taught by <span className="font-semibold">{course.instructor}</span>
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <Button
                        asChild
                        variant="secondary"
                        size="lg"
                        className="bg-white text-purple-600 hover:bg-blue-50"
                      >
                        <Link href={`/courses/${course.id}`}>
                          <Play className="w-5 h-5 mr-2" />
                          Start Learning
                        </Link>
                      </Button>

                      <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="border-white/30 text-white hover:bg-white/10"
                      >
                        <Link href="/auth/signin">View Details</Link>
                      </Button>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="relative">
                    <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />

                      {/* Play overlay */}
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
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

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="flex justify-center space-x-2 mt-6">
        {featuredCourses.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-purple-600 scale-125'
                : 'bg-gray-300 dark:bg-gray-600 hover:bg-purple-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Auto-play control */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="text-sm text-gray-500 hover:text-purple-600 transition-colors"
        >
          {isAutoPlaying ? 'Pause Auto-play' : 'Resume Auto-play'}
        </button>
      </div>
    </div>
  );
}
