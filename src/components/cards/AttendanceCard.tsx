'use client';

import { useAttendance, useAttendanceTrend } from '@/hooks/useAttendance';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { CardSkeleton } from '@/components/Skeletons';
import { AttendanceChart } from '@/components/charts/AttendanceChart';
import { Calendar, TrendingUp, TrendingDown, Users, UserX } from 'lucide-react';

export function AttendanceCard() {
  const { attendance, isLoading: attendanceLoading, error: attendanceError } = useAttendance();
  const { trend, isLoading: trendLoading } = useAttendanceTrend();

  if (attendanceLoading || trendLoading) return <CardSkeleton />;
  if (attendanceError) return <div className="text-red-500">Error loading attendance data</div>;

  const todayRate = attendance?.today?.rate || 0;
  const overallRate = attendance?.overall?.rate || 0;
  const isPositiveTrend =
    trend &&
    trend.length > 1 &&
    trend[trend.length - 1].percentage > trend[trend.length - 2].percentage;

  // Format trend data for chart
  const chartData =
    trend?.map((item: any) => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      present: item.present || 0,
      absent: item.absent || 0,
      rate: item.percentage || 0,
    })) || [];

  const todayAbsent = attendance?.today?.total
    ? attendance.today.total - attendance.today.present
    : 0;

  return (
    <ErrorBoundary>
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Daily Attendance</h3>
              <p className="text-sm text-gray-500">Today's presence rate</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">{todayRate.toFixed(1)}%</div>
            <div className="flex items-center gap-1">
              {isPositiveTrend ? (
                <>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">Improving</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600 font-medium">Declining</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {attendance && (
            <div className="grid grid-cols-3 gap-3">
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <Users className="w-4 h-4 text-green-600" />
                <div>
                  <div className="text-lg font-semibold text-green-700">
                    {attendance.today.present}
                  </div>
                  <div className="text-xs text-green-600">Present</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                <UserX className="w-4 h-4 text-red-600" />
                <div>
                  <div className="text-lg font-semibold text-red-700">{todayAbsent}</div>
                  <div className="text-xs text-red-600">Absent</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <Calendar className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="text-lg font-semibold text-blue-700">
                    {overallRate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-blue-600">Overall</div>
                </div>
              </div>
            </div>
          )}

          {chartData.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">7-Day Trend</h4>
              <AttendanceChart data={chartData} />
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
