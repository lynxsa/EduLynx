'use client';

import { useTheme } from '@/styles/theme';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface TreemapData {
  id: string;
  label: string;
  value: number;
  color?: string;
  children?: TreemapData[];
}

interface TreemapProps {
  data: TreemapData[];
  width?: number;
  height?: number;
  title?: string;
  className?: string;
  colorScheme?: 'blue' | 'green' | 'categorical';
  minFontSize?: number;
  maxFontSize?: number;
  padding?: number;
}

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
  data: TreemapData;
}

const colorPalettes = {
  blue: ['#dbeafe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8'],
  green: ['#dcfce7', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d'],
  categorical: [
    '#3b82f6',
    '#ef4444',
    '#10b981',
    '#f59e0b',
    '#8b5cf6',
    '#06b6d4',
    '#84cc16',
    '#f97316',
    '#ec4899',
    '#6366f1',
  ],
};

export function Treemap({
  data,
  width = 600,
  height = 400,
  title,
  className = '',
  colorScheme = 'blue',
  minFontSize = 10,
  maxFontSize = 24,
  padding = 2,
}: TreemapProps) {
  const { actualTheme } = useTheme();

  const rectangles = useMemo(() => {
    const totalValue = data.reduce((sum, item) => sum + item.value, 0);

    const squarify = (
      data: TreemapData[],
      x: number,
      y: number,
      width: number,
      height: number
    ): Rectangle[] => {
      if (data.length === 0) return [];

      const rectangles: Rectangle[] = [];
      const sortedData = [...data].sort((a, b) => b.value - a.value);

      let currentX = x;
      let currentY = y;
      let remainingWidth = width;
      let remainingHeight = height;

      for (const item of sortedData) {
        const ratio = item.value / totalValue;
        const area = width * height * ratio;

        let rectWidth: number;
        let rectHeight: number;

        if (remainingWidth > remainingHeight) {
          rectHeight = remainingHeight;
          rectWidth = area / rectHeight;

          rectangles.push({
            x: currentX,
            y: currentY,
            width: Math.max(rectWidth - padding, 0),
            height: Math.max(rectHeight - padding, 0),
            data: item,
          });

          currentX += rectWidth;
          remainingWidth -= rectWidth;
        } else {
          rectWidth = remainingWidth;
          rectHeight = area / rectWidth;

          rectangles.push({
            x: currentX,
            y: currentY,
            width: Math.max(rectWidth - padding, 0),
            height: Math.max(rectHeight - padding, 0),
            data: item,
          });

          currentY += rectHeight;
          remainingHeight -= rectHeight;
        }
      }

      return rectangles;
    };

    return squarify(data, 0, 0, width, height);
  }, [data, width, height, padding]);

  const getColor = (index: number, item: TreemapData) => {
    if (item.color) return item.color;

    const colors = colorPalettes[colorScheme];
    if (colorScheme === 'categorical') {
      return colors[index % colors.length];
    }

    // For gradient schemes, use value-based coloring
    const maxValue = Math.max(...data.map(d => d.value));
    const normalized = item.value / maxValue;
    const colorIndex = Math.floor(normalized * (colors.length - 1));
    return colors[Math.max(0, Math.min(colorIndex, colors.length - 1))];
  };

  const getFontSize = (width: number, height: number, textLength: number) => {
    const area = width * height;
    const baseSize = Math.sqrt(area) / 6;
    const adjusted = Math.max(minFontSize, Math.min(maxFontSize, baseSize * (20 / textLength)));
    return Math.floor(adjusted);
  };

  const formatValue = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}
    >
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{title}</h3>
      )}

      <div className="flex justify-center">
        <svg
          width={width}
          height={height}
          className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden"
        >
          {rectangles.map((rect, index) => {
            const fontSize = getFontSize(rect.width, rect.height, rect.data.label.length);
            const textColor = actualTheme === 'dark' ? '#ffffff' : '#000000';
            const showText = rect.width > 30 && rect.height > 20;

            return (
              <g key={rect.data.id}>
                <motion.rect
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  whileHover={{
                    opacity: 0.8,
                    transition: { duration: 0.2 },
                  }}
                  x={rect.x}
                  y={rect.y}
                  width={rect.width}
                  height={rect.height}
                  fill={getColor(index, rect.data)}
                  stroke={actualTheme === 'dark' ? '#374151' : '#e5e7eb'}
                  strokeWidth={1}
                  className="cursor-pointer"
                />

                {showText && (
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 + 0.3, duration: 0.3 }}
                  >
                    <text
                      x={rect.x + rect.width / 2}
                      y={rect.y + rect.height / 2 - fontSize / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={fontSize}
                      fontWeight="600"
                      fill={textColor}
                      className="pointer-events-none select-none"
                    >
                      {rect.data.label.length > 15
                        ? `${rect.data.label.substring(0, 12)}...`
                        : rect.data.label}
                    </text>

                    {rect.height > 40 && (
                      <text
                        x={rect.x + rect.width / 2}
                        y={rect.y + rect.height / 2 + fontSize / 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={Math.max(fontSize - 2, minFontSize)}
                        fill={textColor}
                        fillOpacity={0.8}
                        className="pointer-events-none select-none"
                      >
                        {formatValue(rect.data.value)}
                      </text>
                    )}
                  </motion.g>
                )}

                {/* Hover tooltip area */}
                <rect
                  x={rect.x}
                  y={rect.y}
                  width={rect.width}
                  height={rect.height}
                  fill="transparent"
                  className="cursor-pointer"
                >
                  <title>
                    {rect.data.label}: {formatValue(rect.data.value)}
                  </title>
                </rect>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {data.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-2"
            >
              <div className="w-4 h-4 rounded" style={{ backgroundColor: getColor(index, item) }} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {item.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {formatValue(item.value)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
