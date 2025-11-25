// src/stores/productStore.ts
import { create } from 'zustand';
import apiClient from '@/lib/apiClient';
import type { Supplier } from '@/types/supplier';

// Define Product interface inline to avoid import issues
interface Product {
  id: number;
  base_name: string;
  slug: string;
  status: 'draft' | 'published';
  meta_title?: string;
  meta_description?: string;
  base_thumbnail_url?: string | null;
  gallery_images?: string[] | null;
  category_id?: number;
  suppliers?: ProductSupplier[];
  created_at: string;
  updated_at: string;
}

interface ProductSupplier {
  supplier_id: number;
  supplier_product_urls: string[];
  supplier?: Supplier; // Populated when including supplier data
}

interface ProductState {
  product: Product | null;
  isLoading: boolean;
  error: string | null;

  // Product actions
  fetchProduct: (productId: number) => Promise<void>;

  // Supplier management actions
  attachSupplier: (productId: number, supplierId: number, urls: string[]) => Promise<void>;
  detachSupplier: (productId: number, supplierId: number) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  product: null,
  isLoading: false,
  error: null,

  fetchProduct: async (productId: number) => {
    set((state) => ({ ...state, isLoading: true, error: null }));

    try {
      const response = await apiClient.get<Product>(`/admin/products/${productId}?include=suppliers`);
      // Handle both nested and direct response structures
      const productData = response.data.data || response.data;
      set((state) => ({
        ...state,
        product: productData,
        isLoading: false
      }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch product';
      set((state) => ({ ...state, error: errorMessage, isLoading: false }));
      throw new Error(errorMessage);
    }
  },

  attachSupplier: async (productId: number, supplierId: number, urls: string[]) => {
    try {
      await apiClient.post(`/admin/products/${productId}/suppliers`, {
        supplier_id: supplierId,
        supplier_product_urls: urls
      });

      // Re-fetch the product to update the UI
      await get().fetchProduct(productId);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message ||
                         error?.response?.data?.errors?.supplier_product_urls?.[0] ||
                         error?.message ||
                         'Failed to attach supplier to product';
      throw new Error(errorMessage);
    }
  },

  detachSupplier: async (productId: number, supplierId: number) => {
    try {
      await apiClient.delete(`/admin/products/${productId}/suppliers/${supplierId}`);

      // Re-fetch the product to update the UI
      await get().fetchProduct(productId);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message ||
                         error?.message ||
                         'Failed to detach supplier from product';
      throw new Error(errorMessage);
    }
  }
}));