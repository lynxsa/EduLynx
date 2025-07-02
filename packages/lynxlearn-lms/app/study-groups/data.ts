// Shared mock data for Study Groups
export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  meetingLink: string;
}

export const studyGroups: StudyGroup[] = [
  {
    id: 'algebra-101',
    name: 'Algebra 101 Support',
    description: 'Collaborate on Algebra problems and share study notes.',
    members: 24,
    meetingLink: 'https://meet.example.com/algebra-101',
  },
  {
    id: 'chemistry-lab-group',
    name: 'Chemistry Lab Group',
    description: 'Discuss experiments, lab reports, and safety protocols.',
    members: 18,
    meetingLink: 'https://meet.example.com/chem-lab',
  },
  {
    id: 'history-discussion',
    name: 'History Discussion Forum',
    description: 'Debate historical events and prepare essays together.',
    members: 30,
    meetingLink: 'https://meet.example.com/history-group',
  },
];
