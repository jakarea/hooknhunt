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
  po_number?: string;
  supplier_id: number;
  supplier?: any;
  status: string;
  exchange_rate?: number;
  courier_name?: string;
  tracking_number?: string;
  lot_number?: string;
  shipping_method?: 'air' | 'sea';
  shipping_cost?: number;
  total_weight?: number;
  extra_cost_global?: number;
  total_amount?: number;
  bd_courier_tracking?: string;
  created_by: number;
  items?: PurchaseOrderItem[];
  created_at: string;
  updated_at: string;
}

interface PurchaseOrderItem {
  id: number;
  po_number: number;
  product_id: number;
  product_variant_id?: number | null;
  product?: any;
  productVariant?: any;
  china_price: number;
  quantity: number;
  unit_weight?: number | string;
  extra_weight?: number | string;
  shipping_cost?: number;
  received_quantity: number;
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
  updateOrder: (id: number, items: any[]) => Promise<void>;
  updateStatus: (id: number, status: string, data?: any) => Promise<void>;
  updateOrderStatus: (id: number, status: string, payload?: any) => Promise<void>;
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
      console.log('[PurchaseStore] Fetching purchase orders...');
      const response = await apiClient.get('/admin/purchase-orders');
      console.log('[PurchaseStore] Purchase orders fetched successfully:', response.data);
      set({
        purchaseOrders: response.data.data || response.data,
        isLoading: false,
      });
    } catch (error: any) {
      console.error('[PurchaseStore] Failed to fetch purchase orders:', error);
      console.error('[PurchaseStore] Error response:', error?.response);
      console.error('[PurchaseStore] Error status:', error?.response?.status);

      const errorMessage =
        (error as ApiErrorResponse)?.response?.data?.message ||
        error?.message ||
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

  updateOrder: async (id: number, items: any[]) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.put(`/admin/purchase-orders/${id}`, items);

      // Update current order with the latest data from response
      if (response.data.purchase_order) {
        set({
          currentOrder: response.data.purchase_order,
          isLoading: false
        });
      } else {
        // Fallback: refetch the order to get latest data
        await get().fetchOrder(id);
      }

      console.log('[PurchaseStore] Purchase order updated successfully');
    } catch (error: any) {
      console.error('[PurchaseStore] Failed to update purchase order:', error);
      console.error('[PurchaseStore] Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to update purchase order';
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

  updateOrderStatus: async (id: number, status: string, payload: any = {}) => {
    console.log('[PurchaseStore] updateOrderStatus called:', { id, status, payload });
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.put(`/admin/purchase-orders/${id}/status`, {
        status,
        ...payload
      });

      console.log('[PurchaseStore] updateOrderStatus response:', response.data);
      const updatedOrder = response.data;

      // Debug: Check if the updated order has the expected status
      const currentState = get();
      console.log('[PurchaseStore] Updated order status check:', {
        orderId: updatedOrder.id,
        oldStatus: currentState.currentOrder?.status,
        newStatus: updatedOrder.status,
        statusChanged: currentState.currentOrder?.status !== updatedOrder.status,
        responseKeys: Object.keys(updatedOrder)
      });

      // Update both purchaseOrders list and currentOrder with new object reference
      set(state => {
        const updatedPurchaseOrders = state.purchaseOrders.map(order =>
          order.id === id ? updatedOrder : order
        );
        // Force a new object reference to ensure React detects the change
        const newCurrentOrder = { ...updatedOrder };
        return {
          purchaseOrders: updatedPurchaseOrders,
          currentOrder: newCurrentOrder,
          isLoading: false,
          error: null,
        };
      });

      // Debug: Check if the state was actually updated
      const newState = usePurchaseStore.getState();
      console.log('[PurchaseStore] State after update:', {
        currentOrderId: newState.currentOrder?.id,
        currentOrderStatus: newState.currentOrder?.status,
        storeLoading: newState.isLoading,
        purchaseOrdersCount: newState.purchaseOrders.length
      });
    } catch (error: any) {
      console.error('[PurchaseStore] updateOrderStatus error:', {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        message: error?.response?.data?.message,
        url: error?.config?.url
      });
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