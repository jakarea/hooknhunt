'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import UserNavigation from '@/components/user/UserNavigation';
import { products } from '@/data/products';

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([
    products[0], // Wireless Noise-Cancelling Headphones
    products[1], // Smart Watch Series 8
    products[3], // Minimalist Leather Backpack
    products[5], // Ergonomic Office Chair
    products[7], // Yoga Mat Pro
    products[10], // Bluetooth Speaker
    products[15], // Gaming Laptop
    products[20], // Coffee Maker
  ]);

  const [sortBy, setSortBy] = useState('date-added');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  const removeFromWishlist = (productId: number) => {
    setWishlistItems(items => items.filter(item => item.id !== productId));
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const sortedItems = [...wishlistItems].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.price || 0) - (b.price || 0);
      case 'price-high':
        return (b.price || 0) - (a.price || 0);
      case 'name':
        return (a.name || '').localeCompare(b.name || '');
      case 'date-added':
      default:
        return 0; // Keep original order for date-added
    }
  });

  const getTotalValue = () => {
    return wishlistItems.reduce((total, item) => total + (item.price || 0), 0);
  };

  return (
    <div className="min-h-screen bg-[#fcf8f6]">
      {/* Breadcrumb */}
      <div className="bg-gray-50 dark:bg-[#0f0f0f] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 py-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Link href="/account" className="hover:text-[#bc1215] transition-colors">My Account</Link>
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 dark:text-white font-medium">Wishlist</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <UserNavigation />
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  My Wishlist
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved • Total Value: ৳{getTotalValue().toLocaleString()}
                </p>
              </div>
              
              {wishlistItems.length > 0 && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={clearWishlist}
                    className="bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-800 dark:text-red-200 font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Clear All
                  </button>
                  <Link
                    href="/products"
                    className="bg-[#bc1215] hover:bg-[#8a0f12] text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              )}
            </div>

            {/* Filters and Controls */}
            {wishlistItems.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sort by:
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#bc1215] focus:border-[#bc1215] dark:bg-gray-700 dark:text-white"
                  >
                    <option value="date-added">Date Added</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name A-Z</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View:</span>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-[#bc1215] text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list'
                        ? 'bg-[#bc1215] text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Wishlist Items */}
            {wishlistItems.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
              }>
                {sortedItems.map((product) => (
                  <div key={product.id} className="group relative">
                    {viewMode === 'grid' ? (
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromWishlist(product.id)}
                          className="absolute top-3 right-3 z-10 p-2 bg-white dark:bg-gray-700 rounded-full shadow-md hover:bg-red-100 dark:hover:bg-red-900 text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>

                        {/* Product Image */}
                        <div className="aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden relative">
                          <Image
                            src={product.image || '/placeholder-image.jpg'}
                            alt={product.name || 'Product image'}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-lg font-bold text-[#bc1215]">
                              ৳{(product.price || 0).toLocaleString()}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                ৳{product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          
                          {/* Stock Status */}
                          <div className="mb-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              (product.stock || 0) > 0 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {(product.stock || 0) > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="space-y-2">
                            <button className="w-full bg-[#bc1215] hover:bg-[#8a0f12] text-white font-medium py-2 px-4 rounded-lg transition-colors">
                              Add to Cart
                            </button>
                            <button className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors">
                              Quick View
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-4">
                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromWishlist(product.id)}
                          className="p-2 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-600 dark:text-red-400 rounded-full transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>

                        {/* Product Image */}
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0 relative">
                          <Image
                            src={product.image || '/placeholder-image.jpg'}
                            alt={product.name || 'Product image'}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg font-bold text-[#bc1215]">
                              ৳{(product.price || 0).toLocaleString()}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                ৳{product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            (product.stock || 0) > 0 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {(product.stock || 0) > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button className="bg-[#bc1215] hover:bg-[#8a0f12] text-white font-medium py-2 px-4 rounded-lg transition-colors">
                            Add to Cart
                          </button>
                          <button className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors">
                            View
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your wishlist is empty</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  Save items you love by clicking the heart icon on any product. They&apos;ll appear here for easy access later.
                </p>
                <Link
                  href="/products"
                  className="bg-[#bc1215] hover:bg-[#8a0f12] text-white font-medium py-3 px-8 rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Start Shopping
                </Link>
              </div>
            )}

            {/* Wishlist Summary */}
            {wishlistItems.length > 0 && (
              <div className="bg-gradient-to-r from-[#bc1215] to-[#8a0f12] rounded-lg p-6 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Ready to purchase?</h3>
                    <p className="text-white/90">
                      You have {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-white/90 text-sm">Total Value</p>
                      <p className="text-2xl font-bold">৳{getTotalValue().toLocaleString()}</p>
                    </div>
                    <button className="bg-white text-[#bc1215] hover:bg-gray-100 font-bold py-3 px-6 rounded-lg transition-colors">
                      Add All to Cart
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}