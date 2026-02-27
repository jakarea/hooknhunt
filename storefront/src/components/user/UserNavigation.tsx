'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

export default function UserNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menuItems = [
    { name: 'Dashboard', href: '/account', icon: '📊' },
    { name: 'Profile', href: '/account/profile', icon: '👤' },
    { name: 'Orders', href: '/account/orders', icon: '🛒' },
    { name: 'Wishlist', href: '/account/wishlist', icon: '❤️' },
    { name: 'Affiliate', href: '/account/affiliate', icon: '🤝' },
    { name: 'Addresses', href: '/account/addresses', icon: '📍' },
    { name: 'Settings', href: '/account/settings', icon: '⚙️' },
  ];

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      console.log('🔵 [LOGOUT] Starting logout process...');
      await logout();
      console.log('✅ [LOGOUT] Logout successful');
      toast.success('Logged out successfully!', {
        duration: 3000,
      });

      // Redirect to home page after a short delay
      setTimeout(() => {
        router.push('/');
      }, 500);
    } catch (error: unknown) {
      console.error('❌ [LOGOUT] Logout failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Logout failed. Please try again.';
      toast.error(errorMessage);
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Account</h3>

        <nav className="space-y-2 mb-6">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                pathname === item.href
                  ? 'bg-[#ec3137] text-white'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging out...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
