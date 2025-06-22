'use client';
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface FinanceData {
  month?: string;
  name?: string;
  income: number;
  expense: number;
  amt?: number;
}

interface FinanceChartProps {
  data?: FinanceData[];
}

const defaultData: FinanceData[] = [
  {
    name: 'Jan',
    income: 400000,
    expense: 240000,
    amt: 160000,
  },
  {
    name: 'Feb',
    income: 380000,
    expense: 280000,
    amt: 100000,
  },
  {
    name: 'Mar',
    income: 420000,
    expense: 320000,
    amt: 100000,
  },
  {
    name: 'Apr',
    income: 450000,
    expense: 350000,
    amt: 100000,
  },
  {
    name: 'May',
    income: 480000,
    expense: 330000,
    amt: 150000,
  },
  {
    name: 'Jun',
    income: 520000,
    expense: 380000,
    amt: 140000,
  },
];

const FinanceChart = ({ data = defaultData }: FinanceChartProps) => {
  // Format values for South African Rand
  const formatZAR = (value: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey={data[0]?.month ? 'month' : 'name'}
            tickLine={false}
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis
            tickLine={false}
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={value => `R${(value / 1000).toFixed(0)}K`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              color: '#1f2937',
            }}
            formatter={(value: number, name: string) => [
              formatZAR(value),
              name === 'income' ? 'Income' : 'Expense',
            ]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#10b981"
            strokeWidth={3}
            activeDot={{ r: 6, fill: '#10b981' }}
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#ef4444"
            strokeWidth={3}
            activeDot={{ r: 6, fill: '#ef4444' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinanceChart;
