import axios, { AxiosError } from 'axios';
import { WeatherData } from './store';
import { API_ENDPOINTS, ERROR_MESSAGES, CONFIG, DEFAULT_IMAGE_URL } from './constants';
import { hasApiKey, getMissingKeyError } from './envValidation';

// Configure axios interceptors
const apiClient = axios.create({
  timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    } else if (!error.response) {
      console.error('Network error');
    }
    return Promise.reject(error);
  }
);

// Image cache to avoid duplicate API requests
const imageCache = new Map<string, string>();

// Weather cache to avoid duplicate API requests
const weatherCache = new Map<string, { data: WeatherData | null; timestamp: number }>();
const WEATHER_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// Debounce map for weather requests
const weatherDebounceMap = new Map<string, Promise<WeatherData | null>>();

// Retry logic helper
async function retryRequest<T>(
  requestFn: () => Promise<T>,
  retries: number = CONFIG.MAX_RETRIES
): Promise<T> {
  try {
    return await requestFn();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return retryRequest(requestFn, retries - 1);
    }
    throw error;
  }
}

// Unsplash API client with caching
export async function fetchDestinationImage(destinationName: string): Promise<string> {
  // Check cache first
  const cacheKey = destinationName.toLowerCase().trim();
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }

  // Validate API key before making request
  if (!hasApiKey('NEXT_PUBLIC_UNSPLASH_ACCESS_KEY')) {
    console.error(getMissingKeyError('NEXT_PUBLIC_UNSPLASH_ACCESS_KEY'));
    imageCache.set(cacheKey, DEFAULT_IMAGE_URL);
    return DEFAULT_IMAGE_URL;
  }

  const apiKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

  try {
    const response = await retryRequest(() =>
      apiClient.get(API_ENDPOINTS.UNSPLASH, {
        params: {
          query: `${destinationName} travel destination`,
          per_page: 1,
          orientation: CONFIG.IMAGE_ORIENTATION
        },
        headers: {
          Authorization: `Client-ID ${apiKey}`
        }
      })
    );

    const imageUrl = response.data.results[0]?.urls?.regular;
    
    if (!imageUrl) {
      console.warn(`No image found for ${destinationName}`);
      imageCache.set(cacheKey, DEFAULT_IMAGE_URL);
      return DEFAULT_IMAGE_URL;
    }

    // Cache the result
    imageCache.set(cacheKey, imageUrl);
    return imageUrl;
  } catch (error) {
    console.error('Unsplash API error:', error);
    imageCache.set(cacheKey, DEFAULT_IMAGE_URL);
    return DEFAULT_IMAGE_URL;
  }
}

// OpenWeatherMap API client with caching and debouncing
export async function fetchWeather(cityName: string): Promise<WeatherData | null> {
  const cacheKey = cityName.toLowerCase().trim();
  
  // Check cache first
  const cached = weatherCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < WEATHER_CACHE_TTL) {
    return cached.data;
  }
  
  // Check if there's already a pending request for this city (debouncing)
  if (weatherDebounceMap.has(cacheKey)) {
    return weatherDebounceMap.get(cacheKey)!;
  }
  
  // Validate API key before making request
  if (!hasApiKey('NEXT_PUBLIC_OPENWEATHER_API_KEY')) {
    console.error(getMissingKeyError('NEXT_PUBLIC_OPENWEATHER_API_KEY'));
    return null;
  }

  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

  // Create the request promise
  const requestPromise = (async () => {
    try {
      const response = await retryRequest(() =>
        apiClient.get(API_ENDPOINTS.OPENWEATHER, {
          params: {
            q: cityName,
            appid: apiKey,
            units: CONFIG.WEATHER_UNITS
          }
        })
      );

      const data = response.data;

      const weatherData: WeatherData = {
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed
      };
      
      // Cache the result
      weatherCache.set(cacheKey, { data: weatherData, timestamp: Date.now() });
      
      return weatherData;
    } catch (error) {
      console.error('OpenWeatherMap API error:', error);
      
      // Cache null result to avoid repeated failed requests
      weatherCache.set(cacheKey, { data: null, timestamp: Date.now() });
      
      return null;
    } finally {
      // Remove from debounce map after request completes
      weatherDebounceMap.delete(cacheKey);
    }
  })();
  
  // Store the promise in debounce map
  weatherDebounceMap.set(cacheKey, requestPromise);
  
  return requestPromise;
}

// Batch fetch images for multiple destinations
export async function fetchDestinationImages(destinationNames: string[]): Promise<Map<string, string>> {
  const imageMap = new Map<string, string>();
  
  const imagePromises = destinationNames.map(async (name) => {
    const imageUrl = await fetchDestinationImage(name);
    imageMap.set(name, imageUrl);
  });

  await Promise.all(imagePromises);
  
  return imageMap;
}

// Batch fetch weather for multiple destinations
export async function fetchWeatherBatch(cityNames: string[]): Promise<Map<string, WeatherData | null>> {
  const weatherMap = new Map<string, WeatherData | null>();
  
  const weatherPromises = cityNames.map(async (name) => {
    const weather = await fetchWeather(name);
    weatherMap.set(name, weather);
  });

  await Promise.all(weatherPromises);
  
  return weatherMap;
}
