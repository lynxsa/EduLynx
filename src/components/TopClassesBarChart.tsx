import { ResponsiveBar, BarDatum } from '@nivo/bar';
import React from 'react';

export interface TopClass extends BarDatum {
  className: string;
  avgScore: number;
}

interface TopClassesBarChartProps {
  data: TopClass[];
}

const TopClassesBarChart: React.FC<TopClassesBarChartProps> = ({ data }) => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-md p-4 animate-fade-in hover:shadow-xl transition-shadow duration-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-semibold text-LYNXPurple">Top Performing Classes</h3>
        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full cursor-pointer" data-tooltip-id="topclasses-tooltip" data-tooltip-content="Classes ranked by average student scores">
          🏆
        </div>
      </div>
      {data.length === 0 ? (
        <div className="animate-pulse h-64 w-full bg-gray-100 rounded-xl" />
      ) : (
        <div style={{ height: 260 }}>
          <ResponsiveBar
            data={data}
            keys={["avgScore"]}
            indexBy="className"
            margin={{ top: 20, right: 30, bottom: 40, left: 50 }}
            padding={0.3}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={{ scheme: 'purple_blue' }}
            borderRadius={6}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Class',
              legendPosition: 'middle',
              legendOffset: 32,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Avg Score',
              legendPosition: 'middle',
              legendOffset: -40,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            animate={true}
            motionConfig="wobbly"
            theme={{
              axis: {
                ticks: {
                  text: { fill: '#3726a6', fontWeight: 600 },
                },
                legend: {
                  text: { fill: '#8884d8', fontWeight: 700 },
                },
              },
              grid: {
                line: { stroke: '#e5e7eb', strokeWidth: 1 },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TopClassesBarChart;
