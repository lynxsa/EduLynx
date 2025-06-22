'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ChartData {
  day?: string;
  hour?: string;
  attendance?: number;
  registrations?: number;
  messages?: number;
}

interface TestScoreData {
  subject: string;
  score: number;
  fill: string;
}

interface AttendanceChartProps {
  data: ChartData[];
}

interface RegistrationChartProps {
  data: ChartData[];
}

interface MessageChartProps {
  data: ChartData[];
}

interface TestScoreChartProps {
  data: TestScoreData[];
}

export const AttendanceChart: React.FC<AttendanceChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="attendance"
          stroke="#3726a6"
          strokeWidth={3}
          dot={{ fill: '#3726a6' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const RegistrationChart: React.FC<RegistrationChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="registrations" fill="#a096e7" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const MessageChart: React.FC<MessageChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="messages"
          stroke="#3726a6"
          fill="#a096e7"
          fillOpacity={0.3}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export const TestScoreChart: React.FC<TestScoreChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={data}>
        <RadialBar background dataKey="score" />
        <Tooltip />
      </RadialBarChart>
    </ResponsiveContainer>
  );
};
