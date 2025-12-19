'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '../../../node_modules/react-i18next';
import ProductCard from '@/components/product/ProductCard';
import { Category } from '@/types';
import Image from 'next/image';


export default function Categories() {

    const [categories, setCategories] = useState<Category[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [categoriesError, setCategoriesError] = useState<string | null>(null);

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
    );
}
