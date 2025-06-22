import { NextRequest, NextResponse } from 'next/server';

const WEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const CITY = 'Johannesburg';
const COUNTRY = 'ZA';

export async function GET(req: NextRequest) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY}&appid=${WEATHER_API_KEY}&units=metric`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather fetch failed');
    const data = await res.json();
    return NextResponse.json({
      weather: data.weather?.[0]?.main,
      icon: data.weather?.[0]?.icon,
      temp: data.main?.temp,
      city: data.name,
      country: data.sys?.country,
      raw: data,
    });
  } catch (e) {
    return NextResponse.json({ error: 'Weather unavailable' }, { status: 500 });
  }
}
