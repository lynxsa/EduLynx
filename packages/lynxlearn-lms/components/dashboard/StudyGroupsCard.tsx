import { Card } from '@edulynx/ui-primitives';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface StudyGroupsCardProps {
  groupCount: number;
}

export const StudyGroupsCard = ({ groupCount }: StudyGroupsCardProps) => (
  <Card className="p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
        <MessageCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        <span>Study Groups</span>
      </h2>
      <Link
        href="/study-groups"
        className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        View all
      </Link>
    </div>
    <p className="text-sm text-gray-700 dark:text-gray-300">
      You are part of <span className="font-semibold">{groupCount}</span> study group
      {groupCount !== 1 ? 's' : ''}.
    </p>
  </Card>
);
