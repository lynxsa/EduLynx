"use client";
import React from 'react';
import { FolderOpen, Clock, CheckCircle2, AlertCircle, Users } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'in-progress' | 'overdue' | 'planned';
  progress: number;
  dueDate: string;
  teamSize: number;
  priority: 'high' | 'medium' | 'low';
}

interface ProjectsCardProps {
  projects?: Project[];
}

const ProjectsCard = ({ projects = [] }: ProjectsCardProps) => {
  // Mock data for South African context
  const mockProjects: Project[] = [
    {
      id: '1',
      name: 'Heritage Day Celebration',
      description: 'Annual cultural celebration event',
      status: 'in-progress',
      progress: 75,
      dueDate: '2025-09-24',
      teamSize: 12,
      priority: 'high'
    },
    {
      id: '2',
      name: 'Digital Learning Platform',
      description: 'Online education system upgrade',
      status: 'in-progress',
      progress: 60,
      dueDate: '2025-07-15',
      teamSize: 8,
      priority: 'high'
    },
    {
      id: '3',
      name: 'Sports Day 2025',
      description: 'Inter-house athletic competition',
      status: 'planned',
      progress: 25,
      dueDate: '2025-08-30',
      teamSize: 15,
      priority: 'medium'
    },
    {
      id: '4',
      name: 'Matric Farewell',
      description: 'Grade 12 graduation ceremony',
      status: 'completed',
      progress: 100,
      dueDate: '2025-06-10',
      teamSize: 6,
      priority: 'medium'
    }
  ];

  const displayProjects = projects.length > 0 ? projects : mockProjects;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'planned':
        return <FolderOpen className="w-4 h-4 text-gray-500" />;
      default:
        return <FolderOpen className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700';
      case 'overdue':
        return 'bg-red-100 text-red-700';
      case 'planned':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityIndicator = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Active Projects</h2>
          <p className="text-sm text-gray-600">School initiatives & events</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500 font-medium">
            {displayProjects.filter(p => p.status === 'in-progress').length} Active
          </span>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {displayProjects.slice(0, 4).map((project) => (
          <div key={project.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3">
                {getStatusIcon(project.status)}
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{project.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{project.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getPriorityIndicator(project.priority)}`}></div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                  {project.status.replace('-', ' ')}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">Progress</span>
                <span className="text-xs font-medium text-gray-700">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Project Details */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>{project.teamSize} members</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(project.dueDate).toLocaleDateString('en-ZA')}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-green-600">
              {displayProjects.filter(p => p.status === 'completed').length}
            </div>
            <div className="text-xs text-gray-500">Completed</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-blue-600">
              {displayProjects.filter(p => p.status === 'in-progress').length}
            </div>
            <div className="text-xs text-gray-500">In Progress</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-600">
              {displayProjects.filter(p => p.status === 'planned').length}
            </div>
            <div className="text-xs text-gray-500">Planned</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsCard;
