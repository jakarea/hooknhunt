'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta: string;
  ctaLink: string;
  badge?: string;
  features?: string[];
}

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { t } = useTranslation();

  const slides: Slide[] = [
    {
      id: 1,
      title: t('hero.slide1.title'),
      subtitle: t('hero.slide1.subtitle'),
      description: t('hero.slide1.description'),
      image: 'https://images.unsplash.com/photo-1545450660-8c1e68e62a73?w=1400&h=600&fit=crop',
      cta: t('hero.slide1.cta'),
      ctaLink: '/products?category=rods',
      badge: 'New Collection',
      features: ['Premium Quality', 'Professional Grade', 'Lifetime Warranty'],
    },
    {
      id: 2,
      title: t('hero.slide2.title'),
      subtitle: t('hero.slide2.subtitle'),
      description: t('hero.slide2.description'),
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1400&h=600&fit=crop',
      cta: t('hero.slide2.cta'),
      ctaLink: '/products?category=reels',
      badge: 'Best Seller',
      features: ['Smooth Operation', 'Corrosion Resistant', 'High Performance'],
    },
    {
      id: 3,
      title: t('hero.slide3.title'),
      subtitle: t('hero.slide3.subtitle'),
      description: t('hero.slide3.description'),
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1400&h=600&fit=crop',
      cta: t('hero.slide3.cta'),
      ctaLink: '/products?category=lures',
      badge: 'Flash Sale',
      features: ['Up to 50% Off', 'Limited Time', 'Free Shipping'],
    },
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsTransitioning(false);
      }, 300);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index: number) => {
    if (index === currentSlide || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 300);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setIsTransitioning(false);
    }, 300);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setIsTransitioning(false);
    }, 300);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="w-full bg-gray-900 dark:bg-black relative overflow-hidden">
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-[#bc1215]/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#046bd2]/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-400/10 rounded-full blur-lg animate-bounce"></div>
      </div>

      <div className="relative w-full h-[350px] md:h-[400px] lg:h-[450px] overflow-hidden">
        {/* Slides */}
        <div className="relative h-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentSlide
                  ? 'opacity-100 translate-x-0 scale-100'
                  : index < currentSlide
                  ? 'opacity-0 -translate-x-full scale-95'
                  : 'opacity-0 translate-x-full scale-95'
              }`}
            >
              {/* Background Image with Enhanced Overlay */}
              <div className="absolute inset-0">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover transition-transform duration-1000 hover:scale-105"
                  sizes="100vw"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent dark:from-black/95 dark:via-black/80"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              </div>

              {/* Content */}
              <div className="relative h-full flex items-center">
                <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 w-full">
                  <div className="max-w-2xl">
                    {/* Badge */}
                    {slide.badge && (
                      <div className="inline-block mb-4 animate-fadeInUp">
                        <span className="px-4 py-2 bg-gradient-to-r from-[#bc1215] to-[#8a0f12] text-white text-sm font-bold rounded-full shadow-lg">
                          {slide.badge}
                        </span>
                      </div>
                    )}

                    {/* Subtitle */}
                    <div className="inline-block mb-4 animate-fadeInUp delay-200">
                      <span className="px-6 py-2 bg-white/10 backdrop-blur-sm text-white text-lg font-semibold rounded-full border border-white/20">
                        {slide.subtitle}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fadeInUp delay-300">
                      {slide.title}
                    </h2>

                    {/* Description */}
                    <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl leading-relaxed animate-fadeInUp delay-400">
                      {slide.description}
                    </p>

                    {/* Features */}
                    {slide.features && (
                      <div className="flex flex-wrap gap-3 mb-8 animate-fadeInUp delay-500">
                        {slide.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white text-sm rounded-full border border-white/20"
                          >
                            <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 animate-fadeInUp delay-600">
                      <Link
                        href={slide.ctaLink}
                        className="group px-8 py-4 bg-gradient-to-r from-[#bc1215] to-[#8a0f12] hover:from-[#8a0f12] hover:to-[#bc1215] text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl flex items-center gap-2 cursor-pointer"
                      >
                        {slide.cta}
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                      <Link
                        href="/products"
                        className="px-8 py-4 glass-button text-white font-semibold rounded-lg flex items-center gap-2 cursor-pointer"
                      >
                        {t('hero.viewAll')}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 glass-button text-white flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 group disabled:opacity-50 disabled:cursor-not-allowed rounded-full"
          aria-label="Previous slide"
        >
          <svg
            className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 glass-button text-white flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 group disabled:opacity-50 disabled:cursor-not-allowed rounded-full"
          aria-label="Next slide"
        >
          <svg
            className="w-6 h-6 transform group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Enhanced Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`transition-all duration-500 rounded-full flex items-center gap-2 cursor-pointer ${
                index === currentSlide
                  ? 'w-12 h-3 bg-[#bc1215] shadow-lg'
                  : 'w-3 h-3 glass-button hover:scale-125'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            >
              {index === currentSlide && (
                <span className="text-xs text-white font-bold ml-2">
                  {index + 1}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
          <div 
            className="h-full bg-gradient-to-r from-[#bc1215] to-[#046bd2] transition-all duration-100 ease-linear"
            style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </section>
  );
}
