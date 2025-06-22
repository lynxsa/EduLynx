'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { LucideIcon, Lightbulb, TrendingUp, Target } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
}

interface AIInsightsCardProps {
  title: string;
  tabs: Tab[];
  icon: LucideIcon;
}

export const AIInsightsCard = ({ title, tabs, icon: Icon }: AIInsightsCardProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const insights = {
    insights: [
      {
        icon: TrendingUp,
        title: 'Attendance Improvement',
        description:
          'Mathematics classes show 15% higher attendance when scheduled after lunch break.',
        confidence: 92,
      },
      {
        icon: Target,
        title: 'Performance Correlation',
        description:
          'Students with consistent homework submission score 23% higher on assessments.',
        confidence: 87,
      },
    ],
    predictions: [
      {
        icon: TrendingUp,
        title: 'Q3 Performance Forecast',
        description:
          'Based on current trends, overall class performance is projected to increase by 12%.',
        confidence: 78,
      },
      {
        icon: Target,
        title: 'Dropout Risk Prediction',
        description:
          '3 students are at high risk of dropping out based on attendance and grade patterns.',
        confidence: 85,
      },
    ],
    recommendations: [
      {
        icon: Lightbulb,
        title: 'Optimize Class Scheduling',
        description:
          'Move challenging subjects to mid-morning slots for better student engagement.',
        confidence: 89,
      },
      {
        icon: Target,
        title: 'Targeted Interventions',
        description: 'Implement peer tutoring programs for students scoring below 70%.',
        confidence: 83,
      },
    ],
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 0:
        return insights.insights;
      case 1:
        return insights.predictions;
      case 2:
        return insights.recommendations;
      default:
        return insights.insights;
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200/50 dark:border-purple-700/50 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Icon className="w-5 h-5 mr-2 text-purple-600" />
          {title}
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
          <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
            AI Powered
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white/50 dark:bg-gray-700/50 rounded-lg p-1 mb-6">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(index)}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === index
                ? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* AI Insights Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        {getCurrentData().map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/50 dark:border-gray-700/50 rounded-lg p-4"
          >
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <item.icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                  <div className="flex items-center space-x-1">
                    <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                      {item.confidence}% confidence
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{item.description}</p>

                {/* Confidence Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.confidence}%` }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-1 rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Action Button */}
      <div className="mt-6 text-center">
        <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-medium">
          View Detailed Analysis
        </button>
      </div>
    </div>
  );
};
