'use client';

import React from 'react';
import { TrendingDown, TrendingUp, Users } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useDropoutRisk } from '@/hooks/useAdminData';

export function DropoutRiskCard() {
  const { dropoutData, isLoading, error } = useDropoutRisk();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700">Dropout Risk Assessment</h3>
          <TrendingDown className="h-4 w-4 text-gray-400" />
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6 h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700">Dropout Risk Assessment</h3>
          <TrendingDown className="h-4 w-4 text-red-500" />
        </div>
        <div className="text-red-500 text-sm">Error loading dropout risk data</div>
      </div>
    );
  }

  const stats = dropoutData?.stats || { total: 0, highRisk: 0, mediumRisk: 0, lowRisk: 0 };

  const riskData = [
    { name: 'Low Risk', value: stats.lowRisk, color: '#10b981' },
    { name: 'Medium Risk', value: stats.mediumRisk, color: '#f59e0b' },
    { name: 'High Risk', value: stats.highRisk, color: '#ef4444' },
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700">Dropout Risk Assessment</h3>
        <TrendingDown className="h-4 w-4 text-gray-600" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-red-500" />
          <div>
            <div className="text-2xl font-bold text-red-600">{stats.highRisk}</div>
            <p className="text-xs text-gray-500">High Risk Students</p>
          </div>
        </div>

        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [`${value} students`, 'Count']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2">
          {riskData.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span>{item.name}</span>
              </div>
              <span className="font-medium">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-gray-500">Total Students</span>
            </div>
            <span className="font-medium">{stats.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
