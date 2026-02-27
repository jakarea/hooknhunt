import React from 'react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-12 sm:py-16">
      <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Contact Us
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-sm p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#ec3137]/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#ec3137]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">Phone</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">01841544590</p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500">Sat-Thu, 9am-6pm</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-sm p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#046bd2]/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#046bd2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">Email</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">support@hooknhunt.com</p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500">We reply within 24 hours</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-sm p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">Location</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Dhaka, Bangladesh</p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500">Visit our store</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-sm p-5 sm:p-8">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#ec3137] transition-colors bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#ec3137] transition-colors bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100 text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4 sm:mb-6">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="01712345678"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#ec3137] transition-colors bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100 text-sm"
                  />
                </div>

                <div className="mb-4 sm:mb-6">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#ec3137] transition-colors bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100 text-sm"
                    required
                  />
                </div>

                <div className="mb-4 sm:mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Tell us more about your inquiry..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#ec3137] transition-colors bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100 text-sm resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 bg-[#ec3137] text-white font-semibold rounded-lg hover:bg-[#9a0f12] transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-12 sm:mt-16 text-center">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">Follow Us</h3>
          <div className="flex items-center justify-center gap-4">
            <a href="#" className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1877F2] rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-opacity">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            <a href="#" className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FF0000] rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-opacity">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>

            <a href="#" className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-opacity">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
