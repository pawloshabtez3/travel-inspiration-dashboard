'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { CONFIG } from '@/lib/constants';
import DestinationCard from './DestinationCard';
import DestinationCardSkeleton from './DestinationCardSkeleton';

export default function DestinationGrid() {
  const destinations = useStore((state) => state.destinations);
  const isLoading = useStore((state) => state.isLoading);
  const favorites = useStore((state) => state.favorites);
  const toggleFavorite = useStore((state) => state.toggleFavorite);

  // Loading state with skeleton screens
  if (isLoading) {
    return (
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-4 lg:gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {[1, 2, 3].map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <DestinationCardSkeleton />
          </motion.div>
        ))}
      </motion.div>
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
