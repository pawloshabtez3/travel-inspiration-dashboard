'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Destination } from '@/lib/store';

interface DestinationGridProps {
  destinations: Destination[];
  isLoading: boolean;
}

export default function DestinationGrid({ destinations, isLoading }: DestinationGridProps) {
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

  if (destinations.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">
          Select a mood above to discover amazing destinations
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      <AnimatePresence mode="wait">
        {destinations.map((destination) => (
          <motion.div
            key={destination.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-md p-4 hover:shadow-xl transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-800">{destination.name}</h3>
            <p className="text-gray-600">{destination.country}</p>
            <p className="text-sm text-gray-500 mt-2">{destination.tagline}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
