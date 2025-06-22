import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminAnalyticsChart from '@/components/charts/AdminAnalyticsChart';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  AreaChart: ({ children }: any) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div data-testid="area" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
}));

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  TrendingDown: () => <div data-testid="trending-down-icon" />,
  Users: () => <div data-testid="users-icon" />,
  GraduationCap: () => <div data-testid="graduation-cap-icon" />,
  BookOpen: () => <div data-testid="book-open-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  Award: () => <div data-testid="award-icon" />,
  AlertTriangle: () => <div data-testid="alert-triangle-icon" />,
  Activity: () => <div data-testid="activity-icon" />,
  Brain: () => <div data-testid="brain-icon" />,
  DollarSign: () => <div data-testid="dollar-sign-icon" />,
  Shield: () => <div data-testid="shield-icon" />,
  Monitor: () => <div data-testid="monitor-icon" />,
  Database: () => <div data-testid="database-icon" />,
  Zap: () => <div data-testid="zap-icon" />,
}));

const mockData = {
  metrics: {
    totalStudents: 500,
    totalTeachers: 30,
    totalParents: 400,
    totalClasses: 25,
    totalSubjects: 12,
    totalGrades: 8,
    averageAttendance: 92,
    schoolPerformance: 85,
  },
  analytics: {
    genderDistribution: {
      male: 250,
      female: 250,
    },
    gradeDistribution: [
      { grade: 1, count: 60 },
      { grade: 2, count: 65 },
      { grade: 3, count: 58 },
    ],
    performanceAnalytics: {
      overallGPA: 85,
      attendanceRate: 92,
      passRate: 89,
      improvementRate: 15,
    },
    systemHealth: {
      activeUsers: 930,
      systemLoad: 45,
      uptime: 99,
      errors: 2,
      lastBackup: new Date(),
    },
  },
  trends: {
    attendanceTrendData: [
      { date: '2024-01-01', attendance: 90, present: 450, total: 500 },
      { date: '2024-01-02', attendance: 92, present: 460, total: 500 },
      { date: '2024-01-03', attendance: 88, present: 440, total: 500 },
    ],
    performanceTrends: [
      { date: '2024-01-01', averageScore: 82, totalAssessments: 45, subjectsCount: 8 },
      { date: '2024-01-02', averageScore: 85, totalAssessments: 52, subjectsCount: 9 },
      { date: '2024-01-03', averageScore: 87, totalAssessments: 48, subjectsCount: 7 },
    ],
    subjectPerformance: [
      { subject: 'Mathematics', averageScore: 88, totalStudents: 450 },
      { subject: 'Science', averageScore: 85, totalStudents: 420 },
      { subject: 'English', averageScore: 82, totalStudents: 480 },
    ],
    riskAssessment: {
      studentsAtRisk: 15,
      lowAttendance: 8,
      failingGrades: 12,
    },
    financialOverview: {
      totalIncome: 150000,
      totalExpenses: 120000,
      netBalance: 30000,
    },
    userActivity: {
      totalLogins: 1250,
      activeUsers: 930,
      newRegistrations: 25,
    },
  },
  activities: {
    recentStudents: [],
    recentResults: [],
    topStudents: [],
  },
};

describe('AdminAnalyticsChart', () => {
  const defaultProps = {
    data: mockData,
    period: 'month' as const,
  };

  it('renders without crashing', () => {
    render(<AdminAnalyticsChart {...defaultProps} />);
    expect(screen.getByText('Total Students')).toBeInTheDocument();
  });

  it('displays correct metrics in key metrics grid', () => {
    render(<AdminAnalyticsChart {...defaultProps} />);

    // Check if all key metrics are displayed
    expect(screen.getByText('Total Students')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('Attendance Rate')).toBeInTheDocument();
    expect(screen.getByText('92%')).toBeInTheDocument();
    expect(screen.getByText('School Performance')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('Active Users')).toBeInTheDocument();
    expect(screen.getByText('930')).toBeInTheDocument();
  });

  it('renders attendance trends chart', () => {
    render(<AdminAnalyticsChart {...defaultProps} />);

    expect(screen.getByText('Attendance Trends')).toBeInTheDocument();
    expect(screen.getByText('Daily attendance patterns')).toBeInTheDocument();
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
  });

  it('renders performance trends chart', () => {
    render(<AdminAnalyticsChart {...defaultProps} />);

    expect(screen.getByText('Performance Trends')).toBeInTheDocument();
    expect(screen.getByText('Academic performance over time')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('displays gender distribution chart with correct data', () => {
    render(<AdminAnalyticsChart {...defaultProps} />);

    expect(screen.getByText('Gender Distribution')).toBeInTheDocument();
    expect(screen.getByText('Student demographics')).toBeInTheDocument();
    expect(screen.getByText('Male (250)')).toBeInTheDocument();
    expect(screen.getByText('Female (250)')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  it('renders subject performance chart', () => {
    render(<AdminAnalyticsChart {...defaultProps} />);

    expect(screen.getByText('Subject Performance')).toBeInTheDocument();
    expect(screen.getByText('Average scores by subject')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('displays system health metrics', () => {
    render(<AdminAnalyticsChart {...defaultProps} />);

    expect(screen.getByText('System Health')).toBeInTheDocument();
    expect(screen.getByText('System performance metrics')).toBeInTheDocument();
    expect(screen.getByText('System Load')).toBeInTheDocument();
    expect(screen.getByText('45%')).toBeInTheDocument();
    expect(screen.getByText('Uptime')).toBeInTheDocument();
    expect(screen.getByText('99%')).toBeInTheDocument();
    expect(screen.getByText('Errors (24h)')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('displays risk assessment information', () => {
    render(<AdminAnalyticsChart {...defaultProps} />);

    expect(screen.getByText('Risk Assessment')).toBeInTheDocument();
    expect(screen.getByText('Student risk indicators')).toBeInTheDocument();
    expect(screen.getByText('Students at Risk')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('Low Attendance')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('Failing Grades')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('handles empty data gracefully', () => {
    const emptyData = {
      metrics: {
        totalStudents: 0,
        totalTeachers: 0,
        totalParents: 0,
        totalClasses: 0,
        totalSubjects: 0,
        totalGrades: 0,
        averageAttendance: 0,
        schoolPerformance: 0,
      },
      analytics: {
        genderDistribution: { male: 0, female: 0 },
        gradeDistribution: [],
        performanceAnalytics: {
          overallGPA: 0,
          attendanceRate: 0,
          passRate: 0,
          improvementRate: 0,
        },
        systemHealth: {
          activeUsers: 0,
          systemLoad: 0,
          uptime: 0,
          errors: 0,
          lastBackup: new Date(),
        },
      },
      trends: {
        attendanceTrendData: [],
        performanceTrends: [],
        subjectPerformance: [],
        riskAssessment: {
          studentsAtRisk: 0,
          lowAttendance: 0,
          failingGrades: 0,
        },
      },
      activities: {
        recentStudents: [],
        recentResults: [],
        topStudents: [],
      },
    };

    render(<AdminAnalyticsChart data={emptyData} period="week" />);

    // Should still render without errors
    expect(screen.getByText('Total Students')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders all required chart components', () => {
    render(<AdminAnalyticsChart {...defaultProps} />);

    // Check that all chart containers are present
    const responsiveContainers = screen.getAllByTestId('responsive-container');
    expect(responsiveContainers.length).toBeGreaterThan(0);

    // Check for specific chart types
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getAllByTestId('bar-chart').length).toBeGreaterThanOrEqual(2);
  });

  it('applies correct styling classes', () => {
    render(<AdminAnalyticsChart {...defaultProps} />);

    // Check for glassmorphism styling
    const containers = document.querySelectorAll('.glass-morphism');
    expect(containers.length).toBeGreaterThan(0);

    // Check for gradient classes
    const gradientElements = document.querySelectorAll('[class*="gradient"]');
    expect(gradientElements.length).toBeGreaterThan(0);
  });
});

describe('AdminAnalyticsChart Integration', () => {
  it('handles different time periods correctly', () => {
    const { rerender } = render(<AdminAnalyticsChart data={mockData} period="week" />);
    expect(screen.getByText('Total Students')).toBeInTheDocument();

    rerender(<AdminAnalyticsChart data={mockData} period="month" />);
    expect(screen.getByText('Total Students')).toBeInTheDocument();

    rerender(<AdminAnalyticsChart data={mockData} period="semester" />);
    expect(screen.getByText('Total Students')).toBeInTheDocument();
  });

  it('maintains consistent layout across different data sizes', () => {
    const largeData = {
      ...mockData,
      trends: {
        ...mockData.trends,
        subjectPerformance: Array.from({ length: 20 }, (_, i) => ({
          subject: `Subject ${i + 1}`,
          averageScore: Math.floor(Math.random() * 100),
          totalStudents: Math.floor(Math.random() * 500),
        })),
      },
    };

    render(<AdminAnalyticsChart data={largeData} period="month" />);
    expect(screen.getByText('Subject Performance')).toBeInTheDocument();
  });
});
