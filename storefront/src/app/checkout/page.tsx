'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import AnimatedCounter from '@/components/common/AnimatedCounter';

type PaymentMethod = 'cod' | 'mobile' | 'card';
type MobileWallet = 'bkash' | 'nagad' | 'rocket' | null;

// Coupon types
const availableCoupons = {
  'SAVE10': { type: 'percentage' as const, value: 10 },
  'SAVE100': { type: 'fixed' as const, value: 100 },
  'SAVE200': { type: 'fixed' as const, value: 200 },
  'FREESHIP': { type: 'shipping' as const, value: 0 },
  'WELCOME20': { type: 'percentage' as const, value: 20 },
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, getCartTotal } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [selectedWallet, setSelectedWallet] = useState<MobileWallet>(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    type: 'percentage' | 'fixed' | 'shipping';
    value: number;
  } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Customer info
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, [cartItems, router]);

  // Calculations
  const subtotal = getCartTotal();
  const deliveryCharge = 60;
  const serviceCharge = 5;

  let couponDiscount = 0;
  let freeShipping = false;

  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      couponDiscount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else if (appliedCoupon.type === 'fixed') {
      couponDiscount = Math.min(appliedCoupon.value, subtotal);
    } else if (appliedCoupon.type === 'shipping') {
      freeShipping = true;
    }
  }

  const subtotalAfterCoupon = subtotal - couponDiscount;
  const totalCharges = freeShipping ? serviceCharge : deliveryCharge + serviceCharge;
  const total = subtotalAfterCoupon + totalCharges;
  const payableTotal = total;

  // Calculate original total (without discount)
  const originalSubtotal = cartItems.reduce((sum, item) => {
    const price = item.product.originalPrice || item.product.price || 0;
    return sum + price * item.quantity;
  }, 0);
  const totalSavings = (originalSubtotal - subtotal) + couponDiscount + (freeShipping ? deliveryCharge : 0);

  // Apply coupon
  const applyCoupon = () => {
    setCouponError('');
    setCouponSuccess('');

    const trimmedCode = couponCode.trim().toUpperCase();

    if (!trimmedCode) {
      setCouponError('Please enter a coupon code');
      return;
    }

    const coupon = availableCoupons[trimmedCode as keyof typeof availableCoupons];

    if (!coupon) {
      setCouponError('Invalid coupon code');
      return;
    }

    if (appliedCoupon && appliedCoupon.code === trimmedCode) {
      setCouponError('This coupon is already applied');
      return;
    }

    setAppliedCoupon({
      code: trimmedCode,
      type: coupon.type,
      value: coupon.value,
    });

    setCouponSuccess(`Coupon "${trimmedCode}" applied successfully!`);
    setCouponCode('');

    setTimeout(() => {
      setCouponSuccess('');
    }, 3000);
  };

  // Remove coupon
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
    setCouponSuccess('');
    setCouponCode('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckout = () => {
    if (!agreeToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    if (paymentMethod === 'mobile' && !selectedWallet) {
      alert('Please select a mobile wallet');
      return;
    }

    // Validate form
    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.district) {
      alert('Please fill in all required fields');
      return;
    }

    // Generate order ID
    const orderId = 'ORD-' + Date.now();

    // Here you would process the order via API
    console.log('Processing order...', {
      orderId,
      formData,
      paymentMethod,
      selectedWallet,
      appliedCoupon,
      total: payableTotal,
      items: cartItems,
    });

    // Redirect to success page with order details
    // Cart will be cleared on the success page
    router.push(`/order-success?orderId=${orderId}&total=${payableTotal}&name=${encodeURIComponent(formData.name)}`);
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-[#0a0a0a] min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-50 dark:bg-[#0f0f0f] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 py-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-[#bc1215] transition-colors">
              Home
            </Link>
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/cart" className="hover:text-[#bc1215] transition-colors">
              Cart
            </Link>
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 dark:text-white font-medium">Checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 py-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Customer Info & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white dark:bg-[#0a0a0a] border-2 border-gray-200 dark:border-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Customer Information
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#bc1215] focus:border-[#bc1215] outline-none transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#bc1215] focus:border-[#bc1215] outline-none transition-colors"
                    placeholder="01XXXXXXXXX"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#bc1215] focus:border-[#bc1215] outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Address <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#bc1215] focus:border-[#bc1215] outline-none transition-colors"
                    placeholder="House/Flat No., Road, Area"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    City <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#bc1215] focus:border-[#bc1215] outline-none transition-colors"
                    placeholder="e.g., Dhaka"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    District <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#bc1215] focus:border-[#bc1215] outline-none transition-colors"
                    placeholder="e.g., Dhaka"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-[#0a0a0a] border-2 border-gray-200 dark:border-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Payment Method
              </h2>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#bc1215] bg-red-50 dark:bg-red-900/10'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => {
                      setPaymentMethod('cod');
                      setSelectedWallet(null);
                    }}
                    className="w-5 h-5 text-[#bc1215] border-2 border-gray-300 focus:ring-2 focus:ring-[#bc1215]"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Cash on Delivery</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Pay when you receive</p>
                    </div>
                  </div>
                </label>

                {/* Mobile Wallets */}
                <label
                  className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'mobile'
                      ? 'border-[#bc1215] bg-red-50 dark:bg-red-900/10'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="mobile"
                    checked={paymentMethod === 'mobile'}
                    onChange={() => setPaymentMethod('mobile')}
                    className="w-5 h-5 text-[#bc1215] border-2 border-gray-300 focus:ring-2 focus:ring-[#bc1215] mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">Mobile Wallet</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">bKash, Nagad, Rocket</p>
                      </div>
                    </div>

                    {paymentMethod === 'mobile' && (
                      <div className="grid grid-cols-3 gap-3 mt-3">
                        <button
                          type="button"
                          onClick={() => setSelectedWallet('bkash')}
                          className={`p-3 border-2 rounded-lg transition-all ${
                            selectedWallet === 'bkash'
                              ? 'border-pink-600 bg-pink-50 dark:bg-pink-900/20'
                              : 'border-gray-300 dark:border-gray-600 hover:border-pink-400'
                          }`}
                        >
                          <div className="text-center">
                            <div className="font-bold text-pink-600">bKash</div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedWallet('nagad')}
                          className={`p-3 border-2 rounded-lg transition-all ${
                            selectedWallet === 'nagad'
                              ? 'border-orange-600 bg-orange-50 dark:bg-orange-900/20'
                              : 'border-gray-300 dark:border-gray-600 hover:border-orange-400'
                          }`}
                        >
                          <div className="text-center">
                            <div className="font-bold text-orange-600">Nagad</div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedWallet('rocket')}
                          className={`p-3 border-2 rounded-lg transition-all ${
                            selectedWallet === 'rocket'
                              ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                              : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
                          }`}
                        >
                          <div className="text-center">
                            <div className="font-bold text-purple-600">Rocket</div>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </label>

                {/* Debit/Credit Card */}
                <label
                  className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#bc1215] bg-red-50 dark:bg-red-900/10'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => {
                      setPaymentMethod('card');
                      setSelectedWallet(null);
                    }}
                    className="w-5 h-5 text-[#bc1215] border-2 border-gray-300 focus:ring-2 focus:ring-[#bc1215]"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Debit / Credit Card</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Visa, Mastercard, Amex</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#0a0a0a] border-2 border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden sticky top-24">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#bc1215] to-[#8a0f12] text-white p-6">
                <h2 className="text-2xl font-bold">Checkout Summary</h2>
                <p className="text-sm text-white/90 mt-1">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </p>
              </div>

              <div className="p-6">
                {/* Coupon Code */}
                <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    Apply Voucher or Promo Code
                  </h3>

                  {appliedCoupon ? (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <p className="text-sm font-bold text-green-900 dark:text-green-100">
                              {appliedCoupon.code}
                            </p>
                            <p className="text-xs text-green-700 dark:text-green-300">
                              {appliedCoupon.type === 'percentage' && `${appliedCoupon.value}% discount applied`}
                              {appliedCoupon.type === 'fixed' && `৳${appliedCoupon.value} discount applied`}
                              {appliedCoupon.type === 'shipping' && 'Free shipping applied'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-green-700 dark:text-green-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          aria-label="Remove coupon"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          onKeyPress={(e) => e.key === 'Enter' && applyCoupon()}
                          placeholder="Enter code"
                          className="flex-1 px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#bc1215] focus:border-[#bc1215] outline-none transition-colors"
                        />
                        <button
                          onClick={applyCoupon}
                          className="px-6 py-2.5 bg-[#bc1215] hover:bg-[#8a0f12] text-white font-semibold rounded-lg transition-colors"
                        >
                          Apply
                        </button>
                      </div>

                      {couponError && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          {couponError}
                        </p>
                      )}

                      {couponSuccess && (
                        <p className="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {couponSuccess}
                        </p>
                      )}

                      <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
                        <p className="font-semibold mb-1">Try these codes:</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(availableCoupons).map(([code]) => (
                            <button
                              key={code}
                              onClick={() => {
                                setCouponCode(code);
                                setCouponError('');
                              }}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-mono transition-colors"
                            >
                              {code}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Summary Items */}
                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      <AnimatedCounter value={subtotal} prefix="৳" duration={600} />
                    </span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                        Coupon Discount
                      </span>
                      <span className="font-semibold">
                        -<AnimatedCounter value={couponDiscount} prefix="৳" duration={600} />
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Delivery Charge</span>
                    <span className="font-bold">
                      {freeShipping ? (
                        <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                          </svg>
                          FREE
                        </span>
                      ) : (
                        <span className="text-gray-900 dark:text-white">
                          <AnimatedCounter value={deliveryCharge} prefix="৳" duration={600} />
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Website Service Charge</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      <AnimatedCounter value={serviceCharge} prefix="৳" duration={600} />
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="text-2xl font-bold text-[#bc1215]">
                      <AnimatedCounter value={total} prefix="৳" duration={600} />
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Payable Total</span>
                    <span className="text-2xl font-bold text-[#bc1215]">
                      <AnimatedCounter value={payableTotal} prefix="৳" duration={600} />
                    </span>
                  </div>
                </div>

                {/* Savings Message */}
                {totalSavings > 0 && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                    <p className="text-sm font-bold text-green-900 dark:text-green-100 text-center flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      You are saving <AnimatedCounter value={totalSavings} prefix="৳" duration={600} />
                    </p>
                  </div>
                )}

                {/* Terms and Conditions */}
                <label className="flex items-start gap-3 mb-6 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="w-5 h-5 text-[#bc1215] border-2 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-[#bc1215] focus:ring-offset-0 mt-0.5"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                    I agree to the{' '}
                    <Link href="/terms" className="text-[#bc1215] hover:underline font-semibold">
                      terms and conditions
                    </Link>
                  </span>
                </label>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={!agreeToTerms}
                  className="w-full py-4 bg-gradient-to-r from-[#bc1215] to-[#8a0f12] hover:from-[#8a0f12] hover:to-[#bc1215] text-white font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg transform hover:scale-[1.02] rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Place Order</span>
                </button>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">Fast Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
