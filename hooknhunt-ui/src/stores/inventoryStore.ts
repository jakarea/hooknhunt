// src/stores/inventoryStore.ts
import { create } from 'zustand';
import apiClient from '@/lib/apiClient';

export interface InventoryItem {
  id: number;
  product_variant_id: number;
  quantity: number;
  reserved_quantity: number;
  available_quantity: number;
  min_stock_level?: number | null;
  max_stock_level?: number | null;
  reorder_point?: number | null;
  average_unit_cost?: number | null;
  last_unit_cost?: number | null;
  total_value: number;
  location?: string | null;
  last_stocked_at?: string | null;
  last_sold_at?: string | null;
  stock_status: 'out_of_stock' | 'low_stock' | 'reorder_needed' | 'overstocked' | 'in_stock';
  is_low_stock: boolean;
  should_reorder: boolean;
  created_at: string;
  updated_at: string;

  // Relationships
  product_variant?: {
    id: number;
    sku: string;
    product_id: number;
    landed_cost?: number;
    retail_price?: number;
    wholesale_price?: number;
    retail_name?: string;
    product?: {
      id: number;
      base_name: string;
      base_thumbnail_url?: string | null;
      category?: {
        id: number;
        name: string;
      };
      brand?: {
        id: number;
        name: string;
      };
    };
    attribute_options?: Array<{
      id: number;
      value: string;
      attribute?: {
        id: number;
        name: string;
      };
    }>;
  };
}

export interface InventoryStats {
  total_items: number;
  total_value: number;
  out_of_stock: number;
  low_stock: number;
  reorder_needed: number;
  total_quantity: number;
  total_reserved: number;
}

interface InventoryFilters {
  product_id?: number;
  sku?: string;
  location?: string;
  stock_status?: 'out_of_stock' | 'low_stock' | 'reorder_needed' | 'in_stock';
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
}

interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

interface InventoryState {
  inventoryItems: InventoryItem[];
  stats: InventoryStats | null;
  currentItem: InventoryItem | null;
  isLoading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;

  // Actions
  fetchInventory: (page?: number, filters?: InventoryFilters) => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchInventoryItem: (id: number) => Promise<void>;
  updateInventorySettings: (id: number, data: Partial<InventoryItem>) => Promise<void>;
  clearError: () => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  inventoryItems: [],
  stats: null,
  currentItem: null,
  isLoading: false,
  error: null,
  pagination: null,

  fetchInventory: async (page = 1, filters = {}) => {
    set({ isLoading: true, error: null });

    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());

      // Add filters
      if (filters.product_id) params.append('product_id', filters.product_id.toString());
      if (filters.sku) params.append('sku', filters.sku);
      if (filters.location) params.append('location', filters.location);
      if (filters.stock_status) params.append('stock_status', filters.stock_status);
      if (filters.search) params.append('search', filters.search);
      if (filters.sort_by) params.append('sort_by', filters.sort_by);
      if (filters.sort_order) params.append('sort_order', filters.sort_order);
      if (filters.per_page) params.append('per_page', filters.per_page.toString());

      const response = await apiClient.get(`/admin/inventory?${params.toString()}`);
      const { data, ...meta } = response.data;

      set({
        inventoryItems: data,
        pagination: meta,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch inventory';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  fetchStats: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiClient.get('/admin/inventory/stats');
      set({
        stats: response.data,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch inventory stats';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  fetchInventoryItem: async (id: number) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiClient.get(`/admin/inventory/${id}`);
      set({
        currentItem: response.data,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch inventory item';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  updateInventorySettings: async (id: number, data: Partial<InventoryItem>) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiClient.put(`/admin/inventory/${id}`, data);

      // Update the item in the list if it exists
      set((state) => ({
        inventoryItems: state.inventoryItems.map((item) =>
          item.id === id ? { ...item, ...response.data.data } : item
        ),
        currentItem: state.currentItem?.id === id ? response.data.data : state.currentItem,
        isLoading: false,
      }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update inventory settings';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  clearError: () => set({ error: null }),
}));
