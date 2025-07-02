// Shared mock data for student goals
export interface Goal {
  id: string;
  title: string;
  progress: number; // percent
  targetDate: string; // ISO date
}

export const goals: Goal[] = [
  {
    id: 'g1',
    title: 'Complete 50 Lessons',
    progress: 30,
    targetDate: '2025-08-01',
  },
  {
    id: 'g2',
    title: 'Achieve 90% in Mathematics Quiz',
    progress: 60,
    targetDate: '2025-07-15',
  },
  {
    id: 'g3',
    title: 'Finish Physics Modules',
    progress: 45,
    targetDate: '2025-07-30',
  },
];
