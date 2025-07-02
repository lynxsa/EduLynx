// Shared mock notifications data
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'assignment' | 'grade' | 'message' | 'calendar' | 'system' | 'achievement';
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
  createdAt: string; // ISO date
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export const notifications: Notification[] = [
  {
    id: 'n1',
    title: 'Assignment Graded',
    message: 'Your Chemistry Lab Report has been graded: 85%',
    type: 'grade',
    priority: 'medium',
    isRead: false,
    createdAt: '2025-06-20T10:00:00Z',
    actionUrl: '/assignments/lab-report-2',
    metadata: { score: '85%' },
  },
  {
    id: 'n2',
    title: 'New Course Available',
    message: 'Physics: Advanced Mechanics is now available.',
    type: 'system',
    priority: 'low',
    isRead: true,
    createdAt: '2025-06-18T15:30:00Z',
    actionUrl: '/courses/physics-mechanics',
    metadata: {},
  },
  {
    id: 'n3',
    title: 'Study Group Invitation',
    message: 'You have been invited to join the Biology Study Group.',
    type: 'message',
    priority: 'medium',
    isRead: false,
    createdAt: '2025-06-17T08:45:00Z',
    actionUrl: '/study-groups/history-discussion',
    metadata: { group: 'Biology Study Group' },
  },
];
