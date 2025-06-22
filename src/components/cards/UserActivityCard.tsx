'use client';
import { useState, useEffect } from 'react';
import { Activity, LogIn, User, Clock, ArrowUpRight, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface ActivityData {
  hour: string;
  logins: number;
}

interface UserActivityData {
  totalLogins: number;
  activeUsers: number;
  peakHour: string;
  chartData: ActivityData[];
  recentActivity: {
    user: string;
    action: string;
    time: string;
  }[];
}

export function UserActivityCard() {
  const [activityData, setActivityData] = useState<UserActivityData>({
    totalLogins: 234,
    activeUsers: 89,
    peakHour: '10:00 AM',
    chartData: [
      { hour: '8', logins: 12 },
      { hour: '9', logins: 28 },
      { hour: '10', logins: 45 },
      { hour: '11', logins: 38 },
      { hour: '12', logins: 22 },
      { hour: '13', logins: 35 },
      { hour: '14', logins: 41 },
      { hour: '15', logins: 33 },
    ],
    recentActivity: [
      { user: 'John Smith', action: 'Login', time: '2 min ago' },
      { user: 'Sarah Wilson', action: 'Dashboard', time: '5 min ago' },
      { user: 'Mike Johnson', action: 'Reports', time: '8 min ago' },
    ],
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setActivityData(prev => ({
        ...prev,
        totalLogins: prev.totalLogins + Math.floor(Math.random() * 3),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 2) - 1,
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      whileHover={{
        y: -5,
        transition: { duration: 0.2 },
      }}
      className="glass-morphism rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 border border-white/20 bg-gradient-to-br from-green-50/80 to-emerald-100/80 h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg"
          >
            <Activity className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">User Activity</h3>
            <p className="text-sm text-gray-600">Login patterns & usage</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-3 h-3 bg-green-500 rounded-full"
          />
          <span className="text-xs text-green-600 font-medium">Live</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <LogIn className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-gray-600 font-medium">TOTAL LOGINS</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{activityData.totalLogins}</div>
            <div className="flex items-center justify-center gap-1 text-xs text-green-600 mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>+12%</span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <User className="w-4 h-4 text-green-600" />
              <span className="text-xs text-gray-600 font-medium">ACTIVE USERS</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{activityData.activeUsers}</div>
            <div className="flex items-center justify-center gap-1 text-xs text-green-600 mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>+8%</span>
            </div>
          </motion.div>
        </div>

        {/* Mini Chart */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Login Activity (Last 8 Hours)</h4>
          <div className="h-20">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData.chartData}>
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    fontSize: '12px',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: 'none',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="logins" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Peak Hour */}
        <div className="flex justify-between items-center py-3 px-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30">
          <span className="text-sm text-gray-600 font-medium">Peak Hour</span>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-bold text-orange-600">{activityData.peakHour}</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Activity</h4>
          <div className="space-y-2 max-h-24 overflow-y-auto">
            {activityData.recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="flex justify-between items-center text-xs"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-900 font-medium">{activity.user}</span>
                  <span className="text-gray-500">{activity.action}</span>
                </div>
                <span className="text-gray-400">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* View More Button */}
      <div className="mt-6 pt-4 border-t border-white/30">
        <Link href="/users">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-medium text-sm shadow-lg"
          >
            <Eye className="w-4 h-4" />
            View All Users
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}
