import { Card } from '@edulynx/ui-primitives';
import { Trophy } from 'lucide-react';
import { Button } from '../../components/ui/button';

export const StudyPointsCard = ({ studentProfile }) => (
  <Card className="p-6 rounded-2xl shadow-lg bg-gradient-to-r from-green-500 to-teal-500 text-white">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Trophy className="w-10 h-10" />
        <div>
          <div className="text-3xl font-bold">{studentProfile.totalPoints} pts</div>
          <div className="text-sm opacity-80">Study Points</div>
        </div>
      </div>
      <Button
        size="lg"
        variant="outline"
        className="border-white text-white hover:bg-white hover:text-teal-500"
      >
        Submit Points
      </Button>
    </div>
  </Card>
);
