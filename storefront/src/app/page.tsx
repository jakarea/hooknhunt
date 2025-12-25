import Link from 'next/link';
import Image from 'next/image';
import HeroSlider from '@/components/home/HeroSlider';
import TrendingProduct from '@/components/home/TrendingProduct';
import Categories from '@/components/home/Categories';
import RecentlySold from '@/components/home/RecentlySold';
import FloatingActionButton from '@/components/common/FloatingActionButton';
import NewArrivals from '@/components/home/NewArrivals';
import BestDeals from '@/components/home/BestDeals';
import RecomendedYou from '@/components/home/RecomendedYou';


export default function Home() {

  return (
    <div className="bg-white">
      {/* Hero Slider - Full Screen */}
      <HeroSlider />

      {/* Dynamic Trending Products */}
      <TrendingProduct />

      {/* Categories - Minimalist Style */}
      <Categories />

      {/* Recently Sold - Social Proof & Trust */}
      <RecentlySold />

      {/* New Arrival - Fresh Content */}
      <NewArrivals />

      {/* Promotional Banners - Mid-Page Engagement */}
      <section className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 py-12 bg-white dark:bg-[#0a0a0a]" >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <Link href="/products?category=rods" className="group relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] rounded-xl">
            <div className="relative h-72 lg:h-80 bg-gradient-to-br from-[#046bd2] to-[#0353a5]">
              <Image
                src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop"
                alt="Fishing Rods Collection"
                fill
                className="object-cover opacity-30 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#046bd2]/80 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col items-start justify-center text-white p-8 lg:p-12">
                <div className="transform group-hover:translate-x-2 transition-transform duration-500">
                  <div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider mb-4">Limited Offer</div>
                  <h3 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight">Fishing Rods Collection</h3>
                  <p className="text-lg md:text-xl mb-6 font-medium text-white/90">Professional grade rods for every angler</p>
                  <span className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#046bd2] font-bold text-lg hover:bg-gray-100 shadow-lg group-hover:gap-4 transition-all duration-300">
                    Shop Now
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 transform rotate-45 translate-x-16 -translate-y-16 group-hover:translate-x-12 group-hover:-translate-y-12 transition-transform duration-500"></div>
            </div>
          </Link>

          <Link href="/products?category=reels" className="group relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] rounded-xl">
            <div className="relative h-72 lg:h-80 bg-gradient-to-br from-[#bc1215] to-[#8a0f12]">
              <Image
                src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=400&fit=crop"
                alt="Fishing Reels Collection"
                fill
                className="object-cover opacity-30 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#bc1215]/80 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col items-start justify-center text-white p-8 lg:p-12">
                <div className="transform group-hover:translate-x-2 transition-transform duration-500">
                  <div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider mb-4">Best Seller</div>
                  <h3 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight">Fishing Reels Collection</h3>
                  <p className="text-lg md:text-xl mb-6 font-medium text-white/90">High-performance reels for smooth fishing</p>
                  <span className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#bc1215] font-bold text-lg hover:bg-gray-100 shadow-lg group-hover:gap-4 transition-all duration-300">
                    Shop Now
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 transform rotate-45 translate-x-16 -translate-y-16 group-hover:translate-x-12 group-hover:-translate-y-12 transition-transform duration-500"></div>
            </div>
          </Link>
        </div>
      </section >

      {/* Best Deals - Value Proposition */}
      <BestDeals />

      {/* Recommended for You - Personalization */}
      <RecomendedYou />

      {/* Customer Reviews - Trust & Social Proof */}
      < section className="bg-gray-50 dark:bg-[#0f0f0f] py-20 transition-colors duration-200" >
        <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-[#046bd2]/10 dark:bg-[#046bd2]/20 mb-4">
              <svg className="w-5 h-5 text-[#046bd2]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              <span className="text-sm font-bold text-[#046bd2] uppercase tracking-wider">Customer Feedback</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Customer Reviews</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">See what our customers are saying</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="group bg-white dark:bg-gray-900 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden transform hover:-translate-y-2 rounded-xl">
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#bc1215]/5 transform rotate-45 translate-x-10 -translate-y-10"></div>
              <div className="flex items-center mb-5">
                <div className="w-14 h-14 bg-gradient-to-br from-[#bc1215] to-[#8a0f12] flex items-center justify-center text-white font-bold text-xl mr-4 shadow-lg rounded-full">
                  M
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">Mohammed Rahman</h4>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative">
                <svg className="w-8 h-8 text-[#bc1215]/20 mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base relative z-10">
                  Amazing quality! The fishing rod exceeded my expectations. Highly recommended for serious anglers.
                </p>
              </div>
            </div>

            <div className="group bg-white dark:bg-gray-900 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden transform hover:-translate-y-2 rounded-xl">
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#046bd2]/5 transform rotate-45 translate-x-10 -translate-y-10"></div>
              <div className="flex items-center mb-5">
                <div className="w-14 h-14 bg-gradient-to-br from-[#046bd2] to-[#0353a5] flex items-center justify-center text-white font-bold text-xl mr-4 shadow-lg rounded-full">
                  A
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">Ahmed Khan</h4>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative">
                <svg className="w-8 h-8 text-[#046bd2]/20 mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base relative z-10">
                  Fast shipping and excellent customer service. The product arrived in perfect condition.
                </p>
              </div>
            </div>

            <div className="group bg-white dark:bg-gray-900 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden transform hover:-translate-y-2 rounded-xl">
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#bc1215]/5 transform rotate-45 translate-x-10 -translate-y-10"></div>
              <div className="flex items-center mb-5">
                <div className="w-14 h-14 bg-gradient-to-br from-[#bc1215] to-[#8a0f12] flex items-center justify-center text-white font-bold text-xl mr-4 shadow-lg rounded-full">
                  F
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">Farhan Hossain</h4>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative">
                <svg className="w-8 h-8 text-[#bc1215]/20 mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base relative z-10">
                  Great value for money. The quality is outstanding and the price is very reasonable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* Features - Trust Indicators */}
      < section className="bg-gradient-to-br from-[#bc1215] to-[#8a0f12] text-white py-20 relative overflow-hidden" >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white transform rotate-45"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-white transform -rotate-45"></div>
        </div>

        <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="group text-center transform hover:scale-105 transition-all duration-500">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:bg-white/30 transition-all duration-300 group-hover:shadow-2xl rounded-xl">
                <svg
                  className="w-10 h-10 group-hover:scale-110 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-extrabold mb-3 group-hover:scale-105 transition-transform duration-300">Free Shipping</h3>
              <p className="text-white/90 text-lg font-medium">Free delivery on orders over $50</p>
              <div className="w-16 h-1 bg-white/40 mx-auto mt-4 group-hover:w-24 transition-all duration-300"></div>
            </div>

            <div className="group text-center transform hover:scale-105 transition-all duration-500">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:bg-white/30 transition-all duration-300 group-hover:shadow-2xl rounded-xl">
                <svg
                  className="w-10 h-10 group-hover:scale-110 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-extrabold mb-3 group-hover:scale-105 transition-transform duration-300">Secure Payment</h3>
              <p className="text-white/90 text-lg font-medium">Safe and secure payment processing</p>
              <div className="w-16 h-1 bg-white/40 mx-auto mt-4 group-hover:w-24 transition-all duration-300"></div>
            </div>

            <div className="group text-center transform hover:scale-105 transition-all duration-500">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:bg-white/30 transition-all duration-300 group-hover:shadow-2xl rounded-xl">
                <svg
                  className="w-10 h-10 group-hover:scale-110 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-extrabold mb-3 group-hover:scale-105 transition-transform duration-300">Easy Returns</h3>
              <p className="text-white/90 text-lg font-medium">30-day hassle-free returns</p>
              <div className="w-16 h-1 bg-white/40 mx-auto mt-4 group-hover:w-24 transition-all duration-300"></div>
            </div>
          </div>
        </div>
      </section >

      {/* Floating Action Button */}
      < FloatingActionButton />
    </div >
  );
}
