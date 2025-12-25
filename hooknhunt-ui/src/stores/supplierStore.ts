// src/stores/supplierStore.ts
import { create } from 'zustand';
import type { Supplier, CreateSupplierData, UpdateSupplierData } from "@/types/supplier";
import apiClient from '@/lib/apiClient'; // Import the shared API client

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
}

interface SupplierState {
  suppliers: Supplier[];
  supplierProducts: any[];
  isLoading: boolean;
  error: string | null;
  fetchSuppliers: () => Promise<void>;
  getSupplierProducts: (supplierId: number) => Promise<void>;
  addSupplier: (data: CreateSupplierData) => Promise<void>;
  updateSupplier: (id: number, data: UpdateSupplierData) => Promise<void>;
  deleteSupplier: (id: number) => Promise<void>;
  deleteWechatQr: (id: number) => Promise<void>;
  deleteAlipayQr: (id: number) => Promise<void>;
}

export const useSupplierStore = create<SupplierState>((set) => ({
  suppliers: [],
  supplierProducts: [],
  isLoading: false,
  error: null,

  fetchSuppliers: async () => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      // API endpoint is GET /api/v1/admin/suppliers
      // Laravel paginate response structure: { data: Supplier[], current_page, last_page, etc. }
      const response = await apiClient.get<{ data: Supplier[] }>('/admin/suppliers');
      set((state) => ({ ...state, suppliers: (response.data as any).data || response.data, isLoading: false }));
    } catch (err: unknown) {
      console.error("Failed to fetch suppliers:", err);
      const errorMessage = (err instanceof Error) ? err.message : 'Failed to fetch suppliers';
      set((state) => ({ ...state, error: errorMessage, isLoading: false }));
    }
  },

  getSupplierProducts: async (supplierId: number) => {
    console.log('[SupplierStore] Getting products for supplier ID:', supplierId);
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      // API endpoint is GET /api/v1/admin/suppliers/{id}/products
      // Backend returns: { products: [...], supplier: {...}, count: 0 }
      const apiUrl = `/admin/suppliers/${supplierId}/products`;
      console.log('[SupplierStore] Making API call to:', apiUrl);

      const response = await apiClient.get(apiUrl);
      console.log('[SupplierStore] Raw API Response:', response);
      console.log('[SupplierStore] Response data:', response.data);
      console.log('[SupplierStore] Products array:', response.data.products);

      const products = response.data.products || [];
      console.log('[SupplierStore] Extracted products:', products);
      console.log('[SupplierStore] Products count:', products.length);

      set((state) => ({
        ...state,
        supplierProducts: products,
        isLoading: false
      }));
    } catch (err: any) {
      console.error("[SupplierStore] Failed to fetch supplier products:", err);
      console.error("[SupplierStore] Error details:", {
        supplierId: supplierId,
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data,
        url: `/admin/suppliers/${supplierId}/products`
      });
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch supplier products';
      set((state) => ({ ...state, error: errorMessage, isLoading: false, supplierProducts: [] }));
      throw err;
    }
  },

  addSupplier: async (data: CreateSupplierData) => {
    try {
      // Create FormData for file uploads
      const formData = new FormData();

      // Add all text fields
      formData.append('name', data.name);
      if (data.shop_name) formData.append('shop_name', data.shop_name);
      if (data.email) formData.append('email', data.email);
      if (data.shop_url) formData.append('shop_url', data.shop_url);
      if (data.wechat_id) formData.append('wechat_id', data.wechat_id);
      if (data.alipay_id) formData.append('alipay_id', data.alipay_id);
      if (data.contact_info) formData.append('contact_info', data.contact_info);

      // Add file fields
      if (data.wechat_qr_file) formData.append('wechat_qr_file', data.wechat_qr_file);
      if (data.alipay_qr_file) formData.append('alipay_qr_file', data.alipay_qr_file);

      const response = await apiClient.post<Supplier>('/admin/suppliers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      set((state) => ({
        ...state,
        suppliers: [...state.suppliers, response.data],
      }));
    } catch (err: unknown) {
      console.error("Failed to add supplier:", err);
      const errorMessage = (err instanceof Error) ? err.message : 'Failed to add supplier';
      const apiError = err as ApiErrorResponse;

      // Handle validation errors
      if (apiError?.response?.data?.errors) {
        const errors = apiError.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        throw new Error(errorMessages.join(', '));
      }

      throw new Error(apiError?.response?.data?.message || errorMessage);
    }
  },

  updateSupplier: async (id: number, data: UpdateSupplierData) => {
    try {
      // Create FormData for file uploads
      const formData = new FormData();

      // Add all text fields (only if they're not undefined)
      if (data.name !== undefined) formData.append('name', data.name);
      if (data.shop_name !== undefined) formData.append('shop_name', data.shop_name || '');
      if (data.email !== undefined) formData.append('email', data.email || '');
      if (data.shop_url !== undefined) formData.append('shop_url', data.shop_url || '');
      if (data.wechat_id !== undefined) formData.append('wechat_id', data.wechat_id || '');
      if (data.alipay_id !== undefined) formData.append('alipay_id', data.alipay_id || '');
      if (data.contact_info !== undefined) formData.append('contact_info', data.contact_info || '');

      // Add URL fields for direct updates
      if (data.wechat_qr_url !== undefined) formData.append('wechat_qr_url', data.wechat_qr_url);
      if (data.alipay_qr_url !== undefined) formData.append('alipay_qr_url', data.alipay_qr_url);

      // Add file fields
      if (data.wechat_qr_file) formData.append('wechat_qr_file', data.wechat_qr_file);
      if (data.alipay_qr_file) formData.append('alipay_qr_file', data.alipay_qr_file);

      const response = await apiClient.post<Supplier>(`/admin/suppliers/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // Laravel requires _method override for file uploads with PUT/PATCH
          'X-HTTP-Method-Override': 'PUT',
        },
        params: {
          _method: 'PUT'
        }
      });

      set((state) => ({
        ...state,
        suppliers: state.suppliers.map((sup: Supplier) =>
          sup.id === id ? response.data : sup
        ),
      }));
    } catch (err: unknown) {
      console.error("Failed to update supplier:", err);
      const errorMessage = (err instanceof Error) ? err.message : 'Failed to update supplier';
      const apiError = err as ApiErrorResponse;

      // Handle validation errors
      if (apiError?.response?.data?.errors) {
        const errors = apiError.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        throw new Error(errorMessages.join(', '));
      }

      throw new Error(apiError?.response?.data?.message || errorMessage);
    }
  },

  deleteSupplier: async (id: number) => {
    try {
      await apiClient.delete(`/admin/suppliers/${id}`);
      set((state) => ({
        ...state,
        suppliers: state.suppliers.filter((sup: Supplier) => sup.id !== id),
      }));
    } catch (err: unknown) {
      console.error("Failed to delete supplier:", err);
      const errorMessage = (err instanceof Error) ? err.message : 'Failed to delete supplier';
      const apiError = err as ApiErrorResponse;
      throw new Error(apiError?.response?.data?.message || errorMessage);
    }
  },

  deleteWechatQr: async (id: number) => {
    try {
      await apiClient.delete(`/admin/suppliers/${id}/wechat-qr`);
      set((state) => ({
        ...state,
        suppliers: state.suppliers.map((sup: Supplier) =>
          sup.id === id ? { ...sup, wechat_qr_url: null } : sup
        ),
      }));
    } catch (err: unknown) {
      console.error("Failed to delete WeChat QR code:", err);
      const errorMessage = (err instanceof Error) ? err.message : 'Failed to delete WeChat QR code';
      const apiError = err as ApiErrorResponse;
      throw new Error(apiError?.response?.data?.message || errorMessage);
    }
  },

  deleteAlipayQr: async (id: number) => {
    try {
      await apiClient.delete(`/admin/suppliers/${id}/alipay-qr`);
      set((state) => ({
        ...state,
        suppliers: state.suppliers.map((sup: Supplier) =>
          sup.id === id ? { ...sup, alipay_qr_url: null } : sup
        ),
      }));
    } catch (err: unknown) {
      console.error("Failed to delete Alipay QR code:", err);
      const errorMessage = (err instanceof Error) ? err.message : 'Failed to delete Alipay QR code';
      const apiError = err as ApiErrorResponse;
      throw new Error(apiError?.response?.data?.message || errorMessage);
    }
  },
}));