'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  ClipboardList,
  BarChart3,
  MessageSquare,
  Settings,
  User,
  School,
  DollarSign,
  FileText,
  Clock,
  Award,
  Bell,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  roles: string[];
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    href: '/',
    roles: ['admin', 'teacher', 'parent', 'student'],
  },
  {
    id: 'academic',
    label: 'Academic',
    icon: BookOpen,
    roles: ['admin', 'teacher', 'parent', 'student'],
    children: [
      {
        id: 'classes',
        label: 'Classes',
        icon: School,
        href: '/list/classes',
        roles: ['admin', 'teacher', 'parent', 'student'],
      },
      {
        id: 'subjects',
        label: 'Subjects',
        icon: BookOpen,
        href: '/list/subjects',
        roles: ['admin', 'teacher', 'parent', 'student'],
      },
      {
        id: 'lessons',
        label: 'Lessons',
        icon: Clock,
        href: '/list/lessons',
        roles: ['admin', 'teacher', 'parent', 'student'],
      },
      {
        id: 'timetable',
        label: 'Timetable',
        icon: Calendar,
        href: '/student/timetable',
        roles: ['admin', 'teacher', 'parent', 'student'],
      },
    ],
  },
  {
    id: 'people',
    label: 'People',
    icon: Users,
    roles: ['admin', 'teacher'],
    children: [
      {
        id: 'students',
        label: 'Students',
        icon: GraduationCap,
        href: '/list/students',
        roles: ['admin', 'teacher'],
      },
      {
        id: 'teachers',
        label: 'Teachers',
        icon: User,
        href: '/list/teachers',
        roles: ['admin'],
      },
      {
        id: 'parents',
        label: 'Parents',
        icon: Users,
        href: '/list/parents',
        roles: ['admin', 'teacher'],
      },
    ],
  },
  {
    id: 'assessments',
    label: 'Assessments',
    icon: ClipboardList,
    roles: ['admin', 'teacher', 'parent', 'student'],
    children: [
      {
        id: 'assignments',
        label: 'Assignments',
        icon: ClipboardList,
        href: '/list/assignments',
        roles: ['admin', 'teacher', 'parent', 'student'],
      },
      {
        id: 'quizzes',
        label: 'Quizzes',
        icon: FileText,
        href: '/list/quizzes',
        roles: ['admin', 'teacher', 'parent', 'student'],
      },
      {
        id: 'exams',
        label: 'Exams',
        icon: Award,
        href: '/list/exams',
        roles: ['admin', 'teacher', 'parent', 'student'],
      },
      {
        id: 'results',
        label: 'Results',
        icon: BarChart3,
        href: '/list/results',
        roles: ['admin', 'teacher', 'parent', 'student'],
      },
    ],
  },
  {
    id: 'attendance',
    label: 'Attendance',
    icon: Clock,
    href: '/list/attendance',
    roles: ['admin', 'teacher', 'parent', 'student'],
  },
  {
    id: 'communication',
    label: 'Communication',
    icon: MessageSquare,
    roles: ['admin', 'teacher', 'parent', 'student'],
    children: [
      {
        id: 'messages',
        label: 'Messages',
        icon: MessageSquare,
        href: '/list/messages',
        roles: ['admin', 'teacher', 'parent', 'student'],
      },
      {
        id: 'announcements',
        label: 'Announcements',
        icon: Bell,
        href: '/list/announcements',
        roles: ['admin', 'teacher', 'parent', 'student'],
      },
    ],
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: DollarSign,
    href: '/finance',
    roles: ['admin', 'parent'],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart3,
    href: '/performance',
    roles: ['admin', 'teacher'],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/dashboard/settings',
    roles: ['admin', 'teacher', 'parent', 'student'],
  },
];

interface SidebarProps {
  userRole: string;
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ userRole, isCollapsed, onToggle }) => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const hasAccess = (item: MenuItem) => {
    return item.roles.includes(userRole.toLowerCase()) || item.roles.includes('all');
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || (href !== '/' && pathname.startsWith(href));
  };

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    if (!hasAccess(item)) return null;

    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const ItemIcon = item.icon;

    if (hasChildren) {
      return (
        <div key={item.id} className="mb-1">
          <button
            onClick={() => toggleExpanded(item.id)}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              depth > 0 ? 'ml-4' : ''
            } hover:bg-primary/10 text-muted-foreground hover:text-primary`}
          >
            <div className="flex items-center">
              <ItemIcon className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'} mr-3`} />
              {!isCollapsed && <span>{item.label}</span>}
            </div>
            {!isCollapsed &&
              (isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              ))}
          </button>
          {!isCollapsed && isExpanded && (
            <div className="mt-1 space-y-1">
              {item.children?.map(child => renderMenuItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.id}
        href={item.href || '#'}
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 mb-1 ${
          depth > 0 ? 'ml-4' : ''
        } ${
          isActive(item.href)
            ? 'bg-primary text-white'
            : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
        }`}
      >
        <ItemIcon className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'} mr-3`} />
        {!isCollapsed && <span>{item.label}</span>}
      </Link>
    );
  };

  return (
    <div
      className={`${isCollapsed ? 'w-16' : 'w-64'} h-screen bg-card border-r border-border flex flex-col transition-all duration-300 ease-in-out`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <img
              src="/edulynx-logo.png"
              alt="EduLynx Logo"
              className="w-8 h-8"
              onError={e => {
                e.currentTarget.src = '/logo.png';
              }}
            />
            <span className="text-lg font-bold text-primary">EduLynx</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary"
        >
          {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">{menuItems.map(item => renderMenuItem(item))}</div>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground text-center">
            <p>EduLynx v1.0</p>
            <p>© 2025 LYNX Consulting</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
