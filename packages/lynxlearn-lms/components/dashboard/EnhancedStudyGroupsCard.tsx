import { Card } from '@edulynx/ui-primitives';
import { BookOpen, Clock, MessageCircle, Users } from 'lucide-react';
import Link from 'next/link';

interface StudyGroupData {
  id: number;
  name: string;
  subject: string;
  members: number;
  lastActivity: string;
  nextSession?: string;
}

interface EnhancedStudyGroupsCardProps {
  studyGroups: StudyGroupData[];
  totalGroups: number;
}

export const EnhancedStudyGroupsCard = ({
  studyGroups,
  totalGroups,
}: EnhancedStudyGroupsCardProps) => (
  <Card className="p-6 rounded-2xl shadow-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
        <Users className="w-6 h-6 text-LYNXPurple dark:text-LYNXLight" />
        <span>Study Groups</span>
      </h2>
      <Link
        href="/study-groups"
        className="text-sm font-medium text-LYNXPurple dark:text-LYNXLight hover:underline"
      >
        Join more
      </Link>
    </div>

    <div className="grid grid-cols-1 gap-3 mb-4">
      <div className="bg-LYNXLightLavendar/40 dark:bg-LYNXPurple/10 backdrop-blur-sm rounded-lg p-3 border border-LYNXLight/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-LYNXMauve flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{totalGroups}</p>
              <p className="text-xs text-LYNXPurple dark:text-LYNXLight">Active Groups</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="space-y-3">
      {studyGroups.slice(0, 3).map(group => (
        <Link key={group.id} href={`/study-groups/${group.id}`} className="block">
          <div className="p-3 bg-LYNXThistle/40 dark:bg-LYNXMauve/10 backdrop-blur-sm rounded-lg border border-LYNXMauve/20 hover:bg-LYNXThistle/60 dark:hover:bg-LYNXMauve/20 transition-all">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">{group.name}</h3>
              <span className="text-xs bg-LYNXMauve text-white px-2 py-1 rounded-full">
                {group.members} members
              </span>
            </div>
            <p className="text-sm text-LYNXPurple dark:text-LYNXLight mb-1">{group.subject}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-3 h-3" />
                <span>{group.lastActivity}</span>
              </div>
              {group.nextSession && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{group.nextSession}</span>
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>

    <Link
      href="/study-groups/create"
      className="block mt-4 p-3 border-2 border-dashed border-LYNXLight/40 rounded-lg text-center hover:border-LYNXPurple/60 hover:bg-LYNXLightLavendar/20 transition-all"
    >
      <BookOpen className="w-6 h-6 mx-auto mb-1 text-LYNXPurple dark:text-LYNXLight" />
      <p className="text-sm font-medium text-LYNXPurple dark:text-LYNXLight">Create Study Group</p>
    </Link>
  </Card>
);
