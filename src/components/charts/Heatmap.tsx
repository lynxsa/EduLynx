'use client';

import { useTheme } from '@/styles/theme';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface HeatmapData {
  x: string;
  y: string;
  value: number;
  label?: string;
}

interface HeatmapProps {
  data: HeatmapData[];
  title?: string;
  className?: string;
  colorScheme?: 'blue' | 'green' | 'red' | 'purple' | 'orange';
  showLabels?: boolean;
  cellSize?: number;
  gap?: number;
}

const colorSchemes = {
  blue: {
    light: ['#dbeafe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8'],
    dark: ['#1e3a8a', '#1e40af', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'],
  },
  green: {
    light: ['#dcfce7', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d'],
    dark: ['#14532d', '#166534', '#16a34a', '#22c55e', '#4ade80', '#86efac'],
  },
  red: {
    light: ['#fee2e2', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c'],
    dark: ['#7f1d1d', '#991b1b', '#dc2626', '#ef4444', '#f87171', '#fca5a5'],
  },
  purple: {
    light: ['#f3e8ff', '#c4b5fd', '#a78bfa', '#8b5cf6', '#7c3aed', '#6d28d9'],
    dark: ['#581c87', '#6b21a8', '#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd'],
  },
  orange: {
    light: ['#fed7aa', '#fdba74', '#fb923c', '#f97316', '#ea580c', '#dc2626'],
    dark: ['#9a3412', '#c2410c', '#ea580c', '#f97316', '#fb923c', '#fdba74'],
  },
};

export function Heatmap({
  data,
  title,
  className = '',
  colorScheme = 'blue',
  showLabels = true,
  cellSize = 40,
  gap = 2,
}: HeatmapProps) {
  const { actualTheme } = useTheme();

  const { processedData, xLabels, yLabels, minValue, maxValue } = useMemo(() => {
    const xLabels = Array.from(new Set(data.map(d => d.x))).sort();
    const yLabels = Array.from(new Set(data.map(d => d.y))).sort();
    const values = data.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    const processedData = yLabels.map(y =>
      xLabels.map(x => {
        const item = data.find(d => d.x === x && d.y === y);
        return item || { x, y, value: 0 };
      })
    );

    return { processedData, xLabels, yLabels, minValue, maxValue };
  }, [data]);

  const getColorForValue = (value: number) => {
    const colors = colorSchemes[colorScheme][actualTheme];
    const normalized = (value - minValue) / (maxValue - minValue);
    const colorIndex = Math.floor(normalized * (colors.length - 1));
    return colors[Math.max(0, Math.min(colorIndex, colors.length - 1))];
  };

  const formatValue = (value: number) => {
    if (value === 0) return '0';
    if (value < 1) return value.toFixed(2);
    if (value < 100) return value.toFixed(1);
    return Math.round(value).toString();
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}
    >
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{title}</h3>
      )}

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Y-axis labels */}
          <div className="flex">
            <div className="flex flex-col justify-end mr-2">
              {yLabels.map((label, index) => (
                <div
                  key={label}
                  className="text-xs text-gray-600 dark:text-gray-400 text-right pr-2"
                  style={{
                    height: cellSize + gap,
                    lineHeight: `${cellSize}px`,
                    marginBottom: index < yLabels.length - 1 ? gap : 0,
                  }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            <div>
              {/* X-axis labels */}
              <div className="flex mb-2">
                {xLabels.map(label => (
                  <div
                    key={label}
                    className="text-xs text-gray-600 dark:text-gray-400 text-center"
                    style={{
                      width: cellSize,
                      marginRight: gap,
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>

              {/* Heatmap cells */}
              <div className="space-y-0">
                {processedData.map((row, rowIndex) => (
                  <div key={yLabels[rowIndex]} className="flex">
                    {row.map((cell, colIndex) => (
                      <motion.div
                        key={`${cell.x}-${cell.y}`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          delay: (rowIndex * xLabels.length + colIndex) * 0.02,
                          duration: 0.3,
                        }}
                        whileHover={{
                          scale: 1.1,
                          zIndex: 10,
                          transition: { duration: 0.2 },
                        }}
                        className="relative group cursor-pointer"
                        style={{
                          width: cellSize,
                          height: cellSize,
                          marginRight: colIndex < row.length - 1 ? gap : 0,
                          marginBottom: rowIndex < processedData.length - 1 ? gap : 0,
                          backgroundColor: getColorForValue(cell.value),
                          borderRadius: 4,
                        }}
                      >
                        {/* Cell value label */}
                        {showLabels && cell.value > 0 && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span
                              className="text-xs font-medium"
                              style={{
                                color: cell.value > maxValue / 2 ? '#ffffff' : '#000000',
                                textShadow:
                                  cell.value > maxValue / 2 ? '0 1px 2px rgba(0,0,0,0.3)' : 'none',
                              }}
                            >
                              {formatValue(cell.value)}
                            </span>
                          </div>
                        )}

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                          <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg px-2 py-1 whitespace-nowrap">
                            <div className="font-medium">
                              {cell.x} × {cell.y}
                            </div>
                            <div>Value: {formatValue(cell.value)}</div>
                            {cell.label && <div>{cell.label}</div>}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {formatValue(minValue)}
              </span>
              <div className="flex space-x-1">
                {colorSchemes[colorScheme][actualTheme].map((color, index) => (
                  <div key={index} className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
                ))}
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {formatValue(maxValue)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
