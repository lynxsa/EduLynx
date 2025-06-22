import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get teacher ID from query params (in a real app, this would come from auth)
    const url = new URL(request.url);
    const teacherId = url.searchParams.get('teacherId');

    if (!teacherId) {
      return NextResponse.json({ error: 'Teacher ID is required' }, { status: 400 });
    }

    // Get assignments that need grading by this teacher
    const pendingAssignments = await prisma.assignment.findMany({
      where: {
        lesson: {
          subject: {
            teachers: {
              some: {
                teacherId: teacherId,
              },
            },
          },
        },
      },
      include: {
        lesson: {
          include: {
            subject: {
              select: { name: true },
            },
            class: {
              select: { name: true },
            },
          },
        },
        submissions: {
          where: {
            grade: null, // Ungraded submissions
          },
          include: {
            student: {
              select: {
                name: true,
                surname: true,
              },
            },
          },
        },
      },
      orderBy: {
        dueDate: 'asc',
      },
    });

    // Get ungraded exam results that need grading
    const pendingExamResults = await prisma.result.findMany({
      where: {
        score: 0, // Assuming 0 means ungraded
        exam: {
          lesson: {
            subject: {
              teachers: {
                some: {
                  teacherId: teacherId,
                },
              },
            },
          },
        },
      },
      include: {
        student: {
          select: {
            name: true,
            surname: true,
          },
        },
        exam: {
          include: {
            lesson: {
              include: {
                subject: {
                  select: { name: true },
                },
                class: {
                  select: { name: true },
                },
              },
            },
          },
        },
      },
    });

    // Format pending assignments (based on submissions without grades)
    const formattedAssignments = pendingAssignments
      .filter(assignment => assignment.submissions.length > 0)
      .map(assignment => ({
        id: assignment.id,
        title: assignment.title,
        type: 'assignment',
        subject: assignment.lesson.subject.name,
        class: assignment.lesson.class.name,
        dueDate: assignment.dueDate,
        pendingCount: assignment.submissions.length,
        submissions: assignment.submissions.map(submission => ({
          studentName: `${submission.student.name} ${submission.student.surname}`,
          submittedAt: submission.submittedAt,
        })),
      }));

    // Format pending exam results
    const formattedExamResults = pendingExamResults.map(result => ({
      id: result.id,
      title: result.exam?.title || 'Exam Result',
      type: 'exam',
      subject: result.exam?.lesson.subject.name || 'Unknown',
      class: result.exam?.lesson.class.name || 'Unknown',
      studentName: `${result.student.name} ${result.student.surname}`,
      examDate: result.exam?.startTime,
    }));

    // Group exam results by exam
    const examGroups = new Map();
    formattedExamResults.forEach(result => {
      const key = `${result.subject}-${result.class}-${result.title}`;
      if (!examGroups.has(key)) {
        examGroups.set(key, {
          id: `exam-${result.id}`,
          title: result.title,
          type: 'exam',
          subject: result.subject,
          class: result.class,
          examDate: result.examDate,
          pendingCount: 0,
          submissions: [],
        });
      }

      const group = examGroups.get(key);
      group.pendingCount++;
      group.submissions.push({
        studentName: result.studentName,
      });
    });

    const formattedExams = Array.from(examGroups.values());

    const allPending = [...formattedAssignments, ...formattedExams].sort((a, b) => {
      const dateA = a.dueDate || a.examDate;
      const dateB = b.dueDate || b.examDate;
      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    });

    const stats = {
      totalPending: allPending.reduce((sum, item) => sum + item.pendingCount, 0),
      assignments: formattedAssignments.length,
      exams: formattedExams.length,
      oldestPending: allPending.length > 0 ? allPending[0] : null,
    };

    return NextResponse.json({
      stats,
      pending: allPending.slice(0, 10), // Limit to 10 most urgent items
    });
  } catch (error) {
    console.error('Pending Grading API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch pending grading data' }, { status: 500 });
  }
}
