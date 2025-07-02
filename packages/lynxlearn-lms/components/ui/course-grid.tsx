// Course Grid Component for LynxLearn LMS
'use client';

import { BookOpen, Clock, Search, Star, Users } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Badge } from './badge';
import { Button } from './button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './card';

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
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
}

const allCourses: Course[] = [
  {
    id: '1',
    title: 'Grade 12 Mathematics: NSC Success',
    description: 'Master calculus, algebra, and geometry with ProfLynx AI guidance.',
    instructor: 'Dr. Nomsa Mthembu',
    rating: 4.9,
    students: 3247,
    duration: '12 weeks',
    thumbnail:
      'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Mathematics',
    level: 'Grade 12',
    price: 0,
    difficulty: 'Advanced',
    tags: ['NSC', 'Calculus', 'Algebra', 'Geometry'],
  },
  {
    id: '2',
    title: 'Physical Sciences: Chemistry & Physics',
    description: 'Complete CAPS-aligned course with practical experiments and AI problem solving.',
    instructor: 'Prof. Ahmed Hassan',
    rating: 4.8,
    students: 2156,
    duration: '14 weeks',
    thumbnail:
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Physical Sciences',
    level: 'Grade 11-12',
    price: 0,
    difficulty: 'Intermediate',
    tags: ['Chemistry', 'Physics', 'Experiments', 'CAPS'],
  },
  {
    id: '3',
    title: 'English Home Language: Literature & Writing',
    description: 'Develop critical thinking and writing skills with personalized AI feedback.',
    instructor: 'Mrs. Jane Williams',
    rating: 4.7,
    students: 1892,
    duration: '10 weeks',
    thumbnail:
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Languages',
    level: 'Grade 10-12',
    price: 0,
    difficulty: 'Intermediate',
    tags: ['Literature', 'Writing', 'Critical Thinking', 'Essays'],
  },
  {
    id: '4',
    title: 'Life Sciences: Biology for NSC',
    description: 'Comprehensive biology course with interactive virtual labs and dissections.',
    instructor: 'Dr. Mpho Khoza',
    rating: 4.6,
    students: 1654,
    duration: '13 weeks',
    thumbnail:
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Life Sciences',
    level: 'Grade 10-12',
    price: 0,
    difficulty: 'Intermediate',
    tags: ['Biology', 'Virtual Labs', 'Ecology', 'Human Biology'],
  },
  {
    id: '5',
    title: 'History: South African & World History',
    description: 'Explore South African heritage and world history with multimedia content.',
    instructor: 'Prof. Thabo Mofokeng',
    rating: 4.5,
    students: 1234,
    duration: '11 weeks',
    thumbnail:
      'https://images.unsplash.com/photo-1461360370896-922624d12aa1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Humanities',
    level: 'Grade 10-12',
    price: 0,
    difficulty: 'Beginner',
    tags: ['South African History', 'World History', 'Heritage', 'Culture'],
  },
  {
    id: '6',
    title: 'Business Studies: Entrepreneurship & Economics',
    description: 'Learn business principles and economics with real-world case studies.',
    instructor: 'Mrs. Sarah Ndlovu',
    rating: 4.4,
    students: 987,
    duration: '9 weeks',
    thumbnail:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Business Studies',
    level: 'Grade 10-12',
    price: 0,
    difficulty: 'Beginner',
    tags: ['Entrepreneurship', 'Economics', 'Business', 'Finance'],
  },
];

const categories = [
  'All',
  'Mathematics',
  'Physical Sciences',
  'Languages',
  'Life Sciences',
  'Humanities',
  'Business Studies',
];
const levels = ['All', 'Grade 10', 'Grade 11', 'Grade 12', 'Grade 10-12', 'Grade 11-12'];
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function CourseGrid() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('popular'); // popular, rating, newest

  const filteredCourses = useMemo(() => {
    const filtered = allCourses.filter(course => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
      const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
      const matchesDifficulty =
        selectedDifficulty === 'All' || course.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesLevel && matchesDifficulty;
    });

    // Sort courses
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        filtered.sort((a, b) => b.students - a.students);
        break;
      case 'newest':
        // For demo, we'll sort by ID (newest first)
        filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;
    }

    return filtered;
  }, [searchTerm, selectedCategory, selectedLevel, selectedDifficulty, sortBy]);

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search courses, instructors, or topics..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Grade Level
            </label>
            <select
              value={selectedLevel}
              onChange={e => setSelectedLevel(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            >
              {levels.map(level => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Difficulty
            </label>
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.map(course => (
          <Card
            key={course.id}
            className="group overflow-hidden hover:shadow-2xl transition-all duration-300"
          >
            {/* Course Image */}
            <div className="relative">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col space-y-2">
                <Badge variant="secondary">{course.category}</Badge>
                <Badge variant="info">{course.level}</Badge>
              </div>

              {/* Difficulty badge */}
              <div className="absolute top-4 right-4">
                <Badge
                  variant={
                    course.difficulty === 'Advanced'
                      ? 'destructive'
                      : course.difficulty === 'Intermediate'
                        ? 'warning'
                        : 'success'
                  }
                >
                  {course.difficulty}
                </Badge>
              </div>

              {/* Free badge */}
              {course.price === 0 && (
                <div className="absolute bottom-4 left-4">
                  <Badge variant="success" className="font-bold">
                    FREE
                  </Badge>
                </div>
              )}
            </div>

            <CardHeader>
              <CardTitle className="line-clamp-2 group-hover:text-purple-600 transition-colors">
                {course.title}
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {course.description}
              </p>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                {/* Instructor */}
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {course.instructor}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span>{course.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{course.students.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {course.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {course.tags.length > 3 && (
                    <span className="text-xs text-gray-400">+{course.tags.length - 3} more</span>
                  )}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-2">
              <Button asChild variant="gradient" className="w-full">
                <Link href={`/courses/${course.id}`}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Start Learning
                </Link>
              </Button>

              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href={`/courses/${course.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No courses found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Try adjusting your search criteria or browse all courses
          </p>
          <Button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedLevel('All');
              setSelectedDifficulty('All');
            }}
            variant="outline"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
