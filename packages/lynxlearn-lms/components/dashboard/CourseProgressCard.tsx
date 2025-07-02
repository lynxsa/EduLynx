import { Card } from '@edulynx/ui-primitives';
import { BarChart2 } from 'lucide-react';

interface Course {
  id: number;
  subject: string;
  progress: number;
}

interface CourseProgressCardProps {
  courses: Course[];
}

export const CourseProgressCard = ({ courses }: CourseProgressCardProps) => (
  <Card className="p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
        <BarChart2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        <span>Course Progress</span>
      </h2>
    </div>
    <div className="space-y-4">
      {courses.map(course => (
        <div key={course.id} className="space-y-1">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {course.subject}
            </span>
            <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
              {course.progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-violet-600"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  </Card>
);
