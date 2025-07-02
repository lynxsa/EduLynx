import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // In a real application, we would:
  // 1. Authenticate the user
  // 2. Get student-specific progress data from the database

  // Get query parameters
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || 'term'; // term, year, all

  // Mock data for student progress
  const studentProgress = {
    courses: 5,
    lessons: 42,
    overall: 68,
    assignments: 3,
    upcoming: 2,
    recent: [
      {
        id: 1,
        type: 'quiz',
        title: 'Algebraic Expressions',
        status: 'completed',
        result: '90%',
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        course: 'Mathematics 101',
      },
      {
        id: 2,
        type: 'lesson',
        title: 'Chemical Reactions',
        status: 'in-progress',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        course: 'Science 101',
      },
      {
        id: 3,
        type: 'assignment',
        title: 'History Research',
        status: 'submitted',
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        course: 'History 101',
      },
      {
        id: 4,
        type: 'exam',
        title: 'Mid-term Literature Exam',
        status: 'graded',
        result: '85%',
        timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        course: 'English Literature',
      },
      {
        id: 5,
        type: 'discussion',
        title: 'International Relations Forum',
        status: 'participated',
        timestamp: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
        course: 'Social Studies',
      },
    ],
    tasks: [
      {
        id: 1,
        type: 'assignment',
        title: 'Quadratic Equations',
        dueDate: new Date(Date.now() + 86400000).toISOString(), // tomorrow
        priority: 'urgent',
        subject: 'Mathematics 101',
        description: 'Complete problems 1-15 on page 87 of the textbook.',
      },
      {
        id: 2,
        type: 'lab',
        title: 'Photosynthesis',
        dueDate: new Date(Date.now() + 259200000).toISOString(), // 3 days
        priority: 'important',
        subject: 'Science 101',
        description: 'Complete the lab report for the photosynthesis experiment.',
      },
      {
        id: 3,
        type: 'essay',
        title: 'Essay Review',
        dueDate: new Date(Date.now() + 604800000).toISOString(), // 1 week
        priority: 'upcoming',
        subject: 'English Literature',
        description: 'Submit your final draft of the literary analysis essay.',
      },
      {
        id: 4,
        type: 'project',
        title: 'Historical Timeline',
        dueDate: new Date(Date.now() + 1209600000).toISOString(), // 2 weeks
        priority: 'upcoming',
        subject: 'History 101',
        description: 'Create a visual timeline of ancient Roman civilization.',
      },
    ],
    courseProgress: [
      {
        id: 1,
        name: 'Mathematics 101',
        subtitle: 'Algebra & Trigonometry',
        progress: 75,
        type: 'core',
        nextLesson: 'Integration Techniques',
        lastAccessed: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
      },
      {
        id: 2,
        name: 'Science 101',
        subtitle: 'Chemistry Foundations',
        progress: 52,
        type: 'core',
        nextLesson: 'Chemical Reactions',
        lastAccessed: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      },
      {
        id: 3,
        name: 'History 101',
        subtitle: 'Ancient Civilizations',
        progress: 82,
        type: 'elective',
        nextLesson: 'Roman Empire',
        lastAccessed: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      },
      {
        id: 4,
        name: 'English Literature',
        subtitle: 'Literary Analysis',
        progress: 60,
        type: 'core',
        nextLesson: 'Poetry Analysis',
        lastAccessed: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      },
      {
        id: 5,
        name: 'Social Studies',
        subtitle: 'Global Relations',
        progress: 45,
        type: 'elective',
        nextLesson: 'International Organizations',
        lastAccessed: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
      },
    ],
    schedule: [
      {
        id: 1,
        date: new Date().toISOString().split('T')[0], // Today
        dayName: new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date()),
        classes: [
          {
            id: 101,
            subject: 'Mathematics 101',
            time: '08:30 - 10:00',
            room: '203',
            teacher: 'Mr. Nkosi',
            topic: 'Advanced Algebra',
            type: 'lecture',
          },
          {
            id: 102,
            subject: 'Science 101',
            time: '10:15 - 11:45',
            room: 'Lab 2',
            teacher: 'Mrs. Moyo',
            topic: 'Chemical Reactions Lab',
            type: 'lab',
          },
          {
            id: 103,
            subject: 'English Literature',
            time: '13:00 - 14:30',
            room: '105',
            teacher: 'Mrs. Ndlovu',
            topic: 'Poetry Analysis',
            type: 'lecture',
          },
        ],
      },
      {
        id: 2,
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        dayName: new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(
          new Date(Date.now() + 86400000)
        ),
        classes: [
          {
            id: 201,
            subject: 'History 101',
            time: '08:30 - 10:00',
            room: '108',
            teacher: 'Mr. Zulu',
            topic: 'Ancient Rome',
            type: 'lecture',
          },
          {
            id: 202,
            subject: 'Social Studies',
            time: '10:15 - 11:45',
            room: '201',
            teacher: 'Ms. Dlamini',
            topic: 'International Relations',
            type: 'discussion',
          },
          {
            id: 203,
            subject: 'Mathematics 101',
            time: '13:00 - 14:30',
            room: '203',
            teacher: 'Mr. Nkosi',
            topic: 'Practice Problems',
            type: 'tutorial',
          },
        ],
      },
    ],
    stats: {
      averageGrade: 82,
      attendanceRate: 95,
      completedAssignments: 28,
      totalAssignments: 32,
      participationScore: 87,
      lastLogin: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      streakDays: 15,
    },
  };

  return NextResponse.json(studentProgress);
}
