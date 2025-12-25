'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import UserNavigation from '@/components/user/UserNavigation';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';
import { Address } from '@/types';

interface FormData {
  type: 'shipping' | 'billing';
  full_name: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  district: string;
  post_code: string;
  phone_number: string;
  is_default: boolean;
}

const emptyForm: FormData = {
  type: 'shipping',
  full_name: '',
  address_line_1: '',
  address_line_2: '',
  city: '',
  district: '',
  post_code: '',
  phone_number: '',
  is_default: false,
};

export default function AddressesPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Address | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses();
    }
  }, [isAuthenticated]);

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const response = await api.getAddresses();
      const addressesData = response.data || response;
      setAddresses(Array.isArray(addressesData) ? addressesData : []);
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
      toast.error('Failed to load addresses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        type: address.type as 'shipping' | 'billing',
        full_name: address.full_name,
        address_line_1: address.address_line_1,
        address_line_2: address.address_line_2 || '',
        city: address.city,
        district: address.district,
        post_code: address.post_code || '',
        phone_number: address.phone_number,
        is_default: address.is_default || false,
      });
    } else {
      setEditingAddress(null);
      setFormData({ ...emptyForm });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAddress(null);
    setFormData({ ...emptyForm });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingAddress) {
        await api.updateAddress(editingAddress.id, formData);
        toast.success('Address updated successfully');
      } else {
        await api.addAddress(formData);
        toast.success('Address added successfully');
      }

      await fetchAddresses();
      handleCloseModal();
    } catch (error: any) {
      console.error('Failed to save address:', error);
      const errorMessage = error.errors ? Object.values(error.errors).flat()[0] : 'Failed to save address';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    try {
      await api.deleteAddress(deleteConfirm.id);
      toast.success('Address deleted successfully');
      await fetchAddresses();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete address:', error);
      toast.error('Failed to delete address');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#fcf8f6] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fcf8f6]">
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 py-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/account" className="hover:text-red-700 transition-colors">My Account</Link>
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">Addresses</span>
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">My Addresses</h1>
                  <p className="text-gray-600 mt-2">Manage your shipping and billing addresses</p>
                </div>
                <button
                  onClick={() => handleOpenModal()}
                  className="bg-red-700 hover:bg-red-800 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Address
                </button>
              </div>
            </div>

            {/* Addresses List */}
            {addresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative group"
                  >
                    {/* Default Badge */}
                    {address.is_default && (
                      <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Default
                        </span>
                      </div>
                    )}

                    {/* Type Badge */}
                    <div className="mb-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        address.type === 'shipping'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {address.type === 'shipping' ? 'Shipping' : 'Billing'} Address
                      </span>
                    </div>

                    {/* Address Details */}
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <svg className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <p className="text-sm font-medium text-gray-900">{address.full_name}</p>
                      </div>

                      <div className="flex items-start">
                        <svg className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <p className="text-sm text-gray-600">{address.phone_number}</p>
                      </div>

                      <div className="flex items-start">
                        <svg className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-sm text-gray-600">
                          {address.address_line_1}
                          {address.address_line_2 && `, ${address.address_line_2}`}
                        </p>
                      </div>

                      <div className="flex items-start">
                        <svg className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <p className="text-sm text-gray-600">
                          {address.city}, {address.district}
                          {address.post_code && ` - ${address.post_code}`}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenModal(address)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(address)}
                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 font-medium py-2 px-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No addresses found</h3>
                <p className="text-gray-600 mb-6">You haven't added any addresses yet.</p>
                <button
                  onClick={() => handleOpenModal()}
                  className="bg-red-700 hover:bg-red-800 text-white font-medium py-2 px-6 rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Your First Address
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Address Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Address Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 bg-white"
                >
                  <option value="shipping">Shipping Address</option>
                  <option value="billing">Billing Address</option>
                </select>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 bg-white"
                  placeholder="Enter full name"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 bg-white"
                  placeholder="01xxxxxxxxx"
                />
              </div>

              {/* Address Line 1 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1 *</label>
                <input
                  type="text"
                  name="address_line_1"
                  value={formData.address_line_1}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 bg-white"
                  placeholder="House/Flat no, Building, Street"
                />
              </div>

              {/* Address Line 2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  name="address_line_2"
                  value={formData.address_line_2}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 bg-white"
                  placeholder="Area, Landmark (optional)"
                />
              </div>

              {/* City & District Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 bg-white"
                    placeholder="City"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">District *</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 bg-white"
                    placeholder="District"
                  />
                </div>
              </div>

              {/* Post Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Post Code (Optional)</label>
                <input
                  type="text"
                  name="post_code"
                  value={formData.post_code}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 bg-white"
                  placeholder="Post code"
                />
              </div>

              {/* Default Address */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_default"
                  id="is_default"
                  checked={formData.is_default}
                  onChange={handleChange}
                  className="h-4 w-4 text-red-700 focus:ring-red-700 border-gray-300 rounded"
                />
                <label htmlFor="is_default" className="ml-2 block text-sm text-gray-700">
                  Set as default address
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-red-700 hover:bg-red-800 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {editingAddress ? 'Update Address' : 'Add Address'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Address?</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this address? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-700 hover:bg-red-800 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
