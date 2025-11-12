'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { CONFIG } from '@/lib/constants';
import DestinationCard from './DestinationCard';

export default function DestinationGrid() {
  const destinations = useStore((state) => state.destinations);
  const isLoading = useStore((state) => state.isLoading);
  const favorites = useStore((state) => state.favorites);
  const toggleFavorite = useStore((state) => state.toggleFavorite);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Finding your perfect destinations...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (destinations.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">
          Select a mood above to discover amazing destinations
        </p>
      </div>
    );
  }

  // Check if destination is favorited
  const isFavorite = (destinationId: string) => {
    return favorites.some(fav => fav.id === destinationId);
  };

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-4 lg:gap-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: CONFIG.STAGGER_DELAY
          }
        }
      }}
    >
      <AnimatePresence mode="wait">
        {destinations.map((destination) => (
          <DestinationCard
            key={destination.id}
            destination={destination}
            isFavorite={isFavorite(destination.id)}
            onToggleFavorite={() => toggleFavorite(destination)}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
