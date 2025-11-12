import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// TypeScript Interfaces
export interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  humidity?: number;
  windSpeed?: number;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  tagline: string;
  imageUrl: string;
  weather?: WeatherData;
}

interface AppState {
  // Current mood selection
  selectedMood: string | null;
  
  // Destination data
  destinations: Destination[];
  isLoading: boolean;
  error: string | null;
  
  // Favorites (persisted to localStorage)
  favorites: Destination[];
  
  // Actions
  setMood: (mood: string) => void;
  fetchDestinations: (mood: string) => Promise<void>;
  toggleFavorite: (destination: Destination) => void;
  clearError: () => void;
  setDestinations: (destinations: Destination[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

// Create store with persistence middleware for favorites
export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      selectedMood: null,
      destinations: [],
      isLoading: false,
      error: null,
      favorites: [],

      // Set selected mood
      setMood: (mood: string) => {
        set({ selectedMood: mood });
      },

      // Fetch destinations using Gemini API
      fetchDestinations: async (mood: string) => {
        set({ isLoading: true, error: null, selectedMood: mood });
        
        try {
          // Dynamic import to avoid circular dependencies
          const { getDestinationsByMood } = await import('./geminiClient');
          const { fetchWeather } = await import('./api');
          
          const destinations = await getDestinationsByMood(mood);
          
          // Fetch weather data for each destination
          const destinationsWithWeather = await Promise.all(
            destinations.map(async (destination) => {
              try {
                const weather = await fetchWeather(destination.name);
                return {
                  ...destination,
                  weather: weather || undefined
                };
              } catch (error) {
                console.error(`Failed to fetch weather for ${destination.name}:`, error);
                return destination;
              }
            })
          );
          
          set({ destinations: destinationsWithWeather, isLoading: false });
        } catch (error) {
          console.error('Failed to fetch destinations:', error);
          set({ 
            error: 'Unable to fetch destinations. Please try again.',
            isLoading: false 
          });
        }
      },

      // Toggle favorite status
      toggleFavorite: (destination: Destination) => {
        const { favorites } = get();
        const isFavorite = favorites.some(fav => fav.id === destination.id);
        
        if (isFavorite) {
          // Remove from favorites
          set({ favorites: favorites.filter(fav => fav.id !== destination.id) });
        } else {
          // Add to favorites
          set({ favorites: [...favorites, destination] });
        }
      },

      // Clear error message
      clearError: () => {
        set({ error: null });
      },

      // Set destinations
      setDestinations: (destinations: Destination[]) => {
        set({ destinations });
      },

      // Set loading state
      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      // Set error state
      setError: (error: string | null) => {
        set({ error });
      }
    }),
    {
      name: 'travel-dashboard-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist favorites
      partialize: (state) => ({ favorites: state.favorites })
    }
  )
);
