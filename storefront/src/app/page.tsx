'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/product/ProductCard';
import HeroSlider from '@/components/home/HeroSlider';
import TrendingProduct from '@/components/home/TrendingProduct';
import FloatingActionButton from '@/components/common/FloatingActionButton';
import { products } from '@/data/products';
import { Category } from '@/types';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const newArrivals = products.slice(0, 8); // Latest products
  const bestDeals = products.filter(p => p.originalPrice).slice(0, 4);
  const recentlySold = products.slice(16, 24); // Recently sold
  const recommended = products.slice(0, 8); // Recommended

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        // Use Next.js API rewrite to avoid CORS issues
        const response = await fetch('/api/v1/store/categories/');

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
        // API returns {categories: [...]} so extract the array
        setCategories(data.categories || data || []);
        setCategoriesError(null);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategoriesError('Failed to load categories');
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Slider - Full Screen */}
      <HeroSlider />

      {/* Dynamic Trending Products */}
      <TrendingProduct />

      {/* Categories - Minimalist Style */}
      <section className="py-20 bg-white dark:bg-[#0a0a0a]">
        <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12">
          {/* Simple Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Find exactly what you&apos;re looking for
            </p>
          </div>

          {/* Categories Grid - Clean & Compact Style */}
          {categoriesLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-800 p-4 hover:shadow-md transition-all duration-300">
                    <div className="relative w-full aspect-square mb-3 overflow-hidden bg-gray-300 dark:bg-gray-700"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : categoriesError ? (
            <div className="text-center py-12">
              <p className="text-red-500 dark:text-red-400 text-lg mb-4">{categoriesError}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-[#bc1215] hover:bg-[#8a0f12] text-white font-semibold transition-colors duration-300"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
              {categories.map((category, index) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className="group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 hover:shadow-md transition-all duration-300 group-hover:scale-105">
                    {/* Product Image */}
                    <div className="relative w-full aspect-square mb-3 overflow-hidden">
                      {category.image_url ? (
                        <Image
                          src={category.image_url}
                          alt={category.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 12.5vw"
                        />
                      ) : (
                        <h6 className='text-center text-gray-800 dark:text-gray-200 font-semibold text-xs md:text-sm leading-tight'>No Image Found!</h6>
                      )}
                    </div>

                    {/* Category Name */}
                    <h3 className="text-center text-gray-800 dark:text-gray-200 font-semibold text-xs md:text-sm leading-tight">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Simple CTA */}
          {categories.length > 16 && (
            <div className="text-center mt-16">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#bc1215] hover:bg-[#8a0f12] text-white font-semibold rounded-lg transition-colors duration-300"
              >
                <span>View All Categories</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          )}

        </div>
      </section >

      {/* Recently Sold - Social Proof & Trust */}
      < section className="bg-gray-50 dark:bg-[#0f0f0f] py-20 transition-colors duration-200" >
        <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1 h-8 bg-green-500"></div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">Recently Sold</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl ml-4">See what others are buying</p>
            </div>
            <Link href="/products?sort=recent-sold" className="group">
              <span className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                View All Recently Sold
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-7">
            {recentlySold.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section >

      {/* New Arrival - Fresh Content */}
      < section className="bg-gray-50 dark:bg-[#0f0f0f] py-20 transition-colors duration-200" >
        <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1 h-8 bg-[#046bd2]"></div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">New Arrivals</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl ml-4">Fresh products just added</p>
            </div>
            <Link href="/products?sort=newest" className="group">
              <span className="inline-flex items-center gap-2 px-6 py-3 bg-[#046bd2] text-white font-semibold hover:bg-[#0353a5] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                View All New Arrivals
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-7">
            {newArrivals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section >

      {/* Promotional Banners - Mid-Page Engagement */}
      < section className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 py-12 bg-white dark:bg-[#0a0a0a]" >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <Link href="/products?category=rods" className="group relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]">
            <div className="relative h-72 lg:h-80 bg-gradient-to-br from-[#046bd2] to-[#0353a5]">
              <Image
                src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop"
                alt="Fishing Rods Collection"
                fill
                className="object-cover opacity-30 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#046bd2]/80 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col items-start justify-center text-white p-8 lg:p-12">
                <div className="transform group-hover:translate-x-2 transition-transform duration-500">
                  <div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider mb-4">Limited Offer</div>
                  <h3 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight">Fishing Rods Collection</h3>
                  <p className="text-lg md:text-xl mb-6 font-medium text-white/90">Professional grade rods for every angler</p>
                  <span className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#046bd2] font-bold text-lg hover:bg-gray-100 shadow-lg group-hover:gap-4 transition-all duration-300">
                    Shop Now
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 transform rotate-45 translate-x-16 -translate-y-16 group-hover:translate-x-12 group-hover:-translate-y-12 transition-transform duration-500"></div>
            </div>
          </Link>

          <Link href="/products?category=reels" className="group relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]">
            <div className="relative h-72 lg:h-80 bg-gradient-to-br from-[#bc1215] to-[#8a0f12]">
              <Image
                src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=400&fit=crop"
                alt="Fishing Reels Collection"
                fill
                className="object-cover opacity-30 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#bc1215]/80 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col items-start justify-center text-white p-8 lg:p-12">
                <div className="transform group-hover:translate-x-2 transition-transform duration-500">
                  <div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider mb-4">Best Seller</div>
                  <h3 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight">Fishing Reels Collection</h3>
                  <p className="text-lg md:text-xl mb-6 font-medium text-white/90">High-performance reels for smooth fishing</p>
                  <span className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#bc1215] font-bold text-lg hover:bg-gray-100 shadow-lg group-hover:gap-4 transition-all duration-300">
                    Shop Now
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 transform rotate-45 translate-x-16 -translate-y-16 group-hover:translate-x-12 group-hover:-translate-y-12 transition-transform duration-500"></div>
            </div>
          </Link>
        </div>
      </section >

      {/* Best Deals - Value Proposition */}
      < section className="bg-gray-50 dark:bg-[#0f0f0f] py-20 transition-colors duration-200" >
        <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-[#bc1215]/10 dark:bg-[#bc1215]/20 mb-4">
              <svg className="w-5 h-5 text-[#bc1215]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-bold text-[#bc1215] uppercase tracking-wider">Special Offers</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Best Deals</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">Limited time offers you can&apos;t miss</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-7">
            {bestDeals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section >

      {/* Recommended for You - Personalization */}
      < section className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 py-20 bg-white dark:bg-[#0a0a0a]" >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-8 bg-purple-600"></div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">Recommended for You</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl ml-4">Curated picks based on your preferences</p>
          </div>
          <Link href="/products?sort=recommended" className="group">
            <span className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              View All Recommended
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-7">
          {recommended.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section >

      {/* Customer Reviews - Trust & Social Proof */}
      < section className="bg-gray-50 dark:bg-[#0f0f0f] py-20 transition-colors duration-200" >
        <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-[#046bd2]/10 dark:bg-[#046bd2]/20 mb-4">
              <svg className="w-5 h-5 text-[#046bd2]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              <span className="text-sm font-bold text-[#046bd2] uppercase tracking-wider">Customer Feedback</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Customer Reviews</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">See what our customers are saying</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="group bg-white dark:bg-gray-900 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden transform hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#bc1215]/5 transform rotate-45 translate-x-10 -translate-y-10"></div>
              <div className="flex items-center mb-5">
                <div className="w-14 h-14 bg-gradient-to-br from-[#bc1215] to-[#8a0f12] flex items-center justify-center text-white font-bold text-xl mr-4 shadow-lg">
                  M
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">Mohammed Rahman</h4>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative">
                <svg className="w-8 h-8 text-[#bc1215]/20 mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base relative z-10">
                  Amazing quality! The fishing rod exceeded my expectations. Highly recommended for serious anglers.
                </p>
              </div>
            </div>

            <div className="group bg-white dark:bg-gray-900 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden transform hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#046bd2]/5 transform rotate-45 translate-x-10 -translate-y-10"></div>
              <div className="flex items-center mb-5">
                <div className="w-14 h-14 bg-gradient-to-br from-[#046bd2] to-[#0353a5] flex items-center justify-center text-white font-bold text-xl mr-4 shadow-lg">
                  A
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">Ahmed Khan</h4>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative">
                <svg className="w-8 h-8 text-[#046bd2]/20 mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base relative z-10">
                  Fast shipping and excellent customer service. The product arrived in perfect condition.
                </p>
              </div>
            </div>

            <div className="group bg-white dark:bg-gray-900 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden transform hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#bc1215]/5 transform rotate-45 translate-x-10 -translate-y-10"></div>
              <div className="flex items-center mb-5">
                <div className="w-14 h-14 bg-gradient-to-br from-[#bc1215] to-[#8a0f12] flex items-center justify-center text-white font-bold text-xl mr-4 shadow-lg">
                  F
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">Farhan Hossain</h4>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative">
                <svg className="w-8 h-8 text-[#bc1215]/20 mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base relative z-10">
                  Great value for money. The quality is outstanding and the price is very reasonable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* Features - Trust Indicators */}
      < section className="bg-gradient-to-br from-[#bc1215] to-[#8a0f12] text-white py-20 relative overflow-hidden" >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white transform rotate-45"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-white transform -rotate-45"></div>
        </div>

        <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="group text-center transform hover:scale-105 transition-all duration-500">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:bg-white/30 transition-all duration-300 group-hover:shadow-2xl">
                <svg
                  className="w-10 h-10 group-hover:scale-110 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-extrabold mb-3 group-hover:scale-105 transition-transform duration-300">Free Shipping</h3>
              <p className="text-white/90 text-lg font-medium">Free delivery on orders over $50</p>
              <div className="w-16 h-1 bg-white/40 mx-auto mt-4 group-hover:w-24 transition-all duration-300"></div>
            </div>

            <div className="group text-center transform hover:scale-105 transition-all duration-500">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:bg-white/30 transition-all duration-300 group-hover:shadow-2xl">
                <svg
                  className="w-10 h-10 group-hover:scale-110 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-extrabold mb-3 group-hover:scale-105 transition-transform duration-300">Secure Payment</h3>
              <p className="text-white/90 text-lg font-medium">Safe and secure payment processing</p>
              <div className="w-16 h-1 bg-white/40 mx-auto mt-4 group-hover:w-24 transition-all duration-300"></div>
            </div>

            <div className="group text-center transform hover:scale-105 transition-all duration-500">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:bg-white/30 transition-all duration-300 group-hover:shadow-2xl">
                <svg
                  className="w-10 h-10 group-hover:scale-110 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-extrabold mb-3 group-hover:scale-105 transition-transform duration-300">Easy Returns</h3>
              <p className="text-white/90 text-lg font-medium">30-day hassle-free returns</p>
              <div className="w-16 h-1 bg-white/40 mx-auto mt-4 group-hover:w-24 transition-all duration-300"></div>
            </div>
          </div>
        </div>
      </section >

      {/* Floating Action Button */}
      < FloatingActionButton />
    </div >
  );
}
