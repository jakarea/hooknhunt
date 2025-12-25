'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import { Product } from '@/types';
// import { products } from '@/data/products';

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryParam ? [categoryParam] : ['all']);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [priceRange, setPriceRange] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(12); // Initial load: 12 products
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: number, name: string, slug: string, product_count?: number }>>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }
  }, [categoryParam]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Use Next.js API rewrite
        const response = await fetch('/api/v1/store/categories/');
        if (response.ok) {
          const data = await response.json();
          // API returns {categories: [...]}
          setCategories(data.all_categories || data.categories || []);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const response = await fetch('/api/v1/store/products');
        if (response.ok) {
          const data = await response.json();
          const apiProducts = data.products || [];

          // Map API response to Product type
          const mappedProducts = apiProducts.map((product: any) => {
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
              category_ids: product.category_ids || [],
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
              name: product.name || '',
              price: displayPrice,
              originalPrice: 0,
              image: product.thumbnail_url || '',
              stock: product.stock_info?.total_available || 0,
              rating: product.rating || 0,
              reviews: product.reviews || 0,
              category: product.categories?.[0]?.name || '',
              categories: product.categories || [],
              variant_count: product.variant_count || 0,
              price_range_display: product.price_range?.display || '',
              has_offer: product.has_offer || false,
            };
          });
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products by category
  const filteredProducts = products.filter(product => {
    if (selectedCategories.includes('all')) return true;
    return selectedCategories.some(categorySlug => {
      const category = categories.find(c => c.slug === categorySlug);
      if (!category) return false;
      // Check if product category_ids contains the category ID
      return product.category_ids?.includes(category.id) || product.category === category.name;
    });
  });

  // Apply additional filters
  const additionalFilteredProducts = filteredProducts.filter(product => {
    // Rating filter
    if (minRating > 0 && (product.rating || 0) < minRating) return false;

    // Price range filter
    if (priceRange.length > 0) {
      const inRange = priceRange.some(range => {
        if (range === 'under-1000') return (product.price || 0) < 1000;
        if (range === '1000-5000') return (product.price || 0) >= 1000 && (product.price || 0) < 5000;
        if (range === '5000-10000') return (product.price || 0) >= 5000 && (product.price || 0) < 10000;
        if (range === '10000-plus') return (product.price || 0) >= 10000;
        return false;
      });
      if (!inRange) return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...additionalFilteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.price || 0) - (b.price || 0);
      case 'price-high':
        return (b.price || 0) - (a.price || 0);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'newest':
        return b.id - a.id;
      default:
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
  });

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(12);
  }, [selectedCategories, sortBy, priceRange, minRating]);

  const loadMoreProducts = useCallback(() => {
    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setDisplayCount(prev => prev + 12);
      setIsLoading(false);
    }, 500);
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && displayCount < sortedProducts.length) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [isLoading, displayCount, sortedProducts.length, loadMoreProducts]);

  const handlePriceRangeChange = (range: string) => {
    setPriceRange(prev =>
      prev.includes(range)
        ? prev.filter(r => r !== range)
        : [...prev, range]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories(['all']);
    setPriceRange([]);
    setMinRating(0);
    setSortBy('featured');
  };

  const hasActiveFilters = !selectedCategories.includes('all') || selectedCategories.length > 1 || priceRange.length > 0 || minRating > 0;

  return (
    <div className="bg-white dark:bg-[#0a0a0a] min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-50 dark:bg-[#0f0f0f] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 py-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-[#bc1215] transition-colors">Home</Link>
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 dark:text-white font-medium">Products</span>
            {!selectedCategories.includes('all') && selectedCategories.length === 1 && (
              <>
                <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-900 dark:text-white font-medium capitalize">
                  {categories.find(c => c.slug === selectedCategories[0])?.name || selectedCategories[0]}
                </span>
              </>
            )}
          </div>
        </div>
      </div>


      <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden flex items-center justify-center gap-2 py-3 px-4 bg-[#bc1215] text-white font-semibold mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters {hasActiveFilters && `(${[!selectedCategories.includes('all') || selectedCategories.length > 1 ? 1 : 0, priceRange.length, minRating > 0 ? 1 : 0].reduce((a, b) => a + b, 0)})`}
          </button>

          {/* Sidebar */}
          <aside className={`
            lg:w-72 flex-shrink-0
            ${isSidebarOpen ? 'block' : 'hidden lg:block'}
            fixed lg:relative inset-0 lg:inset-auto z-50 lg:z-auto
            bg-white dark:bg-[#0a0a0a] lg:bg-transparent
            overflow-y-auto lg:overflow-visible
            p-4 lg:p-0
          `}>
            {/* Mobile Close Button */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="space-y-6">
              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="bg-gray-50 dark:bg-[#0f0f0f] border border-gray-200 dark:border-gray-800 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider">
                      Active Filters
                    </h3>
                    <button
                      onClick={clearAllFilters}
                      className="text-[#bc1215] hover:text-[#8a0f12] text-sm font-semibold"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.filter(cat => cat !== 'all').map(categorySlug => (
                      <button
                        key={categorySlug}
                        onClick={() => {
                          const newCategories = selectedCategories.filter(cat => cat !== categorySlug);
                          if (newCategories.length === 0) {
                            setSelectedCategories(['all']);
                          } else {
                            setSelectedCategories(newCategories);
                          }
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-[#bc1215] text-white text-sm"
                      >
                        {categories.find(c => c.slug === categorySlug)?.name}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    ))}
                    {priceRange.map(range => (
                      <button
                        key={range}
                        onClick={() => handlePriceRangeChange(range)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-[#bc1215] text-white text-sm"
                      >
                        {range === 'under-1000' && '< ৳1,000'}
                        {range === '1000-5000' && '৳1,000-5,000'}
                        {range === '5000-10000' && '৳5,000-10,000'}
                        {range === '10000-plus' && '৳10,000+'}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    ))}
                    {minRating > 0 && (
                      <button
                        onClick={() => setMinRating(0)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-[#bc1215] text-white text-sm"
                      >
                        {minRating}+ Stars
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Categories Filter */}
              <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800">
                <div className="bg-gray-50 dark:bg-[#0f0f0f] px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider">
                    Categories
                  </h3>
                </div>
                <div className="p-4 space-y-1">
                  <button
                    onClick={() => setSelectedCategories(['all'])}
                    className={`w-full text-left px-4 py-2.5 transition-colors font-medium flex items-center justify-between ${selectedCategories.includes('all')
                      ? 'bg-[#bc1215] text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes('all')}
                        onChange={() => setSelectedCategories(['all'])}
                        className="w-4 h-4 text-[#bc1215] border-gray-300 focus:ring-[#bc1215] rounded"
                      />
                      All Products
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${selectedCategories.includes('all')
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>
                      {products.length}
                    </span>
                  </button>
                  {categoriesLoading ? (
                    <div className="px-4 py-2.5 text-center text-gray-500 dark:text-gray-400">
                      Loading categories...
                    </div>
                  ) : (
                    categories.map(category => {
                      const categoryProductCount = category.product_count ?? products.filter(p =>
                        p.category_ids?.includes(category.id) || p.category === category.name
                      ).length;

                      if (categoryProductCount === 0) return null;

                      const isSelected = selectedCategories.includes(category.slug);
                      return (
                        <button
                          key={category.id}
                          onClick={() => {
                            if (isSelected) {
                              // Remove from selection
                              const newCategories = selectedCategories.filter(cat => cat !== category.slug);
                              if (newCategories.length === 0) {
                                setSelectedCategories(['all']);
                              } else {
                                setSelectedCategories(newCategories);
                              }
                            } else {
                              // Add to selection (remove 'all' if it exists)
                              const newCategories = selectedCategories.filter(cat => cat !== 'all');
                              setSelectedCategories([...newCategories, category.slug]);
                            }
                          }}
                          className={`w-full text-left px-4 py-2.5 transition-colors flex items-center justify-between ${isSelected
                            ? 'bg-[#bc1215] text-white font-semibold'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                        >
                          <span className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {
                                if (isSelected) {
                                  // Remove from selection
                                  const newCategories = selectedCategories.filter(cat => cat !== category.slug);
                                  if (newCategories.length === 0) {
                                    setSelectedCategories(['all']);
                                  } else {
                                    setSelectedCategories(newCategories);
                                  }
                                } else {
                                  // Add to selection (remove 'all' if it exists)
                                  const newCategories = selectedCategories.filter(cat => cat !== 'all');
                                  setSelectedCategories([...newCategories, category.slug]);
                                }
                              }}
                              className="w-4 h-4 text-[#bc1215] border-gray-300 focus:ring-[#bc1215] rounded"
                            />
                            {category.name}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}>
                            {categoryProductCount}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800">
                <div className="bg-gray-50 dark:bg-[#0f0f0f] px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider">
                    Price Range
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  {[
                    { value: 'under-1000', label: 'Under ৳1,000' },
                    { value: '1000-5000', label: '৳1,000 - ৳5,000' },
                    { value: '5000-10000', label: '৳5,000 - ৳10,000' },
                    { value: '10000-plus', label: '৳10,000 & Above' },
                  ].map(option => (
                    <label key={option.value} className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={priceRange.includes(option.value)}
                        onChange={() => handlePriceRangeChange(option.value)}
                        className="w-4 h-4 text-[#bc1215] border-gray-300 focus:ring-[#bc1215]"
                      />
                      <span className="ml-3 text-gray-700 dark:text-gray-300 group-hover:text-[#bc1215]">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800">
                <div className="bg-gray-50 dark:bg-[#0f0f0f] px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider">
                    Customer Rating
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                      className={`w-full flex items-center px-3 py-2 transition-colors ${minRating === rating
                        ? 'bg-[#bc1215]/10 dark:bg-[#bc1215]/20'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                    >
                      <div className="flex items-center flex-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                              }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">& Up</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Promo Banner */}
              <div className="bg-gradient-to-br from-[#bc1215] to-[#8a0f12] p-6 text-white">
                <h3 className="font-bold text-lg mb-2">Special Offer!</h3>
                <p className="text-sm text-white/90 mb-4">
                  Get up to 30% off on selected items
                </p>
                <Link
                  href="/deals"
                  className="inline-block px-4 py-2 bg-white text-[#bc1215] font-semibold text-sm hover:bg-gray-100 transition-colors"
                >
                  View Deals
                </Link>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort and View Options Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#bc1215] rounded-full"></div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  Showing <span className="font-bold text-gray-900 dark:text-white text-lg">{sortedProducts.length}</span> {sortedProducts.length === 1 ? 'product' : 'products'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-700 dark:text-gray-300 font-semibold">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#bc1215] focus:border-[#bc1215] outline-none rounded-lg font-medium shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {sortedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
                  {sortedProducts.slice(0, displayCount).map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Modern Loading Indicator */}
                {displayCount < sortedProducts.length && (
                  <div ref={observerTarget} className="flex justify-center items-center py-16">
                    {isLoading ? (
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                          <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
                          <div className="w-16 h-16 border-4 border-[#bc1215] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 font-semibold text-lg">Loading more products...</p>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-[#bc1215] rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-[#bc1215] rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-[#bc1215] rounded-full animate-bounce delay-200"></div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-20"></div>
                    )}
                  </div>
                )}

                {/* All Products Loaded Message */}
                {displayCount >= sortedProducts.length && sortedProducts.length > 12 && (
                  <div className="text-center py-8 border-t border-gray-200 dark:border-gray-800 mt-8">
                    <p className="text-gray-600 dark:text-gray-400">
                      You&apos;ve reached the end. Showing all {sortedProducts.length} products.
                    </p>
                  </div>
                )}
              </>
            ) : (
              /* Modern Empty State */
              <div className="text-center py-24">
                <div className="relative w-32 h-32 mx-auto mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#bc1215]/10 to-[#046bd2]/10 rounded-full blur-xl"></div>
                  <div className="relative w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-full flex items-center justify-center shadow-xl">
                    <svg
                      className="w-16 h-16 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">No products found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg max-w-md mx-auto leading-relaxed">
                  Try adjusting your filters or search criteria to find what you&apos;re looking for
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-8 py-4 bg-gradient-to-r from-[#bc1215] to-[#8a0f12] hover:from-[#8a0f12] hover:to-[#bc1215] text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bc1215] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading products...</p>
        </div>
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}
