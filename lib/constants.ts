// Mood Categories Configuration
export interface MoodCategory {
  id: string;
  label: string;
  emoji: string;
  description: string;
  gradient: string;
}

export const MOOD_CATEGORIES: MoodCategory[] = [
  {
    id: 'relaxed',
    label: 'Relaxed',
    emoji: '🏖️',
    description: 'Peaceful beaches and tranquil getaways',
    gradient: 'from-blue-400 to-cyan-300'
  },
  {
    id: 'adventurous',
    label: 'Adventurous',
    emoji: '🏔️',
    description: 'Thrilling experiences and outdoor activities',
    gradient: 'from-orange-400 to-red-500'
  },
  {
    id: 'romantic',
    label: 'Romantic',
    emoji: '💕',
    description: 'Intimate settings and couple-friendly destinations',
    gradient: 'from-pink-400 to-rose-500'
  },
  {
    id: 'cultural',
    label: 'Cultural',
    emoji: '🏛️',
    description: 'Historic sites and rich cultural experiences',
    gradient: 'from-purple-400 to-indigo-500'
  },
  {
    id: 'tropical',
    label: 'Tropical',
    emoji: '🌴',
    description: 'Warm climates and exotic island paradises',
    gradient: 'from-green-400 to-emerald-500'
  },
  {
    id: 'winter-escape',
    label: 'Winter Escape',
    emoji: '❄️',
    description: 'Snowy landscapes and cozy mountain retreats',
    gradient: 'from-sky-300 to-blue-500'
  }
];

// API Endpoint URLs
export const API_ENDPOINTS = {
  UNSPLASH: 'https://api.unsplash.com/search/photos',
  OPENWEATHER: 'https://api.openweathermap.org/data/2.5/weather',
  GEMINI: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
};

// Default Fallback Values
export const DEFAULT_IMAGE_URL = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';
export const DEFAULT_GRADIENT = 'from-gray-400 to-gray-600';

// Error Messages
export const ERROR_MESSAGES = {
  GEMINI_FAILED: 'Unable to fetch destinations. Please try again.',
  UNSPLASH_FAILED: 'Unable to load destination image.',
  WEATHER_FAILED: 'Weather unavailable',
  NETWORK_ERROR: 'Connection lost. Check your internet.',
  MISSING_API_KEY: 'API key is missing. Please check your configuration.',
  INVALID_RESPONSE: 'Received invalid data from server.'
};

// Configuration Constants
export const CONFIG = {
  DESTINATIONS_PER_MOOD: 3,
  IMAGE_ORIENTATION: 'landscape',
  WEATHER_UNITS: 'metric',
  ANIMATION_DURATION: 400,
  STAGGER_DELAY: 0.1,
  HOVER_SCALE: 1.05,
  MAX_RETRIES: 1
};
