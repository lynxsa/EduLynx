'use client';

import { Card } from '@edulynx/ui-primitives';
import { Calendar } from 'lucide-react';
import Link from 'next/link';
import { Progress } from '../../components/ui/progress';
import { goals } from './data';

export default function GoalsPage() {
  return (
    <main className="min-h-screen pt-20 bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Goals & Achievements
          </h1>
          <Link href="/dashboard" className="text-purple-600 hover:underline">
            ← Dashboard
          </Link>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">My Goals</h2>
          <div className="space-y-4">
            {goals.map(goal => (
              <Card key={goal.id} className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {goal.title}
                  </h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(goal.targetDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    {goal.progress}%
                  </span>
                  <Progress value={goal.progress} className="h-2 flex-1" />
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Achievements</h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            You have not unlocked any achievements yet.
          </div>
        </section>
      </div>
    </main>
  );
}
