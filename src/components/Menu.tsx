"use client";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { 
    Home, 
    Users, 
    GraduationCap, 
    UserCheck, 
    Heart, 
    BookOpen, 
    School, 
    Calendar, 
    ClipboardCheck, 
    FileText, 
    BarChart3, 
    ChartBar, 
    DollarSign, 
    TrendingUp, 
    Brain, 
    CalendarDays, 
    MessageCircle, 
    Megaphone, 
    User, 
    Settings, 
    LogOut,
    ChevronDown,
    ChevronRight
} from 'lucide-react';
import { useState } from 'react';

interface MenuItem {
    icon: React.ReactNode;
    label: string;
    href: string;
    visible: string[];
}

interface MenuSection {
    title: string;
    items: MenuItem[];
    collapsible?: boolean;
}

const menuItems: MenuSection[] = [
	{
		title: "OVERVIEW",
		items: [
			{
				icon: <Home className="w-5 h-5" />,
				label: "Dashboard",
				href: "/admin",
				visible: ["admin", "teacher", "student", "parent"],
			},
		],
	},
	{
		title: "PEOPLE",
        collapsible: true,
		items: [
			{
				icon: <Users className="w-5 h-5" />,
				label: "Teachers",
				href: "/list/teachers",
				visible: ["admin", "teacher"],
			},
			{
				icon: <GraduationCap className="w-5 h-5" />,
				label: "Students",
				href: "/list/students",
				visible: ["admin", "teacher"],
			},
			{
				icon: <UserCheck className="w-5 h-5" />,
				label: "Parents",
				href: "/list/parents",
				visible: ["admin", "teacher"],
			},
		],
	},
	{
		title: "STUDENT SERVICES",
        collapsible: true,
		items: [
			{
				icon: <Heart className="w-5 h-5" />,
				label: "Student Health",
				href: "/list/health",
				visible: ["admin", "teacher"],
			},
		],
	},
	{
		title: "ACADEMICS",
        collapsible: true,
		items: [
			{
				icon: <BookOpen className="w-5 h-5" />,
				label: "Subjects",
				href: "/list/subjects",
				visible: ["admin"],
			},
			{
				icon: <School className="w-5 h-5" />,
				label: "Classes",
				href: "/list/classes",
				visible: ["admin", "teacher"],
			},
			{
				icon: <Calendar className="w-5 h-5" />,
				label: "Lessons",
				href: "/list/lessons",
				visible: ["admin", "teacher"],
			},
			{
				icon: <ClipboardCheck className="w-5 h-5" />,
				label: "Exams",
				href: "/list/exams",
				visible: ["admin", "teacher", "student", "parent"],
			},
			{
				icon: <FileText className="w-5 h-5" />,
				label: "Assignments",
				href: "/list/assignments",
				visible: ["admin", "teacher", "student", "parent"],
			},
			{
				icon: <BarChart3 className="w-5 h-5" />,
				label: "Results",
				href: "/list/results",
				visible: ["admin", "teacher", "student", "parent"],
			},
			{
				icon: <ChartBar className="w-5 h-5" />,
				label: "Attendance",
				href: "/list/attendance",
				visible: ["admin", "teacher", "student", "parent"],
			},
		],
	},
	{
		title: "FINANCE",
		items: [
			{
				icon: <DollarSign className="w-5 h-5" />,
				label: "Finance",
				href: "/dashboard/finance",
				visible: ["admin"],
			},
		],
	},
	{
		title: "INSIGHTS",
        collapsible: true,
		items: [
			{
				icon: <TrendingUp className="w-5 h-5" />,
				label: "Performance Insights",
				href: "/dashboard/performance",
				visible: ["admin", "teacher"],
			},
			{
				icon: <Brain className="w-5 h-5" />,
				label: "ProfLynx AI",
				href: "/dashboard/proflynx",
				visible: ["admin", "teacher", "parent", "student"],
			},
		],
	},
	{
		title: "COMMUNICATION",
        collapsible: true,
		items: [
			{
				icon: <CalendarDays className="w-5 h-5" />,
				label: "Events",
				href: "/list/events",
				visible: ["admin", "teacher", "student", "parent"],
			},
			{
				icon: <MessageCircle className="w-5 h-5" />,
				label: "Messages",
				href: "/list/messages",
				visible: ["admin", "teacher", "student", "parent"],
			},
			{
				icon: <Megaphone className="w-5 h-5" />,
				label: "Announcements",
				href: "/list/announcements",
				visible: ["admin", "teacher", "student", "parent"],
			},
		],
	},
	{
		title: "ACCOUNT",
        collapsible: true,
		items: [
			{
				icon: <User className="w-5 h-5" />,
				label: "Profile",
				href: "/dashboard/profile",
				visible: ["admin", "teacher", "student", "parent"],
			},
			{
				icon: <Settings className="w-5 h-5" />,
				label: "Settings",
				href: "/dashboard/settings",
				visible: ["admin", "teacher", "student", "parent"],
			},
			{
				icon: <LogOut className="w-5 h-5" />,
				label: "Logout",
				href: "/logout",
				visible: ["admin", "teacher", "student", "parent"],
			},
		],
	},
];

const Menu = () => {
	const { role } = useAuth();
	const pathname = usePathname();
    const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

	// Debug logging
	console.log('Menu component - Current role:', role);
	
	// Convert role to lowercase for comparison
	const currentRole = role?.toLowerCase();
	
	if (!currentRole) {
		console.log('Menu component - No role found, rendering nothing');
		return null;
	}

    const toggleSection = (sectionTitle: string) => {
        const newCollapsed = new Set(collapsedSections);
        if (newCollapsed.has(sectionTitle)) {
            newCollapsed.delete(sectionTitle);
        } else {
            newCollapsed.add(sectionTitle);
        }
        setCollapsedSections(newCollapsed);
    };

    const isCurrentPath = (href: string) => {
        if (href === '/admin' || href === '/teacher' || href === '/student' || href === '/parent') {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

	return (
		<nav className="bg-white shadow-lg rounded-2xl p-6 h-full overflow-y-auto">
			{menuItems.map((section, index) => {
                const hasVisibleItems = section.items.some(item => item.visible.includes(currentRole));
                if (!hasVisibleItems) return null;

                const isCollapsed = collapsedSections.has(section.title);
                
                return (
                    <div key={index} className="mb-6 last:mb-0">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                {section.title}
                            </h2>
                            {section.collapsible && (
                                <button
                                    onClick={() => toggleSection(section.title)}
                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                >
                                    {isCollapsed ? (
                                        <ChevronRight className="w-3 h-3 text-gray-500" />
                                    ) : (
                                        <ChevronDown className="w-3 h-3 text-gray-500" />
                                    )}
                                </button>
                            )}
                        </div>
                        
                        {!isCollapsed && (
                            <ul className="space-y-1">
                                {section.items.map((item, idx) => (
                                    item.visible.includes(currentRole) && (
                                        <li key={idx}>
                                            <Link 
                                                href={item.href} 
                                                className={`group flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ease-in-out ${
                                                    isCurrentPath(item.href) 
                                                        ? 'sidebar-item-active' 
                                                        : 'sidebar-item hover:bg-gray-100'
                                                }`}
                                            >
                                                <span className={`transition-all duration-200 ${
                                                    isCurrentPath(item.href) 
                                                        ? 'text-white' 
                                                        : 'text-gray-600 group-hover:text-gray-900'
                                                }`}>
                                                    {item.icon}
                                                </span>
                                                <span className={`text-sm font-medium transition-colors duration-200 ${
                                                    isCurrentPath(item.href) 
                                                        ? 'text-white' 
                                                        : 'text-gray-900'
                                                }`}>
                                                    {item.label}
                                                </span>
                                            </Link>
                                        </li>
                                    )
                                ))}
                            </ul>
                        )}
                    </div>
                );
            })}
		</nav>
	);
};

export default Menu;