'use client';

import { motion } from 'framer-motion';

export default function DestinationCardSkeleton() {
  return (
    <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Image Skeleton */}
      <div className="relative h-64 w-full bg-gray-200 animate-pulse">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-300 via-gray-200 to-transparent" />
        
        {/* Favorite Button Skeleton */}
        <div className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-300 animate-pulse w-10 h-10" />
        
        {/* Content Overlay Skeleton */}
        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
          {/* Title Skeleton */}
          <div className="h-7 bg-gray-300 rounded w-3/4 animate-pulse" />
          {/* Country Skeleton */}
          <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse" />
          {/* Tagline Skeleton */}
          <div className="h-4 bg-gray-300 rounded w-full animate-pulse" />
        </div>
      </div>
      
      {/* Weather Widget Skeleton */}
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
