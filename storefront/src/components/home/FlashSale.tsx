'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '../../../node_modules/react-i18next';

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

export default function FlashSale() {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Calculate next 8-hour cycle end time
  const getNextCycleEndTime = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const cycleHours = [0, 8, 16]; // 12am, 8am, 4pm

    const nextCycleHour = cycleHours.find(h => h > currentHour) || cycleHours[0];
    const nextCycle = new Date(now);

    if (nextCycleHour <= currentHour) {
      nextCycle.setDate(nextCycle.getDate() + 1);
    }

    nextCycle.setHours(nextCycleHour, 0, 0, 0);
    return nextCycle;
  };

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = getNextCycleEndTime().getTime();
      const difference = endTime - now;

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-play slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 6);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % 6);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + 6) % 6);
  };

  const flashProducts = [
    {
      id: 1,
      name: 'Carbon Fiber Rod',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=300&fit=crop',
      originalPrice: 8500,
      discountPrice: 5950,
      discount: 30,
    },
    {
      id: 2,
      name: 'Pro Fishing Reel',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=300&fit=crop',
      originalPrice: 4500,
      discountPrice: 3150,
      discount: 30,
    },
    {
      id: 3,
      name: 'Lure Set 12pcs',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=300&fit=crop',
      originalPrice: 2500,
      discountPrice: 1750,
      discount: 30,
    },
    {
      id: 4,
      name: 'Fishing Line 500m',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=300&fit=crop',
      originalPrice: 3200,
      discountPrice: 2240,
      discount: 30,
    },
    {
      id: 5,
      name: 'Tackle Box Pro',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=300&fit=crop',
      originalPrice: 3800,
      discountPrice: 2660,
      discount: 30,
    },
    {
      id: 6,
      name: 'Fish Finder GPS',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=300&fit=crop',
      originalPrice: 12000,
      discountPrice: 8400,
      discount: 30,
    },
  ];

  return (
    <section className="w-full bg-gradient-to-br from-[#bc1215] to-[#8a0f12] py-8 lg:py-12">
      <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12">
        {/* Header with Countdown */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                  {t('flashSale.title')}
                  <span className="inline-flex items-center px-3 py-1 bg-yellow-400 text-[#bc1215] text-sm font-bold animate-pulse">
                    {t('flashSale.save')} 30%
                  </span>
                </h2>
                <p className="text-white/90 text-sm mt-1">{t('flashSale.subtitle')}</p>
              </div>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center gap-2">
            <span className="text-white/90 text-sm font-medium hidden sm:block">{t('flashSale.endsIn')}:</span>
            <div className="flex gap-2">
              <div className="flex flex-col items-center bg-white/20 backdrop-blur-sm px-3 py-2 min-w-[60px]">
                <span className="text-2xl font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-xs text-white/80 uppercase">{t('flashSale.hours')}</span>
              </div>
              <div className="flex flex-col items-center bg-white/20 backdrop-blur-sm px-3 py-2 min-w-[60px]">
                <span className="text-2xl font-bold text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-xs text-white/80 uppercase">{t('flashSale.minutes')}</span>
              </div>
              <div className="flex flex-col items-center bg-white/20 backdrop-blur-sm px-3 py-2 min-w-[60px]">
                <span className="text-2xl font-bold text-white">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="text-xs text-white/80 uppercase">{t('flashSale.seconds')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Products Slider */}
        <div className="relative">
          {/* Previous Arrow */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white text-[#bc1215] flex items-center justify-center transition-all duration-300 hover:scale-110"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Slider Container */}
          <div className="overflow-hidden mx-12">
            <div
              ref={sliderRef}
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * (100 / 6)}%)` }}
            >
              {flashProducts.map((product) => (
                <div key={product.id} className="w-1/6 flex-shrink-0 px-2">
                  <div className="group bg-white dark:bg-gray-900 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <Link href={`/products/${product.id}`}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </Link>
                      <div className="absolute top-1 left-1 bg-[#bc1215] text-white px-1.5 py-0.5 text-[10px] font-bold">
                        -{product.discount}%
                      </div>

                      {/* Add to Cart Button - Shows on Hover */}
                      <button className="absolute inset-x-0 bottom-0 bg-[#bc1215] text-white py-2 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {t('flashSale.addToCart')}
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-2">
                      <Link href={`/products/${product.id}`}>
                        <h3 className="text-xs font-medium text-gray-900 dark:text-white mb-1 line-clamp-1 hover:text-[#bc1215] transition-colors">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Price */}
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold text-[#bc1215]">
                          ৳{product.discountPrice.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 line-through">
                          ৳{product.originalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Arrow */}
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white text-[#bc1215] flex items-center justify-center transition-all duration-300 hover:scale-110"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* View All Link */}
        <div className="text-center mt-8">
          <Link
            href="/flash-sale"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-[#bc1215] px-8 py-3 font-semibold transition-colors duration-300"
          >
            {t('flashSale.viewAll')}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
