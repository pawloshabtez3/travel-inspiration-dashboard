import axios, { AxiosError } from 'axios';
import { WeatherData } from './store';
import { API_ENDPOINTS, ERROR_MESSAGES, CONFIG, DEFAULT_IMAGE_URL } from './constants';

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

// Unsplash API client
export async function fetchDestinationImage(destinationName: string): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
  
  if (!apiKey) {
    console.error(ERROR_MESSAGES.MISSING_API_KEY);
    return DEFAULT_IMAGE_URL;
  }

  try {
    const response = await retryRequest(() =>
      apiClient.get(API_ENDPOINTS.UNSPLASH, {
        params: {
          query: destinationName,
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
      return DEFAULT_IMAGE_URL;
    }

    return imageUrl;
  } catch (error) {
    console.error('Unsplash API error:', error);
    return DEFAULT_IMAGE_URL;
  }
}

// OpenWeatherMap API client
export async function fetchWeather(cityName: string): Promise<WeatherData | null> {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  
  if (!apiKey) {
    console.error(ERROR_MESSAGES.MISSING_API_KEY);
    return null;
  }

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

    return {
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed
    };
  } catch (error) {
    console.error('OpenWeatherMap API error:', error);
    return null;
  }
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
