'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function UserNavigation() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/account', icon: '📊' },
    { name: 'Profile', href: '/account/profile', icon: '👤' },
    { name: 'Orders', href: '/account/orders', icon: '🛒' },
    { name: 'Wishlist', href: '/account/wishlist', icon: '❤️' },
    { name: 'Affiliate', href: '/account/affiliate', icon: '🤝' },
    { name: 'Addresses', href: '/account/addresses', icon: '📍' },
    { name: 'Settings', href: '/account/settings', icon: '⚙️' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Account</h3>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              pathname === item.href
                ? 'bg-[#bc1215] text-white'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
