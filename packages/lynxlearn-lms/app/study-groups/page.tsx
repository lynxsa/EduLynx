'use client';

import { Card } from '@edulynx/ui-primitives';
import { MessageSquare, Users, Video } from 'lucide-react';
import Link from 'next/link';
import { studyGroups } from './data';

export default function StudyGroupsPage() {
  return (
    <main className="min-h-screen pt-20 bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Study Groups</h1>
          <Link href="/dashboard" className="text-purple-600 hover:underline">
            ← Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studyGroups.map(group => (
            <Card key={group.id} className="p-6">
              <h2 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
                {group.name}
              </h2>
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">{group.description}</p>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Users className="w-5 h-5 mr-2" />
                {group.members} members
              </div>
              <div className="flex space-x-2">
                <Link
                  href={group.meetingLink}
                  target="_blank"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm flex items-center"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Join Meeting
                </Link>
                <Link
                  href={`/study-groups/${group.id}`}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded text-sm flex items-center"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Forum
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
