import { motion } from 'framer-motion';
import { BarChart3, FileText, TrendingUp, Users } from 'lucide-react';
import React from 'react';

interface SubjectPerformanceData {
  subjectName: string;
  averageScore: number;
  studentCount: number;
  assessmentCount: number;
  passRate: number;
}

interface SubjectPerformanceBarChartProps {
  data: SubjectPerformanceData[];
  className?: string;
}

const SubjectPerformanceBarChart: React.FC<SubjectPerformanceBarChartProps> = ({
  data,
  className = '',
}) => {
  const maxScore = Math.max(...data.map(d => d.averageScore), 100);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 70) return 'bg-blue-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 85) return 'text-green-700 dark:text-green-300';
    if (score >= 70) return 'text-blue-700 dark:text-blue-300';
    if (score >= 60) return 'text-yellow-700 dark:text-yellow-300';
    return 'text-red-700 dark:text-red-300';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {data.length === 0 ? (
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 dark:text-gray-400">No subject data available</p>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Performance by Subject
            </h4>
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Live Data
            </div>
          </div>

          {/* Chart */}
          <div className="space-y-4">
            {data.map((subject, index) => (
              <motion.div
                key={subject.subjectName}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                {/* Subject Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {subject.subjectName}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {subject.studentCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {subject.assessmentCount}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${getScoreTextColor(subject.averageScore)}`}>
                      {subject.averageScore}%
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {subject.passRate}% pass rate
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(subject.averageScore / maxScore) * 100}%`,
                      }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
                      className={`${getScoreColor(
                        subject.averageScore
                      )} h-3 rounded-full relative overflow-hidden`}
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    </motion.div>
                  </div>

                  {/* Performance indicator */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 flex items-center gap-1"
                    style={{
                      left: `${Math.min((subject.averageScore / maxScore) * 100, 95)}%`,
                    }}
                  >
                    {subject.averageScore >= 80 && (
                      <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                </div>

                {/* Subject insights */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                    <span>Avg Score: {subject.averageScore}%</span>
                    <span>Students: {subject.studentCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {subject.averageScore >= 85 && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 rounded-full text-xs font-medium">
                        Excellent
                      </span>
                    )}
                    {subject.averageScore >= 70 && subject.averageScore < 85 && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 rounded-full text-xs font-medium">
                        Good
                      </span>
                    )}
                    {subject.averageScore >= 60 && subject.averageScore < 70 && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 rounded-full text-xs font-medium">
                        Needs Improvement
                      </span>
                    )}
                    {subject.averageScore < 60 && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 rounded-full text-xs font-medium">
                        At Risk
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">{data.length}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Subjects</div>
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">
                  {Math.round(data.reduce((acc, s) => acc + s.averageScore, 0) / data.length)}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Overall Avg</div>
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">
                  {data.reduce((acc, s) => acc + s.studentCount, 0)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Total Students</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SubjectPerformanceBarChart;
