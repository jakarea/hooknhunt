'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import AnimatedCounter from '@/components/common/AnimatedCounter';
import { useCart } from '@/context/CartContext';

// Special offer products (mega discount items)
const specialOffers = [
  {
    id: 999,
    name: 'Premium Fishing Line - 500m Spool',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80',
    originalPrice: 1200,
    price: 399,
    discount: 67,
    stock: 50,
    category: 'lines',
  },
  {
    id: 998,
    name: 'Fishing Hook Set - 100 Pieces',
    image: 'https://images.unsplash.com/photo-1534590028823-ba395a3e4f77?w=400&q=80',
    originalPrice: 800,
    price: 299,
    discount: 63,
    stock: 100,
    category: 'accessories',
  },
];

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  const [mounted, setMounted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<number | null>(null);
  const [offerAdding, setOfferAdding] = useState(false);
  const [offerAdded, setOfferAdded] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes countdown

  // Get order details from URL params
  const orderId = searchParams.get('orderId') || 'ORD-' + Date.now();
  const orderTotal = parseFloat(searchParams.get('total') || '0');
  const customerName = searchParams.get('name') || 'Customer';

  useEffect(() => {
    setMounted(true);

    // Clear the cart when the order success page loads (only once)
    clearCart();

    // Hide confetti after 5 seconds
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(confettiTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAcceptOffer = async () => {
    if (!selectedOffer) return;

    setOfferAdding(true);

    const selectedProduct = specialOffers.find(offer => offer.id === selectedOffer);

    // Simulate API call to add item to existing order (not to cart)
    console.log('Adding special offer to order:', {
      orderId,
      product: selectedProduct,
      newOrderTotal: orderTotal + (selectedProduct?.price || 0),
    });

    // Here you would call your API to update the order
    // Example: await updateOrder(orderId, { additionalItem: selectedProduct });

    await new Promise(resolve => setTimeout(resolve, 1500));

    setOfferAdding(false);
    setOfferAdded(true);

    // Show success message for 3 seconds then redirect
    setTimeout(() => {
      router.push('/');
    }, 3000);
  };

  const handleDeclineOffer = () => {
    router.push('/');
  };

  if (!mounted) {
    return null;
  }

  const selectedOfferProduct = specialOffers.find(offer => offer.id === selectedOffer);

  return (
    <div className="bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-[#0a0a0a] dark:to-gray-900 min-h-screen relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10%',
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              <div
                className={`w-3 h-3 ${
                  ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'][
                    Math.floor(Math.random() * 5)
                  ]
                }`}
                style={{
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="max-w-[1200px] mx-auto px-4 lg:px-8 xl:px-12 py-12">
        {/* Success Message */}
        <div className="text-center mb-12 animate-slideUp">
          {/* Success Icon with Animation */}
          <div className="relative inline-block mb-6">
            <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center animate-scaleIn shadow-2xl">
              <svg
                className="w-20 h-20 text-white animate-checkmark"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            {/* Pulse rings */}
            <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20" />
            <div className="absolute inset-0 rounded-full bg-green-400 animate-pulse opacity-30" />
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 animate-slideUp">
            Thank You, {customerName}! 🎉
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-2 animate-slideUp" style={{ animationDelay: '0.1s' }}>
            Your order has been successfully placed!
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 animate-slideUp" style={{ animationDelay: '0.2s' }}>
            Order ID: <span className="font-bold text-[#bc1215]">{orderId}</span>
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white dark:bg-[#0a0a0a] border-2 border-gray-200 dark:border-gray-800 rounded-xl p-8 mb-8 shadow-xl animate-slideUp" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order Summary</h2>
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Confirmed</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 dark:bg-[#0f0f0f] rounded-lg">
              <svg className="w-12 h-12 mx-auto mb-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Order Total</p>
              <p className="text-2xl font-bold text-[#bc1215]">
                <AnimatedCounter value={orderTotal} prefix="৳" duration={1000} />
              </p>
            </div>

            <div className="text-center p-4 bg-gray-50 dark:bg-[#0f0f0f] rounded-lg">
              <svg className="w-12 h-12 mx-auto mb-3 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Estimated Delivery</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">3-5 Days</p>
            </div>

            <div className="text-center p-4 bg-gray-50 dark:bg-[#0f0f0f] rounded-lg">
              <svg className="w-12 h-12 mx-auto mb-3 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Confirmation Email</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">Sent ✓</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              <span className="font-semibold">Note:</span> You will receive an SMS and email confirmation shortly with your order details and tracking information.
            </p>
          </div>
        </div>

        {/* Special Offer Section */}
        {!offerAdded && (
          <div className="bg-gradient-to-br from-[#bc1215] to-[#8a0f12] rounded-xl p-8 shadow-2xl mb-8 relative overflow-hidden animate-slideUp" style={{ animationDelay: '0.4s' }}>
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgZmlsbD0iI2ZmZiIvPjwvZz48L3N2Zz4=')]" />
            </div>

            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold text-sm mb-4 animate-bounce">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  EXCLUSIVE ONE-TIME OFFER
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  Wait! Don&apos;t Miss This Deal! 🔥
                </h2>
                <p className="text-xl text-white/90 mb-4">
                  Add this to your current order and save BIG!
                </p>
                <div className="flex items-center justify-center gap-2 text-yellow-300">
                  <svg className="w-6 h-6 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-lg font-bold">Offer expires in: {formatTime(countdown)}</span>
                </div>
              </div>

              {/* Offer Products */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {specialOffers.map((offer) => (
                  <div
                    key={offer.id}
                    onClick={() => setSelectedOffer(offer.id)}
                    className={`bg-white dark:bg-[#0a0a0a] rounded-xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      selectedOffer === offer.id
                        ? 'ring-4 ring-yellow-400 shadow-2xl'
                        : 'hover:shadow-xl'
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24">
                        <Image
                          src={offer.image}
                          alt={offer.name}
                          fill
                          className="object-cover rounded-lg"
                          sizes="96px"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                          {offer.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl font-bold text-[#bc1215]">
                            ৳{offer.price.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                            ৳{offer.originalPrice.toLocaleString()}
                          </span>
                        </div>
                        <div className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-bold">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          SAVE {offer.discount}%
                        </div>
                      </div>
                      {selectedOffer === offer.id && (
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAcceptOffer}
                  disabled={!selectedOffer || offerAdding}
                  className="flex-1 py-4 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {offerAdding ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Adding to Order...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Yes! Add to My Order
                      {selectedOfferProduct && (
                        <span className="ml-1">(৳{selectedOfferProduct.price})</span>
                      )}
                    </>
                  )}
                </button>
                <button
                  onClick={handleDeclineOffer}
                  disabled={offerAdding}
                  className="py-4 px-8 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm border-2 border-white/40 disabled:opacity-50"
                >
                  No Thanks, Continue
                </button>
              </div>

              <p className="text-center text-white/80 text-sm mt-4">
                ⚡ This item will be added to your current order #{orderId} • No additional shipping charges
              </p>
            </div>
          </div>
        )}

        {/* Success Message After Adding Offer */}
        {offerAdded && (
          <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-xl p-8 text-center mb-8 animate-slideUp">
            <div className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center animate-scaleIn">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">
              Awesome! Item Added Successfully! 🎊
            </h3>
            <p className="text-green-800 dark:text-green-200 mb-4">
              Your special offer has been added to order #{orderId}
            </p>
            <p className="text-sm text-green-700 dark:text-green-300">
              Redirecting you to homepage...
            </p>
          </div>
        )}

        {/* Next Steps */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Track Your Order</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Monitor your order status in real-time
            </p>
            <Link
              href="/orders"
              className="text-[#bc1215] hover:underline font-semibold text-sm"
            >
              View Orders →
            </Link>
          </div>

          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Continue Shopping</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Explore more fishing gear
            </p>
            <Link
              href="/products"
              className="text-[#bc1215] hover:underline font-semibold text-sm"
            >
              Browse Products →
            </Link>
          </div>

          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Need Help?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Contact our support team
            </p>
            <Link
              href="/contact"
              className="text-[#bc1215] hover:underline font-semibold text-sm"
            >
              Contact Us →
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        @keyframes checkmark {
          0% {
            stroke-dashoffset: 100;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        .animate-confetti {
          animation: confetti linear forwards;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }

        .animate-checkmark {
          stroke-dasharray: 100;
          animation: checkmark 0.6s ease-out 0.3s forwards;
        }
      `}</style>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
