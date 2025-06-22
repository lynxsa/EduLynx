import React from 'react';
import { Bot, Sparkles, BarChart3, Users, BookOpen, TrendingUp } from 'lucide-react';
import ProfLynx from '@/components/ProfLynx';

const ProfLynxPage = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-full">
            <Bot className="w-12 h-12 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Prof Lynx AI Assistant</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your intelligent educational companion for analytics, insights, and data-driven
            decisions
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <BarChart3 className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Insights</h3>
          <p className="text-gray-600">
            Get real-time analytics and performance insights across all educational metrics
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Student Analysis</h3>
          <p className="text-gray-600">
            Analyze student performance patterns and identify areas for improvement
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Academic Planning</h3>
          <p className="text-gray-600">
            Smart recommendations for curriculum planning and resource allocation
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Trend Prediction</h3>
          <p className="text-gray-600">
            Predictive analytics to forecast enrollment, performance, and resource needs
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Recommendations</h3>
          <p className="text-gray-600">
            AI-powered suggestions for improving educational outcomes and efficiency
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="bg-pink-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Bot className="w-6 h-6 text-pink-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Assistance</h3>
          <p className="text-gray-600">
            Always available to answer questions and provide educational insights
          </p>
        </div>
      </div>

      {/* How to Use Section */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How to Use Prof Lynx</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">1</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Click the Prof Lynx Button</h3>
            <p className="text-gray-600">
              Look for the floating Prof Lynx button in the bottom-right corner of any page
            </p>
          </div>
          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">2</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Ask Your Question</h3>
            <p className="text-gray-600">
              Type your question about analytics, performance, or any educational data
            </p>
          </div>
          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">3</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Get Intelligent Insights</h3>
            <p className="text-gray-600">
              Receive AI-powered analysis and recommendations based on your data
            </p>
          </div>
        </div>
      </div>

      {/* Sample Questions */}
      {/* eslint-disable react/no-unescaped-entities */}
      <div className="bg-gray-50 p-8 rounded-xl max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Sample Questions to Ask
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-gray-700 italic">What are the current attendance trends?</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-gray-700 italic">Which subjects need improvement?</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-gray-700 italic">Show me the top performing students</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-gray-700 italic">What is our financial performance this month?</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-gray-700 italic">How can we improve student engagement?</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-gray-700 italic">Generate a performance summary report</p>
          </div>
        </div>
      </div>
      {/* eslint-enable react/no-unescaped-entities */}

      {/* CTA Section */}
      <div className="text-center py-8">
        <p className="text-lg text-gray-600 mb-4">
          Ready to get started? Prof Lynx is available on every page!
        </p>
        <p className="text-sm text-gray-500">
          Look for the floating Prof Lynx button in the bottom-right corner
        </p>
      </div>
    </div>
  );
};

export default ProfLynxPage;
