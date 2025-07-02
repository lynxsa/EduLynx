import { NextRequest, NextResponse } from 'next/server';

// Mock data for student notifications
const notifications = [
  {
    id: 1,
    type: 'assignment',
    title: 'New Assignment Posted',
    message: 'Math: Quadratic Equations assignment has been posted.',
    time: 'Just now',
    isRead: false,
    course: 'Mathematics 101',
  },
  {
    id: 2,
    type: 'grade',
    title: 'Grade Updated',
    message: 'Your Science Lab Report has been graded. You received an A!',
    time: '2 hours ago',
    isRead: false,
    course: 'Science 101',
  },
  {
    id: 3,
    type: 'message',
    title: 'New Message from Mrs. Ndlovu',
    message: 'Please review your assignment submission...',
    time: 'Yesterday',
    isRead: true,
    course: 'English Literature',
  },
  {
    id: 4,
    type: 'course',
    title: 'New Course Material Available',
    message: 'New content has been added to Week 5 of History 101',
    time: 'Yesterday',
    isRead: true,
    course: 'History 101',
  },
  {
    id: 5,
    type: 'deadline',
    title: 'Assignment Deadline Reminder',
    message: 'Your Physics Problem Set is due tomorrow',
    time: '2 days ago',
    isRead: true,
    course: 'Physics 101',
  },
  {
    id: 6,
    type: 'system',
    title: 'System Maintenance',
    message:
      'The system will be unavailable this Saturday from 2am to 4am for scheduled maintenance.',
    time: '3 days ago',
    isRead: true,
    course: '',
  },
  {
    id: 7,
    type: 'feedback',
    title: 'Teacher Feedback Available',
    message: 'Mrs. Ndlovu has provided feedback on your latest essay.',
    time: '5 days ago',
    isRead: true,
    course: 'English Literature',
  },
];

export async function GET(request: NextRequest) {
  // In a real application, we would:
  // 1. Authenticate the user
  // 2. Get user-specific notifications from a database
  // 3. Apply filters if provided in query parameters

  // Get query parameters for filtering
  const { searchParams } = new URL(request.url);
  const typeFilter = searchParams.get('type');
  const readStatus = searchParams.get('isRead');

  let filteredNotifications = [...notifications];

  // Apply filters if provided
  if (typeFilter) {
    filteredNotifications = filteredNotifications.filter(
      notification => notification.type === typeFilter
    );
  }

  if (readStatus !== null) {
    const isRead = readStatus === 'true';
    filteredNotifications = filteredNotifications.filter(
      notification => notification.isRead === isRead
    );
  }

  // Stats
  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  return NextResponse.json({
    notifications: filteredNotifications,
    stats: {
      total: notifications.length,
      unread: unreadCount,
    },
  });
}

export async function PUT(request: NextRequest) {
  // In a real app, this would mark notifications as read
  try {
    const data = await request.json();

    if (!data.id && !data.all) {
      return NextResponse.json(
        { error: 'Please provide notification ID or set all to true' },
        { status: 400 }
      );
    }

    // In a real app, we would update the database
    // This mock just returns success

    return NextResponse.json({
      success: true,
      message: data.all
        ? 'All notifications marked as read'
        : `Notification ${data.id} marked as read`,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update notification status' }, { status: 500 });
  }
}
