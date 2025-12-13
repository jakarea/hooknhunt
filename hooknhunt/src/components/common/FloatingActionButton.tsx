'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function FloatingActionButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const { getCartCount, toggleCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setShowQuickActions(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);


  const quickActions = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      label: 'Cart',
      action: () => {
        toggleCart();
        setShowQuickActions(false);
      },
      color: 'bg-[#bc1215] hover:bg-[#8a0f12]',
      count: getCartCount(),
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      label: 'Search',
      action: () => {
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
        setShowQuickActions(false);
      },
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      label: 'Support',
      action: () => {
        router.push('/contact');
        setShowQuickActions(false);
      },
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      label: 'WhatsApp',
      action: () => {
        window.open('https://wa.me/8801841544590', '_blank');
        setShowQuickActions(false);
      },
      color: 'bg-green-500 hover:bg-green-600',
    },
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Quick Actions */}
      {showQuickActions && (
        <div className="absolute bottom-16 right-0 space-y-3 mb-4">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className="flex items-center gap-3 animate-fadeInUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
                {action.label}
                {action.count && action.count > 0 && (
                  <span className="ml-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                    {action.count}
                  </span>
                )}
              </span>
              <button
                onClick={action.action}
                className={`w-12 h-12 ${action.color} text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center cursor-pointer`}
              >
                {action.icon}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setShowQuickActions(!showQuickActions)}
        className="w-14 h-14 bg-gradient-to-r from-[#bc1215] to-[#8a0f12] hover:from-[#8a0f12] hover:to-[#bc1215] text-white rounded-full transition-all duration-300 transform hover:scale-110 flex items-center justify-center group cursor-pointer shadow-lg hover:shadow-xl"
      >
        <svg
          className={`w-6 h-6 transition-transform duration-300 ${showQuickActions ? 'rotate-45' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

    </div>
  );
}
