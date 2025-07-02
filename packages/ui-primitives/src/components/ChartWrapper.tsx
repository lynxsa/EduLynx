import * as React from 'react';
import { ResponsiveContainer } from 'recharts';

export interface ChartWrapperProps {
  width?: number | string;
  height?: number | string;
  children: React.ReactElement;
}

export const ChartWrapper: React.FC<ChartWrapperProps> = ({
  width = '100%',
  height = 300,
  children,
}) => (
  <div style={{ width, height }}>
    <ResponsiveContainer width="100%" height="100%">
      {children}
    </ResponsiveContainer>
  </div>
);
