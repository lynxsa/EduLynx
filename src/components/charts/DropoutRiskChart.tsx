'use client';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DropoutRiskChartProps {
  data: Array<{
    month: string;
    atRisk: number;
    interventions: number;
  }>;
}

export function DropoutRiskChart({ data }: DropoutRiskChartProps) {
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" stroke="#666" fontSize={12} tickLine={false} />
          <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    <p className="text-sm text-orange-600">At Risk: {payload[0]?.value}</p>
                    <p className="text-sm text-green-600">Interventions: {payload[1]?.value}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="atRisk"
            stackId="1"
            stroke="#f59e0b"
            fill="#fbbf24"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="interventions"
            stackId="2"
            stroke="#10b981"
            fill="#34d399"
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
