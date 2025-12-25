'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';

interface OrderItem {
  id: number;
  product_name: string;
  product_image: string;
  product_sku: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  product_attributes?: any;
}

interface Order {
  id: number;
  order_number: string;
  status: string;
  total_amount: number;
  subtotal: number;
  delivery_charge: number;
  service_charge: number;
  coupon_discount: number;
  payable_amount: number;
  payment_method: string;
  payment_details?: string;
  notes?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  shipping_address: string;
  shipping_city: string;
  shipping_district: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && orderId) {
      fetchOrderDetails();
    }
  }, [isAuthenticated, orderId]);

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      const response = await api.getOrder(parseInt(orderId));
      const orderData = response.data || response;
      setOrder(orderData as Order);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
      toast.error('Failed to load order details');
      router.push('/account/orders');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return `৳${amount.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
      </div>
    );
  }

  if (!isAuthenticated || !order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fcf8f6]">
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

      {/* Header Actions - Hidden during print */}
      {!isPrinting && (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link
              href="/account/orders"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Orders
            </Link>
            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Invoice Header */}
          <div className="bg-gradient-to-r from-red-700 to-red-800 px-8 py-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img src="/hook-and-hunt-logo.svg" alt="Hook & Hunt" className="h-16 mr-4" />
                <div>
                  <h1 className="text-3xl font-bold">INVOICE</h1>
                  <p className="text-red-100">Order #{order.order_number}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`inline-block px-4 py-2 rounded-full border-2 text-sm font-bold ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Order Info & Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Order Details */}
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Order Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex">
                    <span className="w-24 text-gray-500">Order ID:</span>
                    <span className="font-medium text-gray-900">#{order.order_number}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 text-gray-500">Order Date:</span>
                    <span className="font-medium text-gray-900">{formatDate(order.created_at)}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 text-gray-500">Payment:</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}
                    </span>
                  </div>
                  {order.payment_details && (
                    <div className="flex">
                      <span className="w-24 text-gray-500">Details:</span>
                      <span className="font-medium text-gray-900">{order.payment_details}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Details */}
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Customer Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex">
                    <span className="w-24 text-gray-500">Name:</span>
                    <span className="font-medium text-gray-900">{order.customer_name}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 text-gray-500">Phone:</span>
                    <span className="font-medium text-gray-900">{order.customer_phone}</span>
                  </div>
                  {order.customer_email && (
                    <div className="flex">
                      <span className="w-24 text-gray-500">Email:</span>
                      <span className="font-medium text-gray-900">{order.customer_email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Shipping Address</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900 font-medium">{order.customer_name}</p>
                <p className="text-gray-600 text-sm">{order.shipping_address}</p>
                <p className="text-gray-600 text-sm">{order.shipping_city}, {order.shipping_district}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Order Items</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">SKU</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {order.items?.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-16 w-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden mr-4">
                              <Image
                                src={item.product_image || '/placeholder-image.jpg'}
                                alt={item.product_name}
                                width={64}
                                height={64}
                                className="object-cover"
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900">{item.product_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 hidden sm:table-cell">{item.product_sku || '-'}</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-900">{item.quantity}</td>
                        <td className="px-6 py-4 text-right text-sm text-gray-900">{formatCurrency(item.unit_price)}</td>
                        <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">{formatCurrency(item.total_price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Summary */}
            <div className="flex justify-end mb-8">
              <div className="w-full md:w-80">
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Charge:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(order.delivery_charge)}</span>
                  </div>
                  {order.service_charge > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Service Charge:</span>
                      <span className="font-medium text-gray-900">{formatCurrency(order.service_charge)}</span>
                    </div>
                  )}
                  {order.coupon_discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Coupon Discount:</span>
                      <span className="font-medium text-green-600">-{formatCurrency(order.coupon_discount)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between text-base">
                      <span className="font-bold text-gray-900">Total Amount:</span>
                      <span className="font-bold text-red-700 text-lg">{formatCurrency(order.payable_amount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Notes</h3>
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-4">{order.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
              <p>Thank you for your order!</p>
              <p className="mt-1">For any queries, contact us at support@hooknhunt.com</p>
            </div>
          </div>
        </div>

        {/* Back Button - Hidden during print */}
        {!isPrinting && (
          <div className="mt-6 text-center">
            <Link
              href="/account/orders"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to My Orders
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
