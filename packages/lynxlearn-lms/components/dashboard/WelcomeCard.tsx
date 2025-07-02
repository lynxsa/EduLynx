import { Card } from '@edulynx/ui-primitives';
import { GraduationCap } from 'lucide-react';

export const WelcomeCard = ({ studentProfile }) => (
  <Card className="p-6 rounded-2xl shadow-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30">
    <div className="flex items-center space-x-4">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-LYNXPurple via-LYNXHelio to-LYNXMauve flex items-center justify-center text-white font-bold text-xl shadow-2xl ring-4 ring-LYNXLight/30 backdrop-blur-sm">
        {studentProfile.name
          .split(' ')
          .map(n => n[0])
          .join('')}
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
          Welcome back, {studentProfile.name}
        </h1>
        <p className="text-sm text-LYNXPurple dark:text-LYNXLight flex items-center space-x-2 mt-1">
          <GraduationCap className="w-4 h-4" />
          <span>
            {studentProfile.grade} • {studentProfile.school}
          </span>
        </p>
      </div>
    </div>
  </Card>
);
