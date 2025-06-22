'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Cloud,
  Sun,
  CloudRain,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';

interface WeatherData {
  temperature: number;
  condition: string;
  location: string;
  icon: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: Date;
  read: boolean;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
}

interface TopNavProps {
  user: User | null;
  onToggleSidebar: () => void;
}

const TopNav: React.FC<TopNavProps> = ({ user, onToggleSidebar }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Update date/time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Using a free weather API (OpenWeatherMap alternative)
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Cape Town,ZA&appid=demo&units=metric`
        );

        if (!response.ok) {
          // Fallback to mock data if API fails
          setWeather({
            temperature: 22,
            condition: 'Sunny',
            location: 'Cape Town, ZA',
            icon: 'sun',
          });
          return;
        }

        const data = await response.json();
        setWeather({
          temperature: Math.round(data.main.temp),
          condition: data.weather[0].main,
          location: `${data.name}, ${data.sys.country}`,
          icon: data.weather[0].icon,
        });
      } catch (error) {
        // Fallback weather data
        setWeather({
          temperature: 22,
          condition: 'Sunny',
          location: 'Cape Town, ZA',
          icon: 'sun',
        });
      }
    };

    fetchWeather();
  }, []);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;

      try {
        const response = await fetch('/api/notifications');
        if (response.ok) {
          const data = await response.json();
          setNotifications(data.notifications || []);
        } else {
          // Mock notifications for demo
          setNotifications([
            {
              id: '1',
              title: 'New Assignment',
              message: 'Math Assignment due tomorrow',
              type: 'info',
              timestamp: new Date(),
              read: false,
            },
            {
              id: '2',
              title: 'Grade Updated',
              message: 'Your English test grade is now available',
              type: 'success',
              timestamp: new Date(Date.now() - 3600000),
              read: false,
            },
            {
              id: '3',
              title: 'Parent Meeting',
              message: 'Scheduled for next Tuesday at 2 PM',
              type: 'warning',
              timestamp: new Date(Date.now() - 7200000),
              read: true,
            },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
  }, [user]);

  // Search functionality
  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results || []);
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error('Search failed:', error);
      // Mock search results for demo
      setSearchResults([
        { type: 'student', name: 'John Doe', id: '1', href: '/list/students/1' },
        { type: 'class', name: 'Mathematics Grade 10', id: '2', href: '/list/classes/2' },
        { type: 'teacher', name: 'Mrs. Smith', id: '3', href: '/list/teachers/3' },
      ]);
      setShowSearchResults(true);
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return <Sun className="w-5 h-5 text-yellow-500" />;
      case 'rain':
      case 'drizzle':
        return <CloudRain className="w-5 h-5 text-blue-500" />;
      default:
        return <Cloud className="w-5 h-5 text-gray-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-ZA', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-ZA', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/sign-in';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Mobile menu button */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Center - Weather and Date Card */}
        <div className="flex items-center space-x-4">
          {weather && (
            <div className="bg-primary/10 rounded-lg px-4 py-2 flex items-center space-x-3">
              {getWeatherIcon(weather.condition)}
              <div className="text-sm">
                <span className="font-semibold text-primary">{weather.temperature}°C</span>
                <span className="text-muted-foreground ml-2">{weather.condition}</span>
              </div>
            </div>
          )}

          <div className="bg-secondary/10 rounded-lg px-4 py-2">
            <div className="text-sm">
              <div className="font-semibold text-primary">{formatTime(currentDateTime)}</div>
              <div className="text-muted-foreground text-xs">{formatDate(currentDateTime)}</div>
            </div>
          </div>
        </div>

        {/* Right side - Search, Notifications, Profile */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search students, classes, teachers..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
                onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                className="pl-10 pr-4 py-2 w-64 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <a
                    key={index}
                    href={result.href}
                    className="block px-4 py-2 hover:bg-primary/10 border-b border-border last:border-b-0"
                  >
                    <div className="text-sm">
                      <span className="font-medium text-foreground">{result.name}</span>
                      <span className="text-muted-foreground ml-2 capitalize">({result.type})</span>
                      {result.subtitle && (
                        <div className="text-xs text-muted-foreground mt-1">{result.subtitle}</div>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-foreground">Notifications</h3>
                </div>
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">No notifications</div>
                ) : (
                  <div className="divide-y divide-border">
                    {notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-primary/5 ${!notification.read ? 'bg-primary/5' : ''}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-foreground">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {notification.timestamp.toLocaleString()}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full ml-2 mt-1"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary"
              >
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full" />
                  ) : (
                    <User className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-sm font-medium text-foreground">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">{user.role}</div>
                </div>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
                  <div className="p-2">
                    <a
                      href="/dashboard/profile"
                      className="flex items-center space-x-2 px-3 py-2 text-sm rounded-lg hover:bg-primary/10"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </a>
                    <a
                      href="/dashboard/settings"
                      className="flex items-center space-x-2 px-3 py-2 text-sm rounded-lg hover:bg-primary/10"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </a>
                    <hr className="my-2 border-border" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-lg hover:bg-red-50 hover:text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNav;
