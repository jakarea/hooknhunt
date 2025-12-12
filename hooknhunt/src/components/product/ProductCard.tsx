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
  const image = product.image ?? product.featured_image;
  const name = product.name ?? product.title;
  const stock = product.stock ?? product.inventory_quantity;

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
    <div className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 overflow-hidden">
      <Link href={`/products/${product.slug}`} className="block">
        {/* Product Image */}
        <div className="relative overflow-hidden aspect-square bg-gray-100 dark:bg-gray-800">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
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
        <div className="p-3">
          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 text-sm group-hover:text-[#bc1215] transition-colors min-h-[2.5rem]">
            {name}
          </h3>

          {/* Price */}
          <div className="mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg font-bold text-[#bc1215]">
                ৳{price.toLocaleString()}
              </span>
              {originalPrice && (
                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                  ৳{originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Add to Cart / View Cart Button */}
      <div className="px-3 pb-3">
        {productInCart ? (
          <button
            onClick={handleViewCart}
            className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-[1.02]"
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
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={stock === 0}
            className={`w-full py-2.5 bg-[#bc1215] hover:bg-[#8a0f12] text-white font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-[1.02] ${
              isAdding ? 'scale-95 bg-[#8a0f12]' : ''
            }`}
          >
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${
                isAdding ? 'scale-125 rotate-12' : ''
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
            {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        )}
      </div>
    </div>
  );
}
