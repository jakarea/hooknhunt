'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import UserNavigation from '@/components/user/UserNavigation';

export default function AffiliateDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('30days');

  const affiliateStats = [
    { name: 'Total Earnings', value: '৳45,230', change: '+18%', changeType: 'positive', icon: '💰' },
    { name: 'Referrals', value: '1,247', change: '+12%', changeType: 'positive', icon: '👥' },
    { name: 'Conversion Rate', value: '8.5%', change: '+2.1%', changeType: 'positive', icon: '📈' },
    { name: 'Pending Payout', value: '৳8,450', change: '+5%', changeType: 'positive', icon: '⏳' },
  ];

  const recentReferrals = [
    { id: 'REF-001', name: 'John Smith', email: 'john@example.com', status: 'Completed', amount: '৳2,500', date: '2024-01-15', commission: '৳125' },
    { id: 'REF-002', name: 'Sarah Johnson', email: 'sarah@example.com', status: 'Pending', amount: '৳1,800', date: '2024-01-14', commission: '৳90' },
    { id: 'REF-003', name: 'Mike Wilson', email: 'mike@example.com', status: 'Completed', amount: '৳3,200', date: '2024-01-13', commission: '৳160' },
    { id: 'REF-004', name: 'Emma Davis', email: 'emma@example.com', status: 'Cancelled', amount: '৳1,500', date: '2024-01-12', commission: '৳0' },
  ];

  const topProducts = [
    { name: 'Wireless Headphones', referrals: 45, earnings: '৳2,250', commission: '৳112.50' },
    { name: 'Smart Watch', referrals: 38, earnings: '৳1,900', commission: '৳95.00' },
    { name: 'Gaming Laptop', referrals: 22, earnings: '৳3,300', commission: '৳165.00' },
    { name: 'Fishing Gear Set', referrals: 31, earnings: '৳1,550', commission: '৳77.50' },
  ];

  const affiliateLink = 'https://hookhunt.com/ref/affiliate123';
  const referralCode = 'AFFILIATE123';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf8f6]">
      {/* Breadcrumb */}
      <div className="bg-gray-50 dark:bg-[#0f0f0f] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 py-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Link href="/account" className="hover:text-[#ec3137] transition-colors">My Account</Link>
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 dark:text-white font-medium">Affiliate Dashboard</span>
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  Affiliate Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Track your referral performance and earnings
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137] dark:bg-gray-700 dark:text-white"
                >
                  <option value="7days">Last 7 days</option>
                  <option value="30days">Last 30 days</option>
                  <option value="90days">Last 90 days</option>
                  <option value="1year">Last year</option>
                </select>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {affiliateStats.map((stat) => (
                <div key={stat.name} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{stat.icon}</span>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      stat.changeType === 'positive' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {stat.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Affiliate Tools */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Referral Link */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Referral Link</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Referral Link
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={affiliateLink}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <button
                        onClick={() => copyToClipboard(affiliateLink)}
                        className="bg-[#ec3137] hover:bg-[#8a0f12] text-white font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Referral Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={referralCode}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <button
                        onClick={() => copyToClipboard(referralCode)}
                        className="bg-[#ec3137] hover:bg-[#8a0f12] text-white font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Commission Info */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Commission Structure</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300">Electronics</span>
                    <span className="font-semibold text-gray-900 dark:text-white">5%</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300">Fashion</span>
                    <span className="font-semibold text-gray-900 dark:text-white">3%</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300">Sports & Outdoors</span>
                    <span className="font-semibold text-gray-900 dark:text-white">4%</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300">Home & Living</span>
                    <span className="font-semibold text-gray-900 dark:text-white">3%</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700 dark:text-gray-300">All Other Products</span>
                    <span className="font-semibold text-gray-900 dark:text-white">2%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Referrals */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Referrals</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Referral ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Order Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Commission
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {recentReferrals.map((referral) => (
                      <tr key={referral.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {referral.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{referral.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{referral.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {referral.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#ec3137]">
                          {referral.commission}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(referral.status)}`}>
                            {referral.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {referral.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Performing Products */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Top Performing Products</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{product.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{product.referrals} referrals</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">{product.earnings}</p>
                      <p className="text-sm text-[#ec3137]">{product.commission} commission</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-[#ec3137] to-[#8a0f12] rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Marketing Materials</h3>
                <p className="text-white/90 mb-4">Download banners, links, and promotional content</p>
                <button className="bg-white text-[#ec3137] hover:bg-gray-100 font-medium py-2 px-4 rounded-lg transition-colors">
                  Download Assets
                </button>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Payment History</h3>
                <p className="text-white/90 mb-4">View your payment history and upcoming payouts</p>
                <button className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-2 px-4 rounded-lg transition-colors">
                  View Payments
                </button>
              </div>

              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Support</h3>
                <p className="text-white/90 mb-4">Get help with your affiliate account and marketing</p>
                <button className="bg-white text-green-600 hover:bg-gray-100 font-medium py-2 px-4 rounded-lg transition-colors">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
