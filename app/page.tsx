'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const pageTransition = {
  duration: 0.4,
  ease: 'easeInOut' as const
};

export default function Home() {
  return (
    <motion.main 
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500" />
      
      {/* Animated overlay pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 text-center">
        {/* Hero Text with Animations */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-4xl font-bold text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-tight"
        >
          Find your next destination
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="mt-4 sm:mt-6 text-lg text-white/90 sm:text-xl md:text-2xl lg:text-3xl"
        >
          by mood
        </motion.p>
        
        {/* Call-to-Action Button with Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
          className="mt-8 sm:mt-12"
        >
          <Link
            href="/explore"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-white/20 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/30 hover:scale-105 border border-white/30 min-h-[48px]"
          >
            <span className="relative z-10">Start Exploring</span>
            <svg
              className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </motion.div>
        
        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-12 sm:mt-16 text-xs sm:text-sm text-white/70 px-4"
        >
          Powered by AI • Discover destinations that match your vibe
        </motion.div>
      </div>
      
      {/* Floating Elements for Visual Interest */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-20 left-10 h-32 w-32 rounded-full bg-white/10 backdrop-blur-md"
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-20 right-10 h-40 w-40 rounded-full bg-white/10 backdrop-blur-md"
      />
    </motion.main>
  );
}
