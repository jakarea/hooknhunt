import React from 'react';
import Link from 'next/link';

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-12 sm:py-16">
      <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Track Your Order
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Enter your order number to track your shipment status
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Track Order Form */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-sm p-6 sm:p-8 mb-6 sm:mb-8">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-4 sm:mb-6">
                <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Order Number *
                </label>
                <input
                  type="text"
                  id="orderNumber"
                  placeholder="e.g., HH-2024-001234"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#ec3137] transition-colors bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-[#ec3137] text-white font-semibold rounded-lg hover:bg-[#9a0f12] transition-colors"
              >
                Track Order
              </button>
            </form>
          </div>

          {/* Order Status Example */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-sm p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Order Status: HH-2024-001234
            </h3>

            {/* Progress Steps */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Order Confirmed</h4>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Feb 20, 2024 - 10:30 AM</p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Processing</h4>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Feb 20, 2024 - 2:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-[#ec3137] rounded-full flex items-center justify-center animate-pulse">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Shipped</h4>
                  <p className="text-xs sm:text-sm text-[#ec3137] font-medium">In Transit</p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Expected delivery: Feb 25, 2024</p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4 opacity-50">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Delivered</h4>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Pending</p>
                </div>
              </div>
            </div>

            {/* Shipping Details */}
            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Shipping Details</h4>
              <div className="bg-gray-50 dark:bg-[#0a0a0a] rounded-lg p-3 sm:p-4 text-sm">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Courier:</span>
                    <p className="font-medium text-gray-900 dark:text-white">Pathao</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Tracking ID:</span>
                    <p className="font-medium text-gray-900 dark:text-white">PTH-123456789</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-4">
            Need help with your order?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#046bd2] text-white font-semibold rounded-lg hover:bg-[#0353a5] transition-colors text-sm"
          >
            Contact Support
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
