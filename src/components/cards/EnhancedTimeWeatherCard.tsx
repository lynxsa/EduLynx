'use client';

import { motion } from 'framer-motion';
import {
  Clock,
  Cloud,
  CloudRain,
  CloudSnow,
  Droplets,
  Eye,
  MapPin,
  Sun,
  Wind,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useWeather } from '../../hooks/usePerformanceData';
import { useTheme } from '../../styles/theme';
import { formatDate, formatTime } from '../../utils/format';
import { ExpandableCard } from './ExpandableCard';

interface WeatherIconProps {
  condition: string;
  theme: 'light' | 'dark';
  size?: number;
}

// Weather icon component with theme support
function WeatherIcon({ condition, theme, size = 48 }: WeatherIconProps) {
  const iconProps = {
    size,
    className: `transition-colors duration-300 ${
      theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'
    }`,
  };

  switch (condition.toLowerCase()) {
    case 'sunny':
    case 'clear':
      return <Sun {...iconProps} />;
    case 'cloudy':
    case 'partly cloudy':
      return (
        <Cloud
          {...iconProps}
          className={`${iconProps.className.replace('text-yellow', 'text-gray')}`}
        />
      );
    case 'rainy':
    case 'rain':
      return (
        <CloudRain
          {...iconProps}
          className={`${iconProps.className.replace('text-yellow', 'text-blue')}`}
        />
      );
    case 'snowy':
    case 'snow':
      return (
        <CloudSnow
          {...iconProps}
          className={`${iconProps.className.replace('text-yellow', 'text-blue')}`}
        />
      );
    case 'stormy':
    case 'thunderstorm':
      return (
        <Zap
          {...iconProps}
          className={`${iconProps.className.replace('text-yellow', 'text-purple')}`}
        />
      );
    default:
      return <Sun {...iconProps} />;
  }
}

// Background gradient based on weather and theme
function getWeatherGradient(condition: string, theme: 'light' | 'dark'): string {
  if (theme === 'dark') {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return 'bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900';
      case 'cloudy':
      case 'partly cloudy':
        return 'bg-gradient-to-br from-gray-800 via-slate-800 to-gray-900';
      case 'rainy':
      case 'rain':
        return 'bg-gradient-to-br from-blue-900 via-slate-800 to-gray-900';
      case 'snowy':
      case 'snow':
        return 'bg-gradient-to-br from-blue-900 via-slate-800 to-indigo-900';
      case 'stormy':
      case 'thunderstorm':
        return 'bg-gradient-to-br from-purple-900 via-gray-900 to-black';
      default:
        return 'bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900';
    }
  } else {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return 'bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400';
      case 'cloudy':
      case 'partly cloudy':
        return 'bg-gradient-to-br from-gray-400 via-slate-400 to-gray-500';
      case 'rainy':
      case 'rain':
        return 'bg-gradient-to-br from-blue-400 via-slate-400 to-gray-500';
      case 'snowy':
      case 'snow':
        return 'bg-gradient-to-br from-blue-200 via-slate-300 to-gray-400';
      case 'stormy':
      case 'thunderstorm':
        return 'bg-gradient-to-br from-purple-600 via-gray-600 to-gray-800';
      default:
        return 'bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400';
    }
  }
}

interface EnhancedTimeWeatherCardProps {
  location?: string;
  expandable?: boolean;
  showDetailedInfo?: boolean;
  className?: string;
}

export function EnhancedTimeWeatherCard({
  location = 'Cape Town',
  expandable = true,
  showDetailedInfo = true,
  className = '',
}: EnhancedTimeWeatherCardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { actualTheme } = useTheme();
  const {
    data: weather,
    loading,
    error,
    refetch,
  } = useWeather(location, {
    refreshInterval: 10 * 60 * 1000, // 10 minutes
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const backgroundGradient = weather
    ? getWeatherGradient(weather.condition, actualTheme)
    : 'bg-gradient-to-br from-blue-500 to-purple-600';

  const cardContent = (
    <div className={`relative overflow-hidden rounded-xl ${backgroundGradient} text-white`}>
      {/* Background animation */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/5"
        />
      </div>

      <div className="relative z-10 p-6">
        {/* Time Display */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Clock size={20} className="text-white/80" />
            <span className="text-sm text-white/80">Current Time</span>
          </div>
        </div>

        <div className="mb-6">
          <div className="text-3xl font-bold mb-1">{formatTime(currentTime)}</div>
          <div className="text-white/80 text-sm">{formatDate(currentTime, 'full')}</div>
        </div>

        {/* Weather Display */}
        {weather && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <WeatherIcon condition={weather.condition} theme={actualTheme} size={48} />
              <div>
                <div className="text-2xl font-bold">{weather.temperature}°C</div>
                <div className="text-white/80 text-sm">{weather.condition}</div>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center space-x-1 text-white/80 text-sm mb-1">
                <MapPin size={14} />
                <span>{location}</span>
              </div>
              {showDetailedInfo && (
                <div className="space-y-1 text-xs text-white/70">
                  <div className="flex items-center space-x-1">
                    <Droplets size={12} />
                    <span>{weather.humidity}%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Wind size={12} />
                    <span>{weather.windSpeed} km/h</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full"
            />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-4">
            <p className="text-white/80 text-sm mb-2">Failed to load weather data</p>
            <button
              onClick={refetch}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const expandedContent = weather && (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Current Weather */}
      <div className={`p-6 rounded-xl ${actualTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <h3
          className={`text-lg font-semibold mb-4 ${
            actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          Current Conditions
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              Temperature
            </span>
            <span
              className={`font-semibold ${actualTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}
            >
              {weather.temperature}°C
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className={actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              Condition
            </span>
            <span
              className={`font-semibold ${actualTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}
            >
              {weather.condition}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className={actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              Humidity
            </span>
            <span
              className={`font-semibold ${actualTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}
            >
              {weather.humidity}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className={actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              Wind Speed
            </span>
            <span
              className={`font-semibold ${actualTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}
            >
              {weather.windSpeed} km/h
            </span>
          </div>
        </div>
      </div>

      {/* Time Information */}
      <div className={`p-6 rounded-xl ${actualTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <h3
          className={`text-lg font-semibold mb-4 ${
            actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          Time Information
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              Current Time
            </span>
            <span
              className={`font-semibold ${actualTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}
            >
              {formatTime(currentTime)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className={actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Date</span>
            <span
              className={`font-semibold ${actualTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}
            >
              {formatDate(currentTime, 'medium')}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className={actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              Day of Week
            </span>
            <span
              className={`font-semibold ${actualTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}
            >
              {currentTime.toLocaleDateString('en-ZA', { weekday: 'long' })}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className={actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              Location
            </span>
            <span
              className={`font-semibold ${actualTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}
            >
              {location}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ExpandableCard
      title="Time & Weather"
      subtitle={`Live updates for ${location}`}
      expandable={expandable}
      className={className}
      height="lg"
      loading={loading}
      error={error}
      headerContent={
        <div className="flex items-center space-x-2">
          <button
            onClick={refetch}
            className={`p-1 rounded transition-colors ${
              actualTheme === 'dark'
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
          >
            <motion.div
              animate={loading ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: loading ? Infinity : 0 }}
            >
              <Eye size={16} />
            </motion.div>
          </button>
        </div>
      }
    >
      {cardContent}
      {expandable && expandedContent}
    </ExpandableCard>
  );
}

export default EnhancedTimeWeatherCard;
