'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import OtpVerification from '@/components/OtpVerification';
import toast, { Toaster } from 'react-hot-toast';

export default function ForgotPasswordPage() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState<'phone' | 'otp' | 'reset'>('phone');
    const [error, setError] = useState('');
    const router = useRouter();
    const { sendResetOtp, resetPassword } = useAuth();

    const handleSubmitPhone = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Validate phone number (Bangladesh format)
        const phoneRegex = /^01[3-9]\d{8}$/;
        if (!phoneRegex.test(phone)) {
            setError('Please enter a valid Bangladesh phone number (01xxxxxxxxx)');
            setIsLoading(false);
            return;
        }

        try {
            const response = await sendResetOtp(phone);
            toast.success(response.message || 'OTP sent successfully', {
                id: 'reset-otp-sent',
            });
            setStep('otp');
        } catch (err: unknown) {
            const error = err as Error;
            setError(error.message || 'Failed to send OTP. Please try again.');
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (otp: string) => {
        setStep('reset');
    };

    const handleResendOtp = async () => {
        try {
            const response = await sendResetOtp(phone);
            toast.success(response.message || 'OTP sent successfully');
        } catch (err: unknown) {
            const error = err as Error;
            toast.error(error.message || 'Failed to resend OTP');
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Validate password
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            setIsLoading(false);
            return;
        }

        // Validate password match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            // Note: We need to store the OTP from the previous step
            // For now, we'll pass it from the OtpVerification component
            // We'll handle this in the OtpVerification component callback
            setError('Please complete OTP verification first');
        } catch (err: unknown) {
            const error = err as Error;
            setError(error.message || 'Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Phone input step
    if (step === 'phone') {
        return (
            <div className="min-h-screen bg-[#fcf8f6] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#363636',
                            color: '#fff',
                        },
                        success: {
                            duration: 3000,
                            iconTheme: {
                                primary: '#10b981',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            duration: 4000,
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
                <div className="max-w-md w-full space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <div className="mx-auto h-16 w-16 flex items-center justify-center mb-4">
                            <img src="/hook-and-hunt-logo.svg" alt="Hook & Hunt" className="h-12 w-auto" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">
                            Reset Password
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Enter your phone number to receive a verification code
                        </p>
                    </div>

                    {/* Phone Input Form */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        <form onSubmit={handleSubmitPhone} className="space-y-6">
                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start space-x-2">
                                    <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    <div>
                                        <p className="font-medium">Error</p>
                                        <p className="text-red-600 mt-1">{error}</p>
                                    </div>
                                </div>
                            )}

                            {/* Phone Number Field */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        required
                                        value={phone}
                                        onChange={(e) => {
                                            setPhone(e.target.value);
                                            setError('');
                                        }}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent bg-white text-gray-900 transition-colors"
                                        placeholder="01xxxxxxxxx"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">Format: 01xxxxxxxxx (Bangladesh number)</p>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                            >
                                {isLoading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    'Send OTP'
                                )}
                            </button>
                        </form>

                        {/* Back to Login */}
                        <div className="mt-6 text-center">
                            <Link href="/login" className="text-sm text-gray-600 hover:text-red-700 transition-colors">
                                ← Back to Login
                            </Link>
                        </div>
                    </div>

                    {/* Back to Home */}
                    <div className="text-center">
                        <Link href="/" className="text-sm text-gray-600 hover:text-red-700 transition-colors">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // OTP verification step
    if (step === 'otp') {
        return (
            <div className="min-h-screen bg-[#fcf8f6] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#363636',
                            color: '#fff',
                        },
                    }}
                />
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        <OtpVerification
                            phone={phone}
                            onVerify={(otp) => {
                                // Store OTP for the reset step
                                (window as any).resetOtp = otp;
                                handleVerifyOtp(otp);
                            }}
                            onResend={handleResendOtp}
                            isLoading={isLoading}
                        />

                        {/* Back to Phone Input */}
                        <div className="mt-6 text-center">
                            <button
                                onClick={() => setStep('phone')}
                                className="text-sm text-gray-600 hover:text-red-700 transition-colors"
                            >
                                ← Change Phone Number
                            </button>
                        </div>
                    </div>

                    {/* Back to Home */}
                    <div className="mt-6 text-center">
                        <Link href="/" className="text-sm text-gray-600 hover:text-red-700 transition-colors">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // New password step
    return (
        <div className="min-h-screen bg-[#fcf8f6] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                }}
            />
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 flex items-center justify-center mb-4">
                        <img src="/hook-and-hunt-logo.svg" alt="Hook & Hunt" className="h-12 w-auto" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">
                        Set New Password
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter your new password below
                    </p>
                </div>

                {/* New Password Form */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        setError('');
                        setIsLoading(true);

                        // Validate password
                        if (password.length < 6) {
                            setError('Password must be at least 6 characters long');
                            setIsLoading(false);
                            return;
                        }

                        // Validate password match
                        if (password !== confirmPassword) {
                            setError('Passwords do not match');
                            setIsLoading(false);
                            return;
                        }

                        // Get OTP from window object
                        const otp = (window as any).resetOtp;
                        if (!otp) {
                            setError('OTP verification expired. Please start over.');
                            setStep('phone');
                            setIsLoading(false);
                            return;
                        }

                        resetPassword(phone, otp, password, confirmPassword)
                            .then(() => {
                                toast.success('Password reset successful! Redirecting to login...', {
                                    id: 'reset-success',
                                });
                                setTimeout(() => {
                                    router.push('/login');
                                }, 2000);
                            })
                            .catch((err: Error) => {
                                setError(err.message || 'Failed to reset password. Please try again.');
                                setIsLoading(false);
                            });
                    }} className="space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start space-x-2">
                                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <div>
                                    <p className="font-medium">Error</p>
                                    <p className="text-red-600 mt-1">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* New Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                New Password *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError('');
                                    }}
                                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent bg-white text-gray-900 transition-colors"
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New Password *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setError('');
                                    }}
                                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent bg-white text-gray-900 transition-colors"
                                    placeholder="Confirm new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                    </form>

                    {/* Back to OTP */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setStep('otp')}
                            className="text-sm text-gray-600 hover:text-red-700 transition-colors"
                        >
                            ← Back to OTP
                        </button>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center">
                    <Link href="/" className="text-sm text-gray-600 hover:text-red-700 transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
