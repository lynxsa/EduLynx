'use client';

import { Clock, Play, Star, Users } from 'lucide-react';
import Link from 'next/link';

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
  price: number;
  badge?: string;
}

// Mock courses data - in real app, this would come from API
const allCourses: Course[] = [
  {
    id: '1',
    title: 'Grade 12 Mathematics: Complete Course',
    description: 'Master calculus, analytical geometry, and statistics for NSC success.',
    instructor: 'Dr. Sarah Johnson',
    rating: 4.9,
    students: 2847,
    duration: '12 weeks',
    thumbnail:
      'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Mathematics',
    level: 'Advanced',
    price: 0,
    badge: 'Popular',
  },
  {
    id: '2',
    title: 'Physical Sciences: Physics & Chemistry',
    description: 'Comprehensive physics and chemistry with practical experiments.',
    instructor: 'Prof. Michael Chen',
    rating: 4.8,
    students: 1923,
    duration: '10 weeks',
    thumbnail:
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Physical Sciences',
    level: 'Advanced',
    price: 0,
  },
  {
    id: '3',
    title: 'Life Sciences: Biology & Ecology',
    description: 'Explore biology, ecology, and human systems with AI guidance.',
    instructor: 'Dr. Nomsa Mthembu',
    rating: 4.9,
    students: 3156,
    duration: '8 weeks',
    thumbnail:
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Life Sciences',
    level: 'Intermediate',
    price: 0,
    badge: 'New',
  },
  {
    id: '4',
    title: 'English Home Language',
    description: 'Literature, grammar, and creative writing for NSC excellence.',
    instructor: 'Ms. Sarah Williams',
    rating: 4.7,
    students: 2654,
    duration: '12 weeks',
    thumbnail:
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Languages',
    level: 'Core',
    price: 0,
  },
  {
    id: '5',
    title: 'Afrikaans First Additional Language',
    description: 'Master Afrikaans language skills and literature analysis.',
    instructor: 'Mnr. Pieter van Wyk',
    rating: 4.6,
    students: 1876,
    duration: '10 weeks',
    thumbnail:
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Languages',
    level: 'Core',
    price: 0,
  },
  {
    id: '6',
    title: 'History: South African Heritage',
    description: 'From early civilizations to modern democracy.',
    instructor: 'Prof. David Malan',
    rating: 4.8,
    students: 1567,
    duration: '9 weeks',
    thumbnail:
      'https://images.unsplash.com/photo-1461360370896-922624d12aa1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Social Sciences',
    level: 'Core',
    price: 0,
  },
  {
    id: '7',
    title: 'Geography: Physical & Human Geography',
    description: 'Climate, landforms, population, and development studies.',
    instructor: 'Dr. Jennifer Smith',
    rating: 4.5,
    students: 2134,
    duration: '11 weeks',
    thumbnail:
      'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Social Sciences',
    level: 'Intermediate',
    price: 0,
  },
  {
    id: '8',
    title: 'Accounting: Financial Mastery',
    description: 'Master financial accounting and business fundamentals.',
    instructor: 'Ms. Priya Patel',
    rating: 4.7,
    students: 987,
    duration: '12 weeks',
    thumbnail:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Business',
    level: 'Advanced',
    price: 0,
  },
];

const categoryColors = {
  Mathematics: 'from-blue-500 to-indigo-600',
  'Physical Sciences': 'from-green-500 to-emerald-600',
  'Life Sciences': 'from-teal-500 to-cyan-600',
  Languages: 'from-purple-500 to-violet-600',
  'Social Sciences': 'from-orange-500 to-red-600',
  Business: 'from-yellow-500 to-amber-600',
};

const levelColors = {
  Core: 'bg-gray-100 text-gray-800',
  Intermediate: 'bg-blue-100 text-blue-800',
  Advanced: 'bg-red-100 text-red-800',
};

export default function CourseGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {allCourses.map(course => (
        <div
          key={course.id}
          className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
        >
          {/* Course Thumbnail */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />

            {/* Category Gradient Overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-t ${categoryColors[course.category as keyof typeof categoryColors]} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
            ></div>

            {/* Badge */}
            {course.badge && (
              <div className="absolute top-3 left-3">
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full ${
                    course.badge === 'Popular'
                      ? 'bg-orange-500 text-white'
                      : 'bg-green-500 text-white'
                  }`}
                >
                  {course.badge}
                </span>
              </div>
            )}

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-xl">
                <Play className="w-8 h-8 text-purple-600 fill-current" />
              </div>
            </div>

            {/* Price */}
            <div className="absolute top-3 right-3">
              <span className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                Free
              </span>
            </div>
          </div>

          {/* Course Content */}
          <div className="p-6">
            {/* Level & Category */}
            <div className="flex items-center justify-between mb-3">
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${levelColors[course.level as keyof typeof levelColors]}`}
              >
                {course.level}
              </span>
              <span className="text-xs text-gray-500 font-medium">{course.category}</span>
            </div>

            {/* Title */}
            <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
              {course.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

            {/* Instructor */}
            <p className="text-sm text-gray-700 font-medium mb-4">{course.instructor}</p>

            {/* Course Stats */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-semibold text-gray-700">{course.rating}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{course.students.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{course.duration}</span>
              </div>
            </div>

            {/* Action Button */}
            <Link
              href={`/courses/${course.id}`}
              className="block w-full text-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              View Course
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
