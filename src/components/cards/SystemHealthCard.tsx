'use client';
import { useState, useEffect } from 'react';
import { Server, CheckCircle, AlertTriangle, XCircle, Eye, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface SystemHealthData {
  uptime: string;
  status: 'healthy' | 'warning' | 'critical';
  cpu: number;
  memory: number;
  database: 'connected' | 'disconnected';
  lastCheck: string;
}

export function SystemHealthCard() {
  const [healthData, setHealthData] = useState<SystemHealthData>({
    uptime: '99.9%',
    status: 'healthy',
    cpu: 45,
    memory: 62,
    database: 'connected',
    lastCheck: new Date().toLocaleTimeString(),
  });

  useEffect(() => {
    // Simulate real-time health monitoring
    const interval = setInterval(() => {
      setHealthData(prev => ({
        ...prev,
        cpu: Math.floor(Math.random() * 100),
        memory: Math.floor(Math.random() * 100),
        lastCheck: new Date().toLocaleTimeString(),
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (healthData.status) {
      case 'healthy':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case 'critical':
        return <XCircle className="h-6 w-6 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (healthData.status) {
      case 'healthy':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
    }
  };

  return (
    <motion.div
      whileHover={{
        y: -5,
        transition: { duration: 0.2 },
      }}
      className="glass-morphism rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 border border-white/20 bg-gradient-to-br from-blue-50/80 to-indigo-100/80 h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg"
          >
            <Server className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">System Health</h3>
            <p className="text-sm text-gray-600">System uptime & performance</p>
          </div>
        </div>
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
          {getStatusIcon()}
        </motion.div>
      </div>

      <div className="space-y-6">
        {/* Status Overview */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30"
          >
            <div className="text-xs text-gray-600 font-medium mb-1">UPTIME</div>
            <div className="text-2xl font-bold text-green-600">{healthData.uptime}</div>
            <div className="flex items-center justify-center gap-1 text-xs text-green-600 mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>Excellent</span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30"
          >
            <div className="text-xs text-gray-600 font-medium mb-1">STATUS</div>
            <div className={`text-2xl font-bold ${getStatusColor()}`}>
              {healthData.status.toUpperCase()}
            </div>
            <div className="flex items-center justify-center gap-1 text-xs text-green-600 mt-1">
              <CheckCircle className="w-3 h-3" />
              <span>Stable</span>
            </div>
          </motion.div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Performance Metrics</h4>

          {/* CPU Usage */}
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">CPU Usage</span>
              <span className="text-sm font-medium">{healthData.cpu}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${healthData.cpu}%` }}
                transition={{ duration: 1, ease: 'easeInOut' }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  healthData.cpu > 80
                    ? 'bg-red-500'
                    : healthData.cpu > 60
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                }`}
              />
            </div>
          </div>

          {/* Memory Usage */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Memory Usage</span>
              <span className="text-sm font-medium">{healthData.memory}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${healthData.memory}%` }}
                transition={{ duration: 1, ease: 'easeInOut', delay: 0.2 }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  healthData.memory > 80
                    ? 'bg-red-500'
                    : healthData.memory > 60
                      ? 'bg-yellow-500'
                      : 'bg-blue-500'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Database Status */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 font-medium">Database Connection</span>
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-3 h-3 rounded-full ${
                  healthData.database === 'connected' ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  healthData.database === 'connected' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {healthData.database === 'connected' ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>

        {/* Last Check */}
        <div className="flex justify-between items-center py-3 px-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30">
          <span className="text-xs text-gray-500 font-medium">Last checked</span>
          <span className="text-xs text-gray-600 font-medium">{healthData.lastCheck}</span>
        </div>
      </div>

      {/* View More Button */}
      <div className="mt-6 pt-4 border-t border-white/30">
        <Link href="/system">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-medium text-sm shadow-lg"
          >
            <Eye className="w-4 h-4" />
            View System Details
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}
