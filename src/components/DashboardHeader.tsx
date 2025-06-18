'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";

// Helper to get greeting based on hour
function getGreeting(date: Date) {
  const hour = date.getHours();
  if (hour < 5) return "Good night";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

// Weather API (OpenWeatherMap)
const WEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const CITY = "Johannesburg";
const COUNTRY = "ZA";

interface DashboardHeaderProps {
  userName: string;
}

export default function DashboardHeader({ userName }: DashboardHeaderProps) {
  const [now, setNow] = useState(new Date());
  const [weather, setWeather] = useState<any>(null);
  const [dateString, setDateString] = useState<string>("");
  const [timeString, setTimeString] = useState<string>("");

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch('/api/weather');
        if (!res.ok) throw new Error("Weather fetch failed");
        setWeather(await res.json());
      } catch (e) {
        setWeather(null);
      }
    }
    fetchWeather();
  }, []);

  useEffect(() => {
    setDateString(now.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }));
    setTimeString(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  }, [now]);

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow rounded-lg">
      <div className="flex items-center space-x-4">
        <Image
          src="/avatar.png"
          alt="User Avatar"
          width={40}
          height={40}
          className="rounded-full shadow"
        />
        <div>
          <h1 className="text-lg font-semibold text-gray-800">{getGreeting(now)}, {userName}!</h1>
          <p className="text-sm text-gray-500">{dateString} | {timeString}</p>
        </div>
      </div>
      {weather && (
        <div className="flex items-center space-x-2" title={`Weather in ${CITY}, ${COUNTRY}`}>
          <Image
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt="Weather Icon"
            width={40}
            height={40}
          />
          <p className="text-sm text-gray-600">{weather.description}, {weather.temp}°C</p>
        </div>
      )}
    </header>
  );
}
