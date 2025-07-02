// Enhanced Card Components for LynxLearn LMS
'use client';

import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-xl border bg-card text-card-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';

// Specialized education cards
export function CourseCard({
  course,
  onEnroll,
}: {
  course: {
    id: string;
    title: string;
    description: string;
    instructor: string;
    thumbnail: string;
    category: string;
    level: string;
    duration: string;
    rating: number;
    students: number;
  };
  onEnroll: (courseId: string) => void;
}) {
  return (
    <Card className="group overflow-hidden">
      <div className="relative">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4 flex space-x-2">
          <span className="bg-white/90 text-gray-800 text-xs font-semibold px-2 py-1 rounded-full">
            {course.category}
          </span>
          <span className="bg-blue-500/90 text-white text-xs font-semibold px-2 py-1 rounded-full">
            {course.level}
          </span>
        </div>
      </div>

      <CardHeader>
        <CardTitle className="group-hover:text-purple-600 transition-colors">
          {course.title}
        </CardTitle>
        <CardDescription>{course.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <span>⭐ {course.rating}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>👥 {course.students.toLocaleString()}</span>
          </div>
          <span>📅 {course.duration}</span>
        </div>
      </CardContent>

      <CardFooter>
        <button
          onClick={() => onEnroll(course.id)}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
        >
          Start Learning
        </button>
      </CardFooter>
    </Card>
  );
}

export function ProgressCard({
  title,
  progress,
  description,
  nextAction,
}: {
  title: string;
  progress: number;
  description: string;
  nextAction?: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardContent>

      {nextAction && (
        <CardFooter>
          <button
            onClick={nextAction}
            className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Continue Learning
          </button>
        </CardFooter>
      )}
    </Card>
  );
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
