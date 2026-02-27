'use client';

import React from 'react';
import ProductCard from '@/components/product/ProductCard';
import { getBestDeals } from '@/data/static-products';

export default function BestDeals() {
  const bestDeals = getBestDeals();

  if (bestDeals.length === 0) {
    return null;
  }

  return (
    <>
      {bestDeals.length > 0 && (
        <section className="bg-gray-50 dark:bg-[#0f0f0f] py-20 transition-colors duration-200" >
          <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-[#ec3137]/10 dark:bg-[#ec3137]/20 mb-4">
                <svg className="w-5 h-5 text-[#ec3137]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-bold text-[#ec3137] uppercase tracking-wider">Special Offers</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Best Deals</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">Limited time offers you can&apos;t miss</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-3">
              {bestDeals.slice(0, 6).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section >
      )}
    </>
  );
}
