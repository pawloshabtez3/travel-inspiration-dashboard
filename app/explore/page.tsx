'use client';

import { useStore } from '@/lib/store';
import MoodSelector from '@/components/MoodSelector';
import DestinationGrid from '@/components/DestinationGrid';
import FavoritesPanel from '@/components/FavoritesPanel';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { motion, AnimatePresence } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const pageTransition = {
  duration: 0.4,
  ease: 'easeInOut' as const
};

export default function ExplorePage() {
  const { 
    selectedMood, 
    destinations, 
    isLoading, 
    error, 
    favorites,
    fetchDestinations,
    clearError,
    toggleFavorite
  } = useStore();

  const handleMoodSelect = async (mood: string) => {
    await fetchDestinations(mood);
  };

  return (
    <motion.main 
      className="min-h-screen pt-16 lg:pt-20 pb-24 md:pb-8 bg-gradient-to-br from-gray-50 to-gray-100"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 md:py-8 lg:py-10 max-w-7xl">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Explore Destinations
          </h1>
          <p className="text-sm sm:text-base text-gray-600 px-4">
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
            <ErrorMessage
              message={error.message}
              type={error.type}
              onRetry={selectedMood ? () => handleMoodSelect(selectedMood) : undefined}
              onDismiss={clearError}
              showRetry={!!selectedMood}
            />
          )}
        </AnimatePresence>

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-6 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <div className="flex items-center justify-center space-x-4">
              <LoadingSpinner size="md" />
              <p className="text-sm lg:text-base text-blue-800 font-medium">
                Discovering amazing destinations for you...
              </p>
            </div>
          </motion.div>
        )}

        {/* Destination Grid */}
        <DestinationGrid />
      </div>

      {/* Favorites Panel */}
      <FavoritesPanel 
        favorites={favorites}
        onRemoveFavorite={(id) => {
          const destination = favorites.find(fav => fav.id === id);
          if (destination) {
            toggleFavorite(destination);
          }
        }}
      />
    </motion.main>
  );
}
