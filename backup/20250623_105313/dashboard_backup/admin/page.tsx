'use client';

import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  Calendar,
  CheckCircle,
  ClipboardList,
  Cpu,
  Database,
  DollarSign,
  Download,
  FileText,
  GraduationCap,
  Mail,
  MessageSquare,
  Monitor,
  PieChart,
  RefreshCw,
  School,
  Settings,
  Shield,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
// import { ErrorBoundary } from '../../../src/components/ErrorBoundary'; // Commented out: not resolvable in backup context

// Enhanced Type definitions for comprehensive dashboard data
interface DashboardMetrics {
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  totalClasses: number;
  totalSubjects: number;
  attendancePercentage: number;
  performanceAverage: number;
  systemHealth: {
    cpu: number;
    memory: number;
    storage: number;
    uptime: string;
    response_time: number;
    active_users: number;
    server_status: 'healthy' | 'warning' | 'critical';
    last_backup: string;
    disk_usage: number;
    network_speed: number;
  };
  genderDistribution: {
    male: number;
    female: number;
  };
  gradeDistribution: Array<{
    grade: string;
    count: number;
    performance: number;
    attendance: number;
    passRate: number;
  }>;
  subjectPerformance: Array<{
    subject: string;
    performance: number;
    students: number;
    teachers: number;
    passRate: number;
    improvement: number;
  }>;
  attendanceTrends: Array<{
    date: string;
    attendance: number;
    target: number;
    grade?: string;
    class?: string;
  }>;
  performanceTrends: Array<{
    month: string;
    overall: number;
    math: number;
    science: number;
    english: number;
    passRate: number;
  }>;
  financialTrends: Array<{
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
    tuitionFees: number;
    operatingCosts: number;
  }>;
  recentActivity: Array<{
    id: string;
    user: string;
    action: string;
    timestamp: string;
    type: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'view';
    module: string;
    details?: string;
    avatar?: string;
  }>;
  upcomingEvents: Array<{
    id: string;
    title: string;
    date: string;
    time?: string;
    type: 'exam' | 'meeting' | 'holiday' | 'event' | 'deadline' | 'conference';
    priority: 'high' | 'medium' | 'low';
    location?: string;
    attendees?: number;
    status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  }>;
  financialSummary: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    tuitionFees: number;
    outstandingFees: number;
    monthlyGrowth: number;
    yearlyProjection: number;
    budgetUtilization: number;
    cashFlow: number;
    profitMargin: number;
  };
  alerts: Array<{
    id: string;
    type: 'warning' | 'error' | 'info' | 'success';
    message: string;
    timestamp: string;
    module: string;
    priority: 'high' | 'medium' | 'low';
    actionRequired: boolean;
    resolvedBy?: string;
  }>;
  topPerformers: Array<{
    id: string;
    name: string;
    average: number;
    improvement: number;
    grade: string;
    subjects: string[];
    avatar?: string;
    rank: number;
    badges: string[];
  }>;
  atRiskStudents: Array<{
    id: string;
    name: string;
    riskLevel: 'high' | 'medium' | 'low';
    reasons: string[];
    grade: string;
    interventions: string[];
    lastContact: string;
    parentNotified: boolean;
    mentor?: string;
    actionPlan?: string;
  }>;
  teacherPerformance: Array<{
    id: string;
    name: string;
    subject: string;
    rating: number;
    students: number;
    satisfaction: number;
    experience: number;
    qualifications: string[];
    achievements: string[];
  }>;
  classPerformance: Array<{
    id: string;
    name: string;
    grade: string;
    average: number;
    students: number;
    teacher: string;
    subject: string;
    attendance: number;
    behavior: number;
  }>;
  assignments: {
    due: number;
    overdue: number;
    completed: number;
    pendingGrading: number;
    averageScore: number;
  };
  examinations: {
    upcoming: number;
    inProgress: number;
    completed: number;
    passRate: number;
    averageScore: number;
  };
  communications: {
    unreadMessages: number;
    announcements: number;
    parentMeetings: number;
    newsletters: number;
  };
  aiInsights: {
    predictions: Array<{
      type: string;
      prediction: string;
      confidence: number;
      timeline: string;
      impact: 'high' | 'medium' | 'low';
      actionable: boolean;
    }>;
    recommendations: Array<{
      category: string;
      suggestion: string;
      impact: string;
      priority: string;
      implementation: string;
      expectedOutcome: string;
    }>;
    trends: Array<{
      metric: string;
      trend: 'up' | 'down' | 'stable';
      change: number;
      period: string;
      forecast: string;
    }>;
    sentimentAnalysis: {
      student: number;
      parent: number;
      teacher: number;
      overall: number;
    };
  };
}
// Enhanced color palette for ultra-modern design
const CHART_COLORS = {
  primary: '#3B82F6',
  secondary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#06B6D4',
  gradient: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'],
};

// Notification system types
interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  timestamp: Date;
  dismissed: boolean;
}

// Fix for 'number' only refers to a type, but is being used as a value here:
// If this is meant to be a type, wrap in interface or type:
interface Assignments {
  due: number;
  overdue: number;
  completed: number;
  pendingGrading: number;
  averageScore: number;
}
interface Examinations {
  upcoming: number;
  inProgress: number;
  completed: number;
  passRate: number;
  averageScore: number;
}
interface Communications {
  unreadMessages: number;
  announcements: number;
  parentMeetings: number;
  newsletters: number;
}
interface AiInsights {
  predictions: Array<{
    type: string;
    prediction: string;
    confidence: number;
    timeline: string;
    impact: 'high' | 'medium' | 'low';
    actionable: boolean;
  }>;
  recommendations: Array<{
    category: string;
    suggestion: string;
    impact: string;
    priority: string;
    implementation: string;
    expectedOutcome: string;
  }>;
  trends: Array<{
    metric: string;
    trend: 'up' | 'down' | 'stable';
    change: number;
    period: string;
    forecast: string;
  }>;
  sentimentAnalysis: {
    student: number;
    parent: number;
    teacher: number;
    overall: number;
  };
}

// Enhanced state management
export default function AdminPage() {
  const router = useRouter();

  // Enhanced state management
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('week');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'connecting'>(
    'connecting'
  );
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('overall');

  // Notification management
  const addNotification = useCallback(
    (type: 'success' | 'warning' | 'error' | 'info', message: string) => {
      const notification = {
        id: Date.now().toString(),
        type,
        message,
        timestamp: new Date(),
        dismissed: false,
      };
      setNotifications(prev => [notification, ...prev.slice(0, 4)]);

      setTimeout(() => {
        setNotifications(prev =>
          prev.map(n => (n.id === notification.id ? { ...n, dismissed: true } : n))
        );
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, 300);
      }, 5000);
    },
    []
  );

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, dismissed: true } : n)));
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 300);
  }, []);

  // Enhanced data fetching
  const fetchDashboardData = useCallback(
    async (showLoading = true) => {
      setConnectionStatus('connecting');
      setFetchError(null);

      try {
        if (showLoading) setLoading(true);

        const response = await fetch(
          `/api/dashboard/admin?period=${selectedPeriod}&timestamp=${Date.now()}`,
          {
            method: 'GET',
            headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setConnectionStatus('online');

        // Process comprehensive mock data
        const processedMetrics: DashboardMetrics = {
          totalStudents: data.metrics?.totalStudents || 1250,
          totalTeachers: data.metrics?.totalTeachers || 85,
          totalParents: data.metrics?.totalParents || 980,
          totalClasses: data.metrics?.totalClasses || 42,
          totalSubjects: data.metrics?.totalSubjects || 15,
          attendancePercentage: data.metrics?.attendancePercentage || 92,
          performanceAverage: data.metrics?.performanceAverage || 78,

          systemHealth: {
            cpu: Math.random() * 30 + 20,
            memory: Math.random() * 40 + 50,
            storage: Math.random() * 30 + 60,
            uptime: '99.8%',
            response_time: Math.random() * 50 + 50,
            active_users: Math.floor(Math.random() * 100) + 200,
            server_status: 'healthy' as const,
            last_backup: '2024-01-15 03:00 AM',
            disk_usage: 68,
            network_speed: 850,
          },

          genderDistribution: {
            male: data.genderDistribution?.[0] || 650,
            female: data.genderDistribution?.[1] || 600,
          },

          gradeDistribution: data.gradeDistribution || [
            { grade: '8', count: 180, performance: 85, attendance: 94, passRate: 88 },
            { grade: '9', count: 165, performance: 82, attendance: 92, passRate: 85 },
            { grade: '10', count: 155, performance: 79, attendance: 89, passRate: 82 },
            { grade: '11', count: 140, performance: 76, attendance: 87, passRate: 79 },
            { grade: '12', count: 135, performance: 88, attendance: 91, passRate: 92 },
          ],

          subjectPerformance: data.subjectPerformance || [
            {
              subject: 'Mathematics',
              performance: 82,
              students: 1200,
              teachers: 8,
              passRate: 85,
              improvement: 3.2,
            },
            {
              subject: 'English',
              performance: 88,
              students: 1250,
              teachers: 10,
              passRate: 92,
              improvement: 2.1,
            },
            {
              subject: 'Science',
              performance: 79,
              students: 1100,
              teachers: 7,
              passRate: 83,
              improvement: 4.5,
            },
            {
              subject: 'History',
              performance: 85,
              students: 980,
              teachers: 6,
              passRate: 88,
              improvement: 1.8,
            },
            {
              subject: 'Geography',
              performance: 77,
              students: 890,
              teachers: 5,
              passRate: 81,
              improvement: 2.7,
            },
            {
              subject: 'Life Sciences',
              performance: 81,
              students: 750,
              teachers: 4,
              passRate: 84,
              improvement: 3.9,
            },
          ],

          attendanceTrends: [
            { date: '2024-01-01', attendance: 89, target: 95, grade: 'Grade 9', class: '9A' },
            { date: '2024-01-02', attendance: 92, target: 95, grade: 'Grade 10', class: '10B' },
            { date: '2024-01-03', attendance: 94, target: 95, grade: 'Grade 11', class: '11C' },
            { date: '2024-01-04', attendance: 87, target: 95, grade: 'Grade 8', class: '8A' },
            { date: '2024-01-05', attendance: 96, target: 95, grade: 'Grade 12', class: '12A' },
          ],

          performanceTrends: [
            { month: 'Jan', overall: 78, math: 82, science: 79, english: 88, passRate: 85 },
            { month: 'Feb', overall: 79, math: 84, science: 80, english: 89, passRate: 87 },
            { month: 'Mar', overall: 81, math: 85, science: 82, english: 90, passRate: 88 },
            { month: 'Apr', overall: 83, math: 87, science: 84, english: 91, passRate: 90 },
            { month: 'May', overall: 85, math: 89, science: 86, english: 92, passRate: 92 },
          ],

          financialTrends: [
            {
              month: 'Jan',
              revenue: 125000,
              expenses: 98000,
              profit: 27000,
              tuitionFees: 115000,
              operatingCosts: 85000,
            },
            {
              month: 'Feb',
              revenue: 128000,
              expenses: 99500,
              profit: 28500,
              tuitionFees: 118000,
              operatingCosts: 87000,
            },
            {
              month: 'Mar',
              revenue: 132000,
              expenses: 101000,
              profit: 31000,
              tuitionFees: 122000,
              operatingCosts: 89000,
            },
            {
              month: 'Apr',
              revenue: 135000,
              expenses: 103000,
              profit: 32000,
              tuitionFees: 125000,
              operatingCosts: 91000,
            },
            {
              month: 'May',
              revenue: 138000,
              expenses: 105000,
              profit: 33000,
              tuitionFees: 128000,
              operatingCosts: 93000,
            },
          ],

          recentActivity: [
            {
              id: '1',
              user: 'Sarah Johnson',
              action: 'added a new student',
              timestamp: '2 hours ago',
              type: 'create',
              module: 'Students',
            },
            {
              id: '2',
              user: 'Mike Chen',
              action: 'updated grade records',
              timestamp: '3 hours ago',
              type: 'update',
              module: 'Grades',
            },
            {
              id: '3',
              user: 'Admin',
              action: 'logged into system',
              timestamp: '4 hours ago',
              type: 'login',
              module: 'System',
            },
            {
              id: '4',
              user: 'Lisa Parker',
              action: 'created new assignment',
              timestamp: '5 hours ago',
              type: 'create',
              module: 'Assignments',
            },
            {
              id: '5',
              user: 'John Smith',
              action: 'updated teacher profile',
              timestamp: '6 hours ago',
              type: 'update',
              module: 'Teachers',
            },
          ],

          upcomingEvents: [
            {
              id: '1',
              title: 'Parent-Teacher Conference',
              date: '2025-06-25',
              time: '14:00',
              type: 'meeting',
              priority: 'high',
              location: 'Main Hall',
              attendees: 150,
              status: 'scheduled',
            },
            {
              id: '2',
              title: 'Grade 12 Final Exams',
              date: '2025-06-30',
              time: '09:00',
              type: 'exam',
              priority: 'high',
              location: 'Exam Hall',
              attendees: 135,
              status: 'scheduled',
            },
            {
              id: '3',
              title: 'Staff Development Day',
              date: '2025-07-05',
              time: '08:00',
              type: 'event',
              priority: 'medium',
              location: 'Conference Room',
              attendees: 85,
              status: 'scheduled',
            },
            {
              id: '4',
              title: 'Winter Holiday',
              date: '2025-07-15',
              type: 'holiday',
              priority: 'low',
              status: 'scheduled',
            },
          ],

          financialSummary: {
            totalRevenue: 2500000,
            totalExpenses: 1800000,
            netProfit: 700000,
            tuitionFees: 2200000,
            outstandingFees: 150000,
            monthlyGrowth: 8.5,
            yearlyProjection: 3000000,
            budgetUtilization: 72,
            cashFlow: 500000,
            profitMargin: 28,
          },

          alerts: [
            {
              id: '1',
              type: 'warning',
              message: 'Server maintenance scheduled for tonight',
              timestamp: '1 hour ago',
              module: 'System',
              priority: 'medium',
              actionRequired: true,
            },
            {
              id: '2',
              type: 'info',
              message: 'New parent registration pending approval',
              timestamp: '2 hours ago',
              module: 'Parents',
              priority: 'low',
              actionRequired: true,
            },
            {
              id: '3',
              type: 'success',
              message: 'Backup completed successfully',
              timestamp: '3 hours ago',
              module: 'System',
              priority: 'low',
              actionRequired: false,
            },
          ],

          topPerformers: [
            {
              id: '1',
              name: 'Emma Watson',
              average: 96,
              improvement: 3.2,
              grade: '12',
              subjects: ['Math', 'Science'],
              rank: 1,
              badges: ['Excellence', 'STEM Leader'],
            },
            {
              id: '2',
              name: 'Liam Johnson',
              average: 94,
              improvement: 2.8,
              grade: '11',
              subjects: ['English', 'History'],
              rank: 2,
              badges: ['Honors', 'Literature'],
            },
            {
              id: '3',
              name: 'Sophia Chen',
              average: 93,
              improvement: 4.1,
              grade: '10',
              subjects: ['Science', 'Math'],
              rank: 3,
              badges: ['Rising Star', 'Science'],
            },
            {
              id: '4',
              name: 'Noah Davis',
              average: 91,
              improvement: 2.3,
              grade: '12',
              subjects: ['Geography', 'History'],
              rank: 4,
              badges: ['Consistent', 'Geography'],
            },
            {
              id: '5',
              name: 'Olivia Brown',
              average: 90,
              improvement: 3.7,
              grade: '11',
              subjects: ['English', 'Art'],
              rank: 5,
              badges: ['Creative', 'Arts'],
            },
          ],

          atRiskStudents: [
            {
              id: '1',
              name: 'Alex Thompson',
              riskLevel: 'high',
              reasons: ['Poor attendance', 'Failing grades'],
              grade: '10',
              interventions: ['Counseling', 'Tutoring'],
              lastContact: '2025-06-20',
              parentNotified: true,
              mentor: 'Ms. Johnson',
              actionPlan: 'Weekly check-ins and extra support',
            },
            {
              id: '2',
              name: 'Sam Wilson',
              riskLevel: 'medium',
              reasons: ['Declining performance'],
              grade: '9',
              interventions: ['Mentoring'],
              lastContact: '2025-06-22',
              parentNotified: false,
            },
            {
              id: '3',
              name: 'Jordan Lee',
              riskLevel: 'medium',
              reasons: ['Behavioral issues'],
              grade: '11',
              interventions: ['Counseling'],
              lastContact: '2025-06-21',
              parentNotified: true,
            },
            {
              id: '4',
              name: 'Casey Taylor',
              riskLevel: 'high',
              reasons: ['Chronic absence'],
              grade: '8',
              interventions: ['Family meeting'],
              lastContact: '2025-06-19',
              parentNotified: true,
              actionPlan: 'Home visit scheduled',
            },
          ],

          teacherPerformance: [
            {
              id: '1',
              name: 'Dr. Sarah Williams',
              subject: 'Mathematics',
              rating: 4.8,
              students: 120,
              satisfaction: 95,
              experience: 8,
              qualifications: ['PhD Mathematics', 'Teaching Certificate'],
              achievements: ['Teacher of the Year 2024', 'Excellence Award'],
            },
            {
              id: '2',
              name: 'Mr. James Brown',
              subject: 'Science',
              rating: 4.7,
              students: 100,
              satisfaction: 92,
              experience: 12,
              qualifications: ['MSc Physics', 'Education Diploma'],
              achievements: ['Innovation Award', 'STEM Excellence'],
            },
          ],

          classPerformance: [
            {
              id: '1',
              name: 'Grade 12A',
              grade: '12',
              average: 87,
              students: 28,
              teacher: 'Dr. Sarah Williams',
              subject: 'Mathematics',
              attendance: 94,
              behavior: 85,
            },
            {
              id: '2',
              name: 'Grade 11B',
              grade: '11',
              average: 82,
              students: 25,
              teacher: 'Mr. James Brown',
              subject: 'Science',
              attendance: 91,
              behavior: 88,
            },
          ],

          assignments: {
            due: 45,
            overdue: 8,
            completed: 342,
            pendingGrading: 23,
            averageScore: 78.5,
          },

          examinations: {
            upcoming: 12,
            inProgress: 3,
            completed: 89,
            passRate: 87.2,
            averageScore: 76.8,
          },

          communications: {
            unreadMessages: 24,
            announcements: 8,
            parentMeetings: 15,
            newsletters: 3,
          },

          aiInsights: {
            predictions: [
              {
                type: 'Performance',
                prediction: 'Math scores expected to improve by 5% next quarter',
                confidence: 85,
                timeline: 'Next Quarter',
                impact: 'high',
                actionable: true,
              },
              {
                type: 'Attendance',
                prediction: 'Attendance may decline during winter months',
                confidence: 72,
                timeline: 'Next 2 months',
                impact: 'medium',
                actionable: true,
              },
            ],
            recommendations: [
              {
                category: 'Academic',
                suggestion: 'Implement peer tutoring for Grade 10 Math',
                impact: 'High',
                priority: 'High',
                implementation: 'Setup tutoring sessions with top performers',
                expectedOutcome: '15% improvement in test scores',
              },
              {
                category: 'Attendance',
                suggestion: 'Review morning schedule for better punctuality',
                impact: 'Medium',
                priority: 'Medium',
                implementation: 'Adjust start times and improve transport',
                expectedOutcome: '5% increase in on-time arrivals',
              },
            ],
            trends: [
              {
                metric: 'Overall Performance',
                trend: 'up',
                change: 4.2,
                period: 'Last quarter',
                forecast: 'Continued improvement expected',
              },
              {
                metric: 'Student Satisfaction',
                trend: 'stable',
                change: 0.8,
                period: 'Last month',
                forecast: 'Stable satisfaction levels',
              },
            ],
            sentimentAnalysis: {
              student: 78,
              parent: 82,
              teacher: 85,
              overall: 81,
            },
          },
        };

        setMetrics(processedMetrics);
        setLastUpdated(new Date());
        addNotification('success', 'Dashboard data updated successfully');
      } catch (error) {
        setConnectionStatus('offline');
        setFetchError(error instanceof Error ? error.message : 'Unknown error occurred');
        addNotification(
          'error',
          `Failed to fetch data: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      } finally {
        setLoading(false);
      }
    },
    [selectedPeriod, addNotification]
  );

  // Setup auto-refresh
  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(() => fetchDashboardData(false), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedPeriod, fetchDashboardData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    // <ErrorBoundary> {/* Commented out: not resolvable in backup context */}
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 lg:p-6">
      {/* Connection Status and Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-3">
        {/* Connection Status Indicator */}
        <div
          className={`px-4 py-2 rounded-full shadow-lg backdrop-blur-sm border ${
            connectionStatus === 'online'
              ? 'bg-green-100/90 border-green-200 text-green-800'
              : connectionStatus === 'connecting'
                ? 'bg-yellow-100/90 border-yellow-200 text-yellow-800'
                : 'bg-red-100/90 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                connectionStatus === 'online'
                  ? 'bg-green-500 animate-pulse'
                  : connectionStatus === 'connecting'
                    ? 'bg-yellow-500 animate-spin'
                    : 'bg-red-500'
              }`}
            />
            <span className="text-sm font-medium">
              {connectionStatus === 'online' && 'Live Data'}
              {connectionStatus === 'connecting' && 'Connecting...'}
              {connectionStatus === 'offline' && 'Offline Mode'}
            </span>
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-2">
          {notifications
            .filter(n => !n.dismissed)
            .slice(0, 3)
            .map(notification => (
              <div
                key={notification.id}
                className={`max-w-sm p-4 rounded-xl shadow-lg backdrop-blur-sm border transition-all duration-300 transform ${
                  notification.type === 'success'
                    ? 'bg-green-100/90 border-green-200 text-green-800'
                    : notification.type === 'warning'
                      ? 'bg-yellow-100/90 border-yellow-200 text-yellow-800'
                      : notification.type === 'error'
                        ? 'bg-red-100/90 border-red-200 text-red-800'
                        : 'bg-blue-100/90 border-blue-200 text-blue-800'
                } ${notification.dismissed ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      {notification.type === 'success' && (
                        <CheckCircle size={16} className="text-green-600" />
                      )}
                      {notification.type === 'warning' && (
                        <AlertTriangle size={16} className="text-yellow-600" />
                      )}
                      {notification.type === 'error' && (
                        <AlertTriangle size={16} className="text-red-600" />
                      )}
                      {notification.type === 'info' && <Bell size={16} className="text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{notification.message}</p>
                      <p className="text-xs opacity-75 mt-1">
                        {notification.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissNotification(notification.id)}
                    className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Enhanced Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              EduLynx Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Welcome back! Here's what's happening at your school today.
            </p>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4 mt-4 lg:mt-0">
            <div className="text-center lg:text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Today</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {new Date().toLocaleDateString('en-ZA', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={selectedPeriod}
                onChange={e => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="semester">This Semester</option>
                <option value="year">This Year</option>
              </select>
              <button
                onClick={() => fetchDashboardData()}
                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error State */}
      {fetchError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center mb-6">
          <AlertTriangle className="mx-auto mb-4 text-red-500" size={48} />
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            Failed to Load Dashboard
          </h3>
          <p className="text-red-600 dark:text-red-300 mb-4">{fetchError}</p>
          <button
            onClick={() => fetchDashboardData()}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Dashboard Content */}
      {metrics && (
        <div className="space-y-6">
          {/* Row 1: Quick Actions (5 equal cards) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <button
              onClick={() => router.push('/admin/reports')}
              className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl p-4 lg:p-6 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Download className="mx-auto mb-2 lg:mb-3" size={24} />
              <h3 className="font-semibold text-sm lg:text-lg mb-1 lg:mb-2">Download Report</h3>
              <p className="text-blue-100 text-xs lg:text-sm">Export data & analytics</p>
            </button>

            <button
              onClick={() => router.push('/admin/teachers/add')}
              className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl p-4 lg:p-6 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <UserPlus className="mx-auto mb-2 lg:mb-3" size={24} />
              <h3 className="font-semibold text-sm lg:text-lg mb-1 lg:mb-2">Add Teacher</h3>
              <p className="text-green-100 text-xs lg:text-sm">Register new staff</p>
            </button>

            <button
              onClick={() => router.push('/admin/parents/add')}
              className="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-2xl p-4 lg:p-6 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Users className="mx-auto mb-2 lg:mb-3" size={24} />
              <h3 className="font-semibold text-sm lg:text-lg mb-1 lg:mb-2">Add Parent</h3>
              <p className="text-purple-100 text-xs lg:text-sm">Register guardian</p>
            </button>

            <button
              onClick={() => router.push('/admin/settings')}
              className="bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl p-4 lg:p-6 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Settings className="mx-auto mb-2 lg:mb-3" size={24} />
              <h3 className="font-semibold text-sm lg:text-lg mb-1 lg:mb-2">Settings</h3>
              <p className="text-orange-100 text-xs lg:text-sm">Configuration</p>
            </button>

            <button
              onClick={() => router.push('/admin/ai-assistant')}
              className="bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-2xl p-4 lg:p-6 transition-all duration-200 transform hover:scale-105 shadow-lg col-span-2 md:col-span-1"
            >
              <Bot className="mx-auto mb-2 lg:mb-3" size={24} />
              <h3 className="font-semibold text-sm lg:text-lg mb-1 lg:mb-2">Prof. Lynx</h3>
              <p className="text-indigo-100 text-xs lg:text-sm">AI Assistant</p>
            </button>
          </div>

          {/* Row 2: User Activity & System Health */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
            {/* User Activity - 70% width */}
            <div className="lg:col-span-7 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <Activity className="mr-2" size={24} />
                Recent User Activity
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {metrics.recentActivity.map(activity => (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div
                      className={`p-2 rounded-full ${
                        activity.type === 'create'
                          ? 'bg-green-100 text-green-600'
                          : activity.type === 'update'
                            ? 'bg-blue-100 text-blue-600'
                            : activity.type === 'delete'
                              ? 'bg-red-100 text-red-600'
                              : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <div className="w-3 h-3 rounded-full bg-current" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.user} {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.module} • {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Health - 30% width */}
            <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <BarChart3 className="mr-2" size={24} />
                System Health
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">CPU</span>
                    <span className="text-sm font-semibold">
                      {metrics.systemHealth.cpu.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${metrics.systemHealth.cpu}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Memory</span>
                    <span className="text-sm font-semibold">
                      {metrics.systemHealth.memory.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 bg-green-500 rounded-full transition-all duration-300"
                      style={{ width: `${metrics.systemHealth.memory}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Storage</span>
                    <span className="text-sm font-semibold">
                      {metrics.systemHealth.storage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 bg-purple-500 rounded-full transition-all duration-300"
                      style={{ width: `${metrics.systemHealth.storage}%` }}
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Active Users</span>
                    <span className="text-lg font-bold text-green-600">
                      {metrics.systemHealth.active_users}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Totals Overview (4 cards @25% each) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button
              onClick={() => router.push('/admin/students')}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <GraduationCap className="text-blue-600" size={24} />
                </div>
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {metrics.totalStudents.toLocaleString()}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Total Students
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                {metrics.genderDistribution.male} male, {metrics.genderDistribution.female} female
              </p>
            </button>

            <button
              onClick={() => router.push('/admin/teachers')}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Users className="text-green-600" size={24} />
                </div>
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {metrics.totalTeachers.toLocaleString()}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Total Teachers
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Active educators</p>
            </button>

            <button
              onClick={() => router.push('/admin/parents')}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Users className="text-purple-600" size={24} />
                </div>
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {metrics.totalParents.toLocaleString()}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Parents</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Registered guardians</p>
            </button>

            <button
              onClick={() => router.push('/admin/classes')}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <School className="text-orange-600" size={24} />
                </div>
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {metrics.totalClasses.toLocaleString()}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Classes</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Active classrooms</p>
            </button>
          </div>

          {/* Row 4: Gender & Subject Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Students by Gender */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <PieChart className="mr-2" size={24} />
                Students by Gender
              </h3>
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="10"
                      strokeDasharray={`${(metrics.genderDistribution.male / (metrics.genderDistribution.male + metrics.genderDistribution.female)) * 251.2} 251.2`}
                      transform="rotate(-90 50 50)"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#EC4899"
                      strokeWidth="10"
                      strokeDasharray={`${(metrics.genderDistribution.female / (metrics.genderDistribution.male + metrics.genderDistribution.female)) * 251.2} 251.2`}
                      strokeDashoffset={`-${(metrics.genderDistribution.male / (metrics.genderDistribution.male + metrics.genderDistribution.female)) * 251.2}`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {metrics.totalStudents}
                      </div>
                      <div className="text-sm text-gray-500">Students</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center space-x-6 mt-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-2" />
                  <span className="text-sm">Male ({metrics.genderDistribution.male})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-pink-500 rounded-full mr-2" />
                  <span className="text-sm">Female ({metrics.genderDistribution.female})</span>
                </div>
              </div>
            </div>

            {/* Teachers by Subject */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <BookOpen className="mr-2" size={24} />
                Teachers by Subject
              </h3>
              <div className="space-y-4">
                {metrics.subjectPerformance.map((subject, index) => (
                  <div key={subject.subject} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor:
                            CHART_COLORS.gradient[index % CHART_COLORS.gradient.length],
                        }}
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {subject.subject}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className="h-3 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(subject.students / 50, 100)}%`,
                            backgroundColor:
                              CHART_COLORS.gradient[index % CHART_COLORS.gradient.length],
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white min-w-[50px]">
                        {Math.ceil(subject.students / 30)} teachers
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 5: Attendance & Performance Analytics */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Attendance Trends Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <Calendar className="mr-2" size={24} />
                Attendance Trends
              </h3>
              <div className="space-y-4">
                {metrics.attendanceTrends.map((trend, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {trend.date}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        {trend.grade}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            trend.attendance >= trend.target ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${(trend.attendance / 100) * 100}%` }}
                        />
                      </div>
                      <span
                        className={`text-sm font-semibold ${
                          trend.attendance >= trend.target ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {trend.attendance}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Analytics */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <TrendingUp className="mr-2" size={24} />
                Performance Analytics
              </h3>
              <div className="space-y-4">
                {metrics.performanceTrends.map((trend, index) => (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {trend.month}
                      </span>
                      <span className="text-sm text-green-600 dark:text-green-400">
                        Pass Rate: {trend.passRate}%
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="text-center">
                        <div className="text-gray-500">Overall</div>
                        <div className="font-semibold">{trend.overall}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500">Math</div>
                        <div className="font-semibold">{trend.math}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500">Science</div>
                        <div className="font-semibold">{trend.science}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500">English</div>
                        <div className="font-semibold">{trend.english}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 6: Financial Dashboard */}
          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {/* Financial Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <DollarSign className="mr-2" size={24} />
                Financial Overview
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</span>
                  <span className="text-lg font-bold text-green-600">
                    R{(metrics.financialSummary.totalRevenue / 1000).toFixed(1)}k
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</span>
                  <span className="text-lg font-bold text-red-500">
                    R{(metrics.financialSummary.totalExpenses / 1000).toFixed(1)}k
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Net Profit</span>
                  <span className="text-lg font-bold text-blue-600">
                    R{(metrics.financialSummary.netProfit / 1000).toFixed(1)}k
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Outstanding Fees</span>
                  <span className="text-lg font-bold text-orange-500">
                    R{(metrics.financialSummary.outstandingFees / 1000).toFixed(1)}k
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Profit Margin</span>
                    <span className="text-lg font-bold text-purple-600">
                      {metrics.financialSummary.profitMargin}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Trends */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <BarChart3 className="mr-2" size={24} />
                Monthly Trends
              </h3>
              <div className="space-y-3">
                {metrics.financialTrends.slice(-3).map((trend, index) => (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {trend.month}
                      </span>
                      <span
                        className={`text-sm font-semibold ${
                          trend.profit > 0 ? 'text-green-600' : 'text-red-500'
                        }`}
                      >
                        R{(trend.profit / 1000).toFixed(1)}k profit
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Revenue: R{(trend.revenue / 1000).toFixed(1)}k</span>
                      <span>Expenses: R{(trend.expenses / 1000).toFixed(1)}k</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget Utilization */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <Target className="mr-2" size={24} />
                Budget Status
              </h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="8" />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="8"
                        strokeDasharray={`${(metrics.financialSummary.budgetUtilization / 100) * 251.2} 251.2`}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {metrics.financialSummary.budgetUtilization}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Budget Utilized</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    R{(metrics.financialSummary.cashFlow / 1000).toFixed(1)}k Cash Flow
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 7: Student Performance & Risk Analytics */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Top Performers */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <Award className="mr-2" size={24} />
                Top Performers
              </h3>
              <div className="space-y-3">
                {metrics.topPerformers.map((student, index) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{student.rank}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {student.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Grade {student.grade} • {student.subjects.join(', ')}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-600">{student.average}%</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        +{student.improvement}% improvement
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* At-Risk Students */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <AlertTriangle className="mr-2" size={24} />
                At-Risk Students
              </h3>
              <div className="space-y-3">
                {metrics.atRiskStudents.map(student => (
                  <div key={student.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {student.name}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${
                            student.riskLevel === 'high'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              : student.riskLevel === 'medium'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          }`}
                        >
                          {student.riskLevel} risk
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Grade {student.grade}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Issues: {student.reasons.join(', ')}
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">
                      Interventions: {student.interventions.join(', ')}
                    </div>
                    {student.parentNotified && (
                      <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                        ✓ Parent contacted on {student.lastContact}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 8: Teacher Performance & Class Analytics */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Teacher Performance */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <Users className="mr-2" size={24} />
                Teacher Performance
              </h3>
              <div className="space-y-3">
                {metrics.teacherPerformance.map(teacher => (
                  <div key={teacher.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {teacher.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {teacher.subject}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                          <span className="text-sm font-semibold">{teacher.rating}/5</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {teacher.satisfaction}% satisfaction
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="text-gray-500">Students</div>
                        <div className="font-semibold">{teacher.students}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500">Experience</div>
                        <div className="font-semibold">{teacher.experience}y</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500">Achievements</div>
                        <div className="font-semibold">{teacher.achievements.length}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assignments & Examinations */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <ClipboardList className="mr-2" size={24} />
                Academic Tasks
              </h3>
              <div className="space-y-4">
                {/* Assignments */}
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
                    Assignments
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {metrics.assignments.due}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">Due</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-500">
                        {metrics.assignments.overdue}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">Overdue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {metrics.assignments.completed}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-500">
                        {metrics.assignments.pendingGrading}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">Pending</div>
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Avg Score:{' '}
                      <span className="font-semibold">{metrics.assignments.averageScore}%</span>
                    </span>
                  </div>
                </div>

                {/* Examinations */}
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-200 mb-2">
                    Examinations
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">
                        {metrics.examinations.upcoming}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">Upcoming</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-500">
                        {metrics.examinations.inProgress}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">In Progress</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        {metrics.examinations.completed}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">Completed</div>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">
                      Pass Rate:{' '}
                      <span className="font-semibold text-green-600">
                        {metrics.examinations.passRate}%
                      </span>
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      Avg:{' '}
                      <span className="font-semibold">{metrics.examinations.averageScore}%</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 9: Communications & Calendar */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Communications Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <MessageSquare className="mr-2" size={24} />
                Communications
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                  <Mail className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">
                    {metrics.communications.unreadMessages}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Unread Messages</div>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                  <Bell className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">
                    {metrics.communications.announcements}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Announcements</div>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                  <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">
                    {metrics.communications.parentMeetings}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Parent Meetings</div>
                </div>
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
                  <FileText className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-600">
                    {metrics.communications.newsletters}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Newsletters</div>
                </div>
              </div>
            </div>

            {/* Upcoming Events Calendar */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <Calendar className="mr-2" size={24} />
                Upcoming Events
              </h3>
              <div className="space-y-3">
                {metrics.upcomingEvents.map(event => (
                  <div key={event.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {event.title}
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          event.priority === 'high'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : event.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}
                      >
                        {event.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>
                        {event.date} {event.time && `at ${event.time}`}
                      </span>
                      <span className="capitalize">{event.type}</span>
                    </div>
                    {event.location && (
                      <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        📍 {event.location}
                      </div>
                    )}
                    {event.attendees && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        👥 {event.attendees} attendees
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 10: AI Insights & Predictions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Bot className="mr-2" size={24} />
              AI Insights & Predictions
            </h3>
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Predictions */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Predictions
                </h4>
                {metrics.aiInsights.predictions.map((prediction, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase">
                        {prediction.type}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          prediction.confidence > 80
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : prediction.confidence > 60
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {prediction.confidence}% confidence
                      </span>
                    </div>
                    <div className="text-sm text-gray-900 dark:text-white mb-1">
                      {prediction.prediction}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Timeline: {prediction.timeline}
                    </div>
                    {prediction.actionable && (
                      <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                        ✓ Actionable
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Recommendations
                </h4>
                {metrics.aiInsights.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-green-600 dark:text-green-400 uppercase">
                        {rec.category}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          rec.priority === 'High'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : rec.priority === 'Medium'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}
                      >
                        {rec.priority}
                      </span>
                    </div>
                    <div className="text-sm text-gray-900 dark:text-white mb-1">
                      {rec.suggestion}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Expected: {rec.expectedOutcome}
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">
                      How: {rec.implementation}
                    </div>
                  </div>
                ))}
              </div>

              {/* Trends & Sentiment */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Trends & Sentiment
                </h4>
                {/* Trends */}
                {metrics.aiInsights.trends.map((trend, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {trend.metric}
                      </span>
                      <div className="flex items-center space-x-1">
                        {trend.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : trend.trend === 'down' ? (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        ) : (
                          <Activity className="w-4 h-4 text-gray-500" />
                        )}
                        <span
                          className={`text-sm font-semibold ${
                            trend.trend === 'up'
                              ? 'text-green-600'
                              : trend.trend === 'down'
                                ? 'text-red-600'
                                : 'text-gray-600'
                          }`}
                        >
                          {trend.change > 0 ? '+' : ''}
                          {trend.change}%
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{trend.period}</div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      {trend.forecast}
                    </div>
                  </div>
                ))}

                {/* Sentiment Analysis */}
                <div className="p-3 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-lg">
                  <h5 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase mb-2">
                    Sentiment Analysis
                  </h5>
                  <div className="space-y-2">
                    {Object.entries(metrics.aiInsights.sentimentAnalysis).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between text-xs">
                        <span className="capitalize text-gray-600 dark:text-gray-400">{key}:</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-12 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                value >= 80
                                  ? 'bg-green-500'
                                  : value >= 60
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                              }`}
                              style={{ width: `${value}%` }}
                            />
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white min-w-[30px]">
                            {value}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 11: System Health & Alerts */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* System Health Details */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <Monitor className="mr-2" size={24} />
                System Health
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Cpu className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                    <div className="text-lg font-bold text-blue-600">
                      {metrics.systemHealth.cpu.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">CPU Usage</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Database className="w-6 h-6 text-green-500 mx-auto mb-1" />
                    <div className="text-lg font-bold text-green-600">
                      {metrics.systemHealth.memory.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Memory</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <Shield className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                    <div className="text-lg font-bold text-purple-600">
                      {metrics.systemHealth.storage.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Storage</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Uptime:</span>
                    <span className="text-sm font-semibold text-green-600">
                      {metrics.systemHealth.uptime}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Response Time:</span>
                    <span className="text-sm font-semibold text-blue-600">
                      {metrics.systemHealth.response_time.toFixed(0)}ms
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Active Users:</span>
                    <span className="text-sm font-semibold text-purple-600">
                      {metrics.systemHealth.active_users}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Last Backup:</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {metrics.systemHealth.last_backup}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Alerts */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <AlertCircle className="mr-2" size={24} />
                Active Alerts
              </h3>
              <div className="space-y-3">
                {metrics.alerts.map(alert => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border-l-4 ${
                      alert.type === 'error'
                        ? 'bg-red-50 border-red-500 dark:bg-red-900/20'
                        : alert.type === 'warning'
                          ? 'bg-yellow-50 border-yellow-500 dark:bg-yellow-900/20'
                          : alert.type === 'info'
                            ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/20'
                            : 'bg-green-50 border-green-500 dark:bg-green-900/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-xs font-medium uppercase tracking-wide ${
                          alert.type === 'error'
                            ? 'text-red-600 dark:text-red-400'
                            : alert.type === 'warning'
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : alert.type === 'info'
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-green-600 dark:text-green-400'
                        }`}
                      >
                        {alert.type}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          alert.priority === 'high'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : alert.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}
                      >
                        {alert.priority}
                      </span>
                    </div>
                    <div className="text-sm text-gray-900 dark:text-white mb-1">
                      {alert.message}
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                      <span>
                        {alert.module} • {alert.timestamp}
                      </span>
                      {alert.actionRequired && (
                        <span className="text-red-600 dark:text-red-400 font-medium">
                          Action Required
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => router.push('/admin/alerts')}
                    className="px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors"
                  >
                    View All Alerts
                  </button>
                  <button
                    onClick={() => fetchDashboardData()}
                    className="px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Refresh Data
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Last Updated Info */}
          {lastUpdated && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: {lastUpdated.toLocaleString()}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
    // </ErrorBoundary> {/* Commented out: not resolvable in backup context */}
  );
}
