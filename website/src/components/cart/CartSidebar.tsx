'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import AnimatedCounter from '@/components/common/AnimatedCounter';
import { useTranslation } from 'react-i18next';

export default function CartSidebar() {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartCount,
    isCartOpen,
    closeCart,
  } = useCart();

  const [mounted, setMounted] = React.useState(false);

  // Fix hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  if (!mounted) {
    return null;
  }

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  const handleViewCart = () => {
    closeCart();
    router.push('/cart');
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] md:w-[450px] bg-white dark:bg-[#0a0a0a] shadow-2xl z-[101] transform transition-transform duration-300 ease-out flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#bc1215] to-[#8a0f12] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-[#bc1215] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {getCartCount()}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">{t('cart.sidebar.title')}</h2>
              <p className="text-xs text-white/90">
                <AnimatedCounter
                  value={getCartCount()}
                  duration={400}
                />
                {' '}
                {getCartCount() === 1 ? t('cart.sidebar.item') : t('cart.sidebar.items')}
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={closeCart}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-12 h-12 text-gray-400"
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
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t('cart.sidebar.empty')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('cart.sidebar.emptyMessage')}
              </p>
              <button
                onClick={closeCart}
                className="px-6 py-3 bg-[#bc1215] hover:bg-[#8a0f12] text-white font-semibold transition-colors"
              >
                {t('common.continueShopping')}
              </button>
            </div>
          ) : (
            <>
              {cartItems.map((item, index) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 bg-gray-50 dark:bg-[#0f0f0f] p-4 border border-gray-200 dark:border-gray-800 animate-slideIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Product Image */}
                  <Link
                    href={`/products/${item.product.slug}`}
                    onClick={closeCart}
                    className="flex-shrink-0 relative w-20 h-20"
                  >
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover hover:opacity-80 transition-opacity"
                      sizes="80px"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.product.slug}`}
                      onClick={closeCart}
                      className="block"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 line-clamp-2 hover:text-[#bc1215] transition-colors">
                        {item.product.name}
                      </h3>
                    </Link>

                    <p className="text-[#bc1215] font-bold text-base mb-2">
                      ৳{item.product.price.toLocaleString()}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                        </svg>
                      </button>

                      <span className="w-10 text-center font-semibold text-gray-900 dark:text-white text-sm">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="w-7 h-7 flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Increase quantity"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </button>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="ml-auto p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        aria-label="Remove item"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Stock Warning */}
                    {item.quantity >= item.product.stock && (
                      <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                        {t('cart.sidebar.maxStock')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer with Total and Checkout */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-800 p-5 space-y-4 bg-gray-50 dark:bg-[#0f0f0f]">
            {/* Subtotal */}
            <div className="flex justify-between items-center text-lg">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Subtotal:</span>
              <span className="font-bold text-2xl text-[#bc1215]">
                <AnimatedCounter
                  value={getCartTotal()}
                  prefix="৳"
                  duration={600}
                />
              </span>
            </div>

            {/* Shipping Note */}
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
              {t('cart.sidebar.shippingNote')}
            </p>

            {/* View Cart Button */}
            <button
              onClick={handleViewCart}
              className="w-full py-3 bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-[1.02]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              {t('cart.sidebar.viewCart')}
            </button>

            {/* Proceed to Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full py-3 bg-gradient-to-r from-[#bc1215] to-[#8a0f12] hover:from-[#8a0f12] hover:to-[#bc1215] text-white font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg transform hover:scale-[1.02]"
            >
              <span>{t('cart.sidebar.proceedToCheckout')}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}
