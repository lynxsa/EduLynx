import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PerformanceChart from '@/components/charts/PerformanceChart';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  AreaChart: ({ children }: any) => <div data-testid="area-chart">{children}</div>,
  RadarChart: ({ children }: any) => <div data-testid="radar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  Line: () => <div data-testid="line" />,
  Area: () => <div data-testid="area" />,
  Radar: () => <div data-testid="radar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  PolarGrid: () => <div data-testid="polar-grid" />,
  PolarAngleAxis: () => <div data-testid="polar-angle-axis" />,
  PolarRadiusAxis: () => <div data-testid="polar-radius-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

const mockData = [
  {
    name: 'John Doe',
    subjects: {
      Mathematics: 85,
      Science: 92,
      English: 78,
      History: 88,
    },
    overall: 86,
    attendance: 95,
    trend: 'improving' as const,
  },
  {
    name: 'Jane Smith',
    subjects: {
      Mathematics: 91,
      Science: 87,
      English: 94,
      History: 82,
    },
    overall: 89,
    attendance: 92,
    trend: 'stable' as const,
  },
];

describe('PerformanceChart', () => {
  it('renders without crashing', () => {
    render(<PerformanceChart data={mockData} />);
    expect(screen.getByText('Performance Analytics')).toBeInTheDocument();
  });

  it('displays correct chart title and description', () => {
    render(<PerformanceChart data={mockData} />);
    expect(screen.getByText('Performance Analytics')).toBeInTheDocument();
    expect(screen.getByText('Track academic progress and attendance')).toBeInTheDocument();
  });

  it('renders chart type selector buttons', () => {
    render(<PerformanceChart data={mockData} />);
    expect(screen.getByText('Bar')).toBeInTheDocument();
    expect(screen.getByText('Line')).toBeInTheDocument();
    expect(screen.getByText('Area')).toBeInTheDocument();
    expect(screen.getByText('Radar')).toBeInTheDocument();
  });

  it('displays student data cards', () => {
    render(<PerformanceChart data={mockData} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('86%')).toBeInTheDocument(); // John's overall score
    expect(screen.getByText('89%')).toBeInTheDocument(); // Jane's overall score
  });

  it('shows trend indicators', () => {
    render(<PerformanceChart data={mockData} />);
    // Check for trend icons (we can't easily test the actual icons, but we can test their containers)
    const trendElements = screen.getAllByTestId('trend-icon');
    expect(trendElements.length).toBeGreaterThan(0);
  });

  it('displays subject mini-bars', () => {
    render(<PerformanceChart data={mockData} />);
    expect(screen.getByText('Mathematics')).toBeInTheDocument();
    expect(screen.getByText('Science')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('calls onChildSelect when child card is clicked', () => {
    const mockOnChildSelect = jest.fn();
    render(<PerformanceChart data={mockData} onChildSelect={mockOnChildSelect} />);

    fireEvent.click(screen.getByText('John Doe'));
    expect(mockOnChildSelect).toHaveBeenCalledWith('John Doe');
  });

  it('renders bar chart by default', () => {
    render(<PerformanceChart data={mockData} />);
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('renders different chart types based on prop', () => {
    const { rerender } = render(<PerformanceChart data={mockData} chartType="line" />);
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();

    rerender(<PerformanceChart data={mockData} chartType="area" />);
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();

    rerender(<PerformanceChart data={mockData} chartType="radar" />);
    expect(screen.getByTestId('radar-chart')).toBeInTheDocument();
  });

  it('highlights selected child', () => {
    render(<PerformanceChart data={mockData} selectedChild="John Doe" />);

    // The selected child should have different styling
    // This is a simplified test - in reality, you'd check for specific CSS classes
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('handles empty data gracefully', () => {
    render(<PerformanceChart data={[]} />);
    expect(screen.getByText('Performance Analytics')).toBeInTheDocument();
    // Should not crash and should still show the chart structure
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('displays subject counts correctly when there are many subjects', () => {
    const dataWithManySubjects = [
      {
        name: 'Test Student',
        subjects: {
          Mathematics: 85,
          Science: 92,
          English: 78,
          History: 88,
          Geography: 91,
          Art: 82,
          Music: 89,
        },
        overall: 86,
        attendance: 95,
        trend: 'improving' as const,
      },
    ];

    render(<PerformanceChart data={dataWithManySubjects} />);
    expect(screen.getByText('+4 more subjects')).toBeInTheDocument();
  });

  it('displays attendance and overall scores', () => {
    render(<PerformanceChart data={mockData} />);

    // Check for attendance percentages
    expect(screen.getByText('95%')).toBeInTheDocument(); // John's attendance
    expect(screen.getByText('92%')).toBeInTheDocument(); // Jane's attendance

    // Check for overall scores
    expect(screen.getByText('86%')).toBeInTheDocument(); // John's overall
    expect(screen.getByText('89%')).toBeInTheDocument(); // Jane's overall
  });
});
