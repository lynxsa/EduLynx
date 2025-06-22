import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Award,
  BarChart3,
  Brain,
  Calendar,
  CheckCircle,
  Lightbulb,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface InsightData {
  overallInsights: {
    performanceSummary: string;
    attendanceTrend: string;
    engagementLevel: string;
    keyAchievements: string[];
    areasForImprovement: string[];
  };
  projections: {
    performanceProjection: {
      current: number;
      projected: number;
      timeline: string;
    };
    attendanceProjection: {
      current: number;
      projected: number;
      timeline: string;
    };
    engagementProjection: {
      current: number;
      projected: number;
      timeline: string;
    };
    riskAreas: string[];
    opportunityAreas: string[];
  };
  suggestions: {
    immediate: Array<{
      title: string;
      description: string;
      priority: 'high' | 'medium' | 'low';
      category: string;
    }>;
    longTerm: Array<{
      title: string;
      description: string;
      priority: 'high' | 'medium' | 'low';
      category: string;
    }>;
  };
}

interface InsightsCardProps {
  data?: InsightData;
  userRole: 'ADMIN' | 'TEACHER' | 'PARENT' | 'STUDENT';
  className?: string;
}

const InsightsCard: React.FC<InsightsCardProps> = ({ data, userRole, className = '' }) => {
  const [activeTab, setActiveTab] = useState('insights');
  const [insights, setInsights] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        // For now, we'll use mock data based on user role
        // In production, this would call a real API endpoint
        const mockData = generateMockInsights(userRole);
        setInsights(mockData);
      } catch (error) {
        console.error('Failed to fetch insights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [userRole]);

  const generateMockInsights = (role: string): InsightData => {
    const baseInsights = {
      overallInsights: {
        performanceSummary: 'Overall performance is strong with consistent improvement trends',
        attendanceTrend: 'Attendance rates are above average with steady growth',
        engagementLevel: 'High engagement levels across all activities',
        keyAchievements: [
          '98% assignment completion rate',
          '15% improvement in test scores',
          'Excellent parent-teacher engagement',
        ],
        areasForImprovement: [
          'Math performance needs attention',
          'Late submission rates',
          'Extracurricular participation',
        ],
      },
      projections: {
        performanceProjection: {
          current: 85,
          projected: 92,
          timeline: 'End of semester',
        },
        attendanceProjection: {
          current: 94,
          projected: 96,
          timeline: 'Next month',
        },
        engagementProjection: {
          current: 88,
          projected: 90,
          timeline: 'End of quarter',
        },
        riskAreas: [
          'Potential burnout in advanced classes',
          'Declining participation in optional activities',
        ],
        opportunityAreas: [
          'STEM program expansion potential',
          'Leadership development opportunities',
        ],
      },
      suggestions: {
        immediate: [
          {
            title: 'Implement peer tutoring',
            description: 'Set up peer tutoring sessions for struggling students',
            priority: 'high' as const,
            category: 'Academic Support',
          },
          {
            title: 'Update communication channels',
            description: 'Improve parent-teacher communication frequency',
            priority: 'medium' as const,
            category: 'Communication',
          },
        ],
        longTerm: [
          {
            title: 'Technology integration',
            description: 'Integrate more interactive learning technologies',
            priority: 'high' as const,
            category: 'Innovation',
          },
          {
            title: 'Wellness program',
            description: 'Develop comprehensive student wellness program',
            priority: 'medium' as const,
            category: 'Well-being',
          },
        ],
      },
    };

    // Customize based on role
    switch (role) {
      case 'ADMIN':
        return {
          ...baseInsights,
          overallInsights: {
            ...baseInsights.overallInsights,
            performanceSummary:
              'School-wide performance metrics show positive trends across all departments',
            keyAchievements: [
              'System-wide efficiency improved by 22%',
              'Teacher satisfaction increased by 18%',
              'Student enrollment grew by 12%',
            ],
          },
        };
      case 'TEACHER':
        return {
          ...baseInsights,
          overallInsights: {
            ...baseInsights.overallInsights,
            performanceSummary: 'Your classes are performing exceptionally well this semester',
            keyAchievements: [
              '95% student engagement in your classes',
              'Top-rated teacher by student feedback',
              'Innovative teaching methods implementation',
            ],
          },
        };
      case 'PARENT':
        return {
          ...baseInsights,
          overallInsights: {
            ...baseInsights.overallInsights,
            performanceSummary: 'Your child is showing consistent academic progress',
            keyAchievements: [
              'Improved grades in core subjects',
              'Active participation in class discussions',
              'Strong social skills development',
            ],
          },
        };
      case 'STUDENT':
        return {
          ...baseInsights,
          overallInsights: {
            ...baseInsights.overallInsights,
            performanceSummary: "You're making excellent progress across all subjects",
            keyAchievements: [
              'Consistent assignment completion',
              'Improved test performance',
              'Active participation in extracurriculars',
            ],
          },
        };
      default:
        return baseInsights;
    }
  };

  const tabs = [
    {
      id: 'insights',
      label: 'Overall Insights',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: 'projections',
      label: 'Projections Analysis',
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      id: 'suggestions',
      label: 'Suggestions',
      icon: <Lightbulb className="w-4 h-4" />,
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const renderOverallInsights = () => (
    <div className="space-y-6">
      {/* Performance Summary */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
        <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Performance Summary
        </h4>
        <p className="text-blue-800 dark:text-blue-300 text-sm">
          {insights?.overallInsights.performanceSummary}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Achievements */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-green-500" />
            Key Achievements
          </h4>
          <div className="space-y-2">
            {insights?.overallInsights.keyAchievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                <span>{achievement}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Areas for Improvement */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-orange-500" />
            Areas for Improvement
          </h4>
          <div className="space-y-2">
            {insights?.overallInsights.areasForImprovement.map((area, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <AlertTriangle className="w-3 h-3 text-orange-500 flex-shrink-0" />
                <span>{area}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProjections = () => (
    <div className="space-y-6">
      {/* Projection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            title: 'Performance',
            ...insights?.projections.performanceProjection,
            color: 'blue',
            icon: <BarChart3 className="w-4 h-4" />,
          },
          {
            title: 'Attendance',
            ...insights?.projections.attendanceProjection,
            color: 'green',
            icon: <Users className="w-4 h-4" />,
          },
          {
            title: 'Engagement',
            ...insights?.projections.engagementProjection,
            color: 'purple',
            icon: <Brain className="w-4 h-4" />,
          },
        ].map((projection, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
              bg-${projection.color}-50 dark:bg-${projection.color}-900/20 
              rounded-xl p-4 border border-${projection.color}-200 dark:border-${projection.color}-800
            `}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`p-1 bg-${projection.color}-100 dark:bg-${projection.color}-900/40 rounded`}
              >
                {projection.icon}
              </div>
              <span
                className={`font-medium text-${projection.color}-900 dark:text-${projection.color}-200`}
              >
                {projection.title}
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Current</span>
                <span className="font-semibold">{projection.current}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Projected</span>
                <span className="font-semibold text-green-600">{projection.projected}%</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Timeline: {projection.timeline}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Risk and Opportunity Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
          <h4 className="font-semibold text-red-900 dark:text-red-200 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Risk Areas
          </h4>
          <div className="space-y-2">
            {insights?.projections.riskAreas.map((risk, index) => (
              <div key={index} className="text-sm text-red-800 dark:text-red-300">
                • {risk}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
          <h4 className="font-semibold text-green-900 dark:text-green-200 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Opportunity Areas
          </h4>
          <div className="space-y-2">
            {insights?.projections.opportunityAreas.map((opportunity, index) => (
              <div key={index} className="text-sm text-green-800 dark:text-green-300">
                • {opportunity}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSuggestions = () => (
    <div className="space-y-6">
      {/* Immediate Actions */}
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-orange-500" />
          Immediate Actions
        </h4>
        <div className="space-y-3">
          {insights?.suggestions.immediate.map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="font-medium text-gray-900 dark:text-white">
                      {suggestion.title}
                    </h5>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(
                        suggestion.priority
                      )}`}
                    >
                      {suggestion.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {suggestion.description}
                  </p>
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    {suggestion.category}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 mt-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Long-term Actions */}
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-purple-500" />
          Long-term Strategy
        </h4>
        <div className="space-y-3">
          {insights?.suggestions.longTerm.map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="font-medium text-gray-900 dark:text-white">
                      {suggestion.title}
                    </h5>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(
                        suggestion.priority
                      )}`}
                    >
                      {suggestion.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {suggestion.description}
                  </p>
                  <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                    {suggestion.category}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 mt-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div
        className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}
      >
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700
        ${className}
      `}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                AI-Powered Analytics
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Intelligent insights and recommendations
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">LIVE AI</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 pt-6">
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-md transition-all
                ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'insights' && renderOverallInsights()}
            {activeTab === 'projections' && renderProjections()}
            {activeTab === 'suggestions' && renderSuggestions()}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default InsightsCard;
