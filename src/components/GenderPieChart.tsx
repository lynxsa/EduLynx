import React from 'react';
import { ResponsivePie } from '@nivo/pie';

interface GenderPieChartProps {
  data: { id: string; label: string; value: number; color: string }[];
}

export default function GenderPieChart({ data }: GenderPieChartProps) {
  return (
    <div className="h-56 w-full bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4 flex flex-col animate-fade-in hover:shadow-xl transition-shadow duration-200">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-md font-semibold text-LYNXPurple">Gender Distribution</h3>
        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full" data-tooltip-id="gender-tooltip" data-tooltip-content="Shows the ratio of male to female students">
          ℹ️
        </div>
      </div>
      {data.length === 0 ? (
        <div className="animate-pulse h-full w-full bg-gray-100 rounded-xl" />
      ) : (
        <ResponsivePie
          data={data}
          margin={{ top: 20, right: 40, bottom: 40, left: 40 }}
          innerRadius={0.7}
          padAngle={2}
          cornerRadius={8}
          colors={{ datum: 'data.color' }}
          borderWidth={2}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          enableArcLabels={false}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#6b7280"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          theme={{
            labels: { text: { fontWeight: 600, fill: '#3726a6' } },
            legends: { text: { fontWeight: 700, fill: '#8884d8' } },
          }}
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              justify: false,
              translateY: 36,
              itemWidth: 80,
              itemHeight: 18,
              itemsSpacing: 8,
              symbolSize: 18,
              symbolShape: 'circle',
            },
          ]}
        />
      )}
    </div>
  );
}
