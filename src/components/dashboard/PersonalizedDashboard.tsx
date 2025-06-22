'use client';

import { useEffect, useState } from 'react';
import {
  User2,
  Calendar,
  ClipboardList,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Users,
  MessageCircle,
  Award,
  Clock,
  DollarSign,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface PersonalizedDashboardProps {
  fallbackData: any;
}

const PersonalizedDashboard: React.FC<PersonalizedDashboardProps> = ({ fallbackData }) => {
  const [user, setUser] = useState<User | null>(null);
  const [personalData, setPersonalData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);

          // Fetch role-specific dashboard data
          const dashboardResponse = await fetch(`/api/dashboard/${data.user.role.toLowerCase()}`);
          if (dashboardResponse.ok) {
            const dashboardData = await dashboardResponse.json();
            setPersonalData(dashboardData);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // Set mock user for demo
        setUser({
          id: 'demo',
          firstName: 'Demo',
          lastName: 'User',
          email: 'demo@lynxacademy.co.za',
          role: 'ADMIN',
        });
      }
    };

    fetchUserData();
  }, []);

  const renderAdminDashboard = () => (
    <>
      <Card
        title="Total Students"
        value={personalData?.totalStudents || fallbackData.totalStudents}
        icon={GraduationCap}
        change="+12% from last month"
        changeType="positive"
        className="bg-primary/10 border-primary/20"
      />
      <Card
        title="Total Teachers"
        value={personalData?.totalTeachers || 45}
        icon={Users}
        change="+3 new this month"
        changeType="positive"
        className="bg-primary/10 border-primary/20"
      />
      <Card
        title="Active Classes"
        value={personalData?.activeClasses || fallbackData.activeClasses}
        icon={BookOpen}
        change="All running smoothly"
        changeType="positive"
        className="bg-primary/10 border-primary/20"
      />
      <Card
        title="System Health"
        value="99.9%"
        icon={TrendingUp}
        change="Excellent uptime"
        changeType="positive"
        className="bg-primary/10 border-primary/20"
      />
    </>
  );

  const renderTeacherDashboard = () => (
    <>
      <Card
        title="My Classes"
        value={personalData?.myClasses || 6}
        icon={BookOpen}
        change="2 classes today"
        changeType="positive"
        className="bg-primary/10 border-primary/20"
      />
      <Card
        title="My Students"
        value={personalData?.myStudents || 143}
        icon={GraduationCap}
        change="Across all classes"
        changeType="neutral"
        className="bg-primary/10 border-primary/20"
      />
      <Card
        title="Pending Grades"
        value={personalData?.pendingGrades || 28}
        icon={ClipboardList}
        change="Due this week"
        changeType="neutral"
        className="bg-primary/10 border-primary/20"
      />
      <Card
        title="Class Average"
        value={`${personalData?.classAverage || 76}%`}
        icon={Award}
        change="+3% improvement"
        changeType="positive"
        className="bg-primary/10 border-primary/20"
      />
    </>
  );

  const renderParentDashboard = () => (
    <>
      <Card
        title="My Children"
        value={personalData?.myChildren || 2}
        icon={Users}
        change="Both active"
        changeType="positive"
        className="bg-primary/10 border-primary/20"
      />
      <Card
        title="Upcoming Events"
        value={personalData?.upcomingEvents || 3}
        icon={Calendar}
        change="This week"
        changeType="neutral"
        className="bg-primary/10 border-primary/20"
      />
      <Card
        title="Fee Balance"
        value={`R${personalData?.feeBalance || '2,450'}`}
        icon={DollarSign}
        change="Due 15th"
        changeType="negative"
        className="bg-primary/10 border-primary/20"
      />
      <Card
        title="Messages"
        value={personalData?.unreadMessages || 5}
        icon={MessageCircle}
        change="3 from teachers"
        changeType="neutral"
        className="bg-primary/10 border-primary/20"
      />
    </>
  );

  const renderStudentDashboard = () => (
    <>
      <Card
        title="My Subjects"
        value={personalData?.mySubjects || 8}
        icon={BookOpen}
        change="All enrolled"
        changeType="positive"
        className="bg-primary/10 border-primary/20"
      />
      <Card
        title="Assignments Due"
        value={personalData?.assignmentsDue || 4}
        icon={ClipboardList}
        change="2 due tomorrow"
        changeType="neutral"
        className="bg-primary/10 border-primary/20"
      />
      <Card
        title="Current Average"
        value={`${personalData?.currentAverage || 82}%`}
        icon={Award}
        change="+5% this term"
        changeType="positive"
        className="bg-primary/10 border-primary/20"
      />
      <Card
        title="Attendance"
        value={`${personalData?.attendanceRate || 96}%`}
        icon={Clock}
        change="Excellent record"
        changeType="positive"
        className="bg-primary/10 border-primary/20"
      />
    </>
  );

  const renderDashboardCards = () => {
    if (!user) return null;

    switch (user.role.toUpperCase()) {
      case 'ADMIN':
        return renderAdminDashboard();
      case 'TEACHER':
        return renderTeacherDashboard();
      case 'PARENT':
        return renderParentDashboard();
      case 'STUDENT':
        return renderStudentDashboard();
      default:
        return renderAdminDashboard();
    }
  };

  const getWelcomeMessage = () => {
    if (!user) return 'Welcome to EduLynx';

    const timeOfDay =
      new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening';

    const roleMessages = {
      ADMIN: `Good ${timeOfDay}, ${user.firstName}! Here's your school overview.`,
      TEACHER: `Good ${timeOfDay}, ${user.firstName}! Ready for today's classes?`,
      PARENT: `Good ${timeOfDay}, ${user.firstName}! Here's your children's progress.`,
      STUDENT: `Good ${timeOfDay}, ${user.firstName}! Let's check your academic journey.`,
    };

    return (
      roleMessages[user.role as keyof typeof roleMessages] ||
      `Good ${timeOfDay}, ${user.firstName}!`
    );
  };

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">
          {user?.role
            ? `${user.role.charAt(0) + user.role.slice(1).toLowerCase()} Dashboard`
            : 'Dashboard'}
        </h1>
        <p className="text-muted-foreground">{getWelcomeMessage()}</p>
      </div>

      {/* Personalized Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderDashboardCards()}
      </div>

      {/* Role-specific Quick Actions */}
      {user && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {user.role === 'ADMIN' && (
            <>
              <a
                href="/list/students"
                className="bg-primary/10 border border-primary/20 rounded-2xl p-4 hover:bg-primary/20 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <GraduationCap className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-primary">Manage Students</h3>
                    <p className="text-sm text-muted-foreground">
                      Add, edit, or view student records
                    </p>
                  </div>
                </div>
              </a>
              <a
                href="/list/teachers"
                className="bg-primary/10 border border-primary/20 rounded-2xl p-4 hover:bg-primary/20 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Users className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-primary">Manage Staff</h3>
                    <p className="text-sm text-muted-foreground">Teacher and staff management</p>
                  </div>
                </div>
              </a>
            </>
          )}

          {user.role === 'TEACHER' && (
            <>
              <a
                href="/list/classes"
                className="bg-primary/10 border border-primary/20 rounded-2xl p-4 hover:bg-primary/20 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-primary">My Classes</h3>
                    <p className="text-sm text-muted-foreground">View and manage your classes</p>
                  </div>
                </div>
              </a>
              <a
                href="/list/assignments"
                className="bg-primary/10 border border-primary/20 rounded-2xl p-4 hover:bg-primary/20 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <ClipboardList className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-primary">Assignments</h3>
                    <p className="text-sm text-muted-foreground">Create and grade assignments</p>
                  </div>
                </div>
              </a>
            </>
          )}

          {user.role === 'PARENT' && (
            <>
              <a
                href="/parent/children"
                className="bg-primary/10 border border-primary/20 rounded-2xl p-4 hover:bg-primary/20 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Users className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-primary">My Children</h3>
                    <p className="text-sm text-muted-foreground">View children's progress</p>
                  </div>
                </div>
              </a>
              <a
                href="/finance"
                className="bg-primary/10 border border-primary/20 rounded-2xl p-4 hover:bg-primary/20 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-primary">School Fees</h3>
                    <p className="text-sm text-muted-foreground">View and pay fees</p>
                  </div>
                </div>
              </a>
            </>
          )}

          {user.role === 'STUDENT' && (
            <>
              <a
                href="/student/assignments"
                className="bg-primary/10 border border-primary/20 rounded-2xl p-4 hover:bg-primary/20 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <ClipboardList className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-primary">My Assignments</h3>
                    <p className="text-sm text-muted-foreground">View and submit work</p>
                  </div>
                </div>
              </a>
              <a
                href="/student/marks"
                className="bg-primary/10 border border-primary/20 rounded-2xl p-4 hover:bg-primary/20 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Award className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-primary">My Grades</h3>
                    <p className="text-sm text-muted-foreground">View academic progress</p>
                  </div>
                </div>
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PersonalizedDashboard;
