'use client';

import { motion } from 'framer-motion';
import { MOOD_CATEGORIES, type MoodCategory } from '@/lib/constants';

interface MoodSelectorProps {
  onMoodSelect: (mood: string) => void;
  selectedMood: string | null;
}

export default function MoodSelector({ onMoodSelect, selectedMood }: MoodSelectorProps) {
  return (
    <div className="w-full mb-8 md:mb-12">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 md:mb-6 text-center px-4">
        How are you feeling?
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {MOOD_CATEGORIES.map((mood) => (
          <MoodButton
            key={mood.id}
            mood={mood}
            isSelected={selectedMood === mood.id}
            onClick={() => onMoodSelect(mood.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface MoodButtonProps {
  mood: MoodCategory;
  isSelected: boolean;
  onClick: () => void;
}

function MoodButton({ mood, isSelected, onClick }: MoodButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl p-4 sm:p-5 lg:p-6 
        transition-all duration-200 min-h-[100px] sm:min-h-[120px]
        ${isSelected 
          ? 'ring-4 ring-blue-500 shadow-xl scale-105' 
          : 'ring-2 ring-gray-200 hover:ring-gray-300 hover:shadow-lg'
        }
      `}
      whileHover={{ 
        scale: isSelected ? 1.05 : 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      title={mood.description}
    >
      {/* Gradient Background with Brightness Hover Effect */}
      <motion.div 
        className={`
          absolute inset-0 bg-gradient-to-br ${mood.gradient}
          ${isSelected ? 'opacity-100' : 'opacity-80'}
        `}
        whileHover={{ 
          filter: 'brightness(1.15)',
          transition: { duration: 0.2 }
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-2">
        <span className="text-3xl sm:text-4xl" role="img" aria-label={mood.label}>
          {mood.emoji}
        </span>
        <span className="text-xs sm:text-sm font-semibold text-white drop-shadow-md">
          {mood.label}
        </span>
      </div>
      
      {/* Selected Indicator */}
      {isSelected && (
        <motion.div
          className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <svg 
            className="w-4 h-4 text-blue-500" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
              clipRule="evenodd" 
            />
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
}
