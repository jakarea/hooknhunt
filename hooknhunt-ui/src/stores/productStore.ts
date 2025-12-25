// src/stores/productStore.ts
import { create } from 'zustand';
import apiClient from '@/lib/apiClient';
import type { Supplier } from '@/types/supplier';

// Define Category interface
interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id?: number;
  parent?: Category;
}

// Define Inventory interface
interface Inventory {
  id: number;
  quantity: number;
  available_quantity: number;
  reserved_quantity: number;
  is_low_stock: boolean;
  reorder_level: number;
}

// Define VariantAttributeOption interface
interface VariantAttributeOption {
  id: number;
  name: string;
  attribute: {
    id: number;
    name: string;
  };
}

// Define ProductVariant interface
interface ProductVariant {
  id: number;
  sku: string;
  retail_name?: string;
  wholesale_name?: string;
  daraz_name?: string;
  retail_price?: number;
  wholesale_price?: number;
  daraz_price?: number;
  landed_cost?: number;
  status: string;
  weight?: number;
  dimensions?: any;
  moq_wholesale?: number;
  inventory?: Inventory;
  attribute_options?: VariantAttributeOption[];
  // API-added fields
  current_stock?: number;
  available_stock?: number;
  is_low_stock?: boolean;
  retail_margin?: number;
  wholesale_margin?: number;
  retail_margin_percentage?: number;
  wholesale_margin_percentage?: number;
}

// Define Product interface with all relational data
interface Product {
  id: number;
  base_name: string;
  slug: string;
  sku?: string;
  status: 'draft' | 'published';
  description?: string;
  short_description?: string;
  base_thumbnail_url?: string | null;
  thumbnail?: string | null;
  video_url?: string | null;
  gallery_images?: string[] | null;
  is_featured: boolean;
  weight?: number;
  dimensions?: string;
  tags?: string[] | string | null;
  specifications?: Record<string, any> | null;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  category_id?: number | null;
  category_ids?: number[];
  brand_id?: number | null;
  categories?: Category[];
  suppliers?: ProductSupplier[];
  variants?: ProductVariant[];
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
      const response = await apiClient.get<Product>(`/admin/products/${productId}?include=categories,suppliers,variants.inventory,variants.attributeOptions`);
      console.log('🔍 Raw API response:', response.data);
      // Handle both nested and direct response structures
      const productData = (response.data as any).data || response.data;
      console.log('🔍 Processed product data:', productData);
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