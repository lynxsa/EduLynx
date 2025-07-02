// Shared mock events data for Calendar
export interface EventItem {
  id: number;
  title: string;
  time: string;
  type: 'class' | 'lab' | 'assignment' | 'test' | 'meeting' | 'quiz';
}

export const eventsData: Record<string, EventItem[]> = {
  '2025-06-23': [
    { id: 1, title: 'Mathematics Class', time: '09:00 - 10:30', type: 'class' },
    { id: 2, title: 'Science Lab Session', time: '11:00 - 12:30', type: 'lab' },
    { id: 3, title: 'History Assignment Due', time: '23:59', type: 'assignment' },
  ],
  '2025-06-24': [
    { id: 4, title: 'English Literature Class', time: '09:00 - 10:30', type: 'class' },
    { id: 5, title: 'Computer Science Class', time: '13:00 - 14:30', type: 'class' },
  ],
  '2025-06-25': [
    { id: 6, title: 'Mathematics Class', time: '09:00 - 10:30', type: 'class' },
    { id: 7, title: 'Science Test', time: '11:00 - 12:00', type: 'test' },
    { id: 11, title: 'Mathematics Quiz', time: '11:00 - 11:45', type: 'quiz' },
  ],
  '2025-06-26': [
    { id: 8, title: 'English Literature Class', time: '09:00 - 10:30', type: 'class' },
    { id: 9, title: 'Science Lab Report Due', time: '23:59', type: 'assignment' },
  ],
  '2025-06-27': [
    { id: 10, title: 'History Class', time: '09:00 - 10:30', type: 'class' },
    { id: 11, title: 'Mathematics Quiz', time: '11:00 - 11:45', type: 'quiz' },
    { id: 12, title: 'Computer Science Project Meeting', time: '14:00 - 15:00', type: 'meeting' },
  ],
  '2025-06-30': [{ id: 13, title: 'English Essay Due', time: '23:59', type: 'assignment' }],
};
