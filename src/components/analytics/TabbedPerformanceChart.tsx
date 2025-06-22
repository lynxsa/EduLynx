'use client';

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, BarChart3, BookOpen, TrendingUp, Users } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface PerformanceFilter {
  type: 'overall' | 'grade' | 'subject' | 'trends';
  period: 'week' | 'month' | 'semester' | 'year';
  gradeLevel?: string;
  subject?: string;
}

interface PerformanceData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

interface PerformanceTab {
  id: 'overall' | 'grade' | 'subject' | 'trends';
  label: string;
  icon: React.ReactNode;
  description: string;
}

const TabbedPerformanceChart: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PerformanceTab['id']>('overall');
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<PerformanceFilter>({
    type: 'overall',
    period: 'month',
  });

  const tabs: PerformanceTab[] = useMemo(
    () => [
      {
        id: 'overall',
        label: 'Overall Performance',
        icon: <Activity className="w-5 h-5" />,
        description: 'School-wide performance metrics and weighted averages',
      },
      {
        id: 'grade',
        label: 'Grade Performance',
        icon: <Users className="w-5 h-5" />,
        description: 'Performance breakdown by grade level',
      },
      {
        id: 'subject',
        label: 'Subject Performance',
        icon: <BookOpen className="w-5 h-5" />,
        description: 'Subject-wise analysis with teacher correlations',
      },
      {
        id: 'trends',
        label: 'Performance Trends',
        icon: <TrendingUp className="w-5 h-5" />,
        description: 'Month-over-month percentage changes and trends',
      },
    ],
    []
  );

  // Fetch performance data based on active tab and filters
  const fetchPerformanceData = useCallback(
    async (tabType: PerformanceTab['id']) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/analytics/performance?type=${tabType}&period=${filter.period}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch performance data');
        }

        const data = await response.json();

        if (data.success) {
          setPerformanceData(data.data);
        } else {
          throw new Error(data.error || 'Unknown error occurred');
        }
      } catch (err) {
        console.error('Error fetching performance data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
        // Set mock data for demonstration
        setPerformanceData(getMockData(tabType));
      } finally {
        setLoading(false);
      }
    },
    [filter.period]
  );

  // Mock data generator for demonstration
  const getMockData = (tabType: PerformanceTab['id']): PerformanceData => {
    switch (tabType) {
      case 'overall':
        return {
          labels: ['Math', 'Science', 'English', 'History', 'Art'],
          datasets: [
            {
              label: 'Average Score (%)',
              data: [85, 78, 92, 88, 76],
              backgroundColor: 'rgba(59, 130, 246, 0.8)',
              borderColor: 'rgba(59, 130, 246, 1)',
              borderWidth: 2,
            },
          ],
        };
      case 'grade':
        return {
          labels: ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
          datasets: [
            {
              label: 'Average GPA',
              data: [3.2, 3.5, 3.8, 3.6, 3.9],
              backgroundColor: 'rgba(16, 185, 129, 0.8)',
              borderColor: 'rgba(16, 185, 129, 1)',
              borderWidth: 2,
            },
          ],
        };
      case 'subject':
        return {
          labels: ['Mathematics', 'Physical Science', 'Life Sciences', 'English', 'Afrikaans'],
          datasets: [
            {
              label: 'Student Average',
              data: [82, 75, 88, 90, 85],
              backgroundColor: 'rgba(139, 92, 246, 0.8)',
              borderColor: 'rgba(139, 92, 246, 1)',
              borderWidth: 2,
            },
            {
              label: 'National Average',
              data: [78, 72, 85, 87, 82],
              backgroundColor: 'rgba(249, 115, 22, 0.6)',
              borderColor: 'rgba(249, 115, 22, 1)',
              borderWidth: 2,
            },
          ],
        };
      case 'trends':
        return {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Performance Trend (%)',
              data: [78, 82, 85, 83, 87, 89],
              backgroundColor: 'rgba(236, 72, 153, 0.8)',
              borderColor: 'rgba(236, 72, 153, 1)',
              borderWidth: 2,
            },
          ],
        };
      default:
        return { labels: [], datasets: [] };
    }
  };

  useEffect(() => {
    fetchPerformanceData(activeTab);
  }, [activeTab, filter.period, fetchPerformanceData]);

  const handleTabChange = useCallback((tabId: PerformanceTab['id']) => {
    setActiveTab(tabId);
    setFilter(prev => ({ ...prev, type: tabId }));
  }, []);

  const chartOptions: ChartOptions<'bar'> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            font: {
              size: 12,
              weight: 500,
            },
            color: '#374151',
          },
        },
        title: {
          display: true,
          text: tabs.find(tab => tab.id === activeTab)?.label || 'Performance Analytics',
          font: {
            size: 16,
            weight: 600,
          },
          color: '#111827',
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          titleColor: '#F9FAFB',
          bodyColor: '#F9FAFB',
          borderColor: '#374151',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          mode: 'index',
          intersect: false,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 11,
            },
            color: '#6B7280',
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(156, 163, 175, 0.2)',
          },
          ticks: {
            font: {
              size: 11,
            },
            color: '#6B7280',
          },
        },
      },
      onHover: (event, elements) => {
        if (event.native?.target) {
          (event.native.target as HTMLElement).style.cursor =
            elements.length > 0 ? 'pointer' : 'default';
        }
      },
      onClick: (event, elements) => {
        if (elements.length > 0) {
          const element = elements[0];
          const dataIndex = element.index;
          const label = performanceData?.labels[dataIndex];
          console.log(
            `Clicked on: ${label} - Value: ${performanceData?.datasets[0].data[dataIndex]}`
          );
          // Implement drill-down functionality here
        }
      },
    }),
    [activeTab, performanceData?.datasets, performanceData?.labels, tabs]
  );

  const currentTab = useMemo(() => tabs.find(tab => tab.id === activeTab), [activeTab, tabs]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header with tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Performance Analytics
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Comprehensive performance insights and trends
              </p>
            </div>
          </div>

          {/* Period filter */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Period:</span>
            <select
              value={filter.period}
              onChange={e =>
                setFilter(prev => ({
                  ...prev,
                  period: e.target.value as any,
                }))
              }
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="semester">This Semester</option>
              <option value="year">This Year</option>
            </select>
          </div>

          {/* Tab navigation */}
          <div className="flex flex-wrap gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Tab description */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">{currentTab?.description}</p>
            </div>

            {/* Chart area */}
            <div className="relative">
              {loading && (
                <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex items-center justify-center z-10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Loading data...
                    </span>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
              )}

              <div className="h-96 w-full">
                {performanceData && performanceData.labels.length > 0 ? (
                  <Bar data={performanceData} options={chartOptions} />
                ) : (
                  !loading && (
                    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No data available for this period</p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Export options */}
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Export PDF
              </button>
              <button className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Export Excel
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Memoize the component for performance
export default React.memo(TabbedPerformanceChart);
