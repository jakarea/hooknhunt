'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '../../../node_modules/react-i18next';
import ProductCard from '@/components/product/ProductCard';
import { Product } from '@/types';

interface ApiResponse {
    products: Product[];
    pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
}

export default function RecomendedYou() {
    const [recommended, setrecommended] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchrecommended = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch products from API with trending filter (using Next.js API rewrite)
                const apiUrl = '/api/v1/store/products';
                console.log('Fetching from:', apiUrl);

                const response = await fetch(apiUrl);

                console.log('Response status:', response.status, response.statusText);
                console.log('Response headers:', Object.fromEntries(response.headers.entries()));

                if (!response.ok) {
                    throw new Error(`Failed to fetch trending products: ${response.status} ${response.statusText}`);
                }

                const data: ApiResponse = await response.json();

                console.log('API Response:', data); // Debug: Log the full response

                // Get trending products (featured products)
                const products = data.products || [];

                // Map API response to Product type
                const mappedProducts = products.map((product: any) => {
                    // Extract price from price_range.min or use a default
                    const minPrice = parseFloat(product.price_range?.min) || 0;
                    const maxPrice = parseFloat(product.price_range?.max) || 0;
                    const displayPrice = minPrice > 0 ? minPrice : maxPrice;

                    return {
                        id: product.id,
                        product_code: product.product_code || '',
                        title: product.name || '',
                        slug: product.slug || '',
                        sku: product.sku || '',
                        description: product.description || '',
                        short_description: product.short_description || '',
                        supplier_id: product.supplier_id || 0,
                        product_link: product.product_link || '',
                        category_id: product.category_id || 0,
                        brand: product.brand || '',
                        tags: product.tags || [],
                        featured_image: product.thumbnail_url || '',
                        gallery: product.gallery_images || [],
                        weight: product.weight || 0,
                        unit: product.unit || 'kg',
                        cost_rmb: product.cost_rmb || 0,
                        exchange_rate: product.exchange_rate || 1,
                        cost_bdt: product.cost_bdt || 0,
                        actual_price: displayPrice,
                        default_price: displayPrice,
                        compare_at_price: 0,
                        price_wholesale: displayPrice,
                        price_retail: displayPrice,
                        price_daraz: displayPrice,
                        name_wholesale: product.name || '',
                        name_retail: product.name || '',
                        name_daraz: product.name || '',
                        inventory_quantity: product.stock_info?.total_available || 0,
                        inventory_policy: 'continue' as const,
                        has_variants: product.variant_count > 0,
                        status: product.status || 'active',
                        featured: product.has_offer || false,
                        barcode: product.barcode || '',
                        hs_code: product.hs_code || '',
                        seo_title: product.seo_title || '',
                        seo_description: product.seo_description || '',
                        search_keywords: product.search_keywords || [],
                        created_at: product.created_at || '',
                        updated_at: product.updated_at || '',
                        // Display aliases
                        name: product.name || '',
                        price: displayPrice,
                        originalPrice: 0,
                        image: product.thumbnail_url || '',
                        stock: product.stock_info?.total_available || 0,
                        rating: product.rating || 0,
                        reviews: product.reviews || 0,
                        category: product.categories?.[0]?.name || '',
                        // Additional fields for variant handling
                        variant_count: product.variant_count || 0,
                        price_range_display: product.price_range?.display || '',
                        has_offer: product.has_offer || false,
                    };
                });

                setrecommended(mappedProducts.slice(0, 12)); // Limit to 12 products
            } catch (error) {
                console.error('Error fetching trending products:', error);
                setError('Failed to load trending products');

                // Fallback to empty array
                setrecommended([]);
            } finally {
                setLoading(false);
            }
        };

        fetchrecommended();
    }, []);

    const { t } = useTranslation();

    if (loading) {
        return (
            <section className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 py-20 bg-white">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-1 h-8 bg-purple-600"></div>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">Recommended for You</h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl ml-4">Curated picks based on your preferences</p>
                    </div>
                    {recommended.length > 6 &&
                        <Link href="/products?sort=recommended" className="group">
                            <span className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                                View All Recommended
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                            </span>
                        </Link>
                    }
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-3">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="animate-pulse">
                            <div className="bg-gray-200 rounded-lg overflow-hidden">
                                <div className="aspect-square bg-gray-300"></div>
                                <div className="p-3">
                                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                                    <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (error || recommended.length === 0) {
        return (
            <section className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 py-20 bg-white">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-1 h-8 bg-purple-600"></div>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">Recommended for You</h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl ml-4">Curated picks based on your preferences</p>
                    </div>
                    {recommended.length > 6 &&
                        <Link href="/products?sort=recommended" className="group">
                            <span className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                                View All Recommended
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                            </span>
                        </Link>
                    }
                </div>
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg mb-4">
                        {error || 'No trending products available at the moment'}
                    </div>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#bc1215] hover:bg-[#8a0f12] text-white font-semibold transition-colors duration-300"
                    >
                        Browse All Products
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <>
            {recommended.length > 0 && (
                <section className="bg-gray-50 dark:bg-[#0f0f0f] py-20 transition-colors duration-200" >
                    <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-1 h-8 bg-purple-600"></div>
                                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">Recommended for You</h2>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl ml-4">Curated picks based on your preferences</p>
                            </div>
                            {recommended.length > 6 &&
                                <Link href="/products?sort=recommended" className="group">
                                    <span className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                                        View All Recommended
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                </Link>
                            }
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-3">
                            {recommended.slice(0, 6).map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section >
            )}
        </>
    );
}
