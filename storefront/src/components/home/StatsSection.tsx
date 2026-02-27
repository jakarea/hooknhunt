'use client';

import React, { useState, useEffect } from 'react';

interface StatItem {
  id: number;
  number: string;
  label: string;
  icon: string;
  color: string;
}

export default function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);

  const stats: StatItem[] = [
    {
      id: 1,
      number: '10,000+',
      label: 'Happy Customers',
      icon: '👥',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 2,
      number: '500+',
      label: 'Products',
      icon: '🎣',
      color: 'from-green-500 to-green-600',
    },
    {
      id: 3,
      number: '50+',
      label: 'Cities Served',
      icon: '📍',
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 4,
      number: '24/7',
      label: 'Customer Support',
      icon: '🛟',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('stats-section');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="stats-section" className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0f0f0f] dark:to-[#1a1a1a] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#ec3137]/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#046bd2]/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-[#ec3137]/5 to-[#046bd2]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ec3137]/10 dark:bg-[#ec3137]/20 mb-4">
            <svg className="w-5 h-5 text-[#ec3137]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-bold text-[#ec3137] uppercase tracking-wider">Trusted by Thousands</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose Hook & Hunt?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us for their fishing adventures
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className={`group text-center transform transition-all duration-700 delay-${index * 100} ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="relative">
                {/* Icon Background */}
                <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${stat.color} rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <span className="text-3xl">{stat.icon}</span>
                </div>

                {/* Animated Number */}
                <div className="mb-3">
                  <span className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white block">
                    {stat.number}
                  </span>
                </div>

                {/* Label */}
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 group-hover:text-[#ec3137] transition-colors">
                  {stat.label}
                </h3>

                {/* Decorative Line */}
                <div className="w-12 h-1 bg-gradient-to-r from-[#ec3137] to-[#046bd2] mx-auto mt-4 group-hover:w-16 transition-all duration-300"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-6 px-8 py-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Free Shipping</span>
            </div>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quality Guaranteed</span>
            </div>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Lifetime Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
