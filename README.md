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
- API keys from Unsplash, OpenWeatherMap, and Google Gemini

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd travel-dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

Copy `.env.example` to `.env.local` and add your API keys:

```bash
cp .env.example .env.local
```

### Environment Variables

All environment variables are required for the application to function properly. The application will validate these on startup.

#### Required Variables

| Variable | Description | How to Obtain |
|----------|-------------|---------------|
| `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` | Unsplash API access key for fetching destination images | 1. Visit [Unsplash Developers](https://unsplash.com/developers)<br>2. Create a new application<br>3. Copy the "Access Key" |
| `NEXT_PUBLIC_OPENWEATHER_API_KEY` | OpenWeatherMap API key for weather data | 1. Visit [OpenWeatherMap API](https://openweathermap.org/api)<br>2. Sign up for a free account<br>3. Generate an API key from your account dashboard |
| `NEXT_PUBLIC_GEMINI_API_KEY` | Google Gemini API key for AI-powered destination suggestions | 1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)<br>2. Sign in with your Google account<br>3. Create and copy an API key |

#### Environment Variable Setup Example

Your `.env.local` file should look like this:

```bash
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=abc123xyz789yourkey
NEXT_PUBLIC_OPENWEATHER_API_KEY=def456uvw012yourkey
NEXT_PUBLIC_GEMINI_API_KEY=ghi789rst345yourkey
```

**Important Notes:**
- Never commit `.env.local` to version control
- All variables must be prefixed with `NEXT_PUBLIC_` to be accessible in the browser
- The application will log errors if required API keys are missing
- API keys are validated on application startup

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The application will be available at:
- Local: http://localhost:3000
- Network: http://[your-ip]:3000

### Build

Create a production build:

```bash
npm run build
```

This will:
- Compile TypeScript
- Optimize images and assets
- Generate static pages
- Minify JavaScript and CSS
- Create production-ready bundles in `.next` directory

### Start Production Server

Run the production build locally:

```bash
npm start
```

This starts the Next.js production server on port 3000.

### Linting

Check code quality:

```bash
npm run lint
```

### Build Verification

Verify the production build is ready for deployment:

```bash
npm run build
npm run verify
```

This will check:
- Build artifacts exist
- Environment variables are configured
- All required dependencies are installed
- Critical pages are built correctly
- Configuration files are present

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

## Deployment

### Deploy to Vercel (Recommended)

The easiest way to deploy this Next.js application is using [Vercel](https://vercel.com):

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Import your repository to Vercel:
   - Visit [vercel.com/new](https://vercel.com/new)
   - Select your repository
   - Vercel will automatically detect Next.js

3. Configure environment variables in Vercel:
   - Go to Project Settings → Environment Variables
   - Add all three required API keys:
     - `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY`
     - `NEXT_PUBLIC_OPENWEATHER_API_KEY`
     - `NEXT_PUBLIC_GEMINI_API_KEY`

4. Deploy:
   - Click "Deploy"
   - Vercel will build and deploy your application
   - You'll receive a production URL (e.g., `your-app.vercel.app`)

### Deployment Configuration

The application is pre-configured for optimal Vercel deployment:

- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Framework**: Next.js (auto-detected)

### Environment Variables for Production

When deploying to production:

1. Use production API keys (not development keys)
2. Ensure all three environment variables are set
3. Verify API rate limits are appropriate for production traffic
4. Monitor API usage through respective dashboards

### Verifying Deployment

After deployment, verify:

1. All pages load correctly
2. Mood selection triggers destination suggestions
3. Images load from Unsplash
4. Weather data displays correctly
5. Favorites persist across page refreshes
6. Responsive design works on mobile devices

### Troubleshooting Deployment

**Build Fails:**
- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility (18+)
- Review build logs in Vercel dashboard

**API Errors in Production:**
- Confirm environment variables are set in Vercel
- Check API key validity and rate limits
- Review browser console for specific error messages

**Images Not Loading:**
- Verify Unsplash domain is configured in `next.config.mjs`
- Check Unsplash API key and rate limits

## Performance

The application is optimized for performance:

- **Image Optimization**: Next.js Image component with WebP format
- **Code Splitting**: Automatic route-based code splitting
- **Bundle Optimization**: Tree shaking and minification
- **Caching**: Static assets cached for 1 year
- **Compression**: Gzip compression enabled

Expected performance metrics:
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s
- Cumulative Layout Shift (CLS): < 0.1

## API Rate Limits

Be aware of API rate limits:

- **Unsplash**: 50 requests/hour (free tier)
- **OpenWeatherMap**: 60 requests/minute (free tier)
- **Google Gemini**: Varies by plan

The application implements caching to minimize API calls.

## License

MIT
