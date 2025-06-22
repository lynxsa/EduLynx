'use client';
import React from 'react';
import {
  Settings,
  HelpCircle,
  Bell,
  FileText,
  Users,
  Calendar,
  BarChart3,
  MessageSquare,
} from 'lucide-react';

interface UtilityIconsProps {
  onIconClick?: (iconName: string) => void;
}

const UtilityIcons = ({ onIconClick }: UtilityIconsProps) => {
  const utilityItems = [
    {
      name: 'Settings',
      icon: Settings,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      hoverColor: 'hover:bg-gray-200',
    },
    {
      name: 'Help',
      icon: HelpCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      hoverColor: 'hover:bg-blue-200',
    },
    {
      name: 'Notifications',
      icon: Bell,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      hoverColor: 'hover:bg-yellow-200',
    },
    {
      name: 'Reports',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      hoverColor: 'hover:bg-green-200',
    },
    {
      name: 'Staff',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      hoverColor: 'hover:bg-purple-200',
    },
    {
      name: 'Schedule',
      icon: Calendar,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      hoverColor: 'hover:bg-indigo-200',
    },
    {
      name: 'Analytics',
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      hoverColor: 'hover:bg-orange-200',
    },
    {
      name: 'Messages',
      icon: MessageSquare,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      hoverColor: 'hover:bg-pink-200',
    },
  ];

  const handleClick = (iconName: string) => {
    onIconClick?.(iconName);
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">Quick Actions</h3>
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {utilityItems.map(item => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.name}
              onClick={() => handleClick(item.name)}
              className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 ${item.bgColor} ${item.hoverColor} hover:scale-105 group`}
              title={item.name}
            >
              <IconComponent
                className={`w-5 h-5 ${item.color} group-hover:scale-110 transition-transform duration-200`}
              />
              <span className="text-xs text-gray-600 mt-1 font-medium">{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default UtilityIcons;
