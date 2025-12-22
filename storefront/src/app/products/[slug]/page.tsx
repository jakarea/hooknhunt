'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import ProductCard from '@/components/product/ProductCard';
import { useCart } from '@/context/CartContext';

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
  const { addToCart } = useCart();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [activeTab, setActiveTab] = useState('description');

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use Next.js API rewrite
        const response = await fetch(`/api/v1/store/products/${slug}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`);
        }

        const data: ApiResponse = await response.json();
        setProduct(data.product);

        // Auto-select first variant if product has variants
        if (data.product.variants && data.product.variants.length > 0) {
          setSelectedVariant(data.product.variants[0]);
        }
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

  // Mock related products for now
  const relatedProducts: any[] = [];

  return (
    <div className="bg-white dark:bg-[#0a0a0a] min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-[#bc1215] transition-colors">Home</Link>
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/products" className="hover:text-[#bc1215] transition-colors">Products</Link>
            {product.categories && product.categories.length > 0 && (
              <>
                <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <Link
                  href={`/products?category=${product.categories[0].slug}`}
                  className="hover:text-[#bc1215] transition-colors"
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
          <Link
            href="/products"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Products
          </Link>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 pb-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-gray-100 dark:bg-gray-900 aspect-square overflow-hidden">
              <Image
                src={productImages[selectedImage] || '/placeholder-image.jpg'}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
              />
              {product.has_offer && (
                <div className="absolute top-4 right-4 bg-[#bc1215] text-white px-4 py-2 text-sm font-bold">
                  OFFER
                </div>
              )}
            </div>


            {/* Thumbnail Navigation */}
            {productImages.length > 1 && (
              <div className="relative">
                <div className="grid grid-cols-7 gap-x-2 overflow-x-auto py-1.5 px-1">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-full h-18 bg-gray-100 dark:bg-gray-900 overflow-hidden transition-all relative ${selectedImage === index
                        ? 'ring-2 ring-[#bc1215] opacity-100'
                        : 'opacity-60 hover:opacity-100'
                        }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="72px"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-3">

            {/* Product Title & Category */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight flex-1">
                  {product.name}
                </h1>
                {product.categories && product.categories.length > 0 && (
                  <span className="flex-shrink-0 px-3 py-1 bg-[#bc1215] text-white text-xs font-bold uppercase tracking-wider rounded-full">
                    {product.categories[0].name}
                  </span>
                )}
              </div>

              {/* Product Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Product ID: {product.id}
                </span>
                {selectedVariant && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    SKU: {selectedVariant.sku}
                  </span>
                )}
                <span className={`flex items-center gap-1 ${isInStock ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    {isInStock ? (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    ) : (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    )}
                  </svg>
                  {isInStock ? `${currentStock} units available` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="border-t border-b border-gray-200 dark:border-gray-700 py-2">
              {product.variant_count > 1 ? (
                // Multiple variants - show selected variant price or price range
                <div className="space-y-0">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-[#bc1215]">
                      ৳{currentPrice.toLocaleString()}
                    </span>
                    {product.has_offer && (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold text-xs">
                        Special Offer Available
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {selectedVariant
                      ? `Selected: ${selectedVariant.name}`
                      : `${product.variant_count} variants available • ${product.price_range.display}`
                    }
                  </p>
                </div>
              ) : (
                // Single variant or no variants - show specific price
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-4xl lg:text-5xl font-bold text-[#bc1215]">
                    ৳{currentPrice.toLocaleString()}
                  </span>
                  {product.has_offer && (
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold text-xs">
                      Special Offer Available
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Variant Selection */}
            {product.variants && product.variants.length > 1 && (
              <div className="space-y-4">
                <label className="block text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  Select Variant
                </label>
                <div className="flex gap-x-2 overflow-x-auto p-1">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`relative flex-shrink-0 transition-all group ${selectedVariant?.id === variant.id
                        ? 'ring-2 ring-[#bc1215] ring-offset-2'
                        : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-2'
                        }`}
                    >

                      {/* Variant Image */}
                      <div className="w-8 h-8 rounded-sm overflow-hidden bg-gray-100 dark:bg-gray-800">
                        {variant.image?.url ? (
                          <Image
                            src={variant.image.url}
                            alt={variant.image.alt_text || variant.name}
                            width={70}
                            height={70}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Status & Urgency */}
            <div className='mb-4 space-y-3'>
              {isInStock ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-semibold text-sm">In Stock - {currentStock} units available</span>
                    </div>
                    {currentStock <= 5 && (
                      <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-bold rounded-full">
                        🔥 Only {currentStock} left!
                      </span>
                    )}
                  </div>

                  {/* Stock Progress Bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (currentStock / 20) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {currentStock > 15 ? 'Plenty of stock available' :
                     currentStock > 10 ? 'Stock running low - order soon' :
                     currentStock > 5 ? 'Limited stock available' :
                     'Selling fast - order now!'}
                  </p>
                </>
              ) : (
                <div className="flex items-center text-red-600 dark:text-red-400">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-semibold text-sm">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            {(product.variant_count <= 1 || selectedVariant) && isInStock && (
              <div>
                <label className="block text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-x-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 border-2 border-gray-300 dark:border-gray-600 hover:border-[#bc1215] dark:hover:border-[#bc1215] flex items-center justify-center transition-colors"
                    disabled={quantity <= 1}
                  >
                    <svg className="w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="text-lg font-bold text-gray-900 dark:text-white min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                    className="w-8 h-8 border-2 border-gray-300 dark:border-gray-600 hover:border-[#bc1215] dark:hover:border-[#bc1215] flex items-center justify-center transition-colors"
                    disabled={quantity >= currentStock}
                  >
                    <svg className="w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                  <span>Money Back Guarantee</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                  <span>Fast Delivery</span>
                </div>
              </div>

              {(product.variant_count <= 1 || selectedVariant) ? (
                <div className='grid grid-cols-2 items-center gap-x-5'>
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
                      router.push('/checkout');
                    }}
                    className="w-full py-4 border-2 border-[#bc1215] bg-[#bc1215] hover:bg-[#8a0f12] text-white font-bold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-x-2 shadow-lg"
                    disabled={!isInStock}
                  >
                    <svg className="w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    className="w-full py-4 border-2 border-[#bc1215] text-[#bc1215] hover:bg-[#bc1215] hover:text-white font-bold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-x-2 shadow-md"
                    disabled={!isInStock}
                  >
                    <svg className="w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              ) : (
                <div className="w-full py-4 bg-gray-100 dark:bg-gray-800 text-center text-red-600 dark:text-red-400">
                  <p className="font-semibold">Please select a variant to continue</p>
                </div>
              )}

              {/* Additional Actions */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    // Save for later functionality
                    alert('Product saved for later!');
                  }}
                  className="py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-xs transition-colors flex items-center justify-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  Save
                </button>
                <button className="py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-xs transition-colors flex items-center justify-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Compare
                </button>
                <Link
                  href={`http://localhost:5174/products/${product.id}/edit`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 border border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium text-xs transition-colors flex items-center justify-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </Link>
              </div>

              {/* WhatsApp Order Button */}
              <div className="w-full">
                <button className="w-full py-3 border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-bold text-sm transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-md">
                  <svg className="w-4" fill="#25D366" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      <title>whatsapp</title>
                      <path d="M26.576 5.363c-2.69-2.69-6.406-4.354-10.511-4.354-8.209 0-14.865 6.655-14.865 14.865 0 2.732.737 5.291 2.022 7.491l-0.038-0.070-2.109 7.702 7.879-2.067c2.051 1.139 4.498 1.809 7.102 1.809h0.006c8.209-0.003 14.862-6.659 14.862-14.868 0-4.103-1.662-7.817-4.349-10.507l0 0zM16.062 28.228h-0.005c-0 0-0.001 0-0.001 0-2.319 0-4.489-0.64-6.342-1.753l0.056 0.031-0.451-0.267-4.675 1.227 1.247-4.559-0.294-0.467c-1.185-1.862-1.889-4.131-1.889-6.565 0-6.822 5.531-12.353 12.353-12.353s12.353 5.531 12.353 12.353c0 6.822-5.53 12.353-12.353 12.353h-0zM22.838 18.977c-0.371-0.186-2.197-1.083-2.537-1.208-0.341-0.124-0.589-0.185-0.837 0.187-0.246 0.371-0.958 1.207-1.175 1.455-0.216 0.249-0.434 0.279-0.805 0.094-1.15-0.466-2.138-1.087-2.997-1.852l0.010 0.009c-0.799-0.74-1.484-1.587-2.037-2.521l-0.028-0.052c-0.216-0.371-0.023-0.572 0.162-0.757 0.167-0.166 0.372-0.434 0.557-0.65 0.146-0.179 0.271-0.384 0.366-0.604l0.006-0.017c0.043-0.087 0.068-0.188 0.068-0.296 0-0.131-0.037-0.253-0.101-0.357l0.002 0.003c-0.094-0.186-0.836-2.014-1.145-2.758-0.302-0.724-0.609-0.625-0.836-0.637-0.216-0.010-0.464-0.012-0.712-0.012-0.395 0.010-0.746 0.188-0.988 0.463l-0.001 0.002c-0.802 0.761-1.3 1.834-1.3 3.023 0 0.026 0 0.053 0.001 0.079l-0-0.004c0.131 1.467 0.681 2.784 1.527 3.857l-0.012-0.015c1.604 2.379 3.742 4.282 6.251 5.564l0.094 0.043c0.548 0.248 1.25 0.513 1.968 0.74l0.149 0.041c0.442 0.14 0.951 0.221 1.479 0.221 0.303 0 0.601-0.027 0.889-0.078l-0.031 0.004c1.069-0.223 1.956-0.868 2.497-1.749l0.009-0.017c0.165-0.366 0.261-0.793 0.261-1.242 0-0.185-0.016-0.366-0.047-0.542l0.003 0.019c-0.092-0.155-0.34-0.247-0.712-0.434z"></path>
                    </g>
                  </svg>
                  Order via WhatsApp for Quick Assistance
                </button>
              </div>
            </div>

            {/* Limited Time Offer Banner */}
            {product.has_offer && (
              <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 rounded-lg text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                  <h3 className="font-bold text-lg">Limited Time Offer!</h3>
                </div>
                <p className="text-sm font-semibold mb-2">Special discount available for this product</p>
                <div className="flex items-center justify-center gap-4 text-sm">
                  <span className="font-mono font-bold">⏰ Ends in 23:59:59</span>
                </div>
              </div>
            )}

            {/* Social Proof - Recent Activity */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-800 dark:text-green-200">
                  🔥 Popular Item
                </span>
              </div>
              <p className="text-xs text-green-700 dark:text-green-300">
                <span className="font-bold">{Math.floor(Math.random() * 20) + 5}</span> people bought this product today
              </p>
              <p className="text-xs text-green-700 dark:text-green-300">
                <span className="font-bold">{Math.floor(Math.random() * 50) + 10}</span> sold in the last 7 days
              </p>
            </div>

            {/* Premium Benefits */}
            <div className="bg-gray-50 dark:bg-gray-900 p-4 space-y-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 text-center">
                Product Highlights
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-start text-gray-700 dark:text-gray-300 bg-white px-3 py-2">

                  <svg className="w-6 h-6 mr-3 text-[#bc1215] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#08ba1d"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.288"></g><g id="SVGRepo_iconCarrier"> <path d="M4 12.6111L8.92308 17.5L20 6.5" stroke="#08ba1d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>

                  <div>
                    <p className="font-semibold text-sm">Premium Quality</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Durable construction for long-lasting use</p>
                  </div>
                </div>
                <div className="flex items-start text-gray-700 dark:text-gray-300 bg-white px-3 py-2">
                  <svg className="w-6 h-6 mr-3 text-[#bc1215] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#08ba1d"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.288"></g><g id="SVGRepo_iconCarrier"> <path d="M4 12.6111L8.92308 17.5L20 6.5" stroke="#08ba1d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                  <div>
                    <p className="font-semibold text-sm">Multiple Variants</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{product.variant_count} options available</p>
                  </div>
                </div>
                <div className="flex items-start text-gray-700 dark:text-gray-300 bg-white px-3 py-2">
                  <svg className="w-6 h-6 mr-3 text-[#bc1215] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#08ba1d"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.288"></g><g id="SVGRepo_iconCarrier"> <path d="M4 12.6111L8.92308 17.5L20 6.5" stroke="#08ba1d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                  <div>
                    <p className="font-semibold text-sm">Weather-resistant</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">for outdoor use</p>
                  </div>
                </div>
                <div className="flex items-start text-gray-700 dark:text-gray-300  bg-white px-3 py-2">
                  <svg className="w-6 h-6 mr-3 text-[#bc1215] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#08ba1d"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.288"></g><g id="SVGRepo_iconCarrier"> <path d="M4 12.6111L8.92308 17.5L20 6.5" stroke="#08ba1d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                  <div>
                    <p className="font-semibold text-sm">Suitable for both freshwater</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Saltwater fishing</p>
                  </div>
                </div>
                <div className="flex items-start text-gray-700 dark:text-gray-300 bg-white px-3 py-2">
                  <svg className="w-6 h-6 mr-3 text-[#bc1215] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#08ba1d"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.288"></g><g id="SVGRepo_iconCarrier"> <path d="M4 12.6111L8.92308 17.5L20 6.5" stroke="#08ba1d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                  <div>
                    <p className="font-semibold text-sm">Weather-resistant</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">for outdoor use</p>
                  </div>
                </div>
                <div className="flex items-start text-gray-700 dark:text-gray-300  bg-white px-3 py-2">
                  <svg className="w-6 h-6 mr-3 text-[#bc1215] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#08ba1d"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.288"></g><g id="SVGRepo_iconCarrier"> <path d="M4 12.6111L8.92308 17.5L20 6.5" stroke="#08ba1d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                  <div>
                    <p className="font-semibold text-sm">Suitable for both freshwater</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Saltwater fishing</p>
                  </div>
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
              <svg className="w-6 h-6 mr-3 text-[#bc1215] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <div>
                <p className="font-semibold text-sm">Free Shipping</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">On orders over ৳1000</p>
              </div>
            </div>
            <div className="flex items-start text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-3">
              <svg className="w-6 h-6 mr-3 text-[#bc1215] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <p className="font-semibold text-sm">Secure Payment</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">100% secure payment methods</p>
              </div>
            </div>
            <div className="flex items-start text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-3">
              <svg className="w-6 h-6 mr-3 text-[#bc1215] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <div>
                <p className="font-semibold text-sm">Easy Returns</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">7-day return policy</p>
              </div>
            </div>
            <div className="flex items-start text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-3">
              <svg className="w-6 h-6 mr-3 text-[#bc1215] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Product Details Tabs */}
      <div className="bg-gray-50 dark:bg-[#0f0f0f] py-12">
        <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-8 py-4 font-bold text-base transition-colors ${activeTab === 'description'
                ? 'text-[#bc1215] border-b-2 border-[#bc1215]'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('specifications')}
              className={`px-8 py-4 font-bold text-base transition-colors ${activeTab === 'specifications'
                ? 'text-[#bc1215] border-b-2 border-[#bc1215]'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-8 py-4 font-bold text-base transition-colors ${activeTab === 'reviews'
                ? 'text-[#bc1215] border-b-2 border-[#bc1215]'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              Reviews
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white dark:bg-[#0a0a0a] p-8">
            {activeTab === 'description' && (
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
            )}

            {activeTab === 'specifications' && (
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
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Review Summary */}
                <div className="flex items-center gap-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">4.5</div>
                    <div className="flex items-center justify-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                            }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">No reviews yet</div>
                  </div>
                </div>

                {/* No Reviews Message */}
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      No Reviews Yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Be the first to review this product! Share your experience with other customers.
                    </p>
                    <button className="px-6 py-3 bg-[#bc1215] hover:bg-[#8a0f12] text-white font-semibold rounded-lg transition-colors duration-300">
                      Write a Review
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 bg-white dark:bg-[#0a0a0a]">
          <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">More Products</h2>
              <Link href={`/products?category=${product.categories && product.categories.length > 0 ? product.categories[0].slug : ''}`} className="text-[#bc1215] hover:text-[#8a0f12] font-semibold flex items-center gap-2">
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
