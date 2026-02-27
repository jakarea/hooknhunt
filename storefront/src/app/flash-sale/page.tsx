import React from 'react';
import ProductCard from '@/components/product/ProductCard';
import { getBestDeals } from '@/data/static-products';
import Link from 'next/link';

export default function FlashSalePage() {
  const flashSaleProducts = getBestDeals();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#ec3137] to-[#046bd2] text-white py-16 sm:py-24">
        <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-4xl sm:text-5xl animate-pulse">🔥</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              Flash Sale
            </h1>
          </div>
          <p className="text-lg sm:text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
            Limited time offers - Huge discounts on premium fishing gear!
          </p>
          <div className="mt-6 sm:mt-8 flex items-center justify-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 sm:px-6 sm:py-3">
              <div className="text-xs sm:text-sm opacity-80">Ends in</div>
              <div className="text-xl sm:text-2xl font-bold">23:59:59</div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 py-12 sm:py-16">
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Hot Deals
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {flashSaleProducts.length} products on sale
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {flashSaleProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-fadeInUp"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 sm:mt-16 text-center bg-white dark:bg-[#1a1a1a] rounded-xl p-6 sm:p-8 shadow-sm">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Don't Miss Out!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-xl mx-auto text-sm sm:text-base">
            Subscribe to our newsletter and get notified about exclusive flash sales and special offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#ec3137] text-sm"
            />
            <button className="px-6 py-3 bg-[#ec3137] text-white font-semibold rounded-lg hover:bg-[#9a0f12] transition-colors text-sm">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
