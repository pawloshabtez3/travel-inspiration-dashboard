## ✈️ AI-Powered Travel Inspiration Dashboard — Complete MVP Implementation Prompt

### 🌍 Product Vision
The **AI-Powered Travel Inspiration Dashboard** is a frontend-only web application designed to help users discover travel destinations based on moods, vibes, or themes. Powered by **Next.js 14**, **Tailwind CSS**, **Framer Motion**, **Zustand**, and AI suggestions via **Google Gemini**, it visually blends stunning imagery, live weather insights, and curated travel inspiration into a smooth and immersive experience.

---

### 🌟 Core MVP Features
1. **Landing Page**
   - Tagline: *"Find your next destination by mood."*
   - Framer Motion hero animation and CTA to `/explore`.

2. **Mood-Based Search**
   - Mood categories: *Relaxed*, *Adventurous*, *Romantic*, *Cultural*, *Tropical*, *Winter Escape*.
   - Each mood triggers a Gemini AI call to get 2–3 destination suggestions.

3. **Destination Grid View**
   - Fetch photos for each destination using the **Unsplash API**.
   - Show destination name, country, and AI-generated tagline.
   - Smooth image reveal animations with hover effects.

4. **Weather Widget**
   - Fetch weather info (temperature, condition) via **OpenWeatherMap API**.
   - Compact card displayed below each destination tile.

5. **Favorites Panel**
   - Add/remove favorite destinations.
   - Persist favorites in **localStorage**.

6. **Responsive Layout**
   - Adaptive grid with stacked layout for mobile.
   - Smooth navigation transitions with Framer Motion.

---

### 🧱 Tech Stack & Dependencies
| Category | Tool |
|-----------|------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| State Management | Zustand |
| Image Source | Unsplash API |
| Weather Data | OpenWeatherMap API |
| AI Insights | Google Gemini API |
| Deployment | Vercel |

**Installation Commands:**
```bash
npx create-next-app@latest travel-dashboard --typescript --tailwind --app
cd travel-dashboard
npm install framer-motion zustand axios
```

---

### 📁 Suggested Folder Structure
```
/app
 ├── layout.tsx
 ├── globals.css
 ├── page.tsx                  # Landing page
 ├── explore/page.tsx          # Dashboard main page
/components
 ├── SearchBar.tsx
 ├── MoodSelector.tsx
 ├── DestinationGrid.tsx
 ├── DestinationCard.tsx
 ├── WeatherWidget.tsx
 ├── FavoritesPanel.tsx
 ├── Header.tsx
/lib
 ├── api.ts                    # Unsplash & Weather API calls
 ├── geminiClient.ts           # AI integration helper
 ├── store.ts                  # Zustand state store
 ├── constants.ts              # Mood list, API URLs
```

---

### 🧩 Step-by-Step Implementation Plan

#### 🏗️ 1. Setup & Configuration
- Initialize project with Tailwind and Framer Motion.
- Create base layout with header and container.
- Configure environment variables for API keys.

#### 🎨 2. Landing Page
- Create hero section with gradient background and motion text.
- Add CTA to `/explore` page.

#### 🔍 3. Mood Selection Interface
- Build `MoodSelector.tsx` with mood cards or buttons.
- When a mood is clicked → call Gemini API for destination ideas.
- Store results in Zustand state.

#### 🖼️ 4. Destination Grid
- For each AI-suggested destination:
  - Fetch Unsplash images.
  - Display grid cards with photo, name, and tagline.
  - Animate entry using Framer Motion.

#### 🌦️ 5. Weather Widget
- Fetch live weather data for each destination.
- Render below destination info.

#### 💾 6. Favorites Feature
- Add ❤️ button to each card.
- Save favorites to localStorage using Zustand persistence.

#### 📱 7. Responsive & Animation Polish
- Grid: 3-column desktop, 2-column tablet, 1-column mobile.
- Add subtle hover/scale effects.
- Animate mood transitions and page routing.

#### 🚀 8. Deployment
- Test responsiveness locally.
- Push to GitHub and deploy via **Vercel**.

---

### 🌠 Optional Stretch Goals
- **AI Chat:** Allow user to type free text like "I want somewhere calm with mountains" → Gemini returns places.
- **Daily Inspiration Mode:** Auto-refresh daily mood + image.
- **Map Integration:** Add Mapbox map for each destination.
- **AI Trip Summary:** Gemini generates short itinerary.
- **Download Favorite Board:** Export saved inspirations as an image (using html2canvas).

---

### ✨ UI/UX Design Guidelines
- Use warm gradients and soft glassmorphism.
- Motion: Fade-in for cards, staggered grid animations.
- Keep typography clean (e.g., Inter, Plus Jakarta Sans).
- Maintain consistent spacing and shadow depth.
- Provide hover feedback on all clickable items.

---

### 🌍 Deployment Notes
- Use `NEXT_PUBLIC_` prefix for all API keys.
- Optimize Unsplash API queries (limit results).
- Host static assets (icons, logos) in `/public`.
- Set up Vercel previews for visual testing.

---

### ✅ MVP Completion Checklist
- [ ] Landing page with mood CTA.
- [ ] Gemini mood-based destination suggestions.
- [ ] Image grid with motion transitions.
- [ ] Weather info integrated.
- [ ] Favorites saved in localStorage.
- [ ] Responsive layout and animations.
- [ ] Live deployment on Vercel.

---

### 💬 Summary
The **AI-Powered Travel Inspiration Dashboard** combines design, interactivity, and AI creativity into a stunning frontend showcase. It demonstrates mastery of **Next.js 14**, **Framer Motion**, and **Zustand**, with seamless integration of external APIs for real-world data. Perfect for a portfolio — highly visual, interactive, and creative — all without a backend.

