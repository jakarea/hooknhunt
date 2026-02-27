'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import ProductCard from '@/components/product/ProductCard';
import { useCart } from '@/context/CartContext';
import { staticProducts, staticCategories, getProductBySlug } from '@/data/static-products';
import { Product as StaticProduct } from '@/types';

// Define types for API response
interface StockInfo {
  in_stock: boolean;
  total_available: number;
  low_stock: boolean;
  stock_status: string;
}

interface Variant {
  id: number;
  sku: string;
  name: string;
  retail_price: number;
  wholesale_price: number;
  moq_wholesale: number;
  weight?: number;
  dimensions?: string;
  retail_offer?: any;
  wholesale_offer?: any;
  stock_info: {
    available: number;
    in_stock: boolean;
    low_stock: boolean;
    stock_status: string;
  };
  image: {
    url: string;
    thumbnail_url: string;
    alt_text: string;
  };
}

interface Category {
  name: string;
  slug: string;
}

interface PriceRange {
  min: string;
  max: string;
  display: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  thumbnail_url: string;
  gallery_images: string[] | string;
  price_range: PriceRange;
  has_offer: boolean;
  variant_count: number;
  categories: Category[];
  stock_info: StockInfo;
  description: string;
  meta_title: string;
  meta_description: string;
  variants: Variant[];
}

interface ApiResponse {
  product: Product;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, closeCart } = useCart();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  // Handle image change with simple fade
  const handleImageChange = useCallback((index: number) => {
    if (index === selectedImage) return;
    setSelectedImage(index);
  }, [selectedImage]);

  // Fetch product data from static source
  useEffect(() => {
    const fetchProduct = () => {
      try {
        setLoading(true);
        setError(null);

        // Get product from static data
        const staticProduct = getProductBySlug(slug);

        if (!staticProduct) {
          throw new Error(`Product not found: ${slug}`);
        }

        // Store original price for display
        const originalPriceValue = staticProduct.originalPrice || staticProduct.compare_at_price || 0;

        // Transform static product to match expected API response format
        const productData: Product = {
          id: staticProduct.id,
          name: staticProduct.name || staticProduct.title,
          slug: staticProduct.slug,
          thumbnail_url: staticProduct.image || staticProduct.featured_image || '',
          gallery_images: staticProduct.gallery || [],
          price_range: {
            min: String(staticProduct.price_wholesale || staticProduct.price),
            max: String(staticProduct.price_daraz || staticProduct.price),
            display: staticProduct.price_range_display || `৳${staticProduct.price?.toLocaleString()}`,
          },
          has_offer: staticProduct.has_offer || (originalPriceValue > 0 && originalPriceValue > (staticProduct.price || 0)) || false,
          variant_count: staticProduct.variant_count || 0,
          categories: staticProduct.category_id
            ? [{
                name: staticProduct.category || 'Uncategorized',
                slug: staticCategories.find(c => c.id === staticProduct.category_id)?.slug || 'uncategorized',
              }]
            : [],
          stock_info: {
            in_stock: (staticProduct.stock || staticProduct.inventory_quantity || 0) > 0,
            total_available: staticProduct.stock || staticProduct.inventory_quantity || 0,
            low_stock: (staticProduct.stock || staticProduct.inventory_quantity || 0) > 0 && (staticProduct.stock || staticProduct.inventory_quantity || 0) < 10,
            stock_status: (staticProduct.stock || staticProduct.inventory_quantity || 0) > 0 ? 'in_stock' : 'out_of_stock',
          },
          description: staticProduct.description || '',
          short_description: staticProduct.short_description || '',
          meta_title: staticProduct.seo_title || staticProduct.name || '',
          meta_description: staticProduct.seo_description || staticProduct.short_description || '',
          variants: [], // Static products don't have detailed variants
        };

        // Store original price separately for use in price display
        (productData as any).originalPrice = originalPriceValue;

        // Create mock variants for products with variant_count > 0 (always at least 3)
        if (staticProduct.variant_count > 0) {
          // Define variant types: Size, Weight, Color
          const variantTypes = [
            { name: 'Small', type: 'Size' },
            { name: 'Medium', type: 'Size' },
            { name: '500g', type: 'Weight' },
            { name: '1kg', type: 'Weight' },
            { name: 'Red', type: 'Color' },
            { name: 'Blue', type: 'Color' },
          ];

          // Ensure we have at least 3 variants
          const variantCount = Math.max(staticProduct.variant_count, 3);
          const mockVariants: Variant[] = [];

          for (let i = 0; i < Math.min(variantCount, 6); i++) {
            const variantType = variantTypes[i];
            const variantStock = Math.floor((staticProduct.stock || staticProduct.inventory_quantity || 100) / variantCount);
            mockVariants.push({
              id: staticProduct.id + i + 1, // Unique ID for each variant
              sku: `${staticProduct.sku || staticProduct.product_code || 'FF'}-${variantType.name.toUpperCase()}`,
              name: `${staticProduct.name} - ${variantType.name}`,
              retail_price: staticProduct.price_retail || staticProduct.price || 0,
              wholesale_price: staticProduct.price_wholesale || staticProduct.price || 0,
              moq_wholesale: 1,
              weight: staticProduct.weight || 0,
              dimensions: undefined,
              retail_offer: undefined,
              wholesale_offer: undefined,
              stock_info: {
                available: variantStock,
                in_stock: variantStock > 0,
                low_stock: variantStock > 0 && variantStock < 10,
                stock_status: variantStock > 0 ? 'in_stock' : 'out_of_stock',
              },
              image: {
                url: staticProduct.image || staticProduct.featured_image || '',
                thumbnail_url: staticProduct.image || staticProduct.featured_image || '',
                alt_text: `${staticProduct.name} - ${variantType.name} (${variantType.type})`,
              },
            });
          }

          productData.variants = mockVariants;

          // Set first variant as selected by default
          setSelectedVariant(mockVariants[0]);
        }

        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  // Auto-play image gallery (after product is loaded)
  useEffect(() => {
    if (!product) return;

    // Prepare product images
    const galleryImages = (() => {
      if (!product.gallery_images) return [];
      if (typeof product.gallery_images === 'string') {
        try {
          return JSON.parse(product.gallery_images);
        } catch (e) {
          console.error('Error parsing gallery_images:', e);
          return [];
        }
      }
      return Array.isArray(product.gallery_images) ? product.gallery_images : [];
    })();

    const images = [
      product.thumbnail_url,
      ...galleryImages
    ].filter(img => img && img.trim() !== '');

    // Only auto-play if there are multiple images
    if (images.length > 1) {
      const interval = setInterval(() => {
        setSelectedImage(prev => (prev + 1) % images.length);
      }, 4000); // Change image every 4 seconds

      return () => clearInterval(interval);
    }
  }, [product]);

  // Loading state
  if (loading) {
    return (
      <div className="max-w-[1344px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="animate-pulse">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="flex gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-3">
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="max-w-[1344px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {error || 'Product Not Found'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Sorry, we couldn&apos;t find the product you&apos;re looking for.
        </p>
        <Link href="/products">
          <Button>Back to Products</Button>
        </Link>
      </div>
    );
  }

  // Get current price based on selected variant or price range
  const currentPrice = selectedVariant ? selectedVariant.retail_price : parseFloat(product.price_range.min);
  const currentStock = selectedVariant ? selectedVariant.stock_info.available : product.stock_info.total_available;
  const isInStock = selectedVariant ? selectedVariant.stock_info.in_stock : product.stock_info.in_stock;
  const originalPrice = (product as any).originalPrice || 0;

  // Calculate discount percentage and saved amount
  const discountPercentage = originalPrice > 0 && originalPrice > currentPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;
  const savedAmount = originalPrice > 0 && originalPrice > currentPrice
    ? originalPrice - currentPrice
    : 0;

  // Prepare product images - filter out empty strings and null values
  const galleryImages = (() => {
    if (!product.gallery_images) return [];
    if (typeof product.gallery_images === 'string') {
      try {
        return JSON.parse(product.gallery_images);
      } catch (e) {
        console.error('Error parsing gallery_images:', e);
        return [];
      }
    }
    return Array.isArray(product.gallery_images) ? product.gallery_images : [];
  })();

  const productImages = [
    product.thumbnail_url,
    ...galleryImages
  ].filter(img => img && img.trim() !== '');

  // Get related products from static data (same category, excluding current product)
  const relatedProducts = product.categories.length > 0
    ? staticProducts
        .filter(p => p.category_id === staticProducts.find(sp => sp.slug === slug)?.category_id && p.slug !== slug)
        .slice(0, 4)
    : staticProducts
        .filter(p => p.slug !== slug)
        .slice(0, 4);

  return (
    <div className="bg-white dark:bg-[#0a0a0a] min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 py-6">
        <div className="flex items-center justify-start">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-[#ec3137] transition-colors">Home</Link>
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/products" className="hover:text-[#ec3137] transition-colors">Products</Link>
            {product.categories && product.categories.length > 0 && (
              <>
                <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <Link
                  href={`/products?category=${product.categories[0].slug}`}
                  className="hover:text-[#ec3137] transition-colors"
                >
                  {product.categories[0].name}
                </Link>
              </>
            )}
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 dark:text-white font-medium">{product.name}</span>
          </div>
        </div>
      </div>






      {/* Product Section */}
      <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 pb-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images Gallery */}

          
          <div className="space-y-4">
            {/* Main Image with Smooth Fade Effect */}
            <div className="relative group bg-gray-100 dark:bg-gray-900 aspect-square overflow-hidden rounded-lg">
              {/* All Images - Stacked with controlled opacity */}
              {productImages.map((img, index) => (
                <div
                  key={index}
                  className="absolute inset-0 transition-opacity duration-500 ease-in-out"
                  style={{
                    opacity: index === selectedImage ? '1' : '0',
                    zIndex: index === selectedImage ? '1' : '0',
                  }}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                    priority={index === 0}
                  />
                </div>
              ))}

              {/* Offer Badge */}
              {product.has_offer && discountPercentage > 0 && (
                <div className="absolute top-4 right-4 bg-[#ec3137] text-white px-4 py-2 text-sm font-bold rounded-lg shadow-lg z-10 animate-pulse">
                  Save {discountPercentage}%
                </div>
              )}

              {/* Navigation Arrows */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={() => handleImageChange(selectedImage === 0 ? productImages.length - 1 : selectedImage - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all opacity-100 hover:scale-110"
                  >
                    <svg className="w-5 h-5 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleImageChange(selectedImage === productImages.length - 1 ? 0 : selectedImage + 1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all opacity-100 hover:scale-110"
                  >
                    <svg className="w-5 h-5 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>


            {/* Thumbnail Navigation */}
            {productImages.length > 1 && (
              <div className="relative group">
                <div className="grid grid-cols-7 gap-x-2 overflow-x-auto py-1.5 px-1">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageChange(index)}
                      className={`flex-shrink-0 w-full h-18 bg-gray-100 dark:bg-gray-900 overflow-hidden transition-all relative rounded-lg ${
                        selectedImage === index
                          ? 'ring-2 ring-[#ec3137] opacity-100 scale-105 shadow-md'
                          : 'opacity-60 hover:opacity-100 hover:scale-105'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="72px"
                      />
                      {selectedImage === index && (
                        <div className="absolute inset-0 bg-[#ec3137]/10 pointer-events-none"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-4">





            {/* Product Title & Category - Enhanced */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-left gap-3 flex-wrap">
               
                  <svg className="w-5 h-5 text-[#ec3137]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v-1h8v1z" />
                  </svg>
                  <span className="text-base font-bold text-gray-900 dark:text-white">234</span>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Happy Customers</span>
                
            </div>

              <div className="flex items-start justify-between gap-3 mb-3">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white leading-tight flex-1">
                  {product.name}
                </h1>
                {product.categories && product.categories.length > 0 && (
                  <span className="flex-shrink-0 px-2 py-1 bg-[#ec3137] text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-full">
                    {product.categories[0].name}
                  </span>
                )}
              </div>

              {/* Product Meta Information - Better organized */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-400 mb-3">
                <span className="flex items-center gap-1 px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded-full">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="font-medium">ID: {product.id}</span>
                </span>
                {selectedVariant && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded-full">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="font-medium">SKU: {selectedVariant.sku}</span>
                  </span>
                )}
                <span className={`flex items-center gap-1 px-2 py-1 rounded-full ${isInStock ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'}`}>
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    {isInStock ? (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    ) : (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    )}
                  </svg>
                  <span className="font-medium">{isInStock ? `${currentStock} in stock` : 'Out of Stock'}</span>
                </span>
              </div>
            </div>

            
            {/* Price Section - Enhanced */}
            <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-[#ec3137]">
                    ৳{currentPrice.toLocaleString()}
                  </span>
                  {originalPrice > 0 && originalPrice > currentPrice && (
                    <>
                      <span className="text-lg text-gray-400 line-through">
                        ৳{originalPrice.toLocaleString()}
                      </span>
                      <span className="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold text-xs rounded-lg border border-green-200 dark:border-green-700">
                        Save ৳{savedAmount.toLocaleString()}
                      </span>
                    </>
                  )}
                </div>
                {product.has_offer && (
                  <div className="flex flex-col gap-2">
                    <span className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold text-xs rounded-lg border border-green-200 dark:border-green-700">
                      🔥 Special Offer
                    </span>
                    <div className="inline-flex items-center gap-2 bg-orange-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                      <span className="animate-pulse">⏰</span>
                      <span className="font-mono">Ends in 23:59:59</span>
                    </div>
                  </div>
                )}
              </div>
              {product.variant_count > 1 && selectedVariant && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Selected variant: <span className="font-medium text-gray-700 dark:text-gray-300">{selectedVariant.name}</span>
                </p>
              )}
            </div>

            {/* Variant Selection - Enhanced with Static Design */}
            {product.variants && product.variants.length > 1 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm space-y-4">
                <label className="block text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  Select Variant
                </label>

                {/* Group variants by type and display */}
                {(() => {
                  // Group variants by their type (Size, Weight, Color)
                  const variantGroups: { [key: string]: typeof product.variants } = {};
                  product.variants.forEach((variant) => {
                    const variantName = variant.name.split(' - ').pop() || variant.name;
                    let group = 'Other';

                    // Determine group based on variant name
                    if (['Small', 'Medium', 'Large', 'X-Large'].includes(variantName)) {
                      group = 'Size';
                    } else if (['500g', '1kg', '2kg'].includes(variantName)) {
                      group = 'Weight';
                    } else if (['Red', 'Blue', 'Green', 'Black', 'White'].includes(variantName)) {
                      group = 'Color';
                    }

                    if (!variantGroups[group]) {
                      variantGroups[group] = [];
                    }
                    variantGroups[group].push(variant);
                  });

                  return Object.entries(variantGroups).map(([groupType, variants]) => (
                    <div key={groupType} className="space-y-2">
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        {groupType}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {variants.map((variant) => {
                          const variantName = variant.name.split(' - ').pop() || variant.name;
                          const isSelected = selectedVariant?.id === variant.id;

                          return (
                            <button
                              key={variant.id}
                              onClick={() => setSelectedVariant(variant)}
                              className={`px-4 py-2 border-2 text-sm font-semibold rounded-lg transition-all ${
                                isSelected
                                  ? 'border-[#ec3137] bg-[#ec3137] text-white shadow-md'
                                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-[#ec3137] dark:hover:border-[#ec3137] hover:text-[#ec3137] dark:hover:text-[#ec3137] bg-white dark:bg-gray-700'
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                {isSelected && (
                                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                )}
                                {variantName}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ));
                })()}

                {/* Selected Variant Info */}
                {selectedVariant && (
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">
                        Selected: <span className="font-semibold text-gray-900 dark:text-white">{selectedVariant.name.split(' - ').pop()}</span>
                      </span>
                      <span className={`${selectedVariant.stock_info.in_stock ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} font-semibold`}>
                        {selectedVariant.stock_info.in_stock
                          ? `${selectedVariant.stock_info.available} available`
                          : 'Out of Stock'
                        }
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Stock Alert - Enhanced */}
            {!isInStock && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 flex items-center">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold text-sm text-red-600 dark:text-red-400">Out of Stock</span>
              </div>
            )}

{/* Product Highlights - Short Description */}
            {product.short_description && product.short_description !== product.description && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 shadow-sm border border-blue-100 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Product Highlights</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-1">
                      {product.short_description.split(/[,.-]/).filter((item: string) => item.trim()).map((item: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>{item.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {/* Quantity Selector - Enhanced */}
            {(product.variant_count <= 1 || selectedVariant) && isInStock && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <label className="block text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border-2 border-gray-200 dark:border-gray-600 hover:border-[#ec3137] dark:hover:border-[#ec3137] flex items-center justify-center transition-all rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
                    disabled={quantity <= 1}
                  >
                    <svg className="w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="text-xl font-bold text-gray-900 dark:text-white min-w-10 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                    className="w-10 h-10 border-2 border-gray-200 dark:border-gray-600 hover:border-[#ec3137] dark:hover:border-[#ec3137] flex items-center justify-center transition-all rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
                    disabled={quantity >= currentStock}
                  >
                    <svg className="w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    ({currentStock} available)
                  </span>
                </div>
              </div>
            )}




            {/* Action Buttons - Enhanced */}
            <div className="space-y-3">
              {(product.variant_count <= 1 || selectedVariant) ? (
                <>
                  <div className='grid grid-cols-2 items-center gap-3'>
                    <button
                      onClick={() => {
                        const productToAdd = selectedVariant ? {
                          id: product.id,
                          name: product.name,
                          price: currentPrice,
                          image: product.thumbnail_url,
                          slug: product.slug,
                          variant_id: selectedVariant.id,
                          variant_name: selectedVariant.name,
                          stock: currentStock
                        } : {
                          id: product.id,
                          name: product.name,
                          price: currentPrice,
                          image: product.thumbnail_url,
                          slug: product.slug,
                          stock: currentStock
                        };
                        addToCart(productToAdd, quantity);
                        closeCart();
                        router.push('/checkout');
                      }}
                      className="w-full py-3 border-2 border-[#ec3137] bg-[#ec3137] hover:bg-[#8a0f12] text-white font-bold text-sm transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-x-2 shadow-lg rounded-xl"
                      disabled={!isInStock}
                    >
                      <svg className="w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Buy Now
                    </button>
                    <button
                      onClick={() => {
                        const productToAdd = selectedVariant ? {
                          id: product.id,
                          name: product.name,
                          price: currentPrice,
                          image: product.thumbnail_url,
                          slug: product.slug,
                          variant_id: selectedVariant.id,
                          variant_name: selectedVariant.name,
                          stock: currentStock
                        } : {
                          id: product.id,
                          name: product.name,
                          price: currentPrice,
                          image: product.thumbnail_url,
                          slug: product.slug,
                          stock: currentStock
                        };
                        addToCart(productToAdd, quantity);
                      }}
                      className="w-full py-3 border-2 border-[#ec3137] text-[#ec3137] hover:bg-[#ec3137] hover:text-white font-bold text-sm transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-x-2 shadow-md rounded-xl"
                      disabled={!isInStock}
                    >
                      <svg className="w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      Add to Cart
                    </button>
                  </div>

                  {/* WhatsApp Order Button */}
                  <button className="w-full py-3 border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-bold text-sm transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-md rounded-xl">
                    <svg className="w-5" fill="#25D366" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                      <g id="SVGRepo_iconCarrier">
                        <title>whatsapp</title>
                        <path d="M26.576 5.363c-2.69-2.69-6.406-4.354-10.511-4.354-8.209 0-14.865 6.655-14.865 14.865 0 2.732.737 5.291 2.022 7.491l-0.038-0.070-2.109 7.702 7.879-2.067c2.051 1.139 4.498 1.809 7.102 1.809h0.006c8.209-0.003 14.862-6.659 14.862-14.868 0-4.103-1.662-7.817-4.349-10.507l0 0zM16.062 28.228h-0.005c-0 0-0.001 0-0.001 0-2.319 0-4.489-0.64-6.342-1.753l0.056 0.031-0.451-0.267-4.675 1.227 1.247-4.559-0.294-0.467c-1.185-1.862-1.889-4.131-1.889-6.565 0-6.822 5.531-12.353 12.353-12.353s12.353 5.531 12.353 12.353c0 6.822-5.53 12.353-12.353 12.353h-0zM22.838 18.977c-0.371-0.186-2.197-1.083-2.537-1.208-0.341-0.124-0.589-0.185-0.837 0.187-0.246 0.371-0.958 1.207-1.175 1.455-0.216 0.249-0.434 0.279-0.805 0.094-1.15-0.466-2.138-1.087-2.997-1.852l0.010 0.009c-0.799-0.74-1.484-1.587-2.037-2.521l-0.028-0.052c-0.216-0.371-0.023-0.572 0.162-0.757 0.167-0.166 0.372-0.434 0.557-0.65 0.146-0.179 0.271-0.384 0.366-0.604l0.006-0.017c0.043-0.087 0.068-0.188 0.068-0.296 0-0.131-0.037-0.253-0.101-0.357l0.002 0.003c-0.094-0.186-0.836-2.014-1.145-2.758-0.302-0.724-0.609-0.625-0.836-0.637-0.216-0.010-0.464-0.012-0.712-0.012-0.395 0.010-0.746 0.188-0.988 0.463l-0.001 0.002c-0.802 0.761-1.3 1.834-1.3 3.023 0 0.026 0 0.053 0.001 0.079l-0-0.004c0.131 1.467 0.681 2.784 1.527 3.857l-0.012-0.015c1.604 2.379 3.742 4.282 6.251 5.564l0.094 0.043c0.548 0.248 1.25 0.513 1.968 0.74l0.149 0.041c0.442 0.14 0.951 0.221 1.479 0.221 0.303 0 0.601-0.027 0.889-0.078l-0.031 0.004c1.069-0.223 1.956-0.868 2.497-1.749l0.009-0.017c0.165-0.366 0.261-0.793 0.261-1.242 0-0.185-0.016-0.366-0.047-0.542l0.003 0.019c-0.092-0.155-0.34-0.247-0.712-0.434z"></path>
                      </g>
                    </svg>
                  Order via WhatsApp
                  </button>
                </>
              ) : (
                <div className="w-full py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-center text-amber-600 dark:text-amber-400 rounded-xl">
                  <p className="font-semibold text-sm">Please select a variant to continue</p>
                </div>
              )}

              {/* Trust Badges - Enhanced */}
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center gap-1 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[10px] font-semibold text-green-700 dark:text-green-300 text-center leading-tight">Secure Checkout</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300 text-center leading-tight">Money Back</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                  <span className="text-[10px] font-semibold text-purple-700 dark:text-purple-300 text-center leading-tight">Fast Delivery</span>
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </div>

      <div className="max-w-[1254px] mx-auto mb-6 lg:mb-10">
        <div className="w-full">

          <div className="grid md:grid-cols-4 gap-x-3">
            <div className="flex items-start text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-3">
              <svg className="w-6 h-6 mr-3 text-[#ec3137] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <div>
                <p className="font-semibold text-sm">Free Shipping</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">On orders over ৳1000</p>
              </div>
            </div>
            <div className="flex items-start text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-3">
              <svg className="w-6 h-6 mr-3 text-[#ec3137] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <p className="font-semibold text-sm">Secure Payment</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">100% secure payment methods</p>
              </div>
            </div>
            <div className="flex items-start text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-3">
              <svg className="w-6 h-6 mr-3 text-[#ec3137] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <div>
                <p className="font-semibold text-sm">Easy Returns</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">7-day return policy</p>
              </div>
            </div>
            <div className="flex items-start text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-3">
              <svg className="w-6 h-6 mr-3 text-[#ec3137] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-sm">Fast Delivery</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Ships within 2-3 business days</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details - All Sections */}
      <div className="bg-gray-50 dark:bg-[#0f0f0f] py-12">
        <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12">
          <div className="space-y-8">
            {/* Description Section */}
            <div className="bg-white dark:bg-[#0a0a0a] p-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b-2 border-[#ec3137]">
                Description
              </h2>
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-6">
                  {product.description || 'No description available for this product.'}
                </p>
                {product.meta_description && (
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-6">
                    {product.meta_description}
                  </p>
                )}
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-6">
                  This premium fishing equipment is designed for both amateur and professional anglers.
                  Crafted with high-quality materials and precision engineering, it delivers exceptional
                  performance in various fishing conditions.
                </p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Key Features:</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Premium quality construction for durability</li>
                  <li>Ergonomic design for comfortable use</li>
                  <li>Weather-resistant materials</li>
                  <li>Suitable for both freshwater and saltwater fishing</li>
                  <li>Backed by manufacturer warranty</li>
                </ul>
              </div>
            </div>

            {/* Specifications Section */}
            <div className="bg-white dark:bg-[#0a0a0a] p-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b-2 border-[#ec3137]">
                Specifications
              </h2>
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                    Basic Information
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4 py-2">
                      <span className="font-semibold text-gray-900 dark:text-white">Product ID:</span>
                      <span className="text-gray-700 dark:text-gray-300 col-span-2">{product.id}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-2">
                      <span className="font-semibold text-gray-900 dark:text-white">Name:</span>
                      <span className="text-gray-700 dark:text-gray-300 col-span-2">{product.name}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-2">
                      <span className="font-semibold text-gray-900 dark:text-white">Slug:</span>
                      <span className="text-gray-700 dark:text-gray-300 col-span-2">{product.slug}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-2">
                      <span className="font-semibold text-gray-900 dark:text-white">Category:</span>
                      <span className="text-gray-700 dark:text-gray-300 col-span-2">
                        {product.categories && product.categories.length > 0
                          ? product.categories.map(cat => cat.name).join(', ')
                          : 'Uncategorized'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-2">
                      <span className="font-semibold text-gray-900 dark:text-white">Status:</span>
                      <span className="text-gray-700 dark:text-gray-300 col-span-2 capitalize">
                        {product.meta_title?.includes('Published') ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Variant Information */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                    Variant Information
                  </h3>
                  <div className="space-y-3">
                    {selectedVariant ? (
                      <>
                        <div className="grid grid-cols-3 gap-4 py-2">
                          <span className="font-semibold text-gray-900 dark:text-white">Variant:</span>
                          <span className="text-gray-700 dark:text-gray-300 col-span-2">{selectedVariant.name}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 py-2">
                          <span className="font-semibold text-gray-900 dark:text-white">SKU:</span>
                          <span className="text-gray-700 dark:text-gray-300 col-span-2">{selectedVariant.sku}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 py-2">
                          <span className="font-semibold text-gray-900 dark:text-white">Retail Price:</span>
                          <span className="text-gray-700 dark:text-gray-300 col-span-2">৳{selectedVariant.retail_price.toLocaleString()}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 py-2">
                          <span className="font-semibold text-gray-900 dark:text-white">Wholesale Price:</span>
                          <span className="text-gray-700 dark:text-gray-300 col-span-2">৳{selectedVariant.wholesale_price.toLocaleString()}</span>
                        </div>
                        {selectedVariant.weight && (
                          <div className="grid grid-cols-3 gap-4 py-2">
                            <span className="font-semibold text-gray-900 dark:text-white">Weight:</span>
                            <span className="text-gray-700 dark:text-gray-300 col-span-2">{selectedVariant.weight}g</span>
                          </div>
                        )}
                        {selectedVariant.dimensions && (
                          <div className="grid grid-cols-3 gap-4 py-2">
                            <span className="font-semibold text-gray-900 dark:text-white">Dimensions:</span>
                            <span className="text-gray-700 dark:text-gray-300 col-span-2">{selectedVariant.dimensions}</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400">No variant selected</p>
                    )}
                  </div>
                </div>

                {/* Pricing & Stock */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                    Pricing & Stock
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4 py-2">
                      <span className="font-semibold text-gray-900 dark:text-white">Price Range:</span>
                      <span className="text-gray-700 dark:text-gray-300 col-span-2">{product.price_range.display}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-2">
                      <span className="font-semibold text-gray-900 dark:text-white">Stock Status:</span>
                      <span className={`col-span-2 ${isInStock ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {isInStock ? `In Stock (${currentStock} available)` : 'Out of Stock'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-2">
                      <span className="font-semibold text-gray-900 dark:text-white">Variants:</span>
                      <span className="text-gray-700 dark:text-gray-300 col-span-2">{product.variant_count} available</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-2">
                      <span className="font-semibold text-gray-900 dark:text-white">Special Offer:</span>
                      <span className={`col-span-2 ${product.has_offer ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                        {product.has_offer ? 'Yes - Special discount available' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                    Additional Information
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4 py-2">
                      <span className="font-semibold text-gray-900 dark:text-white">Total Images:</span>
                      <span className="text-gray-700 dark:text-gray-300 col-span-2">{productImages.length}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-2">
                      <span className="font-semibold text-gray-900 dark:text-white">Description:</span>
                      <span className="text-gray-700 dark:text-gray-300 col-span-2">
                        {product.description ? 'Available' : 'Not provided'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-2">
                      <span className="font-semibold text-gray-900 dark:text-white">Meta Title:</span>
                      <span className="text-gray-700 dark:text-gray-300 col-span-2 text-sm">
                        {product.meta_title || 'Not set'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-2">
                      <span className="font-semibold text-gray-900 dark:text-white">Last Updated:</span>
                      <span className="text-gray-700 dark:text-gray-300 col-span-2">
                        {new Date().toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white dark:bg-[#0a0a0a] p-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b-2 border-[#ec3137]">
                Customer Reviews & Ratings
              </h2>
              <div className="space-y-8">
                {/* Rating Summary */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 lg:p-8">
                  <div className="grid lg:grid-cols-3 gap-8 items-center">
                    {/* Left: Average Rating */}
                    <div className="text-center">
                      <div className="text-6xl font-bold text-[#ec3137] mb-2">4.8</div>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-7 h-7 ${i < 4 ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Based on 2,847 reviews</p>
                    </div>

                    {/* Middle: Rating Distribution */}
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const percentage = star === 5 ? 72 : star === 4 ? 18 : star === 3 ? 6 : star === 2 ? 3 : 1;
                        return (
                          <div key={star} className="flex items-center gap-3">
                            <span className="text-sm text-gray-700 dark:text-gray-300 w-20">{star} star</span>
                            <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#ec3137] rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">{percentage}%</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Right: Review Breakdown */}
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">5 star</span>
                        <span className="font-semibold text-gray-900 dark:text-white">2,049</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">4 star</span>
                        <span className="font-semibold text-gray-900 dark:text-white">513</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">3 star</span>
                        <span className="font-semibold text-gray-900 dark:text-white">171</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">2 star</span>
                        <span className="font-semibold text-gray-900 dark:text-white">86</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">1 star</span>
                        <span className="font-semibold text-gray-900 dark:text-white">28</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Featured Reviews */}
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Review Card 1 */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#ec3137] to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        RA
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Rahim Ahmed</h4>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">Verified Purchase</span>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                        ✓ Verified
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3">
                      "Excellent quality fishing net! Very durable and the telescopic handle is a great feature. Used it on my last fishing trip and caught a 5kg catfish. Highly recommended for serious anglers!"
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Posted on January 15, 2026</span>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10.5a1.5 1.5 0 113 0v0a1.5 1.5 0 01-3 0zM7 10.5v-6a1.5 1.5 0 013 0v6a1.5 1.5 0 01-3 0zM12 10.5v-6a1.5 1.5 0 013 0v6a1.5 1.5 0 01-3 0z" />
                        </svg>
                        <span>Helpful (24)</span>
                      </div>
                    </div>
                  </div>

                  {/* Review Card 2 */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        MK
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Mohammad Karim</h4>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">Verified Purchase</span>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                        ✓ Verified
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3">
                      "Great product for the price! The material is sturdy and the net mesh is high quality. Delivery was fast and packaging was secure. Will buy again from Hook & Hunt."
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Posted on January 10, 2026</span>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10.5a1.5 1.5 0 113 0v0a1.5 1.5 0 01-3 0zM7 10.5v-6a1.5 1.5 0 013 0v6a1.5 1.5 0 01-3 0zM12 10.5v-6a1.5 1.5 0 013 0v6a1.5 1.5 0 01-3 0z" />
                        </svg>
                        <span>Helpful (18)</span>
                      </div>
                    </div>
                  </div>

                  {/* Review Card 3 */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        SH
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Sheikh Hassan</h4>
                        <div className="flex items-center gap-1">
                          {[...Array(4)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <svg className="w-4 h-4 text-gray-300 dark:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">Verified Purchase</span>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                        ✓ Verified
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3">
                      "Good quality net but delivery took a bit longer than expected. The product itself is excellent though - strong material and good size. Would recommend to others."
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Posted on January 8, 2026</span>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10.5a1.5 1.5 0 113 0v0a1.5 1.5 0 01-3 0zM7 10.5v-6a1.5 1.5 0 013 0v6a1.5 1.5 0 01-3 0zM12 10.5v-6a1.5 1.5 0 013 0v6a1.5 1.5 0 01-3 0z" />
                        </svg>
                        <span>Helpful (12)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Write Review Button */}
                <div className="text-center">
                  <button className="px-8 py-3 bg-[#ec3137] hover:bg-[#8a0f12] text-white font-bold text-sm transition-all transform hover:scale-105 rounded-xl shadow-lg">
                    Write a Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 bg-white dark:bg-[#0a0a0a]">
          <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">More Products</h2>
              <Link href={`/products?category=${product.categories && product.categories.length > 0 ? product.categories[0].slug : ''}`} className="text-[#ec3137] hover:text-[#8a0f12] font-semibold flex items-center gap-2">
                View All
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
              {relatedProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
