"use client";
import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Sun, Cloud, CloudRain, CloudSnow, Zap } from 'lucide-react';

interface WeatherData {
  temperature: number;
  condition: string;
  location: string;
  icon: 'sun' | 'cloud' | 'rain' | 'snow' | 'storm';
  humidity?: number;
  windSpeed?: number;
}

const TimeWeatherCard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 18,
    condition: 'Partly Cloudy',
    location: 'Johannesburg',
    icon: 'cloud',
    humidity: 65,
    windSpeed: 12
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Extract current hour to fix ESLint dependency warning
  const currentHour = currentTime.getHours();

  // Fetch weather data on component mount and when hour changes
  useEffect(() => {
    const fetchWeather = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/weather');
        if (response.ok) {
          const data = await response.json();
          setWeather(prev => ({
            ...prev,
            temperature: Math.round(data.temperature || 18),
            condition: data.condition || 'Partly Cloudy',
            humidity: data.humidity || 65,
            windSpeed: data.windSpeed || 12,
            icon: data.icon || 'cloud'
          }));
        }
      } catch (error) {
        console.log('Weather API not available, using default data');
        // Use realistic South African weather data as fallback
        const temp = currentHour < 6 ? 12 : currentHour < 12 ? 18 : currentHour < 18 ? 24 : 16;
        setWeather(prev => ({
          ...prev,
          temperature: temp,
          condition: currentHour < 12 ? 'Morning Clear' : 'Afternoon Sun',
          icon: currentHour < 18 ? 'sun' : 'cloud'
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
    // Refresh weather every 30 minutes
    const weatherInterval = setInterval(fetchWeather, 30 * 60 * 1000);
    
    return () => clearInterval(weatherInterval);
  }, [currentHour]); // Now using extracted currentHour variable

  const getWeatherIcon = (icon: string) => {
    const iconClass = "w-4 h-4";
    switch (icon) {
      case 'sun':
        return <Sun className={`${iconClass} text-yellow-500`} />;
      case 'rain':
        return <CloudRain className={`${iconClass} text-blue-500`} />;
      case 'snow':
        return <CloudSnow className={`${iconClass} text-blue-300`} />;
      case 'storm':
        return <Zap className={`${iconClass} text-purple-500`} />;
      default:
        return <Cloud className={`${iconClass} text-gray-500`} />;
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100 shadow-sm">
      {/* Time and Weather - Horizontal Layout */}
      <div className="flex items-center justify-between space-x-4">
        {/* Time Section */}
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-purple-600" />
          <div>
            <div className="text-sm font-semibold text-gray-900">
              {currentTime.toLocaleTimeString('en-ZA', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false
              })}
            </div>
            <div className="text-xs text-gray-600">
              {getGreeting()}
            </div>
          </div>
        </div>

        {/* Weather Section */}
        <div className="flex items-center space-x-2">
          {isLoading ? (
            <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
          ) : (
            getWeatherIcon(weather.icon)
          )}
          <div>
            <div className="text-sm font-medium text-gray-900">
              {weather.temperature}°C
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-600">{weather.location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeWeatherCard;
