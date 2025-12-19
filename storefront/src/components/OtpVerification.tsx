'use client';

import React, { useState, useRef, useEffect } from 'react';

interface OtpVerificationProps {
  phone: string;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  isLoading?: boolean;
}

export default function OtpVerification({ phone, onVerify, onResend, isLoading = false }: OtpVerificationProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last digit
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits are filled
    if (newOtp.every(digit => digit) && index === 5) {
      handleSubmit(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtp(newOtp);

    // Focus last filled input or next empty
    const lastFilledIndex = newOtp.findIndex(digit => !digit) - 1;
    const focusIndex = lastFilledIndex >= 0 ? lastFilledIndex : 5;
    inputRefs.current[focusIndex]?.focus();

    // Auto-submit if complete
    if (newOtp.every(digit => digit)) {
      handleSubmit(newOtp.join(''));
    }
  };

  const handleSubmit = async (otpCode: string) => {
    setError('');
    try {
      await onVerify(otpCode);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setError('');
    setCountdown(60);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);

    try {
      await onResend();
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to resend OTP');
      setCanResend(true);
      setCountdown(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#bc1215] to-[#8a0f12] rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Verify Your Phone
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          We&apos;ve sent a 6-digit code to <span className="font-semibold">{phone}</span>
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      {/* OTP Input */}
      <div className="flex justify-center gap-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            disabled={isLoading}
            className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:border-[#bc1215] focus:ring-2 focus:ring-[#bc1215]/20 bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          />
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center">
          <svg className="animate-spin h-6 w-6 text-[#bc1215]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}

      {/* Resend OTP */}
      <div className="text-center">
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            className="text-sm font-medium text-[#bc1215] hover:text-[#9a0f12] transition-colors"
          >
            Resend OTP
          </button>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Resend OTP in <span className="font-semibold text-[#bc1215]">{countdown}s</span>
          </p>
        )}
      </div>

      {/* Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800 dark:text-blue-300">
            <p className="font-medium mb-1">Tips:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Check your SMS messages for the OTP code</li>
              <li>The code will expire in 10 minutes</li>
              <li>If you don&apos;t receive the code, click &quot;Resend OTP&quot;</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
