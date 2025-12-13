'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useProfileStore } from '@/stores/profileStore';
import UserNavigation from '@/components/user/UserNavigation';
import toast, { Toaster } from 'react-hot-toast';

export default function ProfilePage() {
  const { user: authUser, isAuthenticated } = useAuth();
  const { user, loading, updating, error, validationErrors, fetchProfile, updateProfile, clearErrors } = useProfileStore();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp_number: '',
  });

  // Fetch profile on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  // Update form data when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        whatsapp_number: user.whatsapp_number || '',
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    clearErrors();
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
      // Show success toast
      toast.success('Profile updated successfully!');
    } catch (error) {
      // Errors are handled in the store
      console.error('Profile update failed:', error);
      // Show error toast if not validation error
      if (!validationErrors) {
        toast.error('Failed to update profile');
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        whatsapp_number: user.whatsapp_number || '',
      });
    }
    clearErrors();
  };

  // Get error message for a specific field
  const getFieldError = (fieldName: string): string | null => {
    if (validationErrors && validationErrors[fieldName]) {
      return validationErrors[fieldName][0];
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#0a0a0a] min-h-screen">
        <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bc1215]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-[#0a0a0a] min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-gray-50 dark:bg-[#0f0f0f] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 py-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Link href="/account" className="hover:text-[#bc1215] transition-colors">My Account</Link>
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 dark:text-white font-medium">Profile</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <UserNavigation />
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your account information and preferences.</p>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-[#bc1215] hover:bg-[#8a0f12] text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Success Message */}
            {!isEditing && user && !error && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg hidden" id="success-message">
                Profile updated successfully!
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-[#bc1215] rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-2xl">
                        {user?.name ? user.name.charAt(0).toUpperCase() : user?.phone_number.slice(0, 2)}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {user?.name || 'Customer'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{user?.phone_number}</p>
                    <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {user?.phone_verified_at ? 'Verified' : 'Not Verified'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Personal Information</h3>

                  <div className="space-y-4">
                    {/* Phone Number (Read-only) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={user?.phone_number || ''}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Phone number cannot be changed
                      </p>
                    </div>

                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-2 border rounded-lg transition-colors ${
                          getFieldError('name')
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-[#bc1215]'
                        } ${
                          isEditing
                            ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        } focus:outline-none focus:ring-2`}
                      />
                      {getFieldError('name') && (
                        <p className="text-red-500 text-sm mt-1">{getFieldError('name')}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-2 border rounded-lg transition-colors ${
                          getFieldError('email')
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-[#bc1215]'
                        } ${
                          isEditing
                            ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        } focus:outline-none focus:ring-2`}
                      />
                      {getFieldError('email') && (
                        <p className="text-red-500 text-sm mt-1">{getFieldError('email')}</p>
                      )}
                    </div>

                    {/* WhatsApp Number */}
                    <div>
                      <label htmlFor="whatsapp_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        id="whatsapp_number"
                        name="whatsapp_number"
                        value={formData.whatsapp_number}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="01XXXXXXXXX"
                        className={`w-full px-4 py-2 border rounded-lg transition-colors ${
                          getFieldError('whatsapp_number')
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-[#bc1215]'
                        } ${
                          isEditing
                            ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        } focus:outline-none focus:ring-2`}
                      />
                      {getFieldError('whatsapp_number') && (
                        <p className="text-red-500 text-sm mt-1">{getFieldError('whatsapp_number')}</p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Optional: For order updates and customer support
                      </p>
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={handleSave}
                          disabled={updating}
                          className="flex-1 bg-[#bc1215] hover:bg-[#8a0f12] text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {updating ? (
                            <span className="flex items-center justify-center">
                              <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Saving...
                            </span>
                          ) : (
                            'Save Changes'
                          )}
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={updating}
                          className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Information */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Information</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Account Type:</span>
                      <span className="font-medium text-gray-900 dark:text-white capitalize">
                        {user?.role.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Member Since:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Phone Verified:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {user?.phone_verified_at ? (
                          <span className="text-green-600 dark:text-green-400">✓ Verified</span>
                        ) : (
                          <span className="text-yellow-600 dark:text-yellow-400">Pending</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Toast notifications */}
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
    </>
  );
}
