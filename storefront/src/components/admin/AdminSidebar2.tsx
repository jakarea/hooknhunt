'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '../../../node_modules/react-i18next';
import '../../lib/i18n'; // Import the i18n instance

interface MenuItem {
  name: string;
  tKey: string;
  href: string;
  icon: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    tKey: 'dashboard',
    href: '/admin',
    icon: '📊'
  },
  {
    name: 'Products',
    tKey: 'products',
    href: '/admin/products',
    icon: '📦',
    children: [
      { name: 'All Products', tKey: 'allProducts', href: '/admin/products', icon: '📋' },
      { name: 'Add Product', tKey: 'addProduct', href: '/admin/products/new', icon: '➕' },
      { name: 'Categories', tKey: 'categories', href: '/admin/products/categories', icon: '🏷️' },
      { name: 'Attributes', tKey: 'attributes', href: '/admin/products/attributes', icon: '⚙️' }
    ]
  },
  {
    name: 'Inventory',
    tKey: 'inventory',
    href: '/admin/inventory',
    icon: '📊',
    children: [
      { name: 'Stock Overview', tKey: 'stockOverview', href: '/admin/inventory', icon: '📈' },
      { name: 'Stock Movements', tKey: 'stockMovements', href: '/admin/inventory/movements', icon: '🔄' },
      { name: 'Low Stock Alerts', tKey: 'lowStockAlerts', href: '/admin/inventory/alerts', icon: '⚠️' },
      { name: 'Stock Adjustments', tKey: 'stockAdjustments', href: '/admin/inventory/adjustments', icon: '✏️' }
    ]
  },
  {
    name: 'Orders',
    tKey: 'orders',
    href: '/admin/orders',
    icon: '🛒',
    children: [
      { name: 'All Orders', tKey: 'allOrders', href: '/admin/orders', icon: '📋' },
      { name: 'Pending Orders', tKey: 'pendingOrders', href: '/admin/orders/pending', icon: '⏳' },
      { name: 'Processing', tKey: 'processing', href: '/admin/orders/processing', icon: '🔄' },
      { name: 'Shipped', tKey: 'shipped', href: '/admin/orders/shipped', icon: '🚚' },
      { name: 'Returns', tKey: 'returns', href: '/admin/orders/returns', icon: '↩️' }
    ]
  },
  {
    name: 'Customers',
    tKey: 'customers',
    href: '/admin/customers',
    icon: '👥',
    children: [
      { name: 'All Customers', tKey: 'allCustomers', href: '/admin/customers', icon: '👤' },
      { name: 'Dealers', tKey: 'dealers', href: '/admin/customers/dealers', icon: '🏪' },
      { name: 'Affiliates', tKey: 'affiliates', href: '/admin/customers/affiliates', icon: '🤝' },
      { name: 'Dropshippers', tKey: 'dropshippers', href: '/admin/customers/dropshippers', icon: '📦' }
    ]
  },
  {
    name: 'Financial',
    tKey: 'financial',
    href: '/admin/financial',
    icon: '💰',
    children: [
      { name: 'Revenue Overview', tKey: 'revenueOverview', href: '/admin/financial', icon: '📊' },
      { name: 'Profit & Loss', tKey: 'profitAndLoss', href: '/admin/financial/profit-loss', icon: '📈' },
      { name: 'Expenses', tKey: 'expenses', href: '/admin/financial/expenses', icon: '💸' },
      { name: 'Commissions', tKey: 'commissions', href: '/admin/financial/commissions', icon: '🤝' }
    ]
  },
  {
    name: 'Reports',
    tKey: 'reports',
    href: '/admin/reports',
    icon: '📊',
    children: [
      { name: 'Sales Reports', tKey: 'salesReports', href: '/admin/reports/sales', icon: '📈' },
      { name: 'Inventory Reports', tKey: 'inventoryReports', href: '/admin/reports/inventory', icon: '📦' },
      { name: 'Customer Reports', tKey: 'customerReports', href: '/admin/reports/customers', icon: '👥' },
      { name: 'Performance', tKey: 'performance', href: '/admin/reports/performance', icon: '🎯' }
    ]
  },
  {
    name: 'Suppliers',
    tKey: 'suppliers',
    href: '/admin/suppliers',
    icon: '🏭'
  },
  {
    name: 'Marketing',
    tKey: 'marketing',
    href: '/admin/marketing',
    icon: '📢',
    children: [
      { name: 'Campaigns', tKey: 'campaigns', href: '/admin/marketing/campaigns', icon: '🎯' },
      { name: 'Coupons', tKey: 'coupons', href: '/admin/marketing/coupons', icon: '🎫' },
      { name: 'Email Marketing', tKey: 'emailMarketing', href: '/admin/marketing/email', icon: '📧' },
      { name: 'Analytics', tKey: 'analytics', href: '/admin/marketing/analytics', icon: '📊' }
    ]
  },
  {
    name: 'Settings',
    tKey: 'settings',
    href: '/admin/settings',
    icon: '⚙️',
    children: [
      { name: 'General', tKey: 'general', href: '/admin/settings', icon: '🔧' },
      { name: 'Users & Roles', tKey: 'usersAndRoles', href: '/admin/settings/users', icon: '👤' },
      { name: 'Payment Methods', tKey: 'paymentMethods', href: '/admin/settings/payments', icon: '💳' },
      { name: 'Shipping', tKey: 'shipping', href: '/admin/settings/shipping', icon: '🚚' },
      { name: 'Notifications', tKey: 'notifications', href: '/admin/settings/notifications', icon: '🔔' }
    ]
  }
];

export default function AdminSidebar() {
  const { t } = useTranslation();
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
          <div className="w-8 h-8 bg-[#ec3137] rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">H&H</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('hookAndHunt')}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t('adminPanel')}</p>
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
                      ? 'bg-[#ec3137] text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{t(item.tKey)}</span>
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
                            ? 'bg-[#ec3137] text-white'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span>{child.icon}</span>
                        <span>{t(child.tKey)}</span>
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
              <span className="font-medium">{t('helpAndSupport')}</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <span className="text-lg">🏪</span>
              <span className="font-medium">{t('viewStore')}</span>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
