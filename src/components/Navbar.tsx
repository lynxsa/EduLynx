'use client';
import Image from "next/image";
import { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, Settings, LogOut, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import TimeWeatherCard from './TimeWeatherCard';

interface NavbarProps {
    userName: string;
    userRole: string;
    avatarUrl?: string;
}

interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    type: 'info' | 'warning' | 'success' | 'error';
    unread: boolean;
}

const Navbar = ({ userName, userRole, avatarUrl = "/avatar.png" }: NavbarProps) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            title: 'New Student Registration',
            message: 'Sarah Johnson has been registered for Grade 10',
            time: '2 minutes ago',
            type: 'success',
            unread: true
        },
        {
            id: '2',
            title: 'Assignment Due',
            message: 'Mathematics homework due tomorrow',
            time: '1 hour ago',
            type: 'warning',
            unread: true
        },
        {
            id: '3',
            title: 'Parent Meeting',
            message: 'Meeting with John Smith\'s parents at 3 PM',
            time: '3 hours ago',
            type: 'info',
            unread: false
        }
    ]);

    const notificationRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => n.unread).length;

    const handleMarkAsRead = (id: string) => {
        setNotifications(prev => 
            prev.map(notif => 
                notif.id === id ? { ...notif, unread: false } : notif
            )
        );
    };

    const handleMarkAllAsRead = () => {
        setNotifications(prev => 
            prev.map(notif => ({ ...notif, unread: false }))
        );
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'success': return '✅';
            case 'warning': return '⚠️';
            case 'error': return '❌';
            default: return 'ℹ️';
        }
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Clear any client-side session data
                sessionStorage.clear();
                localStorage.clear();
                
                // Redirect to sign-in page
                router.push('/sign-in');
            } else {
                console.error('Logout failed');
                // Still redirect even if API fails
                router.push('/sign-in');
            }
        } catch (error) {
            console.error('Logout error:', error);
            // Still redirect even if there's an error
            router.push('/sign-in');
        } finally {
            setIsLoggingOut(false);
        }
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
            {/* Empty space - Logo moved to sidebar only */}
            <div className="flex items-center gap-3">
                {/* Weather Card - Moved from center to replace logo */}
                <div className="hidden lg:block">
                    <TimeWeatherCard />
                </div>
            </div>

            {/* Search Bar and Actions - Right side */}
            <div className="flex items-center gap-4">
                {/* Search Bar */}
                <div className="search-bar">
                    <Search className="w-4 h-4 text-gray-500" />
                    <input 
                        type="text" 
                        placeholder="Search students, teachers, classes..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent outline-none text-sm flex-1 placeholder:text-gray-500"
                    />
                </div>

                {/* Messages Icon */}
                <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <MessageSquare className="w-5 h-5 text-gray-600" />
                </button>

                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                    <button 
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <Bell className="w-5 h-5 text-gray-600" />
                        {unreadCount > 0 && (
                            <span className="notification-badge">{unreadCount}</span>
                        )}
                    </button>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-200">
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <button 
                                            onClick={handleMarkAllAsRead}
                                            className="text-sm text-purple-600 hover:text-purple-700 transition-colors"
                                        >
                                            Mark all as read
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.map(notification => (
                                    <div 
                                        key={notification.id}
                                        className={`p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer ${
                                            notification.unread ? 'bg-blue-50' : ''
                                        }`}
                                        onClick={() => handleMarkAsRead(notification.id)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm text-gray-900 truncate">
                                                    {notification.title}
                                                </p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    {notification.time}
                                                </p>
                                            </div>
                                            {notification.unread && (
                                                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 border-t border-gray-200">
                                <button className="w-full text-sm text-purple-600 hover:text-purple-700 transition-colors">
                                    View all notifications
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                    <button 
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <div className="flex flex-col text-right">
                            <span className="text-sm font-medium text-gray-900">{userName}</span>
                            <span className="text-xs text-gray-600">{userRole}</span>
                        </div>
                        <Image 
                            src={avatarUrl} 
                            alt="User Avatar" 
                            width={36} 
                            height={36} 
                            className="rounded-full border-2 border-gray-200"
                        />
                    </button>

                    {/* User Dropdown */}
                    {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-200">
                            <div className="p-2">
                                <div className="px-3 py-2 border-b border-gray-200 mb-2">
                                    <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
                                    <p className="text-xs text-gray-500">{userRole} • EduLynx</p>
                                </div>
                                <button className="flex items-center gap-3 w-full p-2 text-sm text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                                    <User className="w-4 h-4" />
                                    View Profile
                                </button>
                                <button className="flex items-center gap-3 w-full p-2 text-sm text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                                    <Settings className="w-4 h-4" />
                                    Change Avatar
                                </button>
                                <button className="flex items-center gap-3 w-full p-2 text-sm text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                                    <Settings className="w-4 h-4" />
                                    Settings
                                </button>
                                <hr className="my-2 border-gray-200" />
                                <a href="/sign-in" className="flex items-center gap-3 w-full p-2 text-sm text-purple-600 hover:bg-purple-50 rounded-md transition-colors">
                                    <User className="w-4 h-4" />
                                    Sign In
                                </a>
                                <button 
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="flex items-center gap-3 w-full p-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                                >
                                    <LogOut className="w-4 h-4" />
                                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;