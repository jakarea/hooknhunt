'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '../../../node_modules/react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { getCartCount, toggleCart } = useCart();
  const { isAuthenticated, isLoading } = useAuth();

  // Prevent hydration mismatch by only rendering auth-dependent content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    let ticking = false;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollThreshold = 20; // Increased threshold to prevent jitter
          const compactThreshold = 150; // Increased threshold for better UX

          // Clear any existing timeout
          if (scrollTimeout) {
            clearTimeout(scrollTimeout);
          }

          // Debounce the scroll detection
          scrollTimeout = setTimeout(() => {
            // Make header compact when scrolling down past threshold
            if (currentScrollY > compactThreshold) {
              setIsScrolled(true);
              // Hide sections when scrolling down, show when scrolling up
              if (currentScrollY > lastScrollY + scrollThreshold) {
                setIsHeaderVisible(false);
              } else if (currentScrollY < lastScrollY - scrollThreshold) {
                setIsHeaderVisible(true);
              }
            } else {
              setIsScrolled(false);
              setIsHeaderVisible(true);
            }

            setLastScrollY(currentScrollY);
          }, 50); // 50ms debounce

          ticking = false;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [lastScrollY]);

  return (
    <header
      className={`sticky top-0 z-50 bg-white dark:bg-[#1a1a1a] shadow-sm transition-all duration-300 ease-out ${isScrolled ? 'shadow-lg' : 'shadow-sm'
        }`}
    >
      {/* Top Bar */}
      <div
        className={`bg-[#bc1215] text-white transition-transform duration-300 ease-out ${isHeaderVisible ? 'transform translate-y-0' : 'transform -translate-y-full'
          }`}
      >
        <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12">
          <div className="flex justify-between items-center h-7 text-xs">
            <div className="flex items-center">
              <span className="hidden sm:inline">{t('header.welcome')}</span>
              <span className="sm:hidden">{t('header.welcomeShort')}</span>
            </div>
            <div className="flex items-center space-x-6">
              <a href="tel:01841544590" className="flex items-center hover:opacity-80 transition-opacity">
                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="hidden sm:inline">01841544590</span>
              </a>

              {/* Language Switcher */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => changeLanguage('bn')}
                  className={`px-2 py-0.5 text-xs font-medium  transition-colors ${i18n.language === 'bn' ? 'bg-white text-[#bc1215]' : 'bg-transparent hover:bg-white/20'
                    }`}
                >
                  বাংলা
                </button>
                <button
                  onClick={() => changeLanguage('en')}
                  className={`px-2 py-0.5 text-xs font-medium  transition-colors ${i18n.language === 'en' ? 'bg-white text-[#bc1215]' : 'bg-transparent hover:bg-white/20'
                    }`}
                >
                  EN
                </button>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="hover:opacity-80 transition-opacity"
                aria-label="Toggle theme"
              >
                {mounted ? (
                  theme === 'light' ? (
                    <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  ) : (
                    <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  )
                ) : (
                  <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              <div className="flex items-center gap-3">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-75 transition-opacity">
                  <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-75 transition-opacity">
                  <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-75 transition-opacity">
                  <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div
        className={`bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-out ${isHeaderVisible ? 'transform translate-y-0' : 'transform -translate-y-20'
          }`}
      >
        <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/hook-and-hunt-logo.svg"
                alt="Hook & Hunt"
                width={180}
                height={60}
                className="w-auto h-10"
                priority
              />
            </Link>

            {/* Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-[600px]">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder={t('header.search')}
                  className="w-full h-11 px-4 pr-12 text-[15px] border border-gray-300 dark:border-gray-700 -md focus:outline-none focus:border-[#bc1215] transition-colors bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100"
                />
                <button className="absolute right-0 top-0 h-11 px-5 bg-[#bc1215] text-white -r-md hover:bg-[#9a0f12] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-6">
              {mounted && !isLoading && (
                <Link href={isAuthenticated ? "/account" : "/login"} className="hidden sm:flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-[#bc1215] dark:hover:text-[#bc1215] transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-[15px] font-medium">
                    {isAuthenticated ? t('header.account') : t('header.login')}
                  </span>
                </Link>
              )}
              {!mounted && (
                <div className="hidden sm:flex items-center gap-2 w-24 h-6">
                  {/* Placeholder to prevent layout shift */}
                </div>
              )}

              <button
                onClick={toggleCart}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-[#bc1215] dark:hover:text-[#bc1215] transition-colors relative group"
              >
                <div className="relative">
                  <svg className="w-6 h-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {mounted && getCartCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#bc1215] text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 animate-pulse">
                      {getCartCount()}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline text-[15px] font-medium">{t('header.cart')}</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 text-gray-700 dark:text-gray-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu - Desktop */}
      <div
        className="hidden lg:block bg-[#f5f5f5] dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12">
          <nav className="flex items-center justify-start gap-8">
            <Link href="/" className="py-2.5 text-[15px] font-medium text-gray-800 dark:text-gray-200 hover:text-[#bc1215] dark:hover:text-[#bc1215] transition-colors relative group">
              {t('nav.home')}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#bc1215] transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
            </Link>

            <Link href="/products?category=rods" className="py-2.5 text-[15px] font-medium text-gray-800 dark:text-gray-200 hover:text-[#bc1215] dark:hover:text-[#bc1215] transition-colors relative group">
              {t('nav.rods')}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#bc1215] transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
            </Link>

            <Link href="/products?category=reels" className="py-2.5 text-[15px] font-medium text-gray-800 dark:text-gray-200 hover:text-[#bc1215] dark:hover:text-[#bc1215] transition-colors relative group">
              {t('nav.reels')}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#bc1215] transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
            </Link>

            <Link href="/products?category=lures" className="py-2.5 text-[15px] font-medium text-gray-800 dark:text-gray-200 hover:text-[#bc1215] dark:hover:text-[#bc1215] transition-colors relative group">
              {t('nav.lures')}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#bc1215] transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
            </Link>

            <Link href="/products?category=lines" className="py-2.5 text-[15px] font-medium text-gray-800 dark:text-gray-200 hover:text-[#bc1215] dark:hover:text-[#bc1215] transition-colors relative group">
              {t('nav.lines')}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#bc1215] transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
            </Link>

            <Link href="/products?category=accessories" className="py-2.5 text-[15px] font-medium text-gray-800 dark:text-gray-200 hover:text-[#bc1215] dark:hover:text-[#bc1215] transition-colors relative group">
              {t('nav.accessories')}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#bc1215] transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
            </Link>

            <Link href="/contact" className="py-2.5 text-[15px] font-medium text-gray-800 dark:text-gray-200 hover:text-[#bc1215] dark:hover:text-[#bc1215] transition-colors relative group">
              {t('nav.contact')}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#bc1215] transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800 shadow-lg transition-colors duration-200">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <div className="relative">
              <input
                type="text"
                placeholder={t('header.search')}
                className="w-full h-11 px-4 pr-12 text-[15px] border border-gray-300 dark:border-gray-700 -md focus:outline-none focus:border-[#bc1215] bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100"
              />
              <button className="absolute right-0 top-0 h-11 px-4 bg-[#bc1215] text-white -r-md">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex flex-col">
              <Link href="/" className="px-4 py-3 text-[15px] font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] hover:text-[#bc1215] transition-colors" onClick={() => setIsMenuOpen(false)}>
                {t('nav.home')}
              </Link>
              <Link href="/products?category=rods" className="px-4 py-3 text-[15px] font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] hover:text-[#bc1215] transition-colors" onClick={() => setIsMenuOpen(false)}>
                {t('nav.rods')}
              </Link>
              <Link href="/products?category=reels" className="px-4 py-3 text-[15px] font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] hover:text-[#bc1215] transition-colors" onClick={() => setIsMenuOpen(false)}>
                {t('nav.reels')}
              </Link>
              <Link href="/products?category=lures" className="px-4 py-3 text-[15px] font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] hover:text-[#bc1215] transition-colors" onClick={() => setIsMenuOpen(false)}>
                {t('nav.lures')}
              </Link>
              <Link href="/products?category=lines" className="px-4 py-3 text-[15px] font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] hover:text-[#bc1215] transition-colors" onClick={() => setIsMenuOpen(false)}>
                {t('nav.lines')}
              </Link>
              <Link href="/products?category=accessories" className="px-4 py-3 text-[15px] font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] hover:text-[#bc1215] transition-colors" onClick={() => setIsMenuOpen(false)}>
                {t('nav.accessories')}
              </Link>
              <Link href="/contact" className="px-4 py-3 text-[15px] font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] hover:text-[#bc1215] transition-colors" onClick={() => setIsMenuOpen(false)}>
                {t('nav.contact')}
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
