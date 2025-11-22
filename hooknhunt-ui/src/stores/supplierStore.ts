// src/stores/supplierStore.ts
import { create } from 'zustand';
import type { Supplier } from "@/types/supplier";
import apiClient from '@/lib/apiClient'; // Import the shared API client

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Form data type for creating/updating a supplier
export type SupplierFormData = {
  name: string;
  shop_name: string | null;
  email: string | null;
  shop_url: string | null;
  wechat_id: string | null;
  alipay_id: string | null;
  contact_info: string | null;
};

interface SupplierState {
  suppliers: Supplier[];
  isLoading: boolean;
  error: string | null;
  fetchSuppliers: () => Promise<void>;
  addSupplier: (data: SupplierFormData) => Promise<void>;
  updateSupplier: (id: number, data: SupplierFormData) => Promise<void>;
  deleteSupplier: (id: number) => Promise<void>; // Add deleteSupplier
}

export const useSupplierStore = create<SupplierState>((set) => ({
  suppliers: [],
  isLoading: false,
  error: null,

  fetchSuppliers: async () => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      // API endpoint is GET /api/v1/admin/suppliers (from AI_CONTEXT.md Section 9.2)
      const response = await apiClient.get<{ data: Supplier[] }>('/admin/suppliers');
      set((state) => ({ ...state, suppliers: response.data.data, isLoading: false }));
    } catch (err: unknown) {
      console.error("Failed to fetch suppliers:", err);
      const errorMessage = (err instanceof Error) ? err.message : 'Failed to fetch suppliers';
      set((state) => ({ ...state, error: errorMessage, isLoading: false }));
    }
  },

  addSupplier: async (data: SupplierFormData) => {
    try {
      const response = await apiClient.post<{ data: Supplier }>('/admin/suppliers', data);
      set((state) => ({
        ...state,
        suppliers: [...state.suppliers, response.data.data],
      }));
    } catch (err: unknown) {
      console.error("Failed to add supplier:", err);
      const errorMessage = (err instanceof Error) ? err.message : 'Failed to add supplier';
      const apiError = err as ApiErrorResponse;
      throw new Error(apiError?.response?.data?.message || errorMessage);
    }
  },

  updateSupplier: async (id: number, data: SupplierFormData) => {
    try {
      const response = await apiClient.put<{ data: Supplier }>(`/admin/suppliers/${id}`, data);
      const updatedSupplier = response.data.data;
      set((state) => ({
        ...state,
        suppliers: state.suppliers.map((sup: Supplier) =>
          sup.id === id ? updatedSupplier : sup
        ),
      }));
    } catch (err: unknown) {
      console.error("Failed to update supplier:", err);
      const errorMessage = (err instanceof Error) ? err.message : 'Failed to update supplier';
      const apiError = err as ApiErrorResponse;
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
}));