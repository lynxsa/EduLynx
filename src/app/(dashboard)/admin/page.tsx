'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  GraduationCap, 
  UserCheck, 
  School, 
  Activity
} from 'lucide-react';

// Dynamic imports for better performance
const AttendanceChart = dynamic(() => import('@/components/AttendanceChart'), { ssr: false });
const FinanceChart = dynamic(() => import('@/components/FinanceChart'), { ssr: false });
const GenderPieChart = dynamic(() => import('@/components/GenderPieChart'), { ssr: false });
const PassRateSubjectBarChart = dynamic(() => import('@/components/PassRateSubjectBarChart'), { ssr: false });
const TopClassesBarChart = dynamic(() => import('@/components/TopClassesBarChart'), { ssr: false });
const TopAchieversCard = dynamic(() => import('@/components/TopAchieversCard'), { ssr: false });
const UtilityIcons = dynamic(() => import('@/components/UtilityIcons'), { ssr: false });
const ProjectsCard = dynamic(() => import('@/components/ProjectsCard'), { ssr: false });

interface DashboardMetrics {
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  totalClasses: number;
  totalSubjects: number;
  totalAnnouncements: number;
  totalEvents: number;
  totalExams: number;
  totalAssignments: number;
  totalResults: number;
  attendancePercentage: number;
  recentStudents?: number;
  previousStudents?: number;
  totalIncome?: number;
  totalExpense?: number;
  passRate?: number;
  malePassRate?: number;
  femalePassRate?: number;
  projectedPassRate?: number;
  totalMedicalRecords?: number;
  behaviorIncidents?: number;
  disciplinaryCases?: number;
  totalProjects?: number;
  activeProjects?: number;
  completedProjects?: number;
  plannedProjects?: number;
}

const AdminPage = () => {
  const { setRole } = useAuth();
  const [userName, setUserName] = useState('');
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalStudents: 0,
    totalTeachers: 0,
    totalParents: 0,
    totalClasses: 0,
    totalSubjects: 0,
    totalAnnouncements: 0,
    totalEvents: 0,
    totalExams: 0,
    totalAssignments: 0,
    totalResults: 0,
    attendancePercentage: 0,
    recentStudents: 0,
    previousStudents: 0,
    totalMedicalRecords: 0,
    behaviorIncidents: 0,
    disciplinaryCases: 0,
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    plannedProjects: 0,
  });
  const [financeData, setFinanceData] = useState<any[]>([]);
  const [attendanceByDay, setAttendanceByDay] = useState([]);
  const [passRatePerSubject, setPassRatePerSubject] = useState<{ subject: string; passRate: number }[]>([]);
  const [topClasses, setTopClasses] = useState<any[]>([]);
  const [topAchievers, setTopAchievers] = useState<any[]>([]);
  const [genderCounts, setGenderCounts] = useState({ male: 0, female: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set admin role when component mounts - this fixes the blank sidebar
    setRole('ADMIN');
    console.log('Admin page: Setting role to ADMIN');
    
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard/admin');
        if (response.ok) {
          const data = await response.json();
          setMetrics(data.metrics);
          setFinanceData(data.financeChart || []);
          setAttendanceByDay(data.attendanceByDay || []);
          setPassRatePerSubject(data.passRatePerSubject || []);
          setTopClasses(data.topClasses || []);
          setTopAchievers(data.topAchievers || []);
          setGenderCounts(data.genderCounts || { male: 0, female: 0 });
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
    setUserName(sessionStorage.getItem('userName') || 'Admin');
  }, [setRole]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const genderPieData = [
    { id: 'Male', label: 'Male', value: genderCounts.male, color: '#3b82f6' },
    { id: 'Female', label: 'Female', value: genderCounts.female, color: '#ec4899' },
  ];

  // South African Rand formatting
  const formatZAR = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleUtilityClick = (iconName: string) => {
    console.log(`Clicked: ${iconName}`);
  };

  return (
    <ErrorBoundary>
      <div className="p-6 space-y-6 fade-in">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userName}!</h1>
            <p className="text-gray-600 mt-1">Here&apos;s what&apos;s happening at EduLynx today.</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              {new Date().toLocaleDateString('en-ZA', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Row 1: Key Metrics (4 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Students</h2>
                <p className="text-3xl font-bold text-gray-900">{metrics.totalStudents.toLocaleString()}</p>
                <p className="text-sm text-gray-600 mt-1">Total enrolled students</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Teachers</h2>
                <p className="text-3xl font-bold text-gray-900">{metrics.totalTeachers.toLocaleString()}</p>
                <p className="text-sm text-gray-600 mt-1">Active teaching staff</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Parents</h2>
                <p className="text-3xl font-bold text-gray-900">{metrics.totalParents.toLocaleString()}</p>
                <p className="text-sm text-gray-600 mt-1">Registered guardians</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <UserCheck className="w-6 h-6 text-purple-600" />
                </div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Classes</h2>
                <p className="text-3xl font-bold text-gray-900">{metrics.totalClasses.toLocaleString()}</p>
                <p className="text-sm text-gray-600 mt-1">Active class groups</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <School className="w-6 h-6 text-orange-600" />
                </div>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Quick Actions (Full Width) */}
        <div className="w-full">
          <UtilityIcons onIconClick={handleUtilityClick} />
        </div>

        {/* Row 3: Attendance & Gender Split (2 Cards - 50% each) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Attendance Ratio</h2>
                <p className="text-3xl font-bold text-gray-900">{metrics.attendancePercentage}%</p>
                <p className="text-sm text-gray-600">Weekly average attendance</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <Activity className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="h-48">
              <AttendanceChart data={attendanceByDay} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Gender Split</h2>
                <p className="text-sm text-gray-600">Student demographics breakdown</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="h-48 flex items-center justify-center">
              <GenderPieChart data={genderPieData} />
            </div>
          </div>
        </div>

        {/* Row 4: Subject Performance (Full Width) */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Subject Performance</h2>
              <p className="text-sm text-gray-600">Pass rates across all subjects</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="h-96">
            <PassRateSubjectBarChart data={passRatePerSubject} />
          </div>
        </div>

        {/* Row 5: Top Performing Classes (3/4) + Top Achievers (1/4) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Top Performing Classes</h2>
                <p className="text-sm text-gray-600">Classes with highest average scores</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="h-64">
              <TopClassesBarChart data={topClasses} />
            </div>
          </div>

          <div className="lg:col-span-1">
            <TopAchieversCard achievers={topAchievers} />
          </div>
        </div>

        {/* Row 6: Projects Card (Full Width) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <ProjectsCard />
        </div>

        {/* Row 7: Financial Overview (Full Width) */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Financial Overview</h2>
              <p className="text-sm text-gray-600">Income and expenses in South African Rand (ZAR)</p>
              <div className="flex items-center space-x-8 mt-4">
                <div>
                  <span className="text-sm text-gray-500">Total Income</span>
                  <p className="text-2xl font-bold text-green-600">{formatZAR(metrics.totalIncome || 0)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Total Expenses</span>
                  <p className="text-2xl font-bold text-red-600">{formatZAR(metrics.totalExpense || 0)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Net Profit</span>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatZAR((metrics.totalIncome || 0) - (metrics.totalExpense || 0))}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="h-80">
            <FinanceChart data={financeData} />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AdminPage;