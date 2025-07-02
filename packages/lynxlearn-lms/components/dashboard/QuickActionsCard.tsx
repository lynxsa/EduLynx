import { Card } from '@edulynx/ui-primitives';
import { Brain, Flame, Target, Zap } from 'lucide-react';
import Link from 'next/link';

export const QuickActionsCard = () => (
  <Card className="p-6 rounded-2xl shadow-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h2>
    <div className="grid grid-cols-2 gap-4">
      <Link
        href="/ai-tutor"
        className="flex flex-col items-center justify-center p-4 bg-LYNXLightLavendar/60 dark:bg-LYNXPurple/20 backdrop-blur-sm rounded-lg hover:bg-LYNXLavendar/80 dark:hover:bg-LYNXPurple/30 transition-all duration-300 border border-LYNXLight/20"
      >
        <Brain className="w-8 h-8 text-LYNXPurple dark:text-LYNXLight mb-2" />
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Ask ProfLynx</span>
      </Link>
      <Link
        href="/quiz/quick"
        className="flex flex-col items-center justify-center p-4 bg-LYNXThistle/60 dark:bg-LYNXHelio/20 backdrop-blur-sm rounded-lg hover:bg-LYNXThistle/80 dark:hover:bg-LYNXHelio/30 transition-all duration-300 border border-LYNXMauve/20"
      >
        <Target className="w-8 h-8 text-LYNXPurple dark:text-LYNXMauve mb-2" />
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Quick Quiz</span>
      </Link>
      <Link
        href="/study-session/boost"
        className="flex flex-col items-center justify-center p-4 bg-LYNXMauve/60 dark:bg-LYNXThistle/20 backdrop-blur-sm rounded-lg hover:bg-LYNXMauve/80 dark:hover:bg-LYNXThistle/30 transition-all duration-300 border border-LYNXHelio/20"
      >
        <Flame className="w-8 h-8 text-LYNXPurple dark:text-LYNXHelio mb-2" />
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Study Boost</span>
      </Link>
      <Link
        href="/study-streak"
        className="flex flex-col items-center justify-center p-4 bg-LYNXLavendar/60 dark:bg-LYNXMauve/20 backdrop-blur-sm rounded-lg hover:bg-LYNXLavendar/80 dark:hover:bg-LYNXMauve/30 transition-all duration-300 border border-LYNXThistle/20"
      >
        <Zap className="w-8 h-8 text-LYNXPurple dark:text-LYNXThistle mb-2" />
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Study Streak</span>
      </Link>
    </div>
  </Card>
);
