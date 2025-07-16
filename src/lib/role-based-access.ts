/**
 * OPERATION VOLCANOFOUNTAIN - PHASE 1
 * Role-Based Access Control Library
 * Ensures users only see data they're authorized to access
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

interface AccessFilter {
  role: UserRole;
  userId: string;
}

/**
 * Get students visible to a specific user based on their role
 */
export async function getAuthorizedStudents(filter: AccessFilter) {
  const { role, userId } = filter;

  switch (role) {
    case 'ADMIN':
      // Admin sees all students
      return await prisma.student.findMany({
        include: {
          class: true,
          grade: true,
          parent: true,
          results: true,
          attendances: true,
        },
      });

    case 'TEACHER':
      // Teacher sees only students in their classes
      const teacher = await prisma.teacher.findUnique({
        where: { id: userId },
        include: { lessons: { include: { class: true } } },
      });

      if (!teacher) return [];

      const classIds = teacher.lessons.map(lesson => lesson.classId);

      return await prisma.student.findMany({
        where: {
          classId: { in: classIds },
        },
        include: {
          class: true,
          grade: true,
          parent: true,
          results: {
            include: {
              exam: { include: { lesson: true } },
              assignment: { include: { lesson: true } },
            },
          },
          attendances: {
            include: {
              lesson: true,
            },
          },
        },
      });

    case 'STUDENT':
      // Student sees only themselves
      return await prisma.student.findMany({
        where: { id: userId },
        include: {
          class: true,
          grade: true,
          parent: true,
          results: true,
          attendances: true,
        },
      });

    case 'PARENT':
      // Parent sees only their children
      return await prisma.student.findMany({
        where: { parentId: userId },
        include: {
          class: true,
          grade: true,
          parent: true,
          results: true,
          attendances: true,
        },
      });

    default:
      return [];
  }
}

/**
 * Get results visible to a specific user based on their role
 */
export async function getAuthorizedResults(filter: AccessFilter) {
  const { role, userId } = filter;

  switch (role) {
    case 'ADMIN':
      // Admin sees all results
      return await prisma.result.findMany({
        include: {
          student: { include: { class: true } },
          exam: { include: { lesson: { include: { subject: true, class: true } } } },
          assignment: { include: { lesson: { include: { subject: true, class: true } } } },
        },
        orderBy: { id: 'desc' },
      });

    case 'TEACHER':
      // Teacher sees only results from their lessons
      const teacher = await prisma.teacher.findUnique({
        where: { id: userId },
        include: { lessons: true },
      });

      if (!teacher) return [];

      const lessonIds = teacher.lessons.map(lesson => lesson.id);

      return await prisma.result.findMany({
        where: {
          OR: [
            { exam: { lessonId: { in: lessonIds } } },
            { assignment: { lessonId: { in: lessonIds } } },
          ],
        },
        include: {
          student: { include: { class: true } },
          exam: { include: { lesson: { include: { subject: true, class: true } } } },
          assignment: { include: { lesson: { include: { subject: true, class: true } } } },
        },
        orderBy: { id: 'desc' },
      });

    case 'STUDENT':
      // Student sees only their own results
      return await prisma.result.findMany({
        where: { studentId: userId },
        include: {
          student: { include: { class: true } },
          exam: { include: { lesson: { include: { subject: true, class: true } } } },
          assignment: { include: { lesson: { include: { subject: true, class: true } } } },
        },
        orderBy: { id: 'desc' },
      });

    case 'PARENT':
      // Parent sees results of their children
      const children = await prisma.student.findMany({
        where: { parentId: userId },
        select: { id: true },
      });

      const childIds = children.map(child => child.id);

      return await prisma.result.findMany({
        where: { studentId: { in: childIds } },
        include: {
          student: { include: { class: true } },
          exam: { include: { lesson: { include: { subject: true, class: true } } } },
          assignment: { include: { lesson: { include: { subject: true, class: true } } } },
        },
        orderBy: { id: 'desc' },
      });

    default:
      return [];
  }
}

/**
 * Get assignments visible to a specific user based on their role
 */
export async function getAuthorizedAssignments(filter: AccessFilter) {
  const { role, userId } = filter;

  switch (role) {
    case 'ADMIN':
      // Admin sees all assignments
      return await prisma.assignment.findMany({
        include: {
          lesson: {
            include: {
              subject: true,
              class: true,
              teacher: true,
            },
          },
          results: {
            include: {
              student: true,
            },
          },
        },
        orderBy: { dueDate: 'desc' },
      });

    case 'TEACHER':
      // Teacher sees only assignments from their lessons
      const teacher = await prisma.teacher.findUnique({
        where: { id: userId },
        include: { lessons: true },
      });

      if (!teacher) return [];

      const lessonIds = teacher.lessons.map(lesson => lesson.id);

      return await prisma.assignment.findMany({
        where: { lessonId: { in: lessonIds } },
        include: {
          lesson: {
            include: {
              subject: true,
              class: true,
              teacher: true,
            },
          },
          results: {
            include: {
              student: true,
            },
          },
        },
        orderBy: { dueDate: 'desc' },
      });

    case 'STUDENT':
      // Student sees assignments from their class lessons
      const student = await prisma.student.findUnique({
        where: { id: userId },
        include: { class: { include: { lessons: true } } },
      });

      if (!student?.class) return [];

      const studentLessonIds = student.class.lessons.map(lesson => lesson.id);

      return await prisma.assignment.findMany({
        where: { lessonId: { in: studentLessonIds } },
        include: {
          lesson: {
            include: {
              subject: true,
              class: true,
              teacher: true,
            },
          },
          results: {
            where: { studentId: userId }, // Only their own results
            include: {
              student: true,
            },
          },
        },
        orderBy: { dueDate: 'desc' },
      });

    case 'PARENT':
      // Parent sees assignments for their children's classes
      const children = await prisma.student.findMany({
        where: { parentId: userId },
        include: { class: { include: { lessons: true } } },
      });

      const allLessonIds = children
        .flatMap(child => child.class?.lessons || [])
        .map(lesson => lesson.id);

      const childIds = children.map(child => child.id);

      return await prisma.assignment.findMany({
        where: { lessonId: { in: allLessonIds } },
        include: {
          lesson: {
            include: {
              subject: true,
              class: true,
              teacher: true,
            },
          },
          results: {
            where: { studentId: { in: childIds } }, // Only their children's results
            include: {
              student: true,
            },
          },
        },
        orderBy: { dueDate: 'desc' },
      });

    default:
      return [];
  }
}

/**
 * Get teacher's timetable
 */
export async function getTeacherTimetable(teacherId: string) {
  return await prisma.lesson.findMany({
    where: { teacherId },
    include: {
      subject: true,
      class: true,
      teacher: true,
    },
    orderBy: [{ day: 'asc' }, { startTime: 'asc' }],
  });
}

/**
 * Get classes visible to a specific user
 */
export async function getAuthorizedClasses(filter: AccessFilter) {
  const { role, userId } = filter;

  switch (role) {
    case 'ADMIN':
      return await prisma.class.findMany({
        include: {
          grade: true,
          supervisor: true,
          students: true,
          lessons: {
            include: {
              teacher: true,
              subject: true,
            },
          },
        },
      });

    case 'TEACHER':
      // Teacher sees only classes they teach
      const teacher = await prisma.teacher.findUnique({
        where: { id: userId },
        include: { lessons: { include: { class: true } } },
      });

      if (!teacher) return [];

      const classIds = [...new Set(teacher.lessons.map(lesson => lesson.classId))];

      return await prisma.class.findMany({
        where: { id: { in: classIds } },
        include: {
          grade: true,
          supervisor: true,
          students: true,
          lessons: {
            include: {
              teacher: true,
              subject: true,
            },
          },
        },
      });

    case 'STUDENT':
      // Student sees only their class
      const student = await prisma.student.findUnique({
        where: { id: userId },
        include: { class: true },
      });

      if (!student?.classId) return [];

      return await prisma.class.findMany({
        where: { id: student.classId },
        include: {
          grade: true,
          supervisor: true,
          students: true,
          lessons: {
            include: {
              teacher: true,
              subject: true,
            },
          },
        },
      });

    case 'PARENT':
      // Parent sees classes of their children
      const children = await prisma.student.findMany({
        where: { parentId: userId },
        include: { class: true },
      });

      const parentClassIds = children.map(child => child.classId).filter(Boolean);

      return await prisma.class.findMany({
        where: { id: { in: parentClassIds } },
        include: {
          grade: true,
          supervisor: true,
          students: true,
          lessons: {
            include: {
              teacher: true,
              subject: true,
            },
          },
        },
      });

    default:
      return [];
  }
}

/**
 * Check if user has access to specific student data
 */
export async function hasStudentAccess(
  userId: string,
  role: UserRole,
  studentId: string
): Promise<boolean> {
  switch (role) {
    case 'ADMIN':
      return true;

    case 'TEACHER':
      // Check if teacher teaches this student
      const teacher = await prisma.teacher.findUnique({
        where: { id: userId },
        include: { lessons: { include: { class: { include: { students: true } } } } },
      });

      if (!teacher) return false;

      const teacherStudentIds = teacher.lessons
        .flatMap(lesson => lesson.class.students)
        .map(student => student.id);

      return teacherStudentIds.includes(studentId);

    case 'STUDENT':
      return userId === studentId;

    case 'PARENT':
      // Check if this is parent's child
      const parentChild = await prisma.student.findFirst({
        where: { id: studentId, parentId: userId },
      });

      return !!parentChild;

    default:
      return false;
  }
}
