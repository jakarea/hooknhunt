'use client';

import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import { getRecentlySoldProducts } from '@/data/static-products';

export default function RecentlySold() {
  const recentlySold = getRecentlySoldProducts(6);

  if (recentlySold.length === 0) {
    return null;
  }

  return (
    <>
      {recentlySold.length > 0 && (
        <section className="bg-gray-50 dark:bg-[#0f0f0f] py-20 transition-colors duration-200" >
          <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-1 h-8 bg-green-500"></div>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">Recently Sold</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl ml-4">See what others are buying</p>
              </div>
              {recentlySold.length > 6 &&
                <Link href="/products?sort=recent-sold" className="group">
                  <span className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                    View All Recently Sold
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              }
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-3">
              {recentlySold.slice(0, 6).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section >
      )}
    </>
  );
}
