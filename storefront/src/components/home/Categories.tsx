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
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                        {categories.slice(0, 12).map((category, index) => (
                            <Link
                                key={category.id}
                                href={`/products?category=${category.slug}`}
                                className="group"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
                                    {/* Product Image */}
                                    <div className="relative aspect-square overflow-hidden">
                                        {category.image_url ? (
                                            <Image
                                                src={category.image_url}
                                                alt={category.name}
                                                fill
                                                className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                                                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                                                <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                        {/* Category Name - Floating above image */}
                                        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                                            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                                                <h3 className="text-center text-gray-900 dark:text-white font-semibold text-sm leading-tight truncate">
                                                    {category.name}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Initial state - name visible below image */}
                                        <div className="absolute bottom-0 left-0 right-0 p-3 group-hover:opacity-0 transition-opacity duration-300">
                                            <div className="bg-gradient-to-t from-black/60 to-transparent pt-8">
                                                <h3 className="text-center text-white font-semibold text-sm lg:text-lg pb-2 leading-tight px-2">
                                                    {category.name}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Simple CTA */}
                {categories.length > 12 && (
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
