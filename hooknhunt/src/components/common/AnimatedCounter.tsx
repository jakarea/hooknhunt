'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export default function AnimatedCounter({
  value,
  duration = 800,
  className = '',
  prefix = '',
  suffix = '',
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValueRef = useRef(value);
  const frameRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // If value hasn't changed, don't animate
    if (prevValueRef.current === value) {
      return;
    }

    setIsAnimating(true);
    const startValue = prevValueRef.current;
    const endValue = value;
    const difference = endValue - startValue;

    // Easing function (ease-out-cubic)
    const easeOutCubic = (t: number): number => {
      return 1 - Math.pow(1 - t, 3);
    };

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      const currentValue = startValue + difference * easedProgress;
      setDisplayValue(Math.round(currentValue));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
        setIsAnimating(false);
        startTimeRef.current = undefined;
        prevValueRef.current = endValue;
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [value, duration]);

  return (
    <span
      className={`inline-block ${className}`}
      style={{
        transform: isAnimating ? 'scale(1.1)' : 'scale(1)',
        color: isAnimating ? '#FFD700' : 'inherit',
        transition: 'all 0.2s ease-out',
        display: 'inline-block',
      }}
    >
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
}
