'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MissingEnvVar {
  key: string;
  description: string;
}

const ENV_VARS_INFO: Record<string, string> = {
  NEXT_PUBLIC_GEMINI_API_KEY: 'Google Gemini API (AI destination suggestions)',
  NEXT_PUBLIC_UNSPLASH_ACCESS_KEY: 'Unsplash API (destination images)',
  NEXT_PUBLIC_OPENWEATHER_API_KEY: 'OpenWeatherMap API (weather data)'
};

export default function EnvValidator() {
  const [missingVars, setMissingVars] = useState<MissingEnvVar[]>([]);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Check environment variables on client side
    const missing: MissingEnvVar[] = [];

    Object.entries(ENV_VARS_INFO).forEach(([key, description]) => {
      const value = process.env[key];
      if (!value || value.trim() === '') {
        missing.push({ key, description });
      }
    });

    if (missing.length > 0) {
      setMissingVars(missing);
      setShowWarning(true);
      
      // Log to console for developers
      console.group('⚠️ Missing Environment Variables');
      console.warn('The following API keys are not configured:');
      missing.forEach(({ key, description }) => {
        console.warn(`  ❌ ${key} - ${description}`);
      });
      console.warn('\nTo fix this:');
      console.warn('1. Create a .env.local file in the project root');
      console.warn('2. Add the missing variables:');
      missing.forEach(({ key }) => {
        console.warn(`   ${key}=your_api_key_here`);
      });
      console.warn('\n3. Restart the development server');
      console.warn('\nSee .env.example for reference.');
      console.groupEnd();
    } else {
      console.log('✅ All environment variables are configured');
    }
  }, []);

  if (missingVars.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      {showWarning && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-yellow-900 px-4 py-3 shadow-lg"
        >
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <svg 
                  className="w-6 h-6 flex-shrink-0 mt-0.5" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                    clipRule="evenodd" 
                  />
                </svg>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm md:text-base mb-1">
                    Configuration Required
                  </h3>
                  <p className="text-xs md:text-sm mb-2">
                    Missing API keys. Some features may not work properly:
                  </p>
                  <ul className="text-xs md:text-sm space-y-1 ml-4 list-disc">
                    {missingVars.map(({ key, description }) => (
                      <li key={key}>
                        <span className="font-mono text-xs">{key}</span> - {description}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs mt-2 opacity-90">
                    Add these to your <span className="font-mono">.env.local</span> file and restart the server.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowWarning(false)}
                className="text-yellow-900 hover:text-yellow-950 transition-colors ml-2 flex-shrink-0"
                aria-label="Dismiss warning"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path 
                    fillRule="evenodd" 
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
