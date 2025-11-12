'use client';

import { useEffect, useState } from 'react';
import { WeatherData } from '@/lib/store';
import { fetchWeather } from '@/lib/api';
import { ERROR_MESSAGES } from '@/lib/constants';

interface WeatherWidgetProps {
  destinationName: string;
  weather?: WeatherData;
  isLoading?: boolean;
}

export default function WeatherWidget({ 
  destinationName, 
  weather: initialWeather,
  isLoading: externalLoading 
}: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(initialWeather || null);
  const [isLoading, setIsLoading] = useState(externalLoading || false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // If weather data is already provided, use it
    if (initialWeather) {
      setWeather(initialWeather);
      setIsLoading(false);
      return;
    }

    // Otherwise, fetch weather data
    const loadWeather = async () => {
      setIsLoading(true);
      setError(false);
      
      try {
        const weatherData = await fetchWeather(destinationName);
        
        if (weatherData) {
          setWeather(weatherData);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Failed to fetch weather:', err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadWeather();
  }, [destinationName, initialWeather]);

  // Loading skeleton with pulse animation
  if (isLoading) {
    return (
      <div className="flex items-center gap-3 p-3 bg-white/90 backdrop-blur-sm rounded-lg">
        <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 rounded w-16 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
        </div>
      </div>
    );
  }

  // Error or missing weather data
  if (error || !weather) {
    return (
      <div className="flex items-center gap-2 p-3 bg-white/90 backdrop-blur-sm rounded-lg">
        <div className="text-gray-400">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="w-6 h-6"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" 
            />
          </svg>
        </div>
        <span className="text-sm text-gray-500">{ERROR_MESSAGES.WEATHER_FAILED}</span>
      </div>
    );
  }

  // Display weather data
  return (
    <div className="flex items-center gap-3 p-3 bg-white/90 backdrop-blur-sm rounded-lg">
      {/* Weather Icon */}
      <div className="flex-shrink-0">
        <img
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt={weather.condition}
          className="w-12 h-12"
        />
      </div>
      
      {/* Weather Info */}
      <div className="flex-1">
        <div className="text-lg font-semibold text-gray-800">
          {weather.temperature}°C
        </div>
        <div className="text-sm text-gray-600">
          {weather.condition}
        </div>
      </div>
    </div>
  );
}
