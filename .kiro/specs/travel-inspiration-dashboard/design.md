# Design Document

## Overview

The AI-Powered Travel Inspiration Dashboard is a Next.js 14 application using the App Router architecture. The design emphasizes visual appeal, smooth animations, and seamless integration of multiple external APIs. The application follows a component-based architecture with centralized state management via Zustand and persistent storage using browser localStorage.

### Key Design Principles

- **Frontend-Only Architecture**: No backend server required; all API calls made directly from the client
- **Performance-First**: Optimize API calls, lazy load images, and minimize bundle size
- **Animation-Driven UX**: Use Framer Motion for all transitions and interactions
- **Mobile-First Responsive**: Design for mobile screens first, then scale up
- **Type Safety**: Leverage TypeScript throughout for compile-time safety

## Architecture

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 14 (App Router) | Server-side rendering, routing, and optimization |
| Styling | Tailwind CSS | Utility-first styling with responsive design |
| Animation | Framer Motion | Declarative animations and transitions |
| State Management | Zustand | Lightweight global state management |
| HTTP Client | Axios | API request handling with interceptors |
| Image Source | Unsplash API | High-quality destination photography |
| Weather Data | OpenWeatherMap API | Real-time weather information |
| AI Service | Google Gemini API | Mood-based destination suggestions |
| Deployment | Vercel | Serverless deployment with edge functions |

### Application Structure

```
/app
 ├── layout.tsx              # Root layout with global providers
 ├── globals.css             # Global styles and Tailwind imports
 ├── page.tsx                # Landing page (/)
 └── explore/
     └── page.tsx            # Main dashboard (/explore)

/components
 ├── Header.tsx              # Navigation header
 ├── MoodSelector.tsx        # Mood category selection interface
 ├── DestinationGrid.tsx     # Grid container for destination cards
 ├── DestinationCard.tsx     # Individual destination display
 ├── WeatherWidget.tsx       # Weather information display
 └── FavoritesPanel.tsx      # Saved destinations sidebar

/lib
 ├── api.ts                  # Unsplash & OpenWeatherMap API clients
 ├── geminiClient.ts         # Google Gemini API integration
 ├── store.ts                # Zustand state store with persistence
 └── constants.ts            # Mood categories and configuration
```

## Components and Interfaces

### State Management (Zustand Store)

```typescript
interface Destination {
  id: string;
  name: string;
  country: string;
  tagline: string;
  imageUrl: string;
  weather?: WeatherData;
}

interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
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
}
```

### Component Interfaces

#### MoodSelector Component

**Props:**
```typescript
interface MoodSelectorProps {
  onMoodSelect: (mood: string) => void;
  selectedMood: string | null;
}
```

**Behavior:**
- Displays 6 mood category buttons in a responsive grid
- Highlights currently selected mood
- Triggers API call on mood selection
- Animates mood cards on hover

#### DestinationCard Component

**Props:**
```typescript
interface DestinationCardProps {
  destination: Destination;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}
```

**Behavior:**
- Displays destination image with lazy loading
- Shows name, country, and tagline overlay
- Renders weather widget at bottom
- Provides favorite toggle button
- Animates on mount and hover

#### WeatherWidget Component

**Props:**
```typescript
interface WeatherWidgetProps {
  destinationName: string;
  weather?: WeatherData;
  isLoading?: boolean;
}
```

**Behavior:**
- Fetches weather data on mount
- Displays temperature and condition icon
- Shows loading skeleton while fetching
- Handles API errors gracefully

#### FavoritesPanel Component

**Props:**
```typescript
interface FavoritesPanelProps {
  favorites: Destination[];
  onRemoveFavorite: (id: string) => void;
}
```

**Behavior:**
- Displays as a sidebar on desktop, bottom sheet on mobile
- Shows thumbnail grid of favorite destinations
- Allows removal of favorites
- Persists to localStorage on changes

## Data Models

### Destination Model

```typescript
interface Destination {
  id: string;              // Unique identifier (generated)
  name: string;            // City or location name
  country: string;         // Country name
  tagline: string;         // AI-generated description
  imageUrl: string;        // Unsplash photo URL
  weather?: WeatherData;   // Optional weather information
}
```

### Weather Data Model

```typescript
interface WeatherData {
  temperature: number;     // Temperature in Celsius
  condition: string;       // Weather condition (e.g., "Clear", "Cloudy")
  icon: string;           // OpenWeatherMap icon code
  humidity?: number;      // Optional humidity percentage
  windSpeed?: number;     // Optional wind speed
}
```

### Mood Category Model

```typescript
interface MoodCategory {
  id: string;             // Unique identifier
  label: string;          // Display name
  emoji: string;          // Visual icon
  description: string;    // Tooltip description
  gradient: string;       // Tailwind gradient classes
}
```

## API Integration

### Google Gemini API Integration

**Purpose:** Generate destination suggestions based on mood input

**Implementation:**
```typescript
// lib/geminiClient.ts
async function getDestinationsByMood(mood: string): Promise<Destination[]> {
  const prompt = `Suggest 3 travel destinations for someone seeking a ${mood} experience. 
  Return as JSON array with: name, country, tagline (max 10 words)`;
  
  // Call Gemini API
  // Parse response
  // Return structured data
}
```

**Error Handling:**
- Retry failed requests once
- Fallback to cached suggestions if API unavailable
- Display user-friendly error messages

### Unsplash API Integration

**Purpose:** Fetch high-quality destination photos

**Implementation:**
```typescript
// lib/api.ts
async function fetchDestinationImage(destinationName: string): Promise<string> {
  const response = await axios.get('https://api.unsplash.com/search/photos', {
    params: {
      query: destinationName,
      per_page: 1,
      orientation: 'landscape'
    },
    headers: {
      Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
    }
  });
  
  return response.data.results[0]?.urls?.regular || DEFAULT_IMAGE;
}
```

**Optimization:**
- Cache image URLs in state to avoid duplicate requests
- Use Unsplash's optimized image URLs
- Implement lazy loading with Next.js Image component

### OpenWeatherMap API Integration

**Purpose:** Fetch current weather data for destinations

**Implementation:**
```typescript
// lib/api.ts
async function fetchWeather(cityName: string): Promise<WeatherData> {
  const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
    params: {
      q: cityName,
      appid: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY,
      units: 'metric'
    }
  });
  
  return {
    temperature: Math.round(response.data.main.temp),
    condition: response.data.weather[0].main,
    icon: response.data.weather[0].icon
  };
}
```

**Error Handling:**
- Gracefully handle missing weather data
- Display placeholder when API fails
- Implement request debouncing

## Animation Strategy

### Page Transitions

- Use Framer Motion's `AnimatePresence` for route changes
- Fade and slide animations between landing and explore pages
- Duration: 400ms with ease-in-out timing

### Destination Grid Animations

```typescript
// Staggered children animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};
```

### Hover Effects

- Scale: 1.05 on destination cards
- Brightness increase on mood buttons
- Smooth color transitions on favorite button
- All transitions: 200ms duration

### Loading States

- Skeleton screens for destination cards
- Pulse animation for loading indicators
- Spinner for API requests

## Responsive Design

### Breakpoints (Tailwind)

- **Mobile**: < 768px (sm)
- **Tablet**: 768px - 1023px (md)
- **Desktop**: >= 1024px (lg)

### Layout Adaptations

**Destination Grid:**
- Mobile: 1 column, full width cards
- Tablet: 2 columns, 16px gap
- Desktop: 3 columns, 24px gap

**Favorites Panel:**
- Mobile: Bottom sheet (slide up)
- Tablet: Right sidebar (300px width)
- Desktop: Right sidebar (350px width)

**Mood Selector:**
- Mobile: 2 columns, stacked buttons
- Tablet: 3 columns
- Desktop: 6 columns (horizontal row)

## Error Handling

### API Error Scenarios

1. **Gemini API Failure**
   - Display: "Unable to fetch destinations. Please try again."
   - Action: Provide retry button
   - Fallback: Show previously cached results if available

2. **Unsplash API Failure**
   - Display: Placeholder gradient image
   - Action: Continue showing destination data
   - Log: Error to console for debugging

3. **OpenWeatherMap API Failure**
   - Display: "Weather unavailable"
   - Action: Hide weather widget
   - Impact: Does not block destination display

4. **Network Errors**
   - Display: "Connection lost. Check your internet."
   - Action: Retry button with exponential backoff
   - State: Preserve user's current view

### User Input Validation

- Validate environment variables on app initialization
- Check for empty API responses
- Handle malformed JSON from Gemini API
- Sanitize user-generated content (if chat feature added)

## Testing Strategy

### Component Testing

**Priority Components:**
- MoodSelector: Verify mood selection triggers correct API calls
- DestinationCard: Test favorite toggle and weather display
- FavoritesPanel: Validate localStorage persistence

**Testing Approach:**
- Use React Testing Library for component tests
- Mock API calls with MSW (Mock Service Worker)
- Test responsive behavior with viewport simulation

### Integration Testing

**Critical Flows:**
1. Landing page → Explore page navigation
2. Mood selection → Destination display
3. Add to favorites → Persist to localStorage
4. Page refresh → Restore favorites

### API Integration Testing

- Mock API responses for consistent testing
- Test error handling for each API
- Verify rate limit handling
- Test offline behavior

### Performance Testing

**Metrics to Monitor:**
- First Contentful Paint (FCP) < 1.5s
- Largest Contentful Paint (LCP) < 2.5s
- Time to Interactive (TTI) < 3.5s
- Cumulative Layout Shift (CLS) < 0.1

**Optimization Techniques:**
- Image optimization with Next.js Image
- Code splitting by route
- Lazy load Framer Motion animations
- Minimize API payload sizes

## Deployment Configuration

### Environment Variables

Required variables in `.env.local`:
```
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_key_here
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_key_here
NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
```

### Vercel Configuration

**Build Settings:**
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

**Environment Variables:**
- Add all API keys in Vercel dashboard
- Use production keys for main branch
- Use development keys for preview deployments

### Performance Optimizations

- Enable Vercel Edge Network for global CDN
- Configure image optimization domains in `next.config.js`
- Enable compression for API responses
- Set appropriate cache headers

## Security Considerations

### API Key Protection

- Never commit API keys to version control
- Use environment variables with NEXT_PUBLIC_ prefix
- Rotate keys periodically
- Monitor API usage for anomalies

### Content Security

- Sanitize AI-generated content before display
- Validate image URLs from Unsplash
- Implement rate limiting on client side
- Use HTTPS for all API requests

### Data Privacy

- Store only non-sensitive data in localStorage
- No user authentication or personal data collection
- Clear localStorage on user request
- Comply with browser storage limits

## Future Extensibility

### Potential Enhancements

1. **AI Chat Interface**: Allow free-text queries to Gemini
2. **Map Integration**: Add Mapbox for destination visualization
3. **Trip Itinerary**: Generate AI-powered travel plans
4. **Social Sharing**: Share favorite destinations
5. **Export Feature**: Download favorites as PDF or image

### Architecture Considerations

- Keep API clients modular for easy swapping
- Design components for reusability
- Maintain clear separation of concerns
- Document all external dependencies
