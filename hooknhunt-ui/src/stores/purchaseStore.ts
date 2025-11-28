// src/stores/purchaseStore.ts
import { create } from 'zustand';
import apiClient from '@/lib/apiClient';

// Types
interface PurchaseOrderDraftData {
  supplier_id: number;
  items: Array<{
    product_id: number;
    product_variant_id?: number | null;
    china_price: number;
    quantity: number;
  }>;
}

interface PurchaseOrder {
  id: number;
  order_number?: string;
  supplier_id: number;
  supplier?: any;
  status: string;
  exchange_rate?: number;
  courier_name?: string;
  tracking_number?: string;
  lot_number?: string;
  total_weight?: number;
  extra_cost_global?: number;
  bd_courier_tracking?: string;
  created_by: number;
  items?: PurchaseOrderItem[];
  created_at: string;
  updated_at: string;
}

interface PurchaseOrderItem {
  id: number;
  po_id: number;
  product_id: number;
  product_variant_id?: number | null;
  product?: any;
  productVariant?: any;
  china_price: number;
  quantity: number;
  shipping_cost?: number;
  lost_quantity: number;
  lost_item_price?: number;
  final_unit_cost?: number;
  created_at: string;
  updated_at: string;
}

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
}

interface PurchaseState {
  purchaseOrders: PurchaseOrder[];
  currentOrder: PurchaseOrder | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchPurchaseOrders: () => Promise<void>;
  fetchPurchaseOrder: (id: number) => Promise<void>;
  fetchOrder: (id: number) => Promise<void>;
  createDraft: (data: PurchaseOrderDraftData) => Promise<PurchaseOrder>;
  updateStatus: (id: number, status: string, data?: any) => Promise<void>;
  receiveItems: (id: number, data: any) => Promise<void>;
  clearError: () => void;
  clearCurrentOrder: () => void;
}

export const usePurchaseStore = create<PurchaseState>((set, get) => ({
  purchaseOrders: [],
  currentOrder: null,
  isLoading: false,
  error: null,

  fetchPurchaseOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/admin/purchase-orders');
      set({
        purchaseOrders: response.data.data || response.data,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage =
        (error as ApiErrorResponse)?.response?.data?.message ||
        'Failed to fetch purchase orders';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchPurchaseOrder: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(`/admin/purchase-orders/${id}`);
      set({
        currentOrder: response.data,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage =
        (error as ApiErrorResponse)?.response?.data?.message ||
        'Failed to fetch purchase order';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchOrder: async (id: number) => {
    // Alias for fetchPurchaseOrder to match instruction requirements
    return get().fetchPurchaseOrder(id);
  },

  createDraft: async (data: PurchaseOrderDraftData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/admin/purchase-orders', data);
      const newOrder = response.data;

      set(state => ({
        purchaseOrders: [newOrder, ...state.purchaseOrders],
        isLoading: false,
      }));

      // Redirect to purchase orders list on success
      window.location.href = '/dashboard/purchase/list';

      return newOrder;
    } catch (error: any) {
      const errorMessage =
        (error as ApiErrorResponse)?.response?.data?.message ||
        'Failed to create purchase order';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateStatus: async (id: number, status: string, data: any = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.put(`/admin/purchase-orders/${id}/status`, {
        status,
        ...data
      });

      const updatedOrder = response.data;

      set(state => ({
        purchaseOrders: state.purchaseOrders.map(order =>
          order.id === id ? updatedOrder : order
        ),
        currentOrder: state.currentOrder?.id === id ? updatedOrder : state.currentOrder,
        isLoading: false,
      }));
    } catch (error: any) {
      const errorMessage =
        (error as ApiErrorResponse)?.response?.data?.message ||
        'Failed to update purchase order status';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  receiveItems: async (id: number, data: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post(`/admin/purchase-orders/${id}/receive-items`, data);

      const updatedOrder = response.data;

      set(state => ({
        purchaseOrders: state.purchaseOrders.map(order =>
          order.id === id ? updatedOrder : order
        ),
        currentOrder: state.currentOrder?.id === id ? updatedOrder : state.currentOrder,
        isLoading: false,
      }));
    } catch (error: any) {
      const errorMessage =
        (error as ApiErrorResponse)?.response?.data?.message ||
        'Failed to receive items';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  clearCurrentOrder: () => set({ currentOrder: null }),
}));