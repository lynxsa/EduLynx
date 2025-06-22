'use client';
import { useState } from 'react';
import {
  Folder,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  MoreHorizontal,
} from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold' | 'planning';
  progress: number;
  dueDate: string;
  team: Array<{ name: string; avatar?: string; role: string }>;
  category: 'academic' | 'infrastructure' | 'technology' | 'event';
  priority: 'high' | 'medium' | 'low';
}

interface ProjectsCardProps {
  projects: Project[];
  className?: string;
}

export function ProjectsCard({ projects, className = '' }: ProjectsCardProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'planning':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'academic':
        return '📚';
      case 'infrastructure':
        return '🏗️';
      case 'technology':
        return '💻';
      case 'event':
        return '🎯';
      default:
        return '📁';
    }
  };

  const filteredProjects = projects.filter(project => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return project.status === 'active';
    if (activeTab === 'completed') return project.status === 'completed';
    return true;
  });

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Folder className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Active Projects</h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg bg-gray-100 p-1">
            {(['all', 'active', 'completed'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredProjects.slice(0, 4).map(project => (
          <div
            key={project.id}
            className={`border-l-4 ${getPriorityColor(project.priority)} bg-gray-50 rounded-r-lg p-4 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg">{getCategoryIcon(project.category)}</span>
                  <h4 className="font-medium text-gray-900">{project.title}</h4>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}
                  >
                    {project.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3">{project.description}</p>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(project.dueDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {project.team.length} members
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {project.progress}% complete
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <div className="flex -space-x-2">
                  {project.team.slice(0, 3).map((member, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                      title={`${member.name} - ${member.role}`}
                    >
                      {member.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')}
                    </div>
                  ))}
                  {project.team.length > 3 && (
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white">
                      +{project.team.length - 3}
                    </div>
                  )}
                </div>
                <button className="p-1 hover:bg-gray-200 rounded">
                  <MoreHorizontal className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length > 4 && (
        <div className="mt-4 text-center">
          <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
            View all {filteredProjects.length} projects →
          </button>
        </div>
      )}
    </div>
  );
}
