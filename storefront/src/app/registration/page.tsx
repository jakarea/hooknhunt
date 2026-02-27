'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import OtpVerification from '@/components/OtpVerification';

export default function RegistrationPage() {
    const [formData, setFormData] = useState({
        phone: '',
        password: '',
        confirmPassword: '',
        name: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [step, setStep] = useState<'register' | 'verify'>('register');
    const router = useRouter();
    const { register, sendOtp, verifyOtp } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fieldName = e.target.name;

        // Clear field-specific error when user starts typing
        if (fieldErrors[fieldName]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
        }

        // Clear general error when user starts typing
        if (error) {
            setError('');
        }

        setFormData({
            ...formData,
            [fieldName]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Validate phone number (Bangladesh format)
        const phoneRegex = /^01[3-9]\d{8}$/;
        if (!phoneRegex.test(formData.phone)) {
            setError('Please enter a valid Bangladesh phone number (01xxxxxxxxx)');
            setIsLoading(false);
            return;
        }

        // Validate password
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            setIsLoading(false);
            return;
        }

        // Validate password match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        // Validate terms agreement
        if (!agreedToTerms) {
            setError('You must agree to the Terms of Service and Privacy Policy');
            setIsLoading(false);
            return;
        }

        try {
            // Clear previous errors
            setError('');
            setFieldErrors({});

            // Register user
            await register(formData.phone, formData.password, formData.name);

            // Move to OTP verification step
            setStep('verify');
        } catch (err: unknown) {
            console.error('Registration error:', err);

            // Clear loading state
            setIsLoading(false);

            // Handle different types of errors
            if (err && typeof err === 'object' && 'status' in err) {
                const errorObj = err as { status: number; message?: string; errors?: Record<string, string[]> };

                // Handle validation errors (422)
                if (errorObj.status === 422 && errorObj.errors) {
                    // Set field-specific errors
                    const fieldErrors: Record<string, string> = {};
                    Object.entries(errorObj.errors).forEach(([field, messages]) => {
                        // Map Laravel field names to form field names
                        const fieldName = field.replace('phone_number', 'phone');
                        fieldErrors[fieldName] = Array.isArray(messages) ? messages[0] : messages;
                    });

                    setFieldErrors(fieldErrors);

                    // Also set general error message
                    const allErrors = Object.values(errorObj.errors).flat();
                    setError(allErrors[0] || 'Please fix the errors below.');
                }
                // Handle phone number already exists error
                else if (errorObj.status === 422) {
                    setFieldErrors({ phone: 'Phone number already registered. Please use a different number.' });
                    setError('This phone number is already registered.');
                }
                // Handle other server errors
                else {
                    setError(errorObj.message || 'Registration failed. Please try again.');
                }
            } else {
                setError('Registration failed. Please check your connection and try again.');
            }
            return; // Don't proceed to finally block
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (otp: string) => {
        await verifyOtp(formData.phone, otp);
        // On success, redirect to account page
        router.push('/account');
    };

    const handleResendOtp = async () => {
        await sendOtp(formData.phone);
    };

    if (step === 'verify') {
        return (
            <div className="min-h-screen bg-[#fcf8f6] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        <OtpVerification
                            phone={formData.phone}
                            onVerify={handleVerifyOtp}
                            onResend={handleResendOtp}
                            isLoading={isLoading}
                        />

                        {/* Back to Registration */}
                        <div className="mt-6 text-center">
                            <button
                                onClick={() => setStep('register')}
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

    return (
        <div className="min-h-screen bg-[#fcf8f6] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 flex items-center justify-center mb-4">
                        <img src="/hook-and-hunt-logo.svg" alt="Hook & Hunt" className="h-12 w-auto" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">
                        Create Account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Join us and start shopping for the best products
                    </p>
                </div>

                {/* Registration Form */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start space-x-2">
                                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <div>
                                    <p className="font-medium">Registration Error</p>
                                    <p className="text-red-600 mt-1">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name (Optional)
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent bg-white text-gray-900 transition-colors"
                                    placeholder="Enter your full name"
                                />
                            </div>
                        </div>

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
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent bg-white text-gray-900 transition-colors ${
                                        fieldErrors.phone
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-red-700'
                                    }`}
                                    placeholder="01xxxxxxxxx"
                                />
                            </div>
                            {fieldErrors.phone ? (
                                <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>
                            ) : (
                                <p className="mt-1 text-xs text-gray-500">Format: 01xxxxxxxxx (Bangladesh number)</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password *
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
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`block w-full pl-10 pr-10 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent bg-white text-gray-900 transition-colors ${
                                        fieldErrors.password
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-red-700'
                                    }`}
                                    placeholder="Enter your password"
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
                            {fieldErrors.password ? (
                                <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
                            ) : (
                                <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password *
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
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`block w-full pl-10 pr-10 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent bg-white text-gray-900 transition-colors ${
                                        fieldErrors.confirmPassword || fieldErrors.password_confirmation
                                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-red-700'
                                    }`}
                                    placeholder="Confirm your password"
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
                            {fieldErrors.confirmPassword || fieldErrors.password_confirmation ? (
                                <p className="mt-1 text-xs text-red-600">
                                    {fieldErrors.confirmPassword || fieldErrors.password_confirmation}
                                </p>
                            ) : null}
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    className="h-4 w-4 text-[#ec3137] focus:ring-[#ec3137] border-gray-300 rounded"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="terms" className="text-gray-700">
                                    I agree to the{' '}
                                    <a href="#" className="font-medium text-red-700 hover:text-red-800">
                                        Terms of Service
                                    </a>{' '}
                                    and{' '}
                                    <a href="#" className="font-medium text-red-700 hover:text-red-800">
                                        Privacy Policy
                                    </a>
                                </label>
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
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Already have an account?
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Login Link */}
                    <div className="mt-6">
                        <Link
                            href="/login"
                            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-700 transition-all duration-300"
                        >
                            Sign In
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
