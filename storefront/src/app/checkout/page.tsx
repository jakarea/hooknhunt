'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import AnimatedCounter from '@/components/common/AnimatedCounter';
import { Address } from '@/types';
import { OrderResponse } from '@/types/api';
import { bangladeshDivisions } from '@/data/bangladesh-divisions';

type PaymentMethod = 'cod' | 'sslcommerz';

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
  const { cartItems, getCartTotal, clearCart, removeFromCart, updateQuantity } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [useDifferentAddress, setUseDifferentAddress] = useState(false);

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
    thana: '',
    division: '',
  });

  // Get all districts with their division info
  const getAllDistricts = () => {
    const districts: { name: string; division: string }[] = [];
    bangladeshDivisions.forEach(division => {
      division.districts.forEach(district => {
        districts.push({
          name: district.name,
          division: division.name
        });
      });
    });
    return districts.sort((a, b) => a.name.localeCompare(b.name));
  };

  // Get thanas for a selected district
  const getThanasForDistrict = (districtName: string) => {
    for (const division of bangladeshDivisions) {
      const district = division.districts.find(d => d.name === districtName);
      if (district) {
        return district.thanas;
      }
    }
    return [];
  };

  // Get division for a selected district
  const getDivisionForDistrict = (districtName: string) => {
    const district = getAllDistricts().find(d => d.name === districtName);
    return district?.division || '';
  };

  // OTP verification state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [pendingOrder, setPendingOrder] = useState<{
    id: number;
    order_number: string;
    phone_number: string;
    total_amount: number;
    customer_name: string;
  } | null>(null);
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, [cartItems, router]);

  // Pre-fill user data and fetch addresses when user is logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      // Pre-fill form with user data
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        phone: user.phone_number || prev.phone,
        email: user.email || prev.email,
        // Use user's default address fields if available
        address: user.address || prev.address,
        city: user.city || prev.city,
        district: user.district || prev.district,
      }));

      // Fetch user addresses
      fetchUserAddresses();
    }
  }, [isAuthenticated, user]);

  // Fetch user addresses from API
  const fetchUserAddresses = async () => {
    try {
      const api = (await import('@/lib/api')).default;
      const response = await api.getAddresses();
      if (response.data && Array.isArray(response.data)) {
        setAddresses(response.data);
        // Set default address if available
        const defaultAddress = response.data.find((addr: Address) => addr.is_default);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress.id);
          setUseDifferentAddress(false);
          // Pre-fill form with default address
          const district = defaultAddress.district || '';
          const division = getDivisionForDistrict(district);
          setFormData(prev => ({
            ...prev,
            address: defaultAddress.address || prev.address,
            city: defaultAddress.city || prev.city,
            district: district,
            division: division,
          }));
        }
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    }
  };

  // Handle address selection
  const handleAddressSelect = (addressId: number) => {
    setSelectedAddress(addressId);
    const selected = addresses.find(addr => addr.id === addressId);
    if (selected) {
      const district = selected.district || '';
      const division = getDivisionForDistrict(district);
      setFormData(prev => ({
        ...prev,
        address: selected.address || prev.address,
        city: selected.city || prev.city,
        district: district,
        division: division,
      }));
      setUseDifferentAddress(false);
    }
  };

  // Auto-fill division when district changes
  useEffect(() => {
    if (formData.district) {
      const division = getDivisionForDistrict(formData.district);
      if (division) {
        setFormData(prev => ({ ...prev, division }));
      }
    }
  }, [formData.district]);

  // Calculations
  const subtotal = getCartTotal();
  const deliveryCharge = 60;
  const freeDeliveryThreshold = 500;

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
  const totalCharges = freeShipping ? 0 : deliveryCharge;
  const total = subtotalAfterCoupon + totalCharges;
  const payableTotal = total;

  // Calculate how much more to spend for free delivery
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  // Calculate original total (without discount)
  const originalSubtotal = cartItems.reduce((sum, item) => {
    const price = item.price || 0;
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

  const handleCheckout = async () => {
    if (!agreeToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    // Validate form
    if (!formData.name || !formData.phone || !formData.address || !formData.district || !formData.thana) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const api = (await import('@/lib/api')).default;

      // Prepare order items
      const orderItems = cartItems.map(item => ({
        product_id: item.product.id,
        variant_id: item.variant?.id || null,
        product_name: item.product.name,
        product_sku: item.product.sku || item.variant?.sku || null,
        product_image: item.product.image || '/placeholder-product.png',
        unit_price: item.price || 0,
        quantity: item.quantity,
        total_price: (item.price || 0) * item.quantity,
        product_attributes: null,
      }));

      // Prepare payment details
      const paymentDetails = paymentMethod === 'sslcommerz'
        ? 'Payment via SSLCommerz'
        : 'Cash on delivery';

      // Order data
      const orderData = {
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_email: formData.email || null,
        shipping_address: formData.address,
        shipping_city: formData.city,
        shipping_district: formData.district,
        shipping_thana: formData.thana,
        shipping_division: formData.division,
        payment_method: paymentMethod,
        payment_details: paymentDetails,
        notes: formData.notes || null,
        items: orderItems,
        subtotal: subtotal,
        delivery_charge: deliveryCharge,
        coupon_discount: couponDiscount,
        total_amount: subtotal,
        payable_amount: payableTotal,
      };

      // Place the order via API
      const response = await api.post('/store/orders', orderData);

      if (response && 'order' in response) {
        const order = response.order as OrderResponse['order'];
        console.log('Order placed successfully:', order);

        // Check if OTP verification is required
        if (response.verification_required) {
          // Show OTP verification modal
          setPendingOrder({
            id: order.id,
            order_number: order.order_number,
            phone_number: response.order.phone_number || formData.phone,
            total_amount: order.total_amount,
            customer_name: order.customer_name,
          });
          setShowOtpModal(true);
        } else {
          // No verification required, proceed normally
          clearCart();
          router.push(`/order-success?orderId=${order.order_number}&total=${order.payable_amount}&name=${encodeURIComponent(order.customer_name)}`);
        }
      } else {
        throw new Error('Invalid response from server');
      }

    } catch (error: any) {
      console.error('Order placement failed:', error);

      // Handle validation errors
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        alert(`Validation Error: ${errorMessages.join(', ')}`);
      } else if (error.response?.status === 409) {
        // Conflict errors (duplicate phone/email)
        alert(error.response?.data?.message || 'This phone number or email is already registered.');
      } else if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('Order placement failed. Please try again or contact support.');
      }
    }
  };

  // Handle OTP verification
  const handleOtpVerification = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP code');
      return;
    }

    setOtpError('');
    setOtpLoading(true);

    try {
      const api = (await import('@/lib/api')).default;

      const response = await api.post('/store/orders/verify', {
        phone_number: pendingOrder?.phone_number,
        otp_code: otpCode,
        order_id: pendingOrder?.id,
      });

      // OTP verified successfully
      setShowOtpModal(false);
      clearCart();

      // Redirect to success page
      router.push(`/order-success?orderId=${pendingOrder?.order_number}&total=${pendingOrder?.total_amount}&name=${encodeURIComponent(pendingOrder?.customer_name || '')}`);

    } catch (error: any) {
      console.error('OTP verification failed:', error);

      if (error.response?.data?.message) {
        setOtpError(error.response.data.message);
      } else {
        setOtpError('OTP verification failed. Please try again.');
      }
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    setOtpError('');
    setResendLoading(true);

    try {
      const api = (await import('@/lib/api')).default;

      await api.post('/store/auth/send-otp', {
        phone_number: pendingOrder?.phone_number,
      });

      alert('OTP has been resent to your phone number.');

    } catch (error: any) {
      console.error('Resend OTP failed:', error);

      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Failed to resend OTP. Please try again.');
      }
    } finally {
      setResendLoading(false);
    }
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
            <Link href="/" className="hover:text-[#ec3137] transition-colors">
              Home
            </Link>
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/cart" className="hover:text-[#ec3137] transition-colors">
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Customer Information
                </h2>
                
              </div>

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
                    readOnly={isAuthenticated}
                    className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-colors ${
                      isAuthenticated
                        ? 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137]'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {isAuthenticated && (
                    <p className="mt-1 text-xs text-gray-500">Prefilled from your account</p>
                  )}
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
                    readOnly={isAuthenticated}
                    className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-colors ${
                      isAuthenticated
                        ? 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137]'
                    }`}
                    placeholder="01XXXXXXXXX"
                  />
                  {isAuthenticated && (
                    <p className="mt-1 text-xs text-gray-500">Prefilled from your account</p>
                  )}
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
                    readOnly={isAuthenticated && !!user?.email}
                    className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-colors ${
                      (isAuthenticated && !!user?.email)
                        ? 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137]'
                    }`}
                    placeholder="your@email.com"
                  />
                  {isAuthenticated && user?.email && (
                    <p className="mt-1 text-xs text-gray-500">Prefilled from your account</p>
                  )}
                </div>

              {/* Address Selection for Logged-in Users */}
              {isAuthenticated && addresses.length > 0 && (
                <div className="md:col-span-2 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Delivery Address
                  </h3>

                  {/* Saved Addresses */}
                  <div className="space-y-3 mb-4">
                    {addresses.map((address) => (
                      <label
                        key={address.id}
                        className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedAddress === address.id
                            ? 'border-[#ec3137] bg-red-50 dark:bg-red-900/10'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddress === address.id}
                          onChange={() => handleAddressSelect(address.id)}
                          className="w-5 h-5 text-[#ec3137] border-2 border-gray-300 focus:ring-2 focus:ring-[#ec3137] mt-0.5"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {address.type || 'Home'} Address
                            </p>
                            {address.is_default && (
                              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full font-medium">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                            {address.address}, {address.city}, {address.district}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Use Different Address Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={useDifferentAddress}
                      onChange={(e) => setUseDifferentAddress(e.target.checked)}
                      className="w-4 h-4 text-[#ec3137] border-2 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-[#ec3137]"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                      Use a different address for this order
                    </span>
                  </label>
                </div>
              )}

              {/* Address Fields - Show when guest or user wants different address */}
              {(!isAuthenticated || addresses.length === 0 || useDifferentAddress) && (
                <>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Address <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137] outline-none transition-colors"
                      placeholder="House/Flat No., Road, Area"
                    />
                  </div>
                </>
              )}

              {/* District, Thana, and Division Fields - Show when guest or user wants different address */}
              {(!isAuthenticated || addresses.length === 0 || useDifferentAddress) && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      District <span className="text-red-600">*</span>
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={(e) => {
                        const district = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          district,
                          thana: '', // Reset thana when district changes
                        }));
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137] outline-none transition-colors"
                      required
                    >
                      <option value="">Select District</option>
                      {getAllDistricts().map((district) => (
                        <option key={district.name} value={district.name}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Thana/City <span className="text-red-600">*</span>
                    </label>
                    <select
                      name="thana"
                      value={formData.thana}
                      onChange={handleInputChange}
                      disabled={!formData.district}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137] outline-none transition-colors disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                      required
                    >
                      <option value="">{
                        formData.district ? 'Select Thana/City' : 'Select District First'
                      }</option>
                      {formData.district && getThanasForDistrict(formData.district).map((thana) => (
                        <option key={thana.name} value={thana.name}>
                          {thana.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Hidden Division Field */}
                  <input
                    type="hidden"
                    name="division"
                    value={formData.division}
                  />
                </>
              )}

              {/* Selected Address Display */}
              {isAuthenticated && addresses.length > 0 && selectedAddress && !useDifferentAddress && (
                <div className="md:col-span-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Selected Delivery Address:</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-300 whitespace-pre-line">
                    {formData.address}, {formData.thana || formData.city}, {formData.district}
                  </p>
                </div>
              )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-[#0a0a0a] border-2 border-gray-200 dark:border-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Payment Method
              </h2>

              <div className="space-y-3">
                {/* SSLCommerz Payment Gateway */}
                <label
                  className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'sslcommerz'
                      ? 'border-[#ec3137] bg-red-50 dark:bg-red-900/10'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="sslcommerz"
                    checked={paymentMethod === 'sslcommerz'}
                    onChange={() => setPaymentMethod('sslcommerz')}
                    className="w-5 h-5 text-[#ec3137] border-2 border-gray-300 focus:ring-2 focus:ring-[#ec3137]"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 dark:text-white">SSLCommerz</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Pay securely with Card, Mobile Banking, or Net Banking</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium">Visa</span>
                        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium">Mastercard</span>
                        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium">bKash</span>
                        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium">Nagad</span>
                      </div>
                    </div>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label
                  className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#ec3137] bg-red-50 dark:bg-red-900/10'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="w-5 h-5 text-[#ec3137] border-2 border-gray-300 focus:ring-2 focus:ring-[#ec3137]"
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
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#0a0a0a] border-2 border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden lg:sticky lg:top-24">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#ec3137] to-[#8a0f12] text-white p-6">
                <h2 className="text-2xl font-bold">Checkout Summary</h2>
                <p className="text-sm text-white/90 mt-1">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </p>
              </div>

              <div className="p-6">
                {/* Cart Items with Thumbnails */}
                <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-800 max-h-[300px] overflow-y-auto">
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={`${item.product.id}-${item.variant?.id || 'default'}`} className="flex gap-3">
                        {/* Product Image */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                          <img
                            src={item.product.image || '/placeholder-product.png'}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="text-sm font-semibold text-gray-900 dark:text-white hover:text-[#ec3137] dark:hover:text-[#ec3137] line-clamp-2 transition-colors"
                          >
                            {item.product.name}
                          </Link>

                          {item.variant && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {item.variant.name}
                            </p>
                          )}

                          <div className="flex items-center justify-between mt-2">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
                                disabled={item.quantity <= 1}
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              <span className="text-sm font-semibold text-gray-900 dark:text-white w-6 text-center">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <p className="text-sm font-bold text-gray-900 dark:text-white">
                                ৳{(item.price || 0) * item.quantity}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                ৳{item.price || 0} each
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="self-start text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Edit Cart Link */}
                  <Link
                    href="/cart"
                    className="mt-4 inline-flex items-center gap-1 text-sm text-[#ec3137] hover:underline font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Cart
                  </Link>
                </div>

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
                          onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                          placeholder="Enter code"
                          className="flex-1 px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137] outline-none transition-colors"
                        />
                        <button
                          onClick={applyCoupon}
                          className="px-6 py-2.5 bg-[#ec3137] hover:bg-[#8a0f12] text-white font-semibold rounded-lg transition-colors"
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

                {/* Free Delivery Promotion */}
                {!freeShipping && amountNeededForFreeDelivery > 0 && (
                  <div className="mb-6 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-sm font-semibold text-orange-900 dark:text-orange-200 mb-1">
                          Almost there!
                        </p>
                        <p className="text-sm text-orange-800 dark:text-orange-300">
                          Add <strong>৳{amountNeededForFreeDelivery.toLocaleString()}</strong> more to get FREE shipping!
                        </p>
                      </div>
                    </div>
                  </div>
                )}

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
                   <p className="text-sm text-right text-orange-800 dark:text-orange-300">
                              Add <strong>৳200</strong> more to get FREE shipping!
                            </p>
                </div>

                {/* Total */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="text-2xl font-bold text-[#ec3137]">
                      <AnimatedCounter value={total} prefix="৳" duration={600} />
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Payable Total</span>
                    <span className="text-2xl font-bold text-[#ec3137]">
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
                    className="w-5 h-5 text-[#ec3137] border-2 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-[#ec3137] focus:ring-offset-0 mt-0.5"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                    I agree to the{' '}
                    <Link href="/terms" className="text-[#ec3137] hover:underline font-semibold">
                      terms and conditions
                    </Link>
                  </span>
                </label>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={!agreeToTerms}
                  className="w-full py-4 bg-gradient-to-r from-[#ec3137] to-[#8a0f12] hover:from-[#8a0f12] hover:to-[#ec3137] text-white font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg transform hover:scale-[1.02] rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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

      {/* OTP Verification Modal */}
      {showOtpModal && pendingOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-300">
            {/* Close Button */}
            <button
              onClick={() => setShowOtpModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Confirm Your Order
            </h2>

            {/* Order Number */}
            <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
              Order #{pendingOrder.order_number}
            </p>

            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-900 dark:text-blue-100 text-center">
                We've sent a 6-digit verification code to <strong>{pendingOrder.phone_number}</strong>. Please enter the code below to confirm your order.
              </p>
            </div>

            {/* OTP Input */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 text-center">
                Enter 6-digit OTP Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otpCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setOtpCode(value);
                  setOtpError('');
                }}
                className="w-full px-4 py-4 text-2xl text-center tracking-widest border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137] outline-none transition-colors font-mono"
                placeholder="000000"
              />
            </div>

            {/* Error Message */}
            {otpError && (
              <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm text-red-800 dark:text-red-200 text-center flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {otpError}
                </p>
              </div>
            )}

            {/* Verify Button */}
            <button
              onClick={handleOtpVerification}
              disabled={otpLoading || otpCode.length !== 6}
              className="w-full py-4 bg-gradient-to-r from-[#ec3137] to-[#8a0f12] hover:from-[#8a0f12] hover:to-[#ec3137] text-white font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg transform hover:scale-[1.02] rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mb-3"
            >
              {otpLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Verify & Complete Order</span>
                </>
              )}
            </button>

            {/* Resend OTP Link */}
            <div className="text-center">
              <button
                onClick={handleResendOtp}
                disabled={resendLoading}
                className="text-sm text-[#ec3137] hover:text-[#8a0f12] dark:hover:text-red-400 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {resendLoading ? 'Sending...' : "Didn't receive code? Resend OTP"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
