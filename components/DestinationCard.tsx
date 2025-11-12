'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Destination } from '@/lib/store';
import { CONFIG } from '@/lib/constants';
import WeatherWidget from './WeatherWidget';

interface DestinationCardProps {
  destination: Destination;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function DestinationCard({ 
  destination, 
  isFavorite, 
  onToggleFavorite 
}: DestinationCardProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ 
        scale: CONFIG.HOVER_SCALE,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        transition: { duration: 0.2 }
      }}
      transition={{ duration: 0.2 }}
      className="relative bg-white rounded-xl shadow-lg overflow-hidden group cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative h-56 sm:h-64 lg:h-72 w-full">
        <Image
          src={destination.imageUrl}
          alt={`${destination.name}, ${destination.country}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
          loading="lazy"
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmQAAA/9k="
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Favorite Button */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          whileHover={{ 
            scale: 1.1,
            backgroundColor: 'rgba(255, 255, 255, 1)',
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            className="w-6 h-6"
            animate={{ 
              color: isFavorite ? '#ef4444' : '#374151',
              scale: isFavorite ? [1, 1.2, 1] : 1
            }}
            transition={{ 
              color: { duration: 0.2 },
              scale: { duration: 0.3 }
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </motion.svg>
        </motion.button>
        
        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
          <h3 className="text-xl sm:text-2xl font-bold mb-1">{destination.name}</h3>
          <p className="text-xs sm:text-sm text-gray-200 mb-2">{destination.country}</p>
          <p className="text-xs sm:text-sm text-gray-100 line-clamp-2">{destination.tagline}</p>
        </div>
      </div>
      
      {/* Weather Widget */}
      <div className="p-4">
        <WeatherWidget 
          destinationName={destination.name}
          weather={destination.weather}
        />
      </div>
    </motion.div>
  );
}
