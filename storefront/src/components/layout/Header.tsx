'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/contexts/ThemeContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { staticCategories } from '@/data/static-products';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isNavSticky, setIsNavSticky] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { getCartCount, toggleCart } = useCart();
  const { isAuthenticated, isLoading } = useAuth();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsNavSticky(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/flash-sale', label: 'Flash Sale', icon: '🔥' },
    { href: '/products', label: 'All Product', icon: '🎣' },
  ];

  const navItemsAfterCategory = [
    { href: '/track-order', label: 'Track Order', icon: '📦' },
    { href: '/contact', label: 'Contact', icon: '📞' },
  ];

  return (
    <header className="bg-white dark:bg-[#0a0a0a] z-50">
      {/* Top Bar */}
      <div className="bg-[#ec3137] text-white">
        <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12">
          <div className="flex justify-between items-center py-2 text-xs sm:text-sm">
            <div className="flex items-center">
              <span className="hidden sm:inline">Welcome to Hook & Hunt</span>
              <span className="sm:hidden">Welcome</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="tel:01841544590" className="flex items-center hover:opacity-80 transition-opacity">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="hidden sm:inline">01841544590</span>
              </a>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="hover:opacity-80 transition-opacity"
                aria-label="Toggle theme"
              >
                {mounted && theme === 'light' ? (
                  <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                ) : (
                  <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between gap-4 py-3 sm:py-4">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/hook-and-hunt-logo.svg"
                alt="Hook & Hunt"
                width={180}
                height={60}
                className="w-auto h-10 sm:h-12"
                priority
              />
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-[400px] lg:max-w-[500px]">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full h-10 px-4 pr-12 text-sm border border-gray-300 dark:border-gray-700 rounded-l-md focus:outline-none focus:border-[#ec3137] transition-colors bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100"
                />
                <button className="absolute right-0 top-0 h-10 px-4 bg-[#ec3137] text-white rounded-r-md hover:bg-[#9a0f12] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-3 sm:gap-6">
              {mounted && !isLoading && (
                <Link href={isAuthenticated ? "/account" : "/login"} className="hidden sm:flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-[#ec3137] transition-colors">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm sm:text-base font-medium">
                    {isAuthenticated ? 'Account' : 'Login'}
                  </span>
                </Link>
              )}

              <button
                onClick={toggleCart}
                className="flex items-center gap-1 sm:gap-2 text-gray-700 dark:text-gray-300 hover:text-[#ec3137] transition-colors relative"
              >
                <div className="relative">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {mounted && getCartCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#ec3137] text-white text-[10px] sm:text-xs font-bold rounded-full min-w-[16px] sm:min-w-[18px] h-[16px] sm:h-[18px] flex items-center justify-center px-1">
                      {getCartCount()}
                    </span>
                  )}
                </div>
                
              </button>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 text-gray-700 dark:text-gray-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
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
      <div className={`hidden lg:block bg-gray-50 dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-800 transition-all duration-300 ${isNavSticky ? 'sticky top-0 z-40 shadow-md' : ''}`}>
        <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12">
          <nav className="flex items-center justify-start gap-6 sm:gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-3 text-sm md:text-base font-medium text-gray-800 dark:text-gray-200 hover:text-[#ec3137] transition-colors relative group flex items-center gap-1"
              >
                {item.icon && <span>{item.icon}</span>}
                {item.label}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#ec3137] transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
              </Link>
            ))}

            {/* Category Dropdown - After All Product, with Hover */}
            <div
              className="relative group"
              onMouseEnter={() => setIsCategoryDropdownOpen(true)}
              onMouseLeave={() => setIsCategoryDropdownOpen(false)}
            >
              <button className="py-3 text-sm md:text-base font-medium text-gray-800 dark:text-gray-200 hover:text-[#ec3137] transition-colors relative group flex items-center gap-1">
                <span>📁</span>
                Category
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#ec3137] transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
              </button>

              {/* Dropdown Menu - Shows on Hover */}
              <div className={`absolute top-full left-0 mt-1 w-56 bg-white dark:bg-[#1a1a1a] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 transition-opacity duration-200 ${isCategoryDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <div className="max-h-[400px] overflow-y-auto">
                  {staticCategories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/products?category=${category.slug}`}
                      className="block px-4 py-2 text-sm md:text-base text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] hover:text-[#ec3137] transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Track Order & Contact - After Category */}
            {navItemsAfterCategory.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-3 text-sm md:text-base font-medium text-gray-800 dark:text-gray-200 hover:text-[#ec3137] transition-colors relative group flex items-center gap-1"
              >
                {item.icon && <span>{item.icon}</span>}
                {item.label}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#ec3137] transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-800 shadow-lg">
          <div className="px-4 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Mobile Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full h-10 px-4 pr-12 text-sm border border-gray-300 dark:border-gray-700 rounded-l-md focus:outline-none focus:border-[#ec3137] bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100"
              />
              <button className="absolute right-0 top-0 h-10 px-4 bg-[#ec3137] text-white rounded-r-md">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-3 text-sm md:text-base font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] hover:text-[#ec3137] transition-colors flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon && <span>{item.icon}</span>}
                  {item.label}
                </Link>
              ))}

              {/* Mobile Categories */}
              <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4">
                <div className="px-4 py-2 text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <span>📁</span>
                  Categories
                </div>
                {staticCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.slug}`}
                    className="block px-4 py-2 pl-8 text-sm md:text-base text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] hover:text-[#ec3137] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              {/* Track Order & Contact - After Categories */}
              <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4">
                {navItemsAfterCategory.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-4 py-3 text-sm md:text-base font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] hover:text-[#ec3137] transition-colors flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon && <span>{item.icon}</span>}
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
