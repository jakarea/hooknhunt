'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '../../../node_modules/react-i18next';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
    const { t } = useTranslation();
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { login, isAuthenticated, isLoading: authLoading } = useAuth();

    // Redirect if already authenticated
    React.useEffect(() => {
        if (!authLoading && isAuthenticated) {
            router.replace('/account');
        }
    }, [isAuthenticated, authLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prevent double submission
        if (isLoading) return;

        setIsLoading(true);

        // Validate phone number (Bangladesh format)
        const phoneRegex = /^01[3-9]\d{8}$/;
        if (!phoneRegex.test(phone)) {
            toast.error(t('auth.validation.phoneRequired'));
            setIsLoading(false);
            return;
        }

        // Validate password
        if (password.length < 6) {
            toast.error(t('auth.validation.passwordMin'));
            setIsLoading(false);
            return;
        }

        try {
            await login(phone, password);
            toast.success('Login successful! Redirecting...', {
                id: 'login-success', // Prevent duplicate toasts
            });
            setIsLoading(false); // Reset loading state after successful login
            setTimeout(() => {
                // Try Next.js router first
                router.replace('/account');

                // Fallback: Force browser navigation after a delay if Next.js doesn't work
                setTimeout(() => {
                    if (window.location.pathname === '/login') {
                        window.location.href = '/account';
                    }
                }, 300);
            }, 200);
        } catch (err: unknown) {
            const error = err as Error;
            toast.error(error.message || t('auth.login.failed'));
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {t('auth.login.title')}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {t('auth.login.subtitle')}
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Phone Number Field */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('auth.login.phone')}
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
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#bc1215] focus:border-transparent bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100"
                                    placeholder={t('checkout.phoneNumberPlaceholder')}
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t('auth.register.phoneHint')}</p>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('auth.login.password')}
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
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-700 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#bc1215] focus:border-transparent bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100"
                                    placeholder={t('auth.login.passwordPlaceholder')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-[#bc1215] focus:ring-[#bc1215] border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                    {t('auth.login.rememberMe')}
                                </label>
                            </div>
                            <div className="text-sm">
                                <a href="#" className="font-medium text-[#bc1215] hover:text-[#9a0f12]">
                                    {t('auth.login.forgotPassword')}
                                </a>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#bc1215] to-[#8a0f12] hover:from-[#8a0f12] hover:to-[#bc1215] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#bc1215] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                t('auth.login.button')
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-[#1a1a1a] text-gray-500 dark:text-gray-400">
                                    {t('auth.login.noAccount')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Register Link */}
                    <div className="mt-6">
                        <Link
                            href="/registration"
                            className="w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#2a2a2a] hover:bg-gray-50 dark:hover:bg-[#333333] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#bc1215] transition-all duration-300"
                        >
                            {t('auth.login.signUp')}
                        </Link>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center">
                    <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#bc1215] dark:hover:text-[#bc1215] transition-colors">
                        ← {t('auth.reset.backToHome')}
                    </Link>
                </div>
            </div>
        </div>
    );
}
