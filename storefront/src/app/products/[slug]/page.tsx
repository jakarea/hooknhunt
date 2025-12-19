'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import ProductCard from '@/components/product/ProductCard';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const slug = params.slug as string;
  const product = products.find(p => p.slug === slug);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  if (!product) {
    return (
      <div className="max-w-[1344px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Product Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Sorry, we couldn&apos;t find the product you&apos;re looking for.</p>
        <Link href="/products">
          <Button>Back to Products</Button>
        </Link>
      </div>
    );
  }

  // Map product properties to display properties
  const price = product.price ?? product.actual_price;
  const originalPrice = product.originalPrice ?? product.compare_at_price;
  const image = product.image ?? product.featured_image;
  const name = product.name ?? product.title;
  const stock = product.stock ?? product.inventory_quantity;
  const category = product.category_id.toString(); // Convert to string for filtering
  const description = product.description ?? product.short_description;
  const rating = product.rating ?? 4.5; // Default rating
  const reviews = product.reviews ?? 0; // Default reviews count

  const relatedProducts = products
    .filter(p => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 6);

  const discount = originalPrice && price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  // Mock product images - in real app, these would come from product data
  const productImages = [image, image, image, image, image];

  return (
    <div className="bg-white dark:bg-[#0a0a0a] min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 py-6">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Link href="/" className="hover:text-[#bc1215] transition-colors">Home</Link>
          <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href="/products" className="hover:text-[#bc1215] transition-colors">Products</Link>
          <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 dark:text-white font-medium">{name}</span>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 pb-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-gray-100 dark:bg-gray-900 aspect-square overflow-hidden">
              <Image
                src={productImages[selectedImage]}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
              />
              {discount > 0 && (
                <div className="absolute top-4 right-4 bg-[#bc1215] text-white px-4 py-2 text-sm font-bold">
                  -{discount}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail Navigation */}
            <div className="relative">
              <div className="flex gap-3 overflow-x-auto pb-2">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 bg-gray-100 dark:bg-gray-900 overflow-hidden transition-all relative ${
                      selectedImage === index
                        ? 'ring-2 ring-[#bc1215] opacity-100'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${name} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div>
              <span className="inline-block px-4 py-1 bg-gray-100 dark:bg-gray-800 text-[#bc1215] text-xs font-bold uppercase tracking-wider">
                {category}
              </span>
            </div>

            {/* Product Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
              {name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                {rating} ({reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-4xl lg:text-5xl font-bold text-[#bc1215]">
                  ৳{price.toLocaleString()}
                </span>
                {originalPrice && (
                  <>
                    <span className="text-2xl text-gray-400 dark:text-gray-600 line-through">
                      ৳{originalPrice.toLocaleString()}
                    </span>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold text-sm">
                      Save ৳{(originalPrice - price).toLocaleString()}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div>
              {stock > 0 ? (
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-semibold">In Stock ({stock} available)</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600 dark:text-red-400">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-semibold">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 border-2 border-gray-300 dark:border-gray-600 hover:border-[#bc1215] dark:hover:border-[#bc1215] flex items-center justify-center transition-colors"
                  disabled={quantity <= 1}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-2xl font-bold text-gray-900 dark:text-white w-16 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                  className="w-12 h-12 border-2 border-gray-300 dark:border-gray-600 hover:border-[#bc1215] dark:hover:border-[#bc1215] flex items-center justify-center transition-colors"
                  disabled={quantity >= stock}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  addToCart(product, quantity);
                  router.push('/checkout');
                }}
                className="w-full py-4 bg-[#bc1215] hover:bg-[#8a0f12] text-white font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                disabled={stock === 0}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Buy Now
              </button>
              <button
                onClick={() => addToCart(product, quantity)}
                className="w-full py-4 border-2 border-[#bc1215] text-[#bc1215] hover:bg-[#bc1215] hover:text-white font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                disabled={stock === 0}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Add to Cart
              </button>
              <button className="w-full py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:border-[#bc1215] dark:hover:border-[#bc1215] font-bold text-lg transition-colors flex items-center justify-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Order via WhatsApp
              </button>
            </div>

            {/* Premium Benefits */}
            <div className="bg-gray-50 dark:bg-gray-900 p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                Premium Benefits
              </h3>
              <div className="flex items-start text-gray-700 dark:text-gray-300">
                <svg className="w-6 h-6 mr-3 text-[#bc1215] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <div>
                  <p className="font-semibold">Free Shipping</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">On orders over ৳1000</p>
                </div>
              </div>
              <div className="flex items-start text-gray-700 dark:text-gray-300">
                <svg className="w-6 h-6 mr-3 text-[#bc1215] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <p className="font-semibold">Secure Payment</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">100% secure payment methods</p>
                </div>
              </div>
              <div className="flex items-start text-gray-700 dark:text-gray-300">
                <svg className="w-6 h-6 mr-3 text-[#bc1215] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <div>
                  <p className="font-semibold">Easy Returns</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">7-day return policy</p>
                </div>
              </div>
              <div className="flex items-start text-gray-700 dark:text-gray-300">
                <svg className="w-6 h-6 mr-3 text-[#bc1215] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-semibold">Fast Delivery</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ships within 2-3 business days</p>
                </div>
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
              className={`px-8 py-4 font-bold text-base transition-colors ${
                activeTab === 'description'
                  ? 'text-[#bc1215] border-b-2 border-[#bc1215]'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('specifications')}
              className={`px-8 py-4 font-bold text-base transition-colors ${
                activeTab === 'specifications'
                  ? 'text-[#bc1215] border-b-2 border-[#bc1215]'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-8 py-4 font-bold text-base transition-colors ${
                activeTab === 'reviews'
                  ? 'text-[#bc1215] border-b-2 border-[#bc1215]'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Reviews ({reviews})
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white dark:bg-[#0a0a0a] p-8">
            {activeTab === 'description' && (
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-6">
                  {description}
                </p>
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
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="font-semibold text-gray-900 dark:text-white">Brand:</span>
                  <span className="text-gray-700 dark:text-gray-300">Hook & Hunt</span>
                </div>
                <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="font-semibold text-gray-900 dark:text-white">Category:</span>
                  <span className="text-gray-700 dark:text-gray-300">{category}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="font-semibold text-gray-900 dark:text-white">SKU:</span>
                  <span className="text-gray-700 dark:text-gray-300">{product.slug.toUpperCase()}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="font-semibold text-gray-900 dark:text-white">Stock Status:</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {stock > 0 ? `In Stock (${stock} available)` : 'Out of Stock'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="font-semibold text-gray-900 dark:text-white">Weight:</span>
                  <span className="text-gray-700 dark:text-gray-300">Varies by model</span>
                </div>
                <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="font-semibold text-gray-900 dark:text-white">Material:</span>
                  <span className="text-gray-700 dark:text-gray-300">Premium Quality Materials</span>
                </div>
                <div className="grid grid-cols-2 gap-4 py-3">
                  <span className="font-semibold text-gray-900 dark:text-white">Warranty:</span>
                  <span className="text-gray-700 dark:text-gray-300">1 Year Manufacturer Warranty</span>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Review Summary */}
                <div className="flex items-center gap-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">{rating}</div>
                    <div className="flex items-center justify-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{reviews} reviews</div>
                  </div>
                </div>

                {/* Sample Reviews */}
                <div className="space-y-6">
                  {[1, 2, 3].map((review) => (
                    <div key={review} className="pb-6 border-b border-gray-200 dark:border-gray-700 last:border-0">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#bc1215] to-[#8a0f12] flex items-center justify-center text-white font-bold text-lg">
                          {review === 1 ? 'M' : review === 2 ? 'A' : 'S'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-gray-900 dark:text-white">
                              {review === 1 ? 'Mohammed Rahman' : review === 2 ? 'Ahmed Khan' : 'Sarah Ahmed'}
                            </h4>
                            <span className="text-sm text-gray-500 dark:text-gray-400">2 days ago</span>
                          </div>
                          <div className="flex items-center mb-3">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Excellent product! The quality is outstanding and it arrived quickly. Highly recommended for anyone looking for premium fishing gear.
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
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
              <Link href={`/products?category=${category}`} className="text-[#bc1215] hover:text-[#8a0f12] font-semibold flex items-center gap-2">
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
