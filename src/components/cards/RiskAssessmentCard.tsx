'use client';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingDown } from 'lucide-react';

interface RiskAssessmentCardProps {
  title: string;
}

export const RiskAssessmentCard = ({ title }: RiskAssessmentCardProps) => {
  const riskStudents = [
    { name: 'Alex Johnson', risk: 'High', attendance: 65, grade: 'C-', alerts: 3 },
    { name: 'Maria Garcia', risk: 'Medium', attendance: 78, grade: 'C+', alerts: 2 },
    { name: 'Kevin Lee', risk: 'Medium', attendance: 72, grade: 'B-', alerts: 1 },
    { name: 'Sarah Thompson', risk: 'Low', attendance: 85, grade: 'B+', alerts: 1 },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
          {title}
        </h3>
        <TrendingDown className="w-5 h-5 text-red-500" />
      </div>

      <div className="space-y-4">
        {riskStudents.map((student, index) => (
          <motion.div
            key={student.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900 dark:text-white">{student.name}</h4>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(student.risk)}`}
              >
                {student.risk} Risk
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Attendance:</span>
                <div className="font-medium text-gray-900 dark:text-white">
                  {student.attendance}%
                </div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Grade:</span>
                <div className="font-medium text-gray-900 dark:text-white">{student.grade}</div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Alerts:</span>
                <div className="font-medium text-red-600">{student.alerts}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p className="text-xs text-red-700 dark:text-red-400 font-medium">
          {riskStudents.filter(s => s.risk === 'High').length} students require immediate attention
        </p>
      </div>
    </div>
  );
};
