'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function AdminHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-40 lg:left-64">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Mobile menu button and breadcrumb */}
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="hidden lg:block">
              <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Link href="/admin" className="hover:text-[#ec3137] transition-colors">
                  Admin Dashboard 2
                </Link>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-900 dark:text-white font-medium">Overview</span>
              </nav>
            </div>
          </div>

          {/* Right side - Search, notifications, profile */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden md:block relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#ec3137] focus:border-transparent"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM12 3c-3.314 0-6 2.686-6 6v4l-2 2h16l-2-2V9c0-3.314-2.686-6-6-6z" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="hidden lg:flex items-center gap-2">
              <button className="px-3 py-1.5 text-sm bg-[#ec3137] hover:bg-[#8a0f12] text-white rounded-lg transition-colors">
                New Order
              </button>
              <button className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
                Add Product
              </button>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-[#ec3137] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Admin User</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Super Admin</p>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                  <Link href="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Profile Settings
                  </Link>
                  <Link href="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    System Settings
                  </Link>
                  <hr className="my-1 border-gray-200 dark:border-gray-700" />
                  <Link href="/admin/logs" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Activity Logs
                  </Link>
                  <hr className="my-1 border-gray-200 dark:border-gray-700" />
                  <Link href="/" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    View Store
                  </Link>
                  <button className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
