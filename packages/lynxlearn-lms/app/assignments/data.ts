// Shared mock assignments data
export interface Assignment {
  id: string;
  title: string;
  course: string;
  description: string;
  dueDate: string; // ISO date
  status: 'open' | 'submitted';
  submittedFile?: string;
  grade?: string;
}

export const assignments: Assignment[] = [
  {
    id: '1',
    title: 'Calculus Homework',
    course: 'Mathematics Grade 12',
    description: 'Solve the attached problems on differentiation and submit your workings.',
    dueDate: '2025-07-05',
    status: 'open',
  },
  {
    id: '2',
    title: 'Physical Science Lab Report',
    course: 'Physical Science Grade 11',
    description: 'Complete the lab report on wave experiments and upload your PDF.',
    dueDate: '2025-07-10',
    status: 'submitted',
    submittedFile: '/submissions/lab-report-2.pdf',
    grade: '85%',
  },
  {
    id: '3',
    title: 'Ecology Quiz',
    course: 'Life Sciences Grade 10',
    description: 'Answer the questions on ecosystems and biodiversity.',
    dueDate: '2025-07-08',
    status: 'open',
  },
];
