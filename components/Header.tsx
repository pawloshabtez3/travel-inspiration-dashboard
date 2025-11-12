'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo/Title */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 group"
          >
            <div className="text-2xl lg:text-3xl transition-transform duration-300 group-hover:scale-110">
              ✈️
            </div>
            <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TravelMood
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            {!isLandingPage && (
              <Link
                href="/"
                className="text-sm lg:text-base font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
              >
                Home
              </Link>
            )}
            <Link
              href="/explore"
              className={`text-sm lg:text-base font-medium transition-colors duration-200 ${
                pathname === '/explore'
                  ? 'text-purple-600'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Explore
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
