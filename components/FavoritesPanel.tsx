'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Destination } from '@/lib/store';
import { useState } from 'react';

interface FavoritesPanelProps {
  favorites: Destination[];
  onRemoveFavorite: (id: string) => void;
}

export default function FavoritesPanel({ favorites, onRemoveFavorite }: FavoritesPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (favorites.length === 0) {
    return null;
  }

  return (
    <>
      {/* Toggle Button - Fixed position with proper touch target */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 z-50 bg-gradient-to-r from-pink-500 to-red-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow min-w-[56px] min-h-[56px] flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle favorites panel"
      >
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          {favorites.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-red-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {favorites.length}
            </span>
          )}
        </div>
      </motion.button>

      {/* Panel - Mobile: Bottom Sheet, Desktop: Right Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop - Only on mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />

            {/* Panel Content - Mobile: Bottom Sheet, Tablet+: Right Sidebar */}
            <motion.div
              initial={{ 
                x: typeof window !== 'undefined' && window.innerWidth >= 768 ? '100%' : 0,
                y: typeof window !== 'undefined' && window.innerWidth < 768 ? '100%' : 0
              }}
              animate={{ 
                x: 0,
                y: 0
              }}
              exit={{ 
                x: typeof window !== 'undefined' && window.innerWidth >= 768 ? '100%' : 0,
                y: typeof window !== 'undefined' && window.innerWidth < 768 ? '100%' : 0
              }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 md:right-0 md:top-0 md:bottom-0 md:left-auto w-full md:w-96 lg:w-[350px] max-h-[80vh] md:max-h-full bg-white shadow-2xl z-50 overflow-hidden flex flex-col rounded-t-3xl md:rounded-none"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white p-5 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">My Favorites</h2>
                    <p className="text-pink-100 text-xs md:text-sm mt-1">
                      {favorites.length} {favorites.length === 1 ? 'destination' : 'destinations'}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Close favorites panel"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Favorites Grid */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-1 gap-4">
                  <AnimatePresence mode="popLayout">
                    {favorites.map((destination) => (
                      <motion.div
                        key={destination.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="relative bg-white rounded-lg shadow-md overflow-hidden group"
                      >
                        <div className="flex items-center space-x-4 p-3">
                          {/* Thumbnail */}
                          <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                            <Image
                              src={destination.imageUrl}
                              alt={destination.name}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {destination.name}
                            </h3>
                            <p className="text-sm text-gray-500 truncate">
                              {destination.country}
                            </p>
                            {destination.weather && (
                              <p className="text-xs text-gray-400 mt-1">
                                {destination.weather.temperature}°C • {destination.weather.condition}
                              </p>
                            )}
                          </div>

                          {/* Remove Button */}
                          <motion.button
                            onClick={() => onRemoveFavorite(destination.id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                            aria-label={`Remove ${destination.name} from favorites`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
