'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { AlertCircle, Bell, Info, AlertTriangle } from 'lucide-react';
import { useSystemAlerts } from '@/hooks/useAdminData';

export function SystemAlertsCard() {
  const { alertsData, isLoading, error } = useSystemAlerts();

  if (isLoading) {
    return <Card title="System Alerts" value="Loading..." icon={Bell} className="animate-pulse" />;
  }

  if (error) {
    return (
      <Card
        title="System Alerts"
        value="Error"
        icon={AlertCircle}
        changeType="negative"
        change="Failed to load"
      />
    );
  }

  const total = alertsData?.stats?.total || 0;
  const critical = alertsData?.stats?.critical || 0;
  const warning = alertsData?.stats?.warning || 0;
  const unread = alertsData?.stats?.unread || 0;

  return (
    <Card
      title="System Alerts"
      value={total}
      icon={Bell}
      change={`${unread} unread`}
      changeType={critical > 0 ? 'negative' : warning > 0 ? 'warning' : 'neutral'}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-3 w-3 text-red-500" />
            <span className="text-gray-600">Critical</span>
          </div>
          <span className="font-medium text-red-600">{critical}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-3 w-3 text-yellow-500" />
            <span className="text-gray-600">Warning</span>
          </div>
          <span className="font-medium text-yellow-600">{warning}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Info className="h-3 w-3 text-blue-500" />
            <span className="text-gray-600">Info</span>
          </div>
          <span className="font-medium text-blue-600">{alertsData?.stats?.info || 0}</span>
        </div>
      </div>

      {alertsData?.alerts && alertsData.alerts.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Alerts</h4>
          <div className="space-y-1">
            {alertsData.alerts.slice(0, 3).map((alert: any, index: number) => (
              <div key={index} className="text-xs text-gray-600 truncate">
                <span
                  className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    alert.type === 'ERROR'
                      ? 'bg-red-500'
                      : alert.type === 'WARNING'
                        ? 'bg-yellow-500'
                        : alert.type === 'INFO'
                          ? 'bg-blue-500'
                          : 'bg-green-500'
                  }`}
                ></span>
                {alert.title}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
