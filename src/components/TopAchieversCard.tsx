"use client";
import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';

interface TopAchiever {
  id: string;
  name: string;
  surname: string;
  grade: string;
  averageScore: number;
  rank: number;
}

interface TopAchieversCardProps {
  achievers?: TopAchiever[];
}

const TopAchieversCard = ({ achievers = [] }: TopAchieversCardProps) => {
  // Mock data if no achievers provided
  const mockAchievers: TopAchiever[] = [
    { id: '1', name: 'Thabo', surname: 'Mthembu', grade: 'Grade 12', averageScore: 94.5, rank: 1 },
    { id: '2', name: 'Nomsa', surname: 'Van Der Merwe', grade: 'Grade 11', averageScore: 92.8, rank: 2 },
    { id: '3', name: 'Sipho', surname: 'Nkomo', grade: 'Grade 10', averageScore: 91.2, rank: 3 },
    { id: '4', name: 'Lerato', surname: 'Botha', grade: 'Grade 9', averageScore: 89.6, rank: 4 },
    { id: '5', name: 'Mandla', surname: 'Dlamini', grade: 'Grade 8', averageScore: 88.1, rank: 5 },
  ];

  const displayAchievers = achievers.length > 0 ? achievers : mockAchievers;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 2:
        return <Medal className="w-4 h-4 text-gray-400" />;
      case 3:
        return <Award className="w-4 h-4 text-amber-600" />;
      default:
        return <div className="w-4 h-4 flex items-center justify-center text-xs font-bold text-gray-500">{rank}</div>;
    }
  };

  const getIndicatorColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Top Achievers</h2>
          <p className="text-sm text-gray-600">Per grade level</p>
        </div>
        <div className="relative">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-100 rounded-full animate-ping"></div>
        </div>
      </div>

      {/* Achievers List */}
      <div className="space-y-3">
        {displayAchievers.slice(0, 5).map((achiever, index) => (
          <div key={achiever.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <div className="flex items-center space-x-3">
              {getRankIcon(achiever.rank)}
              <div>
                <div className="font-medium text-gray-900 text-sm">
                  {achiever.name} {achiever.surname}
                </div>
                <div className="text-xs text-gray-500">{achiever.grade}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-gray-700">
                {achiever.averageScore.toFixed(1)}%
              </span>
              <div className={`w-2 h-2 rounded-full ${getIndicatorColor(achiever.averageScore)}`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Average: {(displayAchievers.reduce((sum, a) => sum + a.averageScore, 0) / displayAchievers.length).toFixed(1)}%
        </div>
      </div>
    </div>
  );
};

export default TopAchieversCard;
