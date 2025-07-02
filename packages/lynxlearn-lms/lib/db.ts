import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const db = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

export default db;

// Type definitions for external service data (from APIs)
export type CurriculumCourse = {
  id: string;
  title: string;
  description?: string;
  slug: string;
  subject: {
    id: string;
    name: string;
    code: string;
  };
  grade: number;
  modules: CurriculumModule[];
  thumbnailUrl?: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  estimatedHours?: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CurriculumModule = {
  id: string;
  title: string;
  description?: string;
  orderIndex: number;
  lessons: CurriculumLesson[];
  estimatedHours?: number;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
};

export type CurriculumLesson = {
  id: string;
  title: string;
  description?: string;
  content?: any;
  orderIndex: number;
  lessonType: 'TEXT' | 'VIDEO' | 'AUDIO' | 'INTERACTIVE' | 'QUIZ' | 'ASSIGNMENT';
  videoUrl?: string;
  audioUrl?: string;
  duration?: number;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
};

// Mock data for development - replace with actual API calls
const mockCourses: CurriculumCourse[] = [
  {
    id: '1',
    title: 'Introduction to Mathematics',
    description: 'Basic mathematical concepts for Grade 8',
    slug: 'intro-math-grade-8',
    subject: {
      id: 'math',
      name: 'Mathematics',
      code: 'MATH',
    },
    grade: 8,
    modules: [
      {
        id: '1',
        title: 'Numbers and Operations',
        description: 'Understanding basic number operations',
        orderIndex: 1,
        estimatedHours: 8,
        difficulty: 'BEGINNER',
        lessons: [
          {
            id: '1',
            title: 'Whole Numbers',
            description: 'Introduction to whole numbers',
            content: null,
            orderIndex: 1,
            lessonType: 'TEXT',
            difficulty: 'BEGINNER',
          },
        ],
      },
    ],
    thumbnailUrl: '/images/math-course.jpg',
    difficulty: 'BEGINNER',
    estimatedHours: 32,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Physical Sciences',
    description: 'Introduction to Physics and Chemistry for Grade 10',
    slug: 'physical-sciences-grade-10',
    subject: {
      id: 'phys-sci',
      name: 'Physical Sciences',
      code: 'PHYS',
    },
    grade: 10,
    modules: [
      {
        id: '2',
        title: 'Matter and Materials',
        description: 'Understanding the nature of matter',
        orderIndex: 1,
        estimatedHours: 12,
        difficulty: 'INTERMEDIATE',
        lessons: [
          {
            id: '2',
            title: 'Atomic Structure',
            description: 'Understanding atoms and their structure',
            content: null,
            orderIndex: 1,
            lessonType: 'VIDEO',
            videoUrl: '/videos/atomic-structure.mp4',
            duration: 25,
            difficulty: 'INTERMEDIATE',
          },
        ],
      },
    ],
    thumbnailUrl: '/images/physics-course.jpg',
    difficulty: 'INTERMEDIATE',
    estimatedHours: 48,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Course-related queries - These will be replaced with API calls to curriculum service
export const courseQueries = {
  // Get all courses from database
  async getCourses(): Promise<CurriculumCourse[]> {
    try {
      const courses = await db.course.findMany({
        include: {
          subject: true,
          modules: {
            include: {
              lessons: true,
            },
            orderBy: {
              orderIndex: 'asc',
            },
          },
          _count: {
            select: {
              enrollments: true,
            },
          },
        },
        where: {
          isPublished: true,
        },
        orderBy: [{ grade: 'asc' }, { subject: { name: 'asc' } }, { title: 'asc' }],
      });

      // Transform database result to match CurriculumCourse type
      return courses.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description || '',
        slug: course.slug,
        subject: {
          id: course.subject.id,
          name: course.subject.name,
          code: course.subject.code,
        },
        grade: course.grade,
        modules: course.modules.map(module => ({
          id: module.id,
          title: module.title,
          description: module.description || '',
          orderIndex: module.orderIndex,
          lessons: module.lessons.map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            description: lesson.description || '',
            content: lesson.content,
            orderIndex: lesson.orderIndex,
            lessonType: lesson.lessonType,
            videoUrl: lesson.videoUrl,
            audioUrl: lesson.audioUrl,
            duration: lesson.duration,
            difficulty: lesson.difficulty,
          })),
          estimatedHours: module.estimatedHours,
          difficulty: module.difficulty,
        })),
        thumbnailUrl: course.thumbnailUrl,
        difficulty: course.difficulty,
        estimatedHours: course.estimatedHours,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      }));
    } catch (error) {
      console.warn('Database not available, falling back to mock data:', error);
      return mockCourses;
    }
  },

  // Get course by ID from database
  async getCourseById(courseId: string): Promise<CurriculumCourse | null> {
    try {
      const course = await db.course.findUnique({
        where: { id: courseId },
        include: {
          subject: true,
          modules: {
            include: {
              lessons: true,
            },
            orderBy: {
              orderIndex: 'asc',
            },
          },
        },
      });

      if (!course) return null;

      // Transform database result to match CurriculumCourse type
      return {
        id: course.id,
        title: course.title,
        description: course.description || '',
        slug: course.slug,
        subject: {
          id: course.subject.id,
          name: course.subject.name,
          code: course.subject.code,
        },
        grade: course.grade,
        modules: course.modules.map(module => ({
          id: module.id,
          title: module.title,
          description: module.description || '',
          orderIndex: module.orderIndex,
          lessons: module.lessons.map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            description: lesson.description || '',
            content: lesson.content,
            orderIndex: lesson.orderIndex,
            lessonType: lesson.lessonType,
            videoUrl: lesson.videoUrl,
            audioUrl: lesson.audioUrl,
            duration: lesson.duration,
            difficulty: lesson.difficulty,
          })),
          estimatedHours: module.estimatedHours,
          difficulty: module.difficulty,
        })),
        thumbnailUrl: course.thumbnailUrl,
        difficulty: course.difficulty,
        estimatedHours: course.estimatedHours,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      };
    } catch (error) {
      console.warn('Database not available, falling back to mock data:', error);
      return mockCourses.find(course => course.id === courseId) || null;
    }
  },

  // Create course via curriculum service API
  async createCourse(data: {
    title: string;
    description?: string;
    subjectId: string;
    grade: number;
    semester?: number;
    difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    language?: string;
    tags?: string[];
    estimatedHours?: number;
    prerequisites?: string[];
    learningOutcomes?: string[];
    createdById: string;
  }): Promise<CurriculumCourse> {
    // TODO: Replace with actual API call to curriculum service
    throw new Error('Course creation should be done via curriculum service API');
  },

  // Update course via curriculum service API
  async updateCourse(courseId: string, data: any): Promise<CurriculumCourse> {
    // TODO: Replace with actual API call to curriculum service
    throw new Error('Course updates should be done via curriculum service API');
  },

  // Delete course via curriculum service API
  async deleteCourse(courseId: string): Promise<void> {
    // TODO: Replace with actual API call to curriculum service
    throw new Error('Course deletion should be done via curriculum service API');
  },
};

// Subject-related queries - These will use the actual database
export const subjectQueries = {
  // Get all subjects
  async getSubjects() {
    return db.subject.findMany({
      include: {
        _count: {
          select: {
            courses: true,
            modules: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  },

  // Get subjects by grade
  async getSubjectsByGrade(grade: number) {
    return db.subject.findMany({
      where: {
        grades: {
          has: grade,
        },
      },
      include: {
        courses: {
          where: {
            grade,
            isPublished: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  },

  // Create subject
  async createSubject(data: {
    name: string;
    code: string;
    description?: string;
    icon?: string;
    color?: string;
    isCore?: boolean;
    grades: number[];
    language?: string;
    capsCode?: string;
    learningArea?: string;
  }) {
    return db.subject.create({
      data,
    });
  },
};

// Enrollment-related queries - These use the actual database
export const enrollmentQueries = {
  // Enroll student in course
  async createEnrollment(studentId: string, courseId: string) {
    return db.enrollment.create({
      data: {
        studentId,
        courseId,
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: true,
      },
    });
  },

  // Get student enrollments
  async getStudentEnrollments(studentId: string) {
    return db.enrollment.findMany({
      where: {
        studentId,
      },
      include: {
        course: true,
      },
      orderBy: {
        enrolledAt: 'desc',
      },
    });
  },

  // Update enrollment progress
  async updateEnrollmentProgress(enrollmentId: string, progressPercentage: number) {
    return db.enrollment.update({
      where: { id: enrollmentId },
      data: {
        progressPercentage,
        lastAccessedAt: new Date(),
        ...(progressPercentage >= 100 ? { completedAt: new Date() } : {}),
      },
    });
  },
};

// Progress-related queries - These use the actual database
export const progressQueries = {
  // Get lesson progress for student
  async getLessonProgress(lessonId: string, studentId: string) {
    return db.lessonProgress.findUnique({
      where: {
        studentId_lessonId: {
          studentId,
          lessonId,
        },
      },
    });
  },

  // Update lesson progress
  async updateLessonProgress(
    lessonId: string,
    studentId: string,
    data: {
      status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'MASTERED';
      progressPercentage?: number;
      timeSpent?: number;
      notes?: string;
      bookmarks?: any;
    }
  ) {
    return db.lessonProgress.upsert({
      where: {
        studentId_lessonId: {
          studentId,
          lessonId,
        },
      },
      update: {
        ...data,
        lastAccessedAt: new Date(),
        ...(data.status === 'COMPLETED' ? { completedAt: new Date() } : {}),
      },
      create: {
        studentId,
        lessonId,
        ...data,
        lastAccessedAt: new Date(),
        ...(data.status === 'COMPLETED' ? { completedAt: new Date() } : {}),
      },
    });
  },
};

// Study Points and Gamification - These use the actual database
export const gamificationQueries = {
  // Award study points
  async awardStudyPoints(
    studentId: string,
    points: number,
    category:
      | 'LESSON_COMPLETION'
      | 'QUIZ_SCORE'
      | 'ASSIGNMENT_SUBMISSION'
      | 'DAILY_LOGIN'
      | 'STREAK'
      | 'ACHIEVEMENT'
      | 'BONUS',
    reason: string,
    context?: {
      courseId?: string;
      lessonId?: string;
      quizId?: string;
      assignmentId?: string;
    }
  ) {
    return db.studyPoint.create({
      data: {
        studentId,
        points,
        category,
        reason,
        ...context,
      },
    });
  },

  // Get student's total points
  async getStudentPoints(studentId: string, timeframe?: { from?: Date; to?: Date }) {
    const where: any = { studentId };
    if (timeframe?.from || timeframe?.to) {
      where.earnedAt = {};
      if (timeframe.from) where.earnedAt.gte = timeframe.from;
      if (timeframe.to) where.earnedAt.lte = timeframe.to;
    }

    const result = await db.studyPoint.aggregate({
      where,
      _sum: {
        points: true,
      },
    });

    return result._sum.points || 0;
  },

  // Get student achievements
  async getStudentAchievements(studentId: string) {
    return db.userAchievement.findMany({
      where: { userId: studentId },
      include: {
        achievement: true,
      },
      orderBy: {
        earnedAt: 'desc',
      },
    });
  },
};

// Analytics and Dashboard Queries
export const analyticsQueries = {
  // Get comprehensive student dashboard data
  async getStudentDashboard(studentId: string) {
    // Get enrollments with progress
    const enrollments = await db.enrollment.findMany({
      where: { studentId },
      include: {
        course: true,
      },
    });

    // Get recent lesson progress
    const lessonProgress = await db.lessonProgress.findMany({
      where: { studentId },
      orderBy: { lastAccessedAt: 'desc' },
      take: 10,
    });

    // Get total study points
    const totalPoints = await db.studyPoint.aggregate({
      where: { studentId },
      _sum: { points: true },
    });

    // Get recent study points
    const recentPoints = await db.studyPoint.findMany({
      where: { studentId },
      orderBy: { earnedAt: 'desc' },
      take: 10,
    });

    // Get achievements
    const achievements = await db.userAchievement.findMany({
      where: { userId: studentId },
      include: { achievement: true },
      orderBy: { earnedAt: 'desc' },
    });

    // Mock quiz data (replace with API call to assessment service)
    const quizStats = {
      total: 12,
      completed: 8,
      passed: 6,
      averageScore: 75,
    };

    return {
      enrollments,
      lessonProgress,
      totalPoints: totalPoints._sum.points || 0,
      recentPoints,
      achievements,
      quizStats,
    };
  },
};
