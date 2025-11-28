'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MenuItem {
  name: string;
  href: string;
  icon: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: '📊'
  },
  {
    name: 'Products',
    href: '/admin/products',
    icon: '📦',
    children: [
      { name: 'All Products', href: '/admin/products', icon: '📋' },
      { name: 'Add Product', href: '/admin/products/new', icon: '➕' },
      { name: 'Categories', href: '/admin/products/categories', icon: '🏷️' },
      { name: 'Attributes', href: '/admin/products/attributes', icon: '⚙️' }
    ]
  },
  {
    name: 'Inventory',
    href: '/admin/inventory',
    icon: '📊',
    children: [
      { name: 'Stock Overview', href: '/admin/inventory', icon: '📈' },
      { name: 'Stock Movements', href: '/admin/inventory/movements', icon: '🔄' },
      { name: 'Low Stock Alerts', href: '/admin/inventory/alerts', icon: '⚠️' },
      { name: 'Stock Adjustments', href: '/admin/inventory/adjustments', icon: '✏️' }
    ]
  },
  {
    name: 'Orders',
    href: '/admin/orders',
    icon: '🛒',
    children: [
      { name: 'All Orders', href: '/admin/orders', icon: '📋' },
      { name: 'Pending Orders', href: '/admin/orders/pending', icon: '⏳' },
      { name: 'Processing', href: '/admin/orders/processing', icon: '🔄' },
      { name: 'Shipped', href: '/admin/orders/shipped', icon: '🚚' },
      { name: 'Returns', href: '/admin/orders/returns', icon: '↩️' }
    ]
  },
  {
    name: 'Customers',
    href: '/admin/customers',
    icon: '👥',
    children: [
      { name: 'All Customers', href: '/admin/customers', icon: '👤' },
      { name: 'Dealers', href: '/admin/customers/dealers', icon: '🏪' },
      { name: 'Affiliates', href: '/admin/customers/affiliates', icon: '🤝' },
      { name: 'Dropshippers', href: '/admin/customers/dropshippers', icon: '📦' }
    ]
  },
  {
    name: 'Financial',
    href: '/admin/financial',
    icon: '💰',
    children: [
      { name: 'Revenue Overview', href: '/admin/financial', icon: '📊' },
      { name: 'Profit & Loss', href: '/admin/financial/profit-loss', icon: '📈' },
      { name: 'Expenses', href: '/admin/financial/expenses', icon: '💸' },
      { name: 'Commissions', href: '/admin/financial/commissions', icon: '🤝' }
    ]
  },
  {
    name: 'Reports',
    href: '/admin/reports',
    icon: '📊',
    children: [
      { name: 'Sales Reports', href: '/admin/reports/sales', icon: '📈' },
      { name: 'Inventory Reports', href: '/admin/reports/inventory', icon: '📦' },
      { name: 'Customer Reports', href: '/admin/reports/customers', icon: '👥' },
      { name: 'Performance', href: '/admin/reports/performance', icon: '🎯' }
    ]
  },
  {
    name: 'Suppliers',
    href: '/admin/suppliers',
    icon: '🏭'
  },
  {
    name: 'Marketing',
    href: '/admin/marketing',
    icon: '📢',
    children: [
      { name: 'Campaigns', href: '/admin/marketing/campaigns', icon: '🎯' },
      { name: 'Coupons', href: '/admin/marketing/coupons', icon: '🎫' },
      { name: 'Email Marketing', href: '/admin/marketing/email', icon: '📧' },
      { name: 'Analytics', href: '/admin/marketing/analytics', icon: '📊' }
    ]
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: '⚙️',
    children: [
      { name: 'General', href: '/admin/settings', icon: '🔧' },
      { name: 'Users & Roles', href: '/admin/settings/users', icon: '👤' },
      { name: 'Payment Methods', href: '/admin/settings/payments', icon: '💳' },
      { name: 'Shipping', href: '/admin/settings/shipping', icon: '🚚' },
      { name: 'Notifications', href: '/admin/settings/notifications', icon: '🔔' }
    ]
  }
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  const isActive = (href: string) => pathname === href;
  const isParentActive = (item: MenuItem) => {
    if (isActive(item.href)) return true;
    return item.children?.some(child => isActive(child.href)) || false;
  };

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 overflow-y-auto z-30">
      <div className="p-4">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-[#bc1215] rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">H&H</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Hook & Hunt 1</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel 2</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <div key={item.name}>
              {/* Main Menu Item */}
              <div>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group ${
                    isParentActive(item)
                      ? 'bg-[#bc1215] text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                  {item.children && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleExpanded(item.name);
                      }}
                      className="ml-auto"
                    >
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          expandedItems.includes(item.name) ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                </Link>

                {/* Sub Menu Items */}
                {item.children && expandedItems.includes(item.name) && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                          isActive(child.href)
                            ? 'bg-[#bc1215] text-white'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span>{child.icon}</span>
                        <span>{child.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-2">
            <Link
              href="/admin/help"
              className="flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <span className="text-lg">❓</span>
              <span className="font-medium">Help & Support</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <span className="text-lg">🏪</span>
              <span className="font-medium">View Store</span>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
