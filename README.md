# Travel Inspiration Dashboard

An AI-powered travel inspiration dashboard that helps users discover destinations based on moods, vibes, or themes.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **State Management**: Zustand
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

Copy `.env.example` to `.env.local` and add your API keys:

```bash
cp .env.example .env.local
```

Required API keys:
- `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` - Get from [Unsplash Developers](https://unsplash.com/developers)
- `NEXT_PUBLIC_OPENWEATHER_API_KEY` - Get from [OpenWeatherMap](https://openweathermap.org/api)
- `NEXT_PUBLIC_GEMINI_API_KEY` - Get from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Create a production build:

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Project Structure

```
/app                    # Next.js App Router pages
  ├── layout.tsx        # Root layout
  ├── page.tsx          # Landing page
  └── globals.css       # Global styles

/components             # React components (to be created)
/lib                    # Utilities and API clients (to be created)
```

## Features

- Mood-based destination discovery
- AI-powered suggestions via Google Gemini
- High-quality destination imagery from Unsplash
- Real-time weather data
- Favorites management with localStorage
- Responsive design for all devices
- Smooth animations and transitions

## License

MIT
