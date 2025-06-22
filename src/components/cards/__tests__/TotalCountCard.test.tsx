import { render, screen } from '@testing-library/react';
import { TotalCountCard } from '../TotalCountCard';
import { Users } from 'lucide-react';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: any) => <a href={href}>{children}</a>;
  MockLink.displayName = 'MockLink';
  return MockLink;
});

describe('TotalCountCard', () => {
  const defaultProps = {
    title: 'Total Students',
    count: 1234,
    href: '/students',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    trend: '+12 this month',
  };

  it('renders correctly with all props', () => {
    render(<TotalCountCard {...defaultProps} />);

    expect(screen.getByText('Total Students')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
    expect(screen.getByText('+12 this month')).toBeInTheDocument();
  });

  it('formats count with commas', () => {
    render(<TotalCountCard {...defaultProps} count={1234567} />);

    expect(screen.getByText('1,234,567')).toBeInTheDocument();
  });

  it('renders link with correct href', () => {
    render(<TotalCountCard {...defaultProps} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/students');
  });

  it('displays trend information', () => {
    render(<TotalCountCard {...defaultProps} trend="+5 new today" />);

    expect(screen.getByText('+5 new today')).toBeInTheDocument();
  });
});
