import { Card } from '@edulynx/ui-primitives';
import { Award, Medal } from 'lucide-react';
import Link from 'next/link';

interface Achievement {
  id: number;
  title: string;
  icon: typeof Award;
  earned: boolean;
}

interface AchievementsCardProps {
  recentAchievements: Achievement[];
  totalBadges: number;
}

export const AchievementsCard = ({ recentAchievements, totalBadges }: AchievementsCardProps) => (
  <Card className="p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
        <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
        <span>Achievements</span>
      </h2>
      <Link
        href="/achievements"
        className="text-sm font-medium text-yellow-600 dark:text-yellow-400 hover:underline"
      >
        View all
      </Link>
    </div>
    <div className="space-y-3">
      <div className="flex items-center space-x-3">
        <Medal className="w-8 h-8 text-yellow-500" />
        <div>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{totalBadges}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Badges</p>
        </div>
      </div>
      <div className="flex space-x-2">
        {recentAchievements.slice(0, 3).map(achievement => (
          <div
            key={achievement.id}
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${achievement.earned ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}
          >
            <achievement.icon
              className={`w-4 h-4 ${achievement.earned ? 'text-yellow-600' : 'text-gray-400'}`}
            />
          </div>
        ))}
      </div>
    </div>
  </Card>
);
