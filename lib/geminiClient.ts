import axios from 'axios';
import { Destination } from './store';
import { API_ENDPOINTS, ERROR_MESSAGES, CONFIG } from './constants';
import { fetchDestinationImages } from './api';

interface GeminiResponse {
  candidates?: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

interface DestinationSuggestion {
  name: string;
  country: string;
  tagline: string;
}

// Fallback suggestions for when API fails
const FALLBACK_SUGGESTIONS: Record<string, DestinationSuggestion[]> = {
  relaxed: [
    { name: 'Bali', country: 'Indonesia', tagline: 'Serene beaches and peaceful temples' },
    { name: 'Maldives', country: 'Maldives', tagline: 'Crystal clear waters and luxury resorts' },
    { name: 'Santorini', country: 'Greece', tagline: 'Stunning sunsets and white-washed villages' }
  ],
  adventurous: [
    { name: 'Queenstown', country: 'New Zealand', tagline: 'Adventure capital of the world' },
    { name: 'Patagonia', country: 'Argentina', tagline: 'Dramatic landscapes and hiking trails' },
    { name: 'Iceland', country: 'Iceland', tagline: 'Glaciers, volcanoes, and northern lights' }
  ],
  romantic: [
    { name: 'Paris', country: 'France', tagline: 'City of love and romance' },
    { name: 'Venice', country: 'Italy', tagline: 'Gondola rides and charming canals' },
    { name: 'Prague', country: 'Czech Republic', tagline: 'Fairy-tale architecture and cobblestone streets' }
  ],
  cultural: [
    { name: 'Kyoto', country: 'Japan', tagline: 'Ancient temples and traditional culture' },
    { name: 'Rome', country: 'Italy', tagline: 'Historic ruins and Renaissance art' },
    { name: 'Cairo', country: 'Egypt', tagline: 'Pyramids and ancient civilization' }
  ],
  tropical: [
    { name: 'Phuket', country: 'Thailand', tagline: 'Tropical paradise with vibrant nightlife' },
    { name: 'Fiji', country: 'Fiji', tagline: 'Pristine beaches and coral reefs' },
    { name: 'Costa Rica', country: 'Costa Rica', tagline: 'Rainforests and exotic wildlife' }
  ],
  'winter-escape': [
    { name: 'Aspen', country: 'USA', tagline: 'World-class skiing and mountain luxury' },
    { name: 'Zermatt', country: 'Switzerland', tagline: 'Alpine charm and Matterhorn views' },
    { name: 'Lapland', country: 'Finland', tagline: 'Winter wonderland and Santa Claus village' }
  ]
};

// Validate and sanitize destination data
function validateDestination(data: any): DestinationSuggestion | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const { name, country, tagline } = data;

  if (
    typeof name !== 'string' || !name.trim() ||
    typeof country !== 'string' || !country.trim() ||
    typeof tagline !== 'string' || !tagline.trim()
  ) {
    return null;
  }

  return {
    name: name.trim(),
    country: country.trim(),
    tagline: tagline.trim().slice(0, 100) // Limit tagline length
  };
}

// Parse Gemini API response
function parseGeminiResponse(response: GeminiResponse): DestinationSuggestion[] {
  try {
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error('No text content in response');
    }

    // Try to extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No JSON array found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    if (!Array.isArray(parsed)) {
      throw new Error('Response is not an array');
    }

    const validated = parsed
      .map(validateDestination)
      .filter((dest): dest is DestinationSuggestion => dest !== null)
      .slice(0, CONFIG.DESTINATIONS_PER_MOOD);

    if (validated.length === 0) {
      throw new Error('No valid destinations in response');
    }

    return validated;
  } catch (error) {
    console.error('Failed to parse Gemini response:', error);
    throw error;
  }
}

// Generate unique ID for destination
function generateDestinationId(name: string, country: string): string {
  return `${name.toLowerCase().replace(/\s+/g, '-')}-${country.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
}

// Main function to get destinations by mood
export async function getDestinationsByMood(mood: string): Promise<Destination[]> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    console.error(ERROR_MESSAGES.MISSING_API_KEY);
    return getFallbackDestinations(mood);
  }

  try {
    const prompt = `Suggest exactly ${CONFIG.DESTINATIONS_PER_MOOD} travel destinations for someone seeking a ${mood} experience. 
Return ONLY a JSON array with this exact format, no additional text:
[
  {"name": "City Name", "country": "Country Name", "tagline": "Brief description (max 10 words)"},
  {"name": "City Name", "country": "Country Name", "tagline": "Brief description (max 10 words)"},
  {"name": "City Name", "country": "Country Name", "tagline": "Brief description (max 10 words)"}
]`;

    const response = await axios.post<GeminiResponse>(
      `${API_ENDPOINTS.GEMINI}?key=${apiKey}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    const suggestions = parseGeminiResponse(response.data);
    
    // Fetch images for all destinations
    const destinationNames = suggestions.map(s => s.name);
    const imageMap = await fetchDestinationImages(destinationNames);

    // Convert to Destination objects
    const destinations: Destination[] = suggestions.map(suggestion => ({
      id: generateDestinationId(suggestion.name, suggestion.country),
      name: suggestion.name,
      country: suggestion.country,
      tagline: suggestion.tagline,
      imageUrl: imageMap.get(suggestion.name) || ''
    }));

    return destinations;
  } catch (error) {
    console.error('Gemini API error:', error);
    return getFallbackDestinations(mood);
  }
}

// Get fallback destinations when API fails
function getFallbackDestinations(mood: string): Promise<Destination[]> {
  const suggestions = FALLBACK_SUGGESTIONS[mood] || FALLBACK_SUGGESTIONS.relaxed;
  
  return Promise.resolve(
    suggestions.map(suggestion => ({
      id: generateDestinationId(suggestion.name, suggestion.country),
      name: suggestion.name,
      country: suggestion.country,
      tagline: suggestion.tagline,
      imageUrl: '' // Will be fetched separately
    }))
  );
}
