'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addToCart, isInCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  // Map product properties to display properties
  const price = product.price ?? product.actual_price;
  const originalPrice = product.originalPrice ?? product.compare_at_price;
  const image = product.image ?? product.featured_image ?? null;
  const name = product.name ?? product.title;
  const stock = product.stock ?? product.inventory_quantity;
  const variant_count = product.variant_count || 0;
  const price_range_display = product.price_range_display || '';

  const discount = originalPrice && price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const productInCart = isInCart(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAdding(true);
    addToCart(product, 1);

    // Reset animation after 500ms
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  const handleViewCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push('/cart');
  };

  return (
    <div className="group bg-white border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
      <Link href={`/products/${product.slug}`} className="flex flex-col h-full">
        {/* Product Image */}
        <div className="relative overflow-hidden aspect-square bg-gray-100 p-2 flex-shrink-0">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                className="w-16 h-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-2 right-2 bg-[#bc1215] text-white px-2 py-1 text-xs font-bold">
              -{discount}%
            </div>
          )}
          {/* Stock Warning */}
          {stock > 0 && stock < 10 && (
            <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 text-xs font-semibold">
              Only {stock} left
            </div>
          )}
          {/* Out of Stock */}
          {stock === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="bg-white text-gray-900 px-4 py-2 font-bold text-sm">
                OUT OF STOCK
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-2.5 flex-1 flex flex-col">
          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm group-hover:text-[#bc1215] transition-colors min-h-[2.5rem]">
            {name}
          </h3>

          {/* Price or Price Range */}
          <div className="mb-3 lg:mb-5 flex-1">
            {(variant_count === 0 || variant_count === 1) ? (
              // Single variant or no variants - show exact price
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm lg:text-base font-bold text-[#bc1215]">
                  {price > 0 ? `৳${price.toLocaleString()}` : 'Price unavailable'}
                </span>
                {/* {originalPrice && originalPrice > price && price > 0 && (
                  <span className="text-xs text-gray-500 line-through mt-1">
                    ৳{originalPrice.toLocaleString()}
                  </span>
                )} */}
              </div>
            ) : (
              // Multiple variants - show price range
              <div className="flex flex-col gap-1">
                <span className="text-sm lg:text-base font-bold text-[#bc1215]">
                  {price_range_display || (price > 0 ? `৳${price.toLocaleString()}` : 'Price varies')}
                </span>
                <span className="text-xs text-gray-500">
                  {variant_count} variants available
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Button Logic */}
      <div className="px-3 pb-3 flex-shrink-0 mt-auto">
        {productInCart ? (
          <button
            onClick={handleViewCart}
            className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-[1.02]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            View Cart
          </button>
        ) : (variant_count > 1) ? (
          // Multiple variants - show "View Details" button
          <Link href={`/products/${product.slug}`} className="w-full py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-[1.02]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Details
          </Link>
        ) : (
          // Single variant or no variants - show "Add to Cart" button
          <button
            onClick={handleAddToCart}
            disabled={stock === 0 || price <= 0}
            className={`w-full py-2.5 bg-[#bc1215] hover:bg-[#8a0f12] text-white font-semibold text-xs transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-[1.02] ${isAdding ? 'scale-95 bg-[#8a0f12]' : ''
              }`}
          >
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${isAdding ? 'scale-125 rotate-12' : ''
                }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {stock === 0 ? 'Out of Stock' : price <= 0 ? 'Unavailable' : 'Add to Cart'}
          </button>
        )}
      </div>
    </div>
  );
}
