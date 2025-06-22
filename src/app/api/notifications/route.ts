import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: Date;
  read: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const userId = currentUser.userId;

    // Get user's role to customize notifications
    const userRecord = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!userRecord) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let notifications: Notification[] = [];

    // Generate role-specific notifications
    switch (userRecord.role) {
      case 'ADMIN':
        notifications = [
          {
            id: '1',
            title: 'System Update',
            message: 'EduLynx system will be updated tonight at 11 PM',
            type: 'info',
            timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
            read: false,
          },
          {
            id: '2',
            title: 'New Teacher Registration',
            message: 'Sarah Johnson has submitted a teacher application',
            type: 'success',
            timestamp: new Date(Date.now() - 3600000), // 1 hour ago
            read: false,
          },
          {
            id: '3',
            title: 'School Performance Report',
            message: 'Monthly performance report is ready for review',
            type: 'info',
            timestamp: new Date(Date.now() - 7200000), // 2 hours ago
            read: true,
          },
        ];
        break;

      case 'TEACHER':
        notifications = [
          {
            id: '1',
            title: 'Assignment Submissions',
            message: '15 new assignments submitted for Math Grade 10',
            type: 'info',
            timestamp: new Date(Date.now() - 900000), // 15 minutes ago
            read: false,
          },
          {
            id: '2',
            title: 'Parent Meeting Request',
            message: "Mrs. Smith requests a meeting about John's progress",
            type: 'warning',
            timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
            read: false,
          },
          {
            id: '3',
            title: 'Class Schedule Change',
            message: 'Your Physics class moved to Room 205',
            type: 'info',
            timestamp: new Date(Date.now() - 3600000), // 1 hour ago
            read: true,
          },
        ];
        break;

      case 'PARENT':
        notifications = [
          {
            id: '1',
            title: 'Grade Update',
            message: 'Your child received a new grade in Mathematics',
            type: 'success',
            timestamp: new Date(Date.now() - 1200000), // 20 minutes ago
            read: false,
          },
          {
            id: '2',
            title: 'School Event',
            message: 'Sports Day scheduled for next Friday',
            type: 'info',
            timestamp: new Date(Date.now() - 2400000), // 40 minutes ago
            read: false,
          },
          {
            id: '3',
            title: 'Fee Reminder',
            message: 'School fees are due by the end of this month',
            type: 'warning',
            timestamp: new Date(Date.now() - 86400000), // 1 day ago
            read: true,
          },
        ];
        break;

      case 'STUDENT':
        notifications = [
          {
            id: '1',
            title: 'New Assignment',
            message: 'Math homework assigned - due tomorrow',
            type: 'warning',
            timestamp: new Date(Date.now() - 600000), // 10 minutes ago
            read: false,
          },
          {
            id: '2',
            title: 'Grade Available',
            message: 'Your English essay grade is now available',
            type: 'success',
            timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
            read: false,
          },
          {
            id: '3',
            title: 'Library Book Due',
            message: 'Return "To Kill a Mockingbird" by Friday',
            type: 'info',
            timestamp: new Date(Date.now() - 3600000), // 1 hour ago
            read: true,
          },
        ];
        break;

      default:
        notifications = [] as Notification[];
    }

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('Notifications error:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { notificationId, action } = await request.json();

    // In a real application, you would update the notification status in the database
    // For now, we'll just return a success response

    if (action === 'mark_read') {
      // Mark notification as read
      return NextResponse.json({ success: true, message: 'Notification marked as read' });
    }

    if (action === 'delete') {
      // Delete notification
      return NextResponse.json({ success: true, message: 'Notification deleted' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Notification action error:', error);
    return NextResponse.json({ error: 'Failed to process notification action' }, { status: 500 });
  }
}
