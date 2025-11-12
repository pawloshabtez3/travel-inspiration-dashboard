'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export type ErrorType = 'gemini' | 'unsplash' | 'weather' | 'network' | 'storage' | 'generic';

interface ErrorMessageProps {
  message: string;
  type?: ErrorType;
  onRetry?: () => void | Promise<void>;
  onDismiss?: () => void;
  showRetry?: boolean;
}

const ERROR_ICONS: Record<ErrorType, string> = {
  gemini: '🤖',
  unsplash: '🖼️',
  weather: '🌤️',
  network: '📡',
  storage: '💾',
  generic: '⚠️'
};

const ERROR_TITLES: Record<ErrorType, string> = {
  gemini: 'AI Service Error',
  unsplash: 'Image Loading Error',
  weather: 'Weather Service Error',
  network: 'Connection Error',
  storage: 'Storage Error',
  generic: 'Error'
};

export default function ErrorMessage({ 
  message, 
  type = 'generic',
  onRetry, 
  onDismiss,
  showRetry = true
}: ErrorMessageProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [retryDelay, setRetryDelay] = useState(0);

  // Calculate exponential backoff delay
  const calculateBackoff = (attempt: number): number => {
    // Exponential backoff: 1s, 2s, 4s, 8s, max 10s
    return Math.min(1000 * Math.pow(2, attempt), 10000);
  };

  // Reset retry delay when it reaches 0
  useEffect(() => {
    if (retryDelay > 0) {
      const timer = setTimeout(() => {
        setRetryDelay(prev => Math.max(0, prev - 100));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [retryDelay]);

  const handleRetry = async () => {
    if (!onRetry || isRetrying || retryDelay > 0) return;

    setIsRetrying(true);
    
    try {
      await onRetry();
      // Reset retry count on success
      setRetryCount(0);
    } catch (error) {
      // Increment retry count and set backoff delay
      const newRetryCount = retryCount + 1;
      setRetryCount(newRetryCount);
      setRetryDelay(calculateBackoff(newRetryCount));
    } finally {
      setIsRetrying(false);
    }
  };

  const retryDelaySeconds = Math.ceil(retryDelay / 1000);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <span className="text-2xl flex-shrink-0" role="img" aria-label={ERROR_TITLES[type]}>
            {ERROR_ICONS[type]}
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm lg:text-base font-semibold text-red-900 mb-1">
              {ERROR_TITLES[type]}
            </h3>
            <p className="text-sm text-red-800">{message}</p>
            
            {retryCount > 0 && (
              <p className="text-xs text-red-600 mt-2">
                Retry attempt {retryCount} failed. 
                {retryDelay > 0 && ` Please wait ${retryDelaySeconds}s before retrying.`}
              </p>
            )}
          </div>
        </div>
        
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-500 hover:text-red-700 transition-colors ml-2 flex-shrink-0"
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
        )}
      </div>

      {showRetry && onRetry && (
        <div className="mt-3 flex items-center space-x-3">
          <button
            onClick={handleRetry}
            disabled={isRetrying || retryDelay > 0}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium flex items-center space-x-2"
          >
            {isRetrying ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                    fill="none"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Retrying...</span>
              </>
            ) : retryDelay > 0 ? (
              <span>Retry in {retryDelaySeconds}s</span>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path 
                    fillRule="evenodd" 
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" 
                    clipRule="evenodd" 
                  />
                </svg>
                <span>Try Again</span>
              </>
            )}
          </button>
          
          {retryCount > 2 && (
            <p className="text-xs text-red-600">
              Multiple retries failed. Please check your connection or try again later.
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}
