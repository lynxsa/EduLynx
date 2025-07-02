'use client';

import { Card } from '@edulynx/ui-primitives';
import { MessageSquare, Users, Video } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { StudyGroup, studyGroups } from '../data';

interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: string;
}

export default function StudyGroupDetail() {
  const { id } = useParams();
  const group = studyGroups.find((g: StudyGroup) => g.id === id);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      user: 'Alice',
      content: 'Hi everyone, welcome to the group!',
      timestamp: '10:00 AM',
    },
    {
      id: 'm2',
      user: 'Bob',
      content: 'Thanks! Let’s start with chapter 3 questions.',
      timestamp: '10:05 AM',
    },
  ]);
  const [newMessage, setNewMessage] = useState('');

  if (!group) {
    return <p className="p-6 text-red-500">Group not found.</p>;
  }

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages(prev => [
      ...prev,
      {
        id: `m${prev.length + 1}`,
        user: 'You',
        content: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setNewMessage('');
  };

  return (
    <main className="min-h-screen pt-20 bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{group.name}</h1>
          <Link href="/study-groups" className="text-purple-600 hover:underline">
            ← Back
          </Link>
        </div>

        <Card className="p-6">
          <p className="text-gray-700 mb-2">{group.description}</p>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-600">
              <Users className="mr-1" /> {group.members} members
            </div>
            <Link
              href={group.meetingLink}
              target="_blank"
              className="flex items-center text-sm text-purple-600 hover:underline"
            >
              <Video className="mr-1" /> Join Meeting
            </Link>
          </div>
        </Card>

        {/* Discussion Chat */}
        <Card className="p-6 flex flex-col" style={{ height: '500px' }}>
          <h2 className="text-xl font-semibold mb-4">Discussion</h2>
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map(msg => (
              <div key={msg.id} className="flex space-x-3">
                <MessageSquare className="w-6 h-6 text-gray-500" />
                <div>
                  <div className="text-sm font-medium text-gray-800">{msg.user}</div>
                  <div className="text-sm text-gray-700">{msg.content}</div>
                  <div className="text-xs text-gray-500 mt-1">{msg.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex space-x-2">
            <textarea
              rows={2}
              className="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
              placeholder="Type your message..."
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
            />
            <Button onClick={handleSend} className="self-end">
              Send
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
