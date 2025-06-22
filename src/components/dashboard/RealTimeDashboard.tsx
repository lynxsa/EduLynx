'use client';

import { useWebSocket, WebSocketMessage } from '@/hooks/useWebSocket';
import { useTheme } from '@/styles/theme';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

interface LiveMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  color: string;
  icon: string;
}

interface RealTimeDashboardProps {
  className?: string;
  wsUrl?: string;
}

const defaultMetrics: LiveMetric[] = [
  {
    id: 'active-users',
    label: 'Active Users',
    value: 245,
    unit: '',
    trend: 'up',
    trendValue: 12,
    color: '#3b82f6',
    icon: '👥',
  },
  {
    id: 'avg-grade',
    label: 'Average Grade',
    value: 78.5,
    unit: '%',
    trend: 'up',
    trendValue: 2.1,
    color: '#10b981',
    icon: '📊',
  },
  {
    id: 'attendance',
    label: 'Attendance Rate',
    value: 94.2,
    unit: '%',
    trend: 'stable',
    trendValue: 0.3,
    color: '#f59e0b',
    icon: '✅',
  },
  {
    id: 'system-load',
    label: 'System Load',
    value: 68.4,
    unit: '%',
    trend: 'down',
    trendValue: -5.2,
    color: '#ef4444',
    icon: '⚡',
  },
];

export function RealTimeDashboard({
  className = '',
  wsUrl = 'ws://localhost:3001/ws',
}: RealTimeDashboardProps) {
  const { actualTheme } = useTheme();
  const [metrics, setMetrics] = useState<LiveMetric[]>(defaultMetrics);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [notifications, setNotifications] = useState<string[]>([]);

  const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
    switch (message.type) {
      case 'UPDATE':
        if (message.data.metrics) {
          setMetrics(prev =>
            prev.map(metric => {
              const update = message.data.metrics.find((m: any) => m.id === metric.id);
              return update ? { ...metric, ...update } : metric;
            })
          );
          setLastUpdate(new Date());
        }
        break;

      case 'NOTIFICATION':
        setNotifications(prev => [message.data.message, ...prev.slice(0, 4)]);
        setTimeout(() => {
          setNotifications(prev => prev.slice(0, -1));
        }, 5000);
        break;
    }
  }, []);

  const { isConnected, connectionState } = useWebSocket(wsUrl, {
    onMessage: handleWebSocketMessage,
    onConnect: () => console.log('Connected to real-time updates'),
    onDisconnect: () => console.log('Disconnected from real-time updates'),
    onError: error => console.error('WebSocket error:', error),
  });

  // Simulate real-time updates for demo purposes
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev =>
        prev.map(metric => ({
          ...metric,
          value: metric.value + (Math.random() - 0.5) * 2,
          trend: Math.random() > 0.5 ? 'up' : 'down',
          trendValue: (Math.random() - 0.5) * 10,
        }))
      );
      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      default:
        return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return actualTheme === 'dark' ? '#22c55e' : '#16a34a';
      case 'down':
        return actualTheme === 'dark' ? '#ef4444' : '#dc2626';
      default:
        return actualTheme === 'dark' ? '#64748b' : '#6b7280';
    }
  };

  return (
    <div className={`p-6 ${className}`}>
      {/* Header with Connection Status */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Real-Time Dashboard</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {connectionState === 'connected'
              ? 'Live'
              : connectionState === 'connecting'
                ? 'Connecting...'
                : 'Offline'}
          </span>
        </div>
      </div>

      {/* Notifications */}
      <AnimatePresence>
        {notifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            {notifications.map((notification, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-2"
              >
                <div className="flex items-center">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">🔔</span>
                  <span className="text-sm text-blue-800 dark:text-blue-200">{notification}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map(metric => (
          <motion.div
            key={metric.id}
            layout
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 relative overflow-hidden"
          >
            {/* Background decoration */}
            <div
              className="absolute top-0 right-0 w-16 h-16 opacity-10 rounded-bl-full"
              style={{ backgroundColor: metric.color }}
            />

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{metric.icon}</span>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {metric.label}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: isConnected ? 360 : 0 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}
                />
              </div>

              <div className="space-y-2">
                <motion.div
                  key={metric.value}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="text-3xl font-bold text-gray-900 dark:text-white"
                >
                  {metric.value.toFixed(1)}
                  {metric.unit}
                </motion.div>

                <div className="flex items-center space-x-1">
                  <span style={{ color: getTrendColor(metric.trend) }}>
                    {getTrendIcon(metric.trend)}
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: getTrendColor(metric.trend) }}
                  >
                    {metric.trendValue > 0 ? '+' : ''}
                    {metric.trendValue.toFixed(1)}%
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">vs last hour</span>
                </div>
              </div>
            </div>

            {/* Pulse animation for updates */}
            <motion.div
              key={lastUpdate.getTime()}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 border-2 rounded-xl"
              style={{ borderColor: metric.color }}
            />
          </motion.div>
        ))}
      </div>

      {/* Real-time Activity Feed */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Live Activity</h3>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 py-2"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Student {index + 1} completed Assignment #{Math.floor(Math.random() * 100)}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">
                  {Math.floor(Math.random() * 5) + 1}m ago
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
