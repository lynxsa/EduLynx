// Universal Badge Component for LynxLearn
'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        success: 'border-transparent bg-green-100 text-green-800 hover:bg-green-200',
        warning: 'border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
        info: 'border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200',
        purple: 'border-transparent bg-purple-100 text-purple-800 hover:bg-purple-200',
        progress: 'border-transparent bg-gradient-to-r from-purple-500 to-blue-500 text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

// Specialized badges for education context
export function CourseBadge({ category, level }: { category: string; level: string }) {
  return (
    <div className="flex items-center space-x-2">
      <Badge variant="purple">{category}</Badge>
      <Badge variant="info">{level}</Badge>
    </div>
  );
}

export function ProgressBadge({ progress }: { progress: number }) {
  const getVariant = () => {
    if (progress >= 90) return 'success';
    if (progress >= 70) return 'info';
    if (progress >= 50) return 'warning';
    return 'destructive';
  };

  return <Badge variant={getVariant()}>{progress}% Complete</Badge>;
}

export function StatusBadge({
  status,
}: {
  status: 'completed' | 'in-progress' | 'not-started' | 'locked';
}) {
  const variants = {
    completed: 'success',
    'in-progress': 'warning',
    'not-started': 'secondary',
    locked: 'destructive',
  } as const;

  return <Badge variant={variants[status]}>{status.replace('-', ' ').toUpperCase()}</Badge>;
}

export { Badge, badgeVariants };
