'use client';

import { useStore } from '@/lib/store';
import MoodSelector from '@/components/MoodSelector';
import DestinationGrid from '@/components/DestinationGrid';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExplorePage() {
  const { 
    selectedMood, 
    destinations, 
    isLoading, 
    error, 
    fetchDestinations,
    clearError 
  } = useStore();

  const handleMoodSelect = async (mood: string) => {
    await fetchDestinations(mood);
  };

  return (
    <main className="min-h-screen pt-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <motion.div 
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Explore Destinations
          </h1>
          <p className="text-gray-600">
            Select a mood to discover your perfect destination
          </p>
        </div>

        <MoodSelector 
          onMoodSelect={handleMoodSelect}
          selectedMood={selectedMood}
        />

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <svg 
                    className="w-5 h-5 text-red-500" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
                <button
                  onClick={clearError}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  aria-label="Dismiss error"
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
              {selectedMood && (
                <button
                  onClick={() => handleMoodSelect(selectedMood)}
                  className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors text-sm font-medium"
                >
                  Try Again
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              <p className="text-blue-800 font-medium">
                Discovering amazing destinations for you...
              </p>
            </div>
          </motion.div>
        )}

        {/* Destination Grid */}
        <DestinationGrid 
          destinations={destinations}
          isLoading={isLoading}
        />
      </motion.div>
    </main>
  );
}
