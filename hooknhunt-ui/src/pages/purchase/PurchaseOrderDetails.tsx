import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { Package, CheckCircle, Truck, Ship, Home, DollarSign, LoaderCircle, Edit, Save, X, Plus, Trash2 } from 'lucide-react';

import { usePurchaseStore } from '@/stores/purchaseStore';
import { useSupplierStore } from '@/stores/supplierStore';
import { useSettingStore, useSetting } from '@/stores/settingStore';
import apiClient from '@/lib/apiClient';

// Form types - using type inference from Zod schema

// Workflow steps
const workflowSteps = [
  { key: 'draft', label: 'Draft', icon: LoaderCircle },
  { key: 'payment_confirmed', label: 'Payment', icon: DollarSign },
  { key: 'supplier_dispatched', label: 'Dispatched', icon: Truck },
  { key: 'warehouse_received', label: 'Warehouse Received', icon: Package },
  { key: 'shipped_bd', label: 'Shipped BD', icon: Ship },
  { key: 'arrived_bd', label: 'Arrived BD', icon: Home },
  { key: 'in_transit_bogura', label: 'Transit Bogura', icon: Truck },
  { key: 'received_hub', label: 'Received', icon: Package },
  { key: 'completed', label: 'Completed', icon: CheckCircle },
  { key: 'completed_partially', label: 'Partially Completed', icon: CheckCircle },
];

// Validation schemas
const paymentFormSchema = z.object({
  exchange_rate: z.string().min(1, 'Exchange rate is required'),
});

const dispatchFormSchema = z.object({
  courier_name: z.string().optional(),
  tracking_number: z.string().optional(),
});

const shippedFormSchema = z.object({
  lot_number: z.string().optional(),
});

const arrivedFormSchema = z.object({
  shipping_method: z.enum(['air', 'sea']).optional(),
  shipping_cost: z.string().optional(),
});

const transitFormSchema = z.object({
  bd_courier_tracking: z.string().optional(),
});

const receiveStockFormSchema = z.object({
  additional_cost: z.string().optional(),
  items: z.array(z.object({
    po_item_id: z.number(),
    unit_weight: z.string().min(1, 'Unit weight is required'),
    extra_weight: z.string().optional(),
    received_quantity: z.string().optional(),
  })).optional(),
});

type PaymentFormData = z.infer<typeof paymentFormSchema>;
type DispatchFormData = z.infer<typeof dispatchFormSchema>;
type ShippedFormData = z.infer<typeof shippedFormSchema>;
type ArrivedFormData = z.infer<typeof arrivedFormSchema>;
type TransitFormData = z.infer<typeof transitFormSchema>;
type ReceiveStockFormData = z.infer<typeof receiveStockFormSchema>;

export function PurchaseOrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentOrder = usePurchaseStore((state) => state.currentOrder);
  const { fetchOrder, updateOrder, updateStatus, updateOrderStatus, receiveItems, isLoading: storeLoading } = usePurchaseStore();
  const { getSupplierProducts, supplierProducts } = useSupplierStore();
  const { fetchSettings } = useSettingStore();
  const defaultExchangeRate = useSetting('exchange_rate_rmb_bdt');

  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showDispatchDialog, setShowDispatchDialog] = useState(false);
  const [showShippedDialog, setShowShippedDialog] = useState(false);
  const [showArrivedDialog, setShowArrivedDialog] = useState(false);
  const [showTransitDialog, setShowTransitDialog] = useState(false);
  const [showReceiveStockDialog, setShowReceiveStockDialog] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableItems, setEditableItems] = useState<any[]>([]);
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  // Check which columns have data to hide empty ones
  const hasWeightData = currentOrder?.items?.some(item =>
    item.unit_weight && Number(item.unit_weight) > 0
  ) || false;

  const hasExtraWeightData = currentOrder?.items?.some(item =>
    item.extra_weight && Number(item.extra_weight) > 0
  ) || false;

  const hasReceivedQtyData = currentOrder?.items?.some(item =>
    item.received_quantity && Number(item.received_quantity) > 0
  ) || false;

  const hasFinalCostData = currentOrder?.items?.some(item =>
    item.final_unit_cost && Number(item.final_unit_cost) > 0
  ) || false;

  // Forms
  const paymentForm = useForm<PaymentFormData>({ resolver: zodResolver(paymentFormSchema) });
  const dispatchForm = useForm<DispatchFormData>({ resolver: zodResolver(dispatchFormSchema) });
  const shippedForm = useForm<ShippedFormData>({ resolver: zodResolver(shippedFormSchema) });
  const arrivedForm = useForm<ArrivedFormData>({ resolver: zodResolver(arrivedFormSchema) });
  const transitForm = useForm<TransitFormData>({ resolver: zodResolver(transitFormSchema) });
  const receiveStockForm = useForm<ReceiveStockFormData>({ resolver: zodResolver(receiveStockFormSchema) });

  // State for receive stock items
  const [receiveStockItems, setReceiveStockItems] = useState<Array<{
    po_item_id: number;
    product_name: string;
    quantity: number;
    unit_weight: string;
    extra_weight: string;
    received_quantity: string;
  }>>([]);

  // Function to calculate final unit cost based on all cost components
  const calculateFinalUnitCost = useCallback(async (orderId: number) => {
    try {
      const response = await apiClient.put(`/admin/purchase-orders/${orderId}/recalculate-costs`);
      console.log('Costs recalculated successfully:', response.data);

      // Refetch the order to get updated costs
      await fetchOrder(orderId);

      toast({
        title: 'Costs Updated',
        description: 'Unit costs have been recalculated based on latest data.',
      });
    } catch (error: any) {
      console.error('Failed to recalculate costs:', error);
      toast({
        title: 'Error',
        description: 'Failed to recalculate costs. Please refresh the page.',
        variant: 'destructive',
      });
    }
  }, [fetchOrder]);

  useEffect(() => {
    if (id) {
      fetchOrder(parseInt(id));
    }
    fetchSettings();
  }, [id, fetchOrder, fetchSettings]);

  // Force timeline update when currentOrder changes
  useEffect(() => {
    if (currentOrder) {
      console.log('🔄 currentOrder changed (Zustand subscription working):', {
        id: currentOrder.id,
        status: currentOrder.status,
        updated_at: currentOrder.updated_at,
        exchange_rate: currentOrder.exchange_rate,
        courier_name: currentOrder.courier_name,
        tracking_number: currentOrder.tracking_number,
        bd_courier_tracking: currentOrder.bd_courier_tracking,
        timestamp: new Date().toISOString()
      });
    }
  }, [currentOrder]);

  // Initialize receive items when order is loaded
  useEffect(() => {
    if (currentOrder?.items) {
      setReceiveStockItems(currentOrder.items.map(item => ({
        po_item_id: item.id,
        product_name: item.product?.base_name || 'Unknown Product',
        quantity: item.quantity,
        unit_weight: item.unit_weight ? item.unit_weight.toString() : '',
        extra_weight: item.extra_weight ? item.extra_weight.toString() : '0',
        received_quantity: item.received_quantity ? item.received_quantity.toString() : item.quantity.toString(),
      })));
    }
  }, [currentOrder]);

  // Update available products when supplier products are loaded (in edit mode)
  useEffect(() => {
    if (isEditMode && currentOrder && supplierProducts.length > 0) {
      console.log('[PurchaseOrderDetails] Updating available products from supplierProducts');
      console.log('[PurchaseOrderDetails] Current order items:', currentOrder.items?.length);
      console.log('[PurchaseOrderDetails] Supplier products loaded:', supplierProducts.length);

      // Filter out products that are already in the order
      const availableProductsList = supplierProducts.filter((product: any) =>
        !currentOrder.items?.some((item: any) => item.product_id === product.id)
      );

      setAvailableProducts(availableProductsList);
      console.log('[PurchaseOrderDetails] Available products for adding:', availableProductsList.length);
    }
  }, [supplierProducts, isEditMode, currentOrder]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      payment_confirmed: 'bg-blue-100 text-blue-800',
      supplier_dispatched: 'bg-yellow-100 text-yellow-800',
      warehouse_received: 'bg-cyan-100 text-cyan-800',
      shipped_bd: 'bg-orange-100 text-orange-800',
      arrived_bd: 'bg-purple-100 text-purple-800',
      in_transit_bogura: 'bg-indigo-100 text-indigo-800',
      received_hub: 'bg-green-100 text-green-800',
      completed: 'bg-green-600 text-white',
      completed_partially: 'bg-amber-500 text-white',
      lost: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Helper functions to open dialogs with current data
  const openPaymentDialog = () => {
    if (currentOrder?.exchange_rate) {
      paymentForm.reset({
        exchange_rate: currentOrder.exchange_rate.toString(),
      });
    } else if (defaultExchangeRate) {
      paymentForm.reset({
        exchange_rate: defaultExchangeRate.toString(),
      });
    }
    setShowPaymentDialog(true);
  };

  const openDispatchDialog = () => {
    if (currentOrder?.courier_name || currentOrder?.tracking_number) {
      dispatchForm.reset({
        courier_name: currentOrder.courier_name || '',
        tracking_number: currentOrder.tracking_number || '',
      });
    }
    setShowDispatchDialog(true);
  };

  const openShippedDialog = () => {
    if (currentOrder?.lot_number) {
      shippedForm.reset({
        lot_number: currentOrder.lot_number,
      });
    }
    setShowShippedDialog(true);
  };

  const openArrivedDialog = () => {
    if (currentOrder?.shipping_method || currentOrder?.shipping_cost) {
      arrivedForm.reset({
        shipping_method: currentOrder.shipping_method || 'air',
        shipping_cost: currentOrder.shipping_cost?.toString() || '',
      });
    }
    setShowArrivedDialog(true);
  };

  const openTransitDialog = () => {
    if (currentOrder?.bd_courier_tracking) {
      transitForm.reset({
        bd_courier_tracking: currentOrder.bd_courier_tracking,
      });
    }
    setShowTransitDialog(true);
  };

  const openReceiveStockDialog = () => {
    // Reset form with current order data if available
    receiveStockForm.reset({
      additional_cost: currentOrder?.extra_cost_global ? currentOrder.extra_cost_global.toString() : '',
    });
    setShowReceiveStockDialog(true);
  };

  const handleAddToStock = () => {
    if (!currentOrder || !currentOrder.items || currentOrder.items.length === 0) {
      toast({
        title: 'Error',
        description: 'No items found to add to stock',
        variant: 'destructive',
      });
      return;
    }

    console.log('🔄 Add to Stock clicked for order:', currentOrder?.id);
    console.log('🔄 Items to process:', currentOrder.items);

    // Navigate to the first item's receive stock page
    const firstItem = currentOrder.items[0];
    if (firstItem) {
      // Navigate to the newer ReceiveStockNew.tsx file
      navigate(`/inventory/receive/${firstItem.id}`, {
        state: {
          from: `/purchase/${currentOrder.id}`,
          purchaseOrderId: currentOrder.id,
          allItems: currentOrder.items,
          currentIndex: 0
        }
      });
    } else {
      toast({
        title: 'Error',
        description: 'No items found to add to stock',
        variant: 'destructive',
      });
    }
  };

  const handleAddItemToStock = (item: any) => {
    if (!item || !item.id) {
      toast({
        title: 'Error',
        description: 'Invalid item selected',
        variant: 'destructive',
      });
      return;
    }

    if (!currentOrder) {
      toast({
        title: 'Error',
        description: 'Purchase order information not found',
        variant: 'destructive',
      });
      return;
    }

    console.log('🔄 Add Item to Stock clicked for item:', item.id);
    console.log('🔄 Product:', item.product?.base_name);
    console.log('🔄 From order:', currentOrder.id);

    // Find the index of this item in the order items list
    const currentIndex = currentOrder.items?.findIndex((orderItem: any) => orderItem.id === item.id) || 0;

    // Navigate to the specific item's receive stock page
    navigate(`/inventory/receive/${item.id}`, {
      state: {
        from: `/purchase/${currentOrder.id}`,
        purchaseOrderId: currentOrder.id,
        allItems: currentOrder.items || [],
        currentIndex: currentIndex,
        focusedItem: item
      }
    });
  };

  // Function to determine if Actions column should be shown
  const shouldShowActionsColumn = (item?: any) => {
    if (isEditMode) return true;

    // If item is provided, check if Received Qty != Stock Qty
    if (item) {
      const receivedQty = Number(item.received_quantity) || 0;
      const stockedQty = Number(item.stocked_quantity) || 0;
      return receivedQty !== stockedQty;
    }

    // If no item provided, check if any item has different received and stocked quantities
    return currentOrder?.items?.some((item: any) => {
      const receivedQty = Number(item.received_quantity) || 0;
      const stockedQty = Number(item.stocked_quantity) || 0;
      return receivedQty !== stockedQty;
    });
  };

  const getMainActionButton = () => {
    if (!currentOrder) return null;

    const actions: Record<string, { label: string; action: () => void; disabled: boolean }> = {
      draft: { label: 'Confirm Payment', action: () => openPaymentDialog(), disabled: false },
      payment_confirmed: { label: 'Mark as Dispatched', action: () => openDispatchDialog(), disabled: false },
      supplier_dispatched: { label: 'Mark as Warehouse Received', action: () => handleStatusUpdate('warehouse_received'), disabled: false },
      warehouse_received: { label: 'Mark as Shipped BD', action: () => openShippedDialog(), disabled: false },
      shipped_bd: { label: 'Mark as Arrived BD', action: () => openArrivedDialog(), disabled: false },
      arrived_bd: { label: 'Mark as Transit Bogura', action: () => openTransitDialog(), disabled: false },
      in_transit_bogura: { label: 'Receive Stock', action: () => openReceiveStockDialog(), disabled: false },
      received_hub: { label: 'Mark as Completed', action: () => handleStatusUpdate('completed'), disabled: false },
      completed: { label: '', action: () => { }, disabled: true },
      completed_partially: { label: 'Partially Completed', action: () => { }, disabled: true },
      lost: { label: 'Order Lost', action: () => { }, disabled: true },
    };

    return actions[currentOrder.status] || { label: 'Unknown Status', action: () => { }, disabled: true };
  };

  const handleStatusUpdate = async (status: string, payload?: any) => {
    console.log('🔄 handleStatusUpdate called:', { status, payload, currentOrderStatus: currentOrder?.status });
    if (!currentOrder) return;

    const originalStatus = currentOrder.status;

    setProcessing(true);
    try {
      console.log('🔄 About to call updateOrderStatus...');
      await updateOrderStatus(currentOrder.id, status, payload);
      console.log('🔄 updateOrderStatus completed successfully');

      // Check if the store was updated
      const updatedOrder = usePurchaseStore.getState().currentOrder;
      console.log('🔄 Store update check:', {
        originalStatus,
        newStatus: updatedOrder?.status,
        statusChanged: updatedOrder?.status !== originalStatus,
        currentOrderId: currentOrder.id,
        storeOrderId: updatedOrder?.id
      });

      // Status changed - Zustand will automatically trigger re-render
      if (updatedOrder?.status !== originalStatus) {
        console.log('🔄 Status changed - Zustand will trigger automatic re-render');
      }

      toast({
        title: 'Success',
        description: `Order status updated to ${status.replace('_', ' ')}`,
      });
    } catch (error: any) {
      console.error('🔄 Failed to update status:', error);
      console.error('🔄 Error details:', {
        status: error?.response?.status,
        message: error?.response?.data?.message,
        isAuthError: error?.response?.status === 401 || error?.response?.status === 403
      });
      toast({
        title: 'Error',
        description: error.message || 'Failed to update order status',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentSubmit = async (data: PaymentFormData) => {
    console.log('🔄 Payment submit called');
    if (currentOrder?.status === 'draft') {
      // For orders at draft stage, confirm payment and set status
      console.log('🔄 Calling handleStatusUpdate for payment_confirmed');
      await handleStatusUpdate('payment_confirmed', {
        exchange_rate: parseFloat(data.exchange_rate),
      });

      // Recalculate costs when exchange rate changes
      await calculateFinalUnitCost(currentOrder.id);
    } else {
      // For orders already past payment stage, just update the exchange rate without status change
      try {
        setProcessing(true);

        await apiClient.put(`/admin/purchase-orders/${currentOrder.id}`, {
          exchange_rate: parseFloat(data.exchange_rate),
        });

        // Refetch the order to update the store and trigger re-render
        await fetchOrder(currentOrder.id);

        // Recalculate costs when exchange rate changes
        await calculateFinalUnitCost(currentOrder.id);

        toast({
          title: 'Success',
          description: 'Exchange rate updated and costs recalculated',
        });
      } catch (error: any) {
        console.error('Failed to update exchange rate:', error);
        toast({
          title: 'Error',
          description: error?.response?.data?.message || 'Failed to update exchange rate',
          variant: 'destructive',
        });
      } finally {
        setProcessing(false);
      }
    }

    setShowPaymentDialog(false);
    paymentForm.reset();
  };

  const handleDispatchSubmit = async (data: DispatchFormData) => {
    if (currentOrder?.status === 'payment_confirmed') {
      // For orders at payment stage, confirm dispatch and set status
      await handleStatusUpdate('supplier_dispatched', {
        courier_name: data.courier_name,
        tracking_number: data.tracking_number,
      });
    } else {
      // For orders already past dispatch stage, just update courier info without status change
      try {
        setProcessing(true);

        await apiClient.put(`/admin/purchase-orders/${currentOrder.id}`, {
          courier_name: data.courier_name,
          tracking_number: data.tracking_number,
        });

        // Refetch the order to update the store and trigger re-render
        await fetchOrder(currentOrder.id);

        toast({
          title: 'Success',
          description: 'Courier information updated successfully',
        });
      } catch (error: any) {
        console.error('Failed to update courier information:', error);
        toast({
          title: 'Error',
          description: error?.response?.data?.message || 'Failed to update courier information',
          variant: 'destructive',
        });
      } finally {
        setProcessing(false);
      }
    }

    setShowDispatchDialog(false);
    dispatchForm.reset();
  };

  const handleShippedSubmit = async (data: ShippedFormData) => {
    if (currentOrder?.status === 'warehouse_received') {
      // For orders at warehouse stage, confirm shipped and set status
      await handleStatusUpdate('shipped_bd', {
        lot_number: data.lot_number,
      });
    } else {
      // For orders already past shipped stage, just update lot number without status change
      try {
        setProcessing(true);

        await apiClient.put(`/admin/purchase-orders/${currentOrder.id}`, {
          lot_number: data.lot_number,
        });

        // Refetch the order to update the store and trigger re-render
        await fetchOrder(currentOrder.id);

        toast({
          title: 'Success',
          description: 'Lot number updated successfully',
        });
      } catch (error: any) {
        console.error('Failed to update lot number:', error);
        toast({
          title: 'Error',
          description: error?.response?.data?.message || 'Failed to update lot number',
          variant: 'destructive',
        });
      } finally {
        setProcessing(false);
      }
    }

    setShowShippedDialog(false);
    shippedForm.reset();
  };

  const handleArrivedSubmit = async (data: ArrivedFormData) => {
    const hasShippingCost = data.shipping_cost && parseFloat(data.shipping_cost) > 0;

    if (currentOrder?.status === 'shipped_bd') {
      // For orders at shipped stage, confirm arrived and set status
      await handleStatusUpdate('arrived_bd', {
        shipping_method: data.shipping_method,
        shipping_cost: parseFloat(data.shipping_cost),
      });

      // Recalculate costs when shipping cost changes
      if (hasShippingCost) {
        await calculateFinalUnitCost(currentOrder.id);
      }
    } else {
      // For orders already past arrived stage, just update shipping info without status change
      try {
        setProcessing(true);

        await apiClient.put(`/admin/purchase-orders/${currentOrder.id}`, {
          shipping_method: data.shipping_method,
          shipping_cost: data.shipping_cost ? parseFloat(data.shipping_cost) : undefined,
        });

        // Refetch the order to update the store and trigger re-render
        await fetchOrder(currentOrder.id);

        // Recalculate costs when shipping cost changes
        if (hasShippingCost) {
          await calculateFinalUnitCost(currentOrder.id);
        }

        toast({
          title: 'Success',
          description: 'Shipping information updated and costs recalculated',
        });
      } catch (error: any) {
        console.error('Failed to update shipping information:', error);
        toast({
          title: 'Error',
          description: error?.response?.data?.message || 'Failed to update shipping information',
          variant: 'destructive',
        });
      } finally {
        setProcessing(false);
      }
    }

    setShowArrivedDialog(false);
    arrivedForm.reset();
  };

  const handleTransitSubmit = async (data: TransitFormData) => {
    if (currentOrder?.status === 'arrived_bd') {
      // For orders at arrived stage, confirm transit and set status
      await handleStatusUpdate('in_transit_bogura', {
        bd_courier_tracking: data.bd_courier_tracking,
      });
    } else {
      // For orders already past transit stage, just update tracking without status change
      try {
        setProcessing(true);

        await apiClient.put(`/admin/purchase-orders/${currentOrder.id}`, {
          bd_courier_tracking: data.bd_courier_tracking,
        });

        // Refetch the order to update the store and trigger re-render
        await fetchOrder(currentOrder.id);

        toast({
          title: 'Success',
          description: 'BD courier tracking updated successfully',
        });
      } catch (error: any) {
        console.error('Failed to update BD courier tracking:', error);
        toast({
          title: 'Error',
          description: error?.response?.data?.message || 'Failed to update BD courier tracking',
          variant: 'destructive',
        });
      } finally {
        setProcessing(false);
      }
    }

    setShowTransitDialog(false);
    transitForm.reset();
  };

  const updateReceiveItem = (index: number, field: string, value: string) => {
    setReceiveStockItems(items =>
      items.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleReceiveStockSubmit = async (data: ReceiveStockFormData) => {
    if (!currentOrder) return;

    setProcessing(true);
    try {
      // Calculate total weight from all items
      const totalWeight = receiveStockItems.reduce((sum, item) => {
        const unitWeight = parseFloat(item.unit_weight) || 0;
        const extraWeight = parseFloat(item.extra_weight) || 0;
        const quantity = item.quantity;
        return sum + ((unitWeight + extraWeight) * quantity);
      }, 0);

      const hasAdditionalCost = data.additional_cost && parseFloat(data.additional_cost) > 0;

      if (currentOrder.status === 'in_transit_bogura') {
        // First time receiving stock - change status to received_hub
        const payload = {
          total_weight: totalWeight,
          additional_cost: parseFloat(data.additional_cost || '0'),
          items: receiveStockItems.map(item => ({
            po_item_id: item.po_item_id,
            unit_weight: parseFloat(item.unit_weight),
            extra_weight: parseFloat(item.extra_weight || '0'),
            received_quantity: parseFloat(item.received_quantity || '0'),
          })),
        };

        console.log('Receive stock payload:', payload);

        await receiveItems(currentOrder.id, payload);

        // Recalculate costs when weight and additional costs are set
        await calculateFinalUnitCost(currentOrder.id);

        toast({
          title: 'Success',
          description: 'Stock received successfully and costs recalculated.',
        });
      } else {
        // Already received - just update the stock data without status change
        await apiClient.put(`/admin/purchase-orders/${currentOrder.id}`, {
          total_weight: totalWeight,
          extra_cost_global: parseFloat(data.additional_cost || '0'),
          items: receiveStockItems.map(item => ({
            id: item.po_item_id,
            unit_weight: parseFloat(item.unit_weight),
            extra_weight: parseFloat(item.extra_weight || '0'),
            received_quantity: parseFloat(item.received_quantity || '0'),
          })),
        });

        // Refetch the order to update the store and trigger re-render
        await fetchOrder(currentOrder.id);

        // Recalculate costs when weight, extra costs, or received quantities change
        if (hasAdditionalCost || totalWeight > 0) {
          await calculateFinalUnitCost(currentOrder.id);
        }

        toast({
          title: 'Success',
          description: 'Stock information updated and costs recalculated.',
        });
      }

      setShowReceiveStockDialog(false);
      receiveStockForm.reset();

    } catch (error: any) {
      console.error('Failed to update stock information:', error);
      toast({
        title: 'Error',
        description: error?.response?.data?.message || error.message || 'Failed to update stock information',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  // Edit mode functions
  const startEditMode = async () => {
    if (currentOrder?.items) {
      // Set editable items
      setEditableItems(currentOrder.items.map(item => ({
        ...item,
        china_price: Number(item.china_price) || 0,
        quantity: Number(item.quantity) || 1,
      })));

      // Load all supplier products
      try {
        if (currentOrder.supplier_id) {
          console.log('[PurchaseOrderDetails] Current order details:', {
            orderId: currentOrder.id,
            supplierId: currentOrder.supplier_id,
            supplierName: currentOrder.supplier?.shop_name || 'Unknown'
          });
          console.log('[PurchaseOrderDetails] Loading products for supplier ID:', currentOrder.supplier_id);
          await getSupplierProducts(currentOrder.supplier_id);
          console.log('[PurchaseOrderDetails] Supplier products loaded successfully');
        } else {
          console.warn('[PurchaseOrderDetails] No supplier_id found in current order:', currentOrder);
        }
      } catch (error) {
        console.error('[PurchaseOrderDetails] Error loading supplier products:', error);
        console.error('[PurchaseOrderDetails] Order data that caused the error:', {
          orderId: currentOrder?.id,
          supplierId: currentOrder?.supplier_id,
          hasSupplier: !!currentOrder?.supplier
        });
        toast({
          title: 'Warning',
          description: `Could not load products for supplier ID ${currentOrder?.supplier_id}. You can still edit existing items.`,
          variant: 'destructive',
        });
        // Continue with edit mode even if supplier products fail to load
      }

      setIsEditMode(true);
    }
  };

  const cancelEditMode = () => {
    setIsEditMode(false);
    setEditableItems([]);
    setAvailableProducts([]);
  };

  const updateEditableItem = (index: number, field: string, value: string | number) => {
    setEditableItems(items =>
      items.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const removeEditableItem = (index: number) => {
    // Check if this is the last item
    if (editableItems.length <= 1) {
      setShowDeleteAlert(true);
      return;
    }
    setEditableItems(items => items.filter((_, i) => i !== index));
  };

  const addProductToOrder = (product: any) => {
    // Check if product is already in the order (shouldn't happen with our filtering, but safety check)
    if (editableItems.some(item => item.product_id === product.id)) {
      toast({
        title: 'Product Already Added',
        description: 'This product is already in the order',
        variant: 'destructive',
      });
      return;
    }

    // Add new item with default values
    const newItem = {
      id: `new-${Date.now()}`, // Temporary ID for new items
      product_id: product.id,
      product: product,
      china_price: 0,
      quantity: 1,
      is_new: true, // Flag to identify new items
    };

    setEditableItems(prev => [...prev, newItem]);

    // Remove from available products
    setAvailableProducts(prev => prev.filter(p => p.id !== product.id));

    toast({
      title: 'Product Added',
      description: `${product.base_name} has been added to the order`,
    });
  };

  const saveEditedOrder = async () => {
    if (!currentOrder) return;

    try {
      setProcessing(true);

      // Validate editable items before saving
      const validItems = editableItems.filter(item => {
        // Only include items that are not new (have real IDs)
        return !item.is_new && item.id && !item.id.toString().startsWith('new-');
      });

      if (validItems.length === 0) {
        toast({
          title: 'Error',
          description: 'No valid items to update',
          variant: 'destructive',
        });
        return;
      }

      const payload = {
        items: validItems.map(item => ({
          id: item.id,
          china_price: Number(item.china_price),
          quantity: Number(item.quantity),
        })),
      };

      console.log('[PurchaseOrderDetails] Saving order with payload:', payload);
      console.log('[PurchaseOrderDetails] Valid items count:', validItems.length);
      console.log('[PurchaseOrderDetails] Valid items details:', validItems.map(item => ({
        id: item.id,
        id_type: typeof item.id,
        china_price: item.china_price,
        quantity: item.quantity
      })));

      // Call the API to update the order
      await updateOrder(currentOrder.id, payload);

      toast({
        title: 'Success',
        description: 'Order updated successfully',
      });

      setIsEditMode(false);
      setEditableItems([]);
      setAvailableProducts([]);

    } catch (error: any) {
      console.error('Failed to update order:', error);
      toast({
        title: 'Error',
        description: error?.response?.data?.message || error?.response?.data?.error || 'Failed to update order',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  // Get workflow steps dynamically based on order status - real-time update
  const getWorkflowSteps = useCallback(() => {
    if (!currentOrder) return workflowSteps;

    console.log('🔄 getWorkflowSteps recalculating for status:', currentOrder.status);

    // Filter out the completion status that doesn't apply
    return workflowSteps.filter(step => {
      // If order is completed, don't show completed_partially
      if (currentOrder.status === 'completed' && step.key === 'completed_partially') {
        return false;
      }
      // If order is completed_partially, don't show completed
      if (currentOrder.status === 'completed_partially' && step.key === 'completed') {
        return false;
      }
      // If order hasn't reached completion yet, only show 'completed' (not both)
      if (!['completed', 'completed_partially'].includes(currentOrder.status)) {
        return step.key !== 'completed_partially';
      }
      return true;
    });
  }, [currentOrder?.status]);

  const getCurrentStepIndex = useCallback(() => {
    if (!currentOrder) return 0;
    const activeSteps = getWorkflowSteps();
    const index = activeSteps.findIndex(step => step.key === currentOrder.status);
    console.log('🔄 getCurrentStepIndex:', { status: currentOrder.status, index });
    return index;
  }, [currentOrder?.status, getWorkflowSteps]);

  // Loading skeleton that matches the actual page layout
  if (!currentOrder) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
              </div>
              <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                  <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Timeline skeleton */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div className={`h-8 w-8 rounded-full ${i === 0 ? 'bg-blue-200' : 'bg-gray-200'} animate-pulse`} />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                      <div className="space-y-1">
                        <div className="h-2 bg-gray-200 rounded w-full animate-pulse" />
                        <div className="h-2 bg-gray-200 rounded w-2/3 animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order items table skeleton */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
                <div className="h-9 bg-gray-200 rounded w-36 animate-pulse" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <th key={i} className="text-left p-2 pb-3">
                          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b">
                        <td className="p-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                        </td>
                        <td className="p-2">
                          <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                        </td>
                        <td className="p-2">
                          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                        </td>
                        <td className="p-2 text-right">
                          <div className="h-4 bg-gray-200 rounded w-1/2 ml-auto animate-pulse" />
                        </td>
                        <td className="p-2 text-right">
                          <div className="h-4 bg-gray-200 rounded w-1/2 ml-auto animate-pulse" />
                        </td>
                        <td className="p-2 text-right">
                          <div className="h-4 bg-gray-200 rounded w-1/2 ml-auto animate-pulse" />
                        </td>
                        <td className="p-2 text-right">
                          <div className="h-4 bg-gray-200 rounded w-2/3 ml-auto animate-pulse" />
                        </td>
                        <td className="p-2 text-right">
                          <div className="h-4 bg-gray-200 rounded w-1/2 ml-auto animate-pulse" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Force recalculation on every render to ensure timeline updates with store changes
  const mainAction = getMainActionButton();
  const activeWorkflowSteps = getWorkflowSteps();
  const currentStepIndex = getCurrentStepIndex();

  // Check if order is completed (completed or completed_partially)
  const isCompleted = ['completed', 'completed_partially'].includes(currentOrder?.status || '');

  // Debug logging
  console.log('🔄 PurchaseOrderDetails render:', {
    currentOrderId: currentOrder?.id,
    currentOrderStatus: currentOrder?.status,
    currentStepIndex,
    activeSteps: activeWorkflowSteps.map(s => s.key),
    timestamp: new Date().toISOString()
  });

  const showReceivedQty = ['received_hub', 'completed', 'completed_partially'].includes(currentOrder.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3">
                <span>
                  {currentOrder.po_number || `PO-${currentOrder.id}`}
                </span>
                <Badge className={getStatusColor(currentOrder.status)}>
                  {currentOrder.status.replace('_', ' ')}
                </Badge>
              </CardTitle>
              <CardDescription>
                Supplier: {currentOrder.supplier ? (
                  <button
                    onClick={() => navigate(`/purchase/suppliers/${currentOrder.supplier?.id}`)}
                    className="text-blue-600 hover:text-blue-800 hover:underline underline-offset-4 transition-colors"
                  >
                    {currentOrder.supplier.shop_name}
                  </button>
                ) : (
                  'Unknown'
                )}
              </CardDescription>
            </div>
            {!isCompleted && (
              <Button
                onClick={mainAction.action}
                disabled={mainAction.disabled || processing}
              >
                {mainAction.label}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-sm text-gray-500">Total Items</div>
              <div className="text-2xl font-bold">{currentOrder.items?.length || 0}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">Total Amount (RMB)</div>
              <div className="text-2xl font-bold">
                ¥{(currentOrder.items?.reduce((sum, item) => sum + (Number(item.china_price) * Number(item.quantity)), 0) || 0).toFixed(2)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">Total Amount (BDT)</div>
              <div className="text-2xl font-bold">
                {(() => {
                  const totalRMB = currentOrder.items?.reduce((sum, item) => sum + (Number(item.china_price) * Number(item.quantity)), 0) || 0;
                  const exchangeRate = currentOrder.exchange_rate || Number(defaultExchangeRate) || 0;
                  const totalBDT = totalRMB * exchangeRate;

                  return currentOrder.exchange_rate ? (
                    <>
                      ৳{totalBDT.toFixed(2)}
                      <div className="text-xs text-gray-400 font-normal">
                        (¥{totalRMB.toFixed(2)} × ৳{currentOrder.exchange_rate})
                      </div>
                    </>
                  ) : (
                    <>
                      ৳{totalBDT.toFixed(2)}
                      <div className="text-xs text-gray-400 font-normal">
                        (Estimated at ৳{Number(defaultExchangeRate) || 0}/RMB)
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline and Order Items - Side by Side Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Timeline Sidebar */}
        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Order Timeline</CardTitle>
              <CardDescription className="text-xs">Track order progress</CardDescription>
            </CardHeader>
            <CardContent className="px-4">
              {/* Vertical Timeline */}
              <div className="space-y-3">
                {activeWorkflowSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const isCompleted = index < currentStepIndex;
                  const isCompletionStep = step.key === 'completed' || step.key === 'completed_partially';

                  // Get step-specific data
                  let stepData: { label: string; value: string }[] = [];

                  if (isActive) {
                    if (step.key === 'draft') {
                      stepData = [
                        { label: 'Created', value: new Date(currentOrder.created_at).toLocaleString() },
                        ...(isCurrent ? [{ label: 'Updated', value: 'Just now' }] : [])
                      ];
                    }
                    else if (step.key === 'payment_confirmed' && currentOrder.exchange_rate) {
                      stepData = [
                        { label: 'PO Number', value: currentOrder.po_number || 'N/A' },
                        { label: 'Exchange Rate', value: `1 RMB = ৳${currentOrder.exchange_rate}` },
                        { label: 'Updated', value: isCurrent ? 'Just now' : new Date(currentOrder.updated_at).toLocaleString() }
                      ];
                    }
                    else if (step.key === 'supplier_dispatched') {
                      if (currentOrder.courier_name) {
                        stepData = [
                          { label: 'Courier', value: currentOrder.courier_name },
                          { label: 'Tracking #', value: currentOrder.tracking_number || 'N/A' },
                          { label: 'Updated', value: isCurrent || isCompleted ? 'Just now' : new Date(currentOrder.updated_at).toLocaleString() }
                        ];
                      } else if (isActive) {
                        stepData = [
                          { label: 'Status', value: 'Dispatched' },
                          { label: 'Updated', value: isCurrent ? 'Just now' : new Date(currentOrder.updated_at).toLocaleString() }
                        ];
                      }
                    }
                    else if (step.key === 'warehouse_received') {
                      stepData = [
                        { label: 'Status', value: 'Received at Warehouse' },
                        { label: 'Updated', value: isActive ? (isCurrent ? 'Just now' : new Date(currentOrder.updated_at).toLocaleString()) : '' }
                      ].filter(item => item.value !== '');
                    }
                    else if (step.key === 'shipped_bd') {
                      if (currentOrder.lot_number) {
                        stepData = [
                          { label: 'Lot Number', value: currentOrder.lot_number },
                          { label: 'Updated', value: isActive ? (isCurrent ? 'Just now' : new Date(currentOrder.updated_at).toLocaleString()) : '' }
                        ].filter(item => item.value !== '');
                      } else if (isActive) {
                        stepData = [
                          { label: 'Status', value: 'Shipped to Bangladesh' },
                          { label: 'Updated', value: isCurrent ? 'Just now' : new Date(currentOrder.updated_at).toLocaleString() }
                        ];
                      }
                    }
                    else if (step.key === 'arrived_bd') {
                      if (currentOrder.shipping_method) {
                        stepData = [
                          { label: 'Shipping Method', value: currentOrder.shipping_method === 'air' ? 'Air' : 'Sea' },
                          { label: 'Shipping Cost', value: `৳${currentOrder.shipping_cost || 0}` },
                          { label: 'Updated', value: isActive ? (isCurrent ? 'Just now' : new Date(currentOrder.updated_at).toLocaleString()) : '' }
                        ].filter(item => item.value !== '');
                      } else if (isActive) {
                        stepData = [
                          { label: 'Status', value: 'Arrived in Bangladesh' },
                          { label: 'Updated', value: isCurrent ? 'Just now' : new Date(currentOrder.updated_at).toLocaleString() }
                        ];
                      }
                    }
                    else if (step.key === 'in_transit_bogura') {
                      if (currentOrder.bd_courier_tracking) {
                        stepData = [
                          { label: 'BD Tracking', value: currentOrder.bd_courier_tracking },
                          { label: 'Updated', value: isActive ? (isCurrent ? 'Just now' : new Date(currentOrder.updated_at).toLocaleString()) : '' }
                        ].filter(item => item.value !== '');
                      } else if (isActive) {
                        stepData = [
                          { label: 'Status', value: 'In Transit to Bogura' },
                          { label: 'Updated', value: isCurrent ? 'Just now' : new Date(currentOrder.updated_at).toLocaleString() }
                        ];
                      }
                    }
                    else if (step.key === 'received_hub') {
                      // Calculate received quantities summary
                      const totalOrderedQty = currentOrder.items?.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0) || 0;
                      const totalReceivedQty = currentOrder.items?.reduce((sum, item) => sum + (Number(item.received_quantity) || 0), 0) || 0;
                      const itemsWithReceivedQty = currentOrder.items?.filter(item => item.received_quantity && Number(item.received_quantity) > 0) || [];

                      if (isActive) {
                        const weight = Number(currentOrder.total_weight) || 0;
                        const weightInKg = weight >= 1000 ? `${(weight / 1000).toFixed(2)} kg` : `${weight} g`;

                        stepData = [
                          { label: 'Status', value: 'Received at Hub' },
                          ...(totalReceivedQty > 0 ? [
                            { label: 'Total Received', value: `${totalReceivedQty} / ${totalOrderedQty} pcs` },
                            { label: 'Items Updated', value: `${itemsWithReceivedQty.length} of ${currentOrder.items?.length || 0} items` }
                          ] : []),
                          ...(weight > 0 ? [{ label: 'Total Weight', value: weightInKg }] : []),
                          ...(currentOrder.extra_cost_global && Number(currentOrder.extra_cost_global) > 0 ? [
                            { label: 'Extra Cost', value: `৳${currentOrder.extra_cost_global}` }
                          ] : []),
                          { label: 'Updated', value: isCurrent ? 'Just now' : new Date(currentOrder.updated_at).toLocaleString() }
                        ];
                      }
                    }
                    else if (step.key === 'completed' && isCompleted) {
                      stepData = [
                        { label: 'Status', value: 'Completed' },
                        { label: 'Completed', value: new Date(currentOrder.updated_at).toLocaleString() }
                      ];
                    }
                    else if (step.key === 'completed_partially' && isCompleted) {
                      stepData = [
                        { label: 'Status', value: 'Partially Completed' },
                        { label: 'Lost Items', value: 'Yes' },
                        { label: 'Completed', value: new Date(currentOrder.updated_at).toLocaleString() }
                      ];
                    }
                  }

                  return (
                    <div key={step.key} className="relative">
                      <div className="flex items-start gap-2">
                        {/* Icon and vertical line */}
                        <div className="flex flex-col items-center">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 flex-shrink-0 ${step.key === 'completed_partially' && (isCompleted || isCurrent) ? 'border-amber-500 bg-amber-500 text-white' :
                            isCompleted || (isCurrent && isCompletionStep) ? 'border-green-600 bg-green-600 text-white' :
                              isCurrent ? 'border-primary bg-primary text-primary-foreground' :
                                isActive ? 'border-primary bg-primary text-primary-foreground' :
                                  'border-muted-foreground bg-background'
                            }`}>
                            {isCompleted || (isCurrent && isCompletionStep) ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <LoaderCircle className="w-4 h-4" />
                            )}
                          </div>
                          {index < activeWorkflowSteps.length - 1 && (
                            <div className={`w-0.5 h-full min-h-[40px] mt-2 ${step.key === 'completed_partially' && (isCompleted || isCurrent) ? 'bg-amber-500' :
                              isCompleted || (isCurrent && isCompletionStep) ? 'bg-green-600' :
                                isActive && !isCurrent ? 'bg-primary' :
                                  'bg-muted-foreground/30'
                              }`} />
                          )}
                        </div>

                        {/* Step content */}
                        <div className="flex-1 pb-3">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`text-xs font-semibold ${isActive ? 'text-foreground' : 'text-muted-foreground'
                              }`}>
                              {step.label}
                            </h4>
                            {/* Edit button for current step */}
                            {isCurrent && step.key !== 'draft' && step.key !== 'completed' && step.key !== 'completed_partially' && !['completed', 'completed_partially'].includes(currentOrder?.status || '') && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-5 w-5 p-0 text-xs"
                                onClick={() => {
                                  if (step.key === 'payment_confirmed') openPaymentDialog();
                                  else if (step.key === 'supplier_dispatched') openDispatchDialog();
                                  else if (step.key === 'shipped_bd') openShippedDialog();
                                  else if (step.key === 'arrived_bd') openArrivedDialog();
                                  else if (step.key === 'in_transit_bogura') openTransitDialog();
                                  else if (step.key === 'received_hub') openReceiveStockDialog();
                                }}
                                title={`Edit ${step.label}`}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                            )}
                            {/* Quick action buttons for completed steps */}
                            {isCompleted && (step.key === 'payment_confirmed' || step.key === 'supplier_dispatched' || step.key === 'shipped_bd' || step.key === 'arrived_bd' || step.key === 'in_transit_bogura') && !['completed', 'completed_partially'].includes(currentOrder?.status || '') && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-5 w-5 p-0 text-xs"
                                onClick={() => {
                                  if (step.key === 'payment_confirmed') openPaymentDialog();
                                  else if (step.key === 'supplier_dispatched') openDispatchDialog();
                                  else if (step.key === 'shipped_bd') openShippedDialog();
                                  else if (step.key === 'arrived_bd') openArrivedDialog();
                                  else if (step.key === 'in_transit_bogura') openTransitDialog();
                                }}
                                title={`Update ${step.label} details`}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                            )}
                          </div>

                          {/* Step details */}
                          <div className="space-y-1">
                            {stepData.map((data, idx) => (
                              <div key={idx} className="text-xs">
                                <span className="text-muted-foreground">{data.label}:</span>{' '}
                                <span className="font-medium text-foreground">{data.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        <div className="lg:col-span-9">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Order Items</CardTitle>
                  <CardDescription>
                    Total Items: {currentOrder.items?.length || 0}
                  </CardDescription>
                </div>
                {currentOrder.status === 'draft' && !isEditMode && (
                  <Button
                    onClick={() => navigate(`/purchase/${id}/edit`)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Order
                  </Button>
                )}
                {isEditMode && (
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={saveEditedOrder}
                      disabled={processing}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {processing ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                      onClick={cancelEditMode}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        <span>RMB Price</span>
                        <span className="text-xs text-muted-foreground">
                          {currentOrder.exchange_rate ? `1 RMB = ৳${Number(currentOrder.exchange_rate).toFixed(2)}` : '--'}
                        </span>
                      </div>
                    </TableHead>
                    <TableHead>Quantity</TableHead>
                    {hasReceivedQtyData && <TableHead>Received Qty</TableHead>}
                    {hasReceivedQtyData && <TableHead>Stock Qty</TableHead>}
                    {hasWeightData && <TableHead>Weight</TableHead>}
                    {hasExtraWeightData && <TableHead>Extra Weight</TableHead>}
                    <TableHead>
                      <div className="flex items-center gap-2">
                        <span>Subtotal (RMB)</span>
                        <span className="text-xs text-muted-foreground">
                          {currentOrder.exchange_rate ? `1 RMB = ৳${Number(currentOrder.exchange_rate).toFixed(2)}` : '--'}
                        </span>
                      </div>
                    </TableHead>
                    {hasFinalCostData && <TableHead>Unit Cost</TableHead>}
                    {shouldShowActionsColumn() && <TableHead className="text-center">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(isEditMode ? editableItems : currentOrder.items)?.map((item, idx) => {
                    const chinaPrice = Number(item.china_price) || 0;
                    const quantity = Number(item.quantity) || 0;

                    return (
                      <TableRow key={item.id} className={idx % 2 === 1 ? 'bg-muted/40' : ''}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {item.product?.base_thumbnail_url ? (
                              <img
                                src={item.product.base_thumbnail_url}
                                alt={item.product.base_name}
                                className="h-10 w-10 object-cover rounded"
                              />
                            ) : (
                              <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                                <Package className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <div className="font-medium">{item.product?.base_name || 'Unknown Product'}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {isEditMode ? (
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={editableItems[idx]?.china_price || 0}
                              onChange={(e) => updateEditableItem(idx, 'china_price', parseFloat(e.target.value) || 0)}
                              className="w-24"
                            />
                          ) : (
                            <>¥{chinaPrice.toFixed(2)}</>
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditMode ? (
                            <Input
                              type="number"
                              min="1"
                              value={editableItems[idx]?.quantity || 1}
                              onChange={(e) => updateEditableItem(idx, 'quantity', parseInt(e.target.value) || 1)}
                              className="w-20"
                            />
                          ) : (
                            <>{quantity}</>
                          )}
                        </TableCell>
                        {hasReceivedQtyData && (
                          <TableCell className={Number(item.received_quantity) < quantity ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
                            {item.received_quantity ?? '-'}
                          </TableCell>
                        )}
                        {hasReceivedQtyData && (
                          <TableCell className="text-blue-600 font-semibold">
                            {item.stocked_quantity ?? '-'}
                          </TableCell>
                        )}
                        {hasWeightData && <TableCell>{(Number(item.unit_weight || 0)).toFixed(2)} g</TableCell>}
                        {hasExtraWeightData && <TableCell>{(Number(item.extra_weight || 0)).toFixed(2)} g</TableCell>}
                        <TableCell>¥{(chinaPrice * quantity).toFixed(2)}</TableCell>
                        {hasFinalCostData && <TableCell>৳{(Number(item.final_unit_cost || 0)).toFixed(2)}</TableCell>}
                        {shouldShowActionsColumn(item) && (
                          <TableCell className="text-center">
                            {isEditMode ? (
                              <Button
                                onClick={() => removeEditableItem(idx)}
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:border-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button
                                onClick={() => handleAddItemToStock(item)}
                                variant="outline"
                                size="sm"
                                className="text-green-600 hover:text-green-700 hover:border-green-300"
                                title="Add this item to stock"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Add Products Section - Only show in edit mode */}
          {isEditMode && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add More Products
                </CardTitle>
                <CardDescription>
                  Select additional products from this supplier to add to the order
                </CardDescription>
              </CardHeader>
              <CardContent>
                {availableProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableProducts.map((product) => (
                      <div
                        key={product.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => addProductToOrder(product)}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          {product.base_thumbnail_url ? (
                            <img
                              src={product.base_thumbnail_url}
                              alt={product.base_name}
                              className="h-12 w-12 object-cover rounded border"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="h-12 w-12 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{product.base_name}</h4>
                            <p className="text-xs text-gray-500">SKU: {product.sku || 'N/A'}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            addProductToOrder(product);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add to Order
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p className="font-medium mb-1">
                      {supplierProducts.length === 0
                        ? 'No additional products available'
                        : 'All supplier products are already in the order'}
                    </p>
                    <p className="text-sm text-gray-400">
                      {supplierProducts.length === 0
                        ? 'This supplier may not have any products linked in the system, or there was an issue loading them.'
                        : 'You can edit existing items or remove items to add different ones.'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Payment Confirmation Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
            <DialogDescription>
              Enter the exchange rate to confirm payment and generate order number
            </DialogDescription>
          </DialogHeader>
          <Form {...paymentForm}>
            <form onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)} className="space-y-4">
              <FormField
                control={paymentForm.control}
                name="exchange_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exchange Rate (RMB to BDT)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="17.50"
                        defaultValue={defaultExchangeRate}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowPaymentDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing ? 'Processing...' : 'Confirm Payment'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dispatch Dialog */}
      <Dialog open={showDispatchDialog} onOpenChange={setShowDispatchDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Dispatched</DialogTitle>
            <DialogDescription>
              Enter courier information (optional - you can update later)
            </DialogDescription>
          </DialogHeader>
          <Form {...dispatchForm}>
            <form onSubmit={dispatchForm.handleSubmit(handleDispatchSubmit)} className="space-y-4">
              <FormField
                control={dispatchForm.control}
                name="courier_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Courier Name</FormLabel>
                    <FormControl>
                      <Input placeholder="DHL Express" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={dispatchForm.control}
                name="tracking_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tracking Number</FormLabel>
                    <FormControl>
                      <Input placeholder="1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowDispatchDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing ? 'Processing...' : 'Mark as Dispatched'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Shipped BD Dialog */}
      <Dialog open={showShippedDialog} onOpenChange={setShowShippedDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Shipped to Bangladesh</DialogTitle>
            <DialogDescription>
              Enter the lot number for this shipment (optional - you can update later)
            </DialogDescription>
          </DialogHeader>
          <Form {...shippedForm}>
            <form onSubmit={shippedForm.handleSubmit(handleShippedSubmit)} className="space-y-4">
              <FormField
                control={shippedForm.control}
                name="lot_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lot Number</FormLabel>
                    <FormControl>
                      <Input placeholder="LOT-2025-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowShippedDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing ? 'Processing...' : 'Mark as Shipped BD'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Arrived BD Dialog */}
      <Dialog open={showArrivedDialog} onOpenChange={setShowArrivedDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Arrived in Bangladesh</DialogTitle>
            <DialogDescription>
              Enter shipping method and cost (optional - you can update later)
            </DialogDescription>
          </DialogHeader>
          <Form {...arrivedForm}>
            <form onSubmit={arrivedForm.handleSubmit(handleArrivedSubmit)} className="space-y-4">
              <FormField
                control={arrivedForm.control}
                name="shipping_method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select shipping method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="air">Air</SelectItem>
                        <SelectItem value="sea">Sea</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={arrivedForm.control}
                name="shipping_cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Cost (BDT)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="5000.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowArrivedDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing ? 'Processing...' : 'Mark as Arrived'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Transit Bogura Dialog */}
      <Dialog open={showTransitDialog} onOpenChange={setShowTransitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as in Transit to Bogura</DialogTitle>
            <DialogDescription>
              Enter BD courier tracking information (optional - you can update later)
            </DialogDescription>
          </DialogHeader>
          <Form {...transitForm}>
            <form onSubmit={transitForm.handleSubmit(handleTransitSubmit)} className="space-y-4">
              <FormField
                control={transitForm.control}
                name="bd_courier_tracking"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>BD Courier Tracking</FormLabel>
                    <FormControl>
                      <Input placeholder="BD-TRACK-123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowTransitDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing ? 'Processing...' : 'Mark as in Transit'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Receive Stock Dialog */}
      <Dialog open={showReceiveStockDialog} onOpenChange={setShowReceiveStockDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Receive Stock at Hub</DialogTitle>
            <DialogDescription>
              Enter details for each item. Additional cost will be distributed across all units.
            </DialogDescription>
          </DialogHeader>
          <Form {...receiveStockForm}>
            <form onSubmit={receiveStockForm.handleSubmit(handleReceiveStockSubmit)} className="space-y-6">
              {/* Items Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Product</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead>Unit Weight (g)</TableHead>
                      <TableHead>Extra Weight (g)</TableHead>
                      <TableHead>Receive Qty</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receiveStockItems.map((item, index) => (
                      <TableRow key={item.po_item_id}>
                        <TableCell className="font-medium">{item.product_name}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={item.unit_weight}
                            onChange={(e) => updateReceiveItem(index, 'unit_weight', e.target.value)}
                            className="w-24"
                            required
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={item.extra_weight}
                            onChange={(e) => updateReceiveItem(index, 'extra_weight', e.target.value)}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            placeholder={item.quantity.toString()}
                            value={item.received_quantity}
                            onChange={(e) => updateReceiveItem(index, 'received_quantity', e.target.value)}
                            className="w-20"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Summary */}
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Total Weight:</span>{' '}
                    <span>
                      {(() => {
                        const totalWeight = receiveStockItems.reduce((sum, item) => {
                          const unitWeight = parseFloat(item.unit_weight) || 0;
                          const extraWeight = parseFloat(item.extra_weight) || 0;
                          return sum + ((unitWeight + extraWeight) * item.quantity);
                        }, 0);
                        return totalWeight >= 1000 ? `${(totalWeight / 1000).toFixed(2)} kg` : `${totalWeight.toFixed(2)} g`;
                      })()}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Total Received Items:</span>{' '}
                    <span>
                      {receiveStockItems.reduce((sum, item) => sum + (parseFloat(item.received_quantity) || 0), 0)} pcs
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Cost */}
              <FormField
                control={receiveStockForm.control}
                name="additional_cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Cost (BDT) - Will be distributed to all units</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowReceiveStockDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing ? 'Processing...' : 'Receive Stock'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <Dialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cannot Delete Last Item</DialogTitle>
            <DialogDescription>
              An order must have at least one item. You cannot delete all items from the purchase order.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowDeleteAlert(false)}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}