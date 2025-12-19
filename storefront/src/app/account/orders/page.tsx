'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import UserNavigation from '@/components/user/UserNavigation';
import { products } from '@/data/products';

export default function OrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState('');

  const orders = [
    {
      id: '17192573547198',
      date: '2024-01-15',
      status: 'COMPLETED',
      totalItems: 5,
      totalAmount: products.slice(0, 5).reduce((sum, item) => sum + item.price, 0),
      items: products.slice(0, 5).map(product => ({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        originalPrice: product.originalPrice,
        discount: product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0,
        quantity: 1
      }))
    },
    {
      id: '17192573547199',
      date: '2024-01-10',
      status: 'SHIPPED',
      totalItems: 3,
      totalAmount: products.slice(5, 8).reduce((sum, item) => sum + item.price, 0),
      items: products.slice(5, 8).map(product => ({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        originalPrice: product.originalPrice,
        discount: product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0,
        quantity: 1
      }))
    },
    {
      id: '17192573547200',
      date: '2024-01-05',
      status: 'PENDING',
      totalItems: 2,
      totalAmount: products.slice(8, 10).reduce((sum, item) => sum + item.price, 0),
      items: products.slice(8, 10).map(product => ({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        originalPrice: product.originalPrice,
        discount: product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0,
        quantity: 1
      }))
    }
  ];

  const filteredOrders = selectedStatus 
    ? orders.filter(order => order.status.toLowerCase() === selectedStatus.toLowerCase())
    : orders;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="bg-white dark:bg-[#0a0a0a] min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-50 dark:bg-[#0f0f0f] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 py-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Link href="/account" className="hover:text-[#bc1215] transition-colors">My Account</Link>
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 dark:text-white font-medium">My Orders</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <UserNavigation />
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Header */}
            <div className="border-b-4 border-[#bc1215] pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                    My Orders
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    (Your Total Order: {orders.length})
                  </p>
                </div>
                
                {/* Status Filter */}
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status:
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#bc1215] focus:border-[#bc1215] dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Any</option>
                    <option value="completed">Completed</option>
                    <option value="shipped">Shipped</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button className="bg-[#bc1215] hover:bg-[#8a0f12] text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    Submit
                  </button>
                </div>
              </div>
              
              {/* Bestseller eBook Button */}
              <div className="mt-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  Read Bestseller eBook
                </button>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Your Order ID: <span className="text-[#bc1215]">{order.id}</span> ({order.totalItems} items)
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Order Date: {order.date} | Total: ৳{order.totalAmount.toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
                        Track My Order
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow">
                        {/* Product Image */}
                        <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg mb-3 overflow-hidden relative">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>

                        {/* Product Info */}
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 line-clamp-2">
                            {item.name}
                          </h3>
                          <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-[#bc1215]">
                              ৳{item.price.toLocaleString()}
                            </span>
                            {item.originalPrice && item.originalPrice !== item.price && (
                              <span className="text-sm text-gray-500 line-through">
                                ৳{item.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-red-600 font-medium">
                              ({item.discount}% Off)
                            </span>
                            <span className="text-xs text-gray-500">
                              Qty: {item.quantity}
                            </span>
                          </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Actions */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-3">
                    <button className="bg-[#bc1215] hover:bg-[#8a0f12] text-white font-medium py-2 px-4 rounded-lg transition-colors">
                      Reorder
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors">
                      View Details
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors">
                      Download Invoice
                    </button>
                    {order.status === 'COMPLETED' && (
                      <button className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors">
                        Leave Review
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No orders found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {selectedStatus 
                    ? `No orders with status "${selectedStatus}" found.`
                    : 'You haven\'t placed any orders yet.'
                  }
                </p>
                <Link
                  href="/products"
                  className="bg-[#bc1215] hover:bg-[#8a0f12] text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
