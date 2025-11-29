import { useState, useEffect } from 'react';
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
import { Package, CheckCircle, Circle, Truck, Ship, Home, DollarSign } from 'lucide-react';

import { usePurchaseStore } from '@/stores/purchaseStore';
import { useSettingStore } from '@/stores/settingStore';

// Form types - using type inference from Zod schema

// Workflow steps
const workflowSteps = [
  { key: 'draft', label: 'Draft', icon: Circle },
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
  courier_name: z.string().min(1, 'Courier name is required'),
  tracking_number: z.string().min(1, 'Tracking number is required'),
});

const shippedFormSchema = z.object({
  lot_number: z.string().min(1, 'Lot number is required'),
});

const arrivedFormSchema = z.object({
  shipping_method: z.enum(['air', 'sea'], {
    required_error: 'Shipping method is required',
  }),
  shipping_cost: z.string().min(1, 'Shipping cost is required'),
});

const transitFormSchema = z.object({
  bd_courier_tracking: z.string().min(1, 'BD courier tracking is required'),
});

const receiveStockFormSchema = z.object({
  additional_cost: z.string().optional(),
  items: z.array(z.object({
    po_item_id: z.number(),
    unit_weight: z.string().min(1, 'Unit weight is required'),
    extra_weight: z.string().optional(),
    lost_quantity: z.string().optional(),
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
  const { currentOrder, fetchOrder, updateStatus, updateOrderStatus, receiveItems, isLoading } = usePurchaseStore();
  const { settings } = useSettingStore();

  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showDispatchDialog, setShowDispatchDialog] = useState(false);
  const [showShippedDialog, setShowShippedDialog] = useState(false);
  const [showArrivedDialog, setShowArrivedDialog] = useState(false);
  const [showTransitDialog, setShowTransitDialog] = useState(false);
  const [showReceiveStockDialog, setShowReceiveStockDialog] = useState(false);
  const [processing, setProcessing] = useState(false);

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
    lost_quantity: string;
  }>>([]);

  useEffect(() => {
    if (id) {
      fetchOrder(parseInt(id));
    }
  }, [id, fetchOrder]);

  // Initialize receive items when order is loaded
  useEffect(() => {
    if (currentOrder?.items) {
      setReceiveStockItems(currentOrder.items.map(item => ({
        po_item_id: item.id,
        product_name: item.product?.base_name || 'Unknown Product',
        quantity: item.quantity,
        unit_weight: '',
        extra_weight: '0',
        lost_quantity: '0',
      })));
    }
  }, [currentOrder]);

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

  const getMainActionButton = () => {
    if (!currentOrder) return null;

    const actions: Record<string, { label: string; action: () => void; disabled: boolean }> = {
      draft: { label: 'Confirm Payment', action: () => setShowPaymentDialog(true), disabled: false },
      payment_confirmed: { label: 'Mark as Dispatched', action: () => setShowDispatchDialog(true), disabled: false },
      supplier_dispatched: { label: 'Mark as Warehouse Received', action: () => handleStatusUpdate('warehouse_received'), disabled: false },
      warehouse_received: { label: 'Mark as Shipped BD', action: () => setShowShippedDialog(true), disabled: false },
      shipped_bd: { label: 'Mark as Arrived BD', action: () => setShowArrivedDialog(true), disabled: false },
      arrived_bd: { label: 'Mark as Transit Bogura', action: () => setShowTransitDialog(true), disabled: false },
      in_transit_bogura: { label: 'Receive Stock', action: () => setShowReceiveStockDialog(true), disabled: false },
      received_hub: { label: 'Mark as Completed', action: () => handleStatusUpdate('completed'), disabled: false },
      completed: { label: 'Order Completed', action: () => {}, disabled: true },
      lost: { label: 'Order Lost', action: () => {}, disabled: true },
    };

    return actions[currentOrder.status] || { label: 'Unknown Status', action: () => {}, disabled: true };
  };

  const handleStatusUpdate = async (status: string, payload?: any) => {
    if (!currentOrder) return;

    setProcessing(true);
    try {
      await updateOrderStatus(currentOrder.id, status, payload);
      toast({
        title: 'Success',
        description: `Order status updated to ${status.replace('_', ' ')}`,
      });
    } catch (error: any) {
      console.error('Failed to update status:', error);
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
    await handleStatusUpdate('payment_confirmed', {
      exchange_rate: parseFloat(data.exchange_rate),
    });
    setShowPaymentDialog(false);
    paymentForm.reset();
  };

  const handleDispatchSubmit = async (data: DispatchFormData) => {
    await handleStatusUpdate('supplier_dispatched', {
      courier_name: data.courier_name,
      tracking_number: data.tracking_number,
    });
    setShowDispatchDialog(false);
    dispatchForm.reset();
  };

  const handleShippedSubmit = async (data: ShippedFormData) => {
    await handleStatusUpdate('shipped_bd', {
      lot_number: data.lot_number,
    });
    setShowShippedDialog(false);
    shippedForm.reset();
  };

  const handleArrivedSubmit = async (data: ArrivedFormData) => {
    await handleStatusUpdate('arrived_bd', {
      shipping_method: data.shipping_method,
      shipping_cost: parseFloat(data.shipping_cost),
    });
    setShowArrivedDialog(false);
    arrivedForm.reset();
  };

  const handleTransitSubmit = async (data: TransitFormData) => {
    await handleStatusUpdate('in_transit_bogura', {
      bd_courier_tracking: data.bd_courier_tracking,
    });
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

      // Check if any items are lost
      const hasLostItems = receiveStockItems.some(item => parseFloat(item.lost_quantity || '0') > 0);

      // Prepare payload
      const payload = {
        total_weight: totalWeight,
        extra_cost_global: parseFloat(data.additional_cost || '0'),
        items: receiveStockItems.map(item => ({
          po_item_id: item.po_item_id,
          unit_weight: parseFloat(item.unit_weight),
          extra_weight: parseFloat(item.extra_weight || '0'),
          lost_quantity: parseFloat(item.lost_quantity || '0'),
        })),
        status: hasLostItems ? 'completed_partially' : 'received_hub',
      };

      console.log('Receive stock payload:', payload);

      await receiveItems(currentOrder.id, payload);
      toast({
        title: 'Success',
        description: hasLostItems
          ? 'Stock received with partial loss and marked as partially completed'
          : 'Stock received and inventory updated successfully',
      });
      setShowReceiveStockDialog(false);
      receiveStockForm.reset();
    } catch (error: any) {
      console.error('Failed to receive items:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to receive stock',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const getCurrentStepIndex = () => {
    if (!currentOrder) return 0;
    return workflowSteps.findIndex(step => step.key === currentOrder.status);
  };

  if (isLoading || !currentOrder) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading Purchase Order...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const mainAction = getMainActionButton();
  const currentStepIndex = getCurrentStepIndex();
  const defaultExchangeRate = settings?.exchange_rate || 15;

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
                Supplier: {currentOrder.supplier?.shop_name || 'Unknown'}
              </CardDescription>
            </div>
            <Button
              onClick={mainAction.action}
              disabled={mainAction.disabled || processing}
            >
              {mainAction.label}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Timeline and Order Items - Side by Side Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Timeline Sidebar */}
        <div className="lg:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
              <CardDescription>Track order progress</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Vertical Timeline */}
              <div className="space-y-6">
                {workflowSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const isCompleted = index < currentStepIndex;

                  // Get step-specific data
                  let stepData: { label: string; value: string }[] = [];

                  if (isActive) {
                    if (step.key === 'draft') {
                      stepData = [
                        { label: 'Created', value: new Date(currentOrder.created_at).toLocaleString() }
                      ];
                    }
                    else if (step.key === 'payment_confirmed' && currentOrder.exchange_rate) {
                      stepData = [
                        { label: 'PO Number', value: currentOrder.po_number || 'N/A' },
                        { label: 'Exchange Rate', value: `1 RMB = ৳${currentOrder.exchange_rate}` },
                        { label: 'Updated', value: new Date(currentOrder.updated_at).toLocaleString() }
                      ];
                    }
                    else if (step.key === 'supplier_dispatched' && currentOrder.courier_name) {
                      stepData = [
                        { label: 'Courier', value: currentOrder.courier_name },
                        { label: 'Tracking #', value: currentOrder.tracking_number || 'N/A' },
                        { label: 'Updated', value: new Date(currentOrder.updated_at).toLocaleString() }
                      ];
                    }
                    else if (step.key === 'warehouse_received') {
                      stepData = [
                        { label: 'Status', value: 'Received at Warehouse' },
                        { label: 'Updated', value: new Date(currentOrder.updated_at).toLocaleString() }
                      ];
                    }
                    else if (step.key === 'shipped_bd' && currentOrder.lot_number) {
                      stepData = [
                        { label: 'Lot Number', value: currentOrder.lot_number },
                        { label: 'Updated', value: new Date(currentOrder.updated_at).toLocaleString() }
                      ];
                    }
                    else if (step.key === 'arrived_bd' && currentOrder.shipping_method) {
                      stepData = [
                        { label: 'Shipping Method', value: currentOrder.shipping_method === 'air' ? 'Air' : 'Sea' },
                        { label: 'Shipping Cost', value: `৳${currentOrder.shipping_cost || 0}` },
                        { label: 'Updated', value: new Date(currentOrder.updated_at).toLocaleString() }
                      ];
                    }
                    else if (step.key === 'in_transit_bogura' && currentOrder.bd_courier_tracking) {
                      stepData = [
                        { label: 'BD Tracking', value: currentOrder.bd_courier_tracking },
                        { label: 'Updated', value: new Date(currentOrder.updated_at).toLocaleString() }
                      ];
                    }
                    else if (step.key === 'received_hub' && currentOrder.total_weight) {
                      stepData = [
                        { label: 'Weight', value: `${currentOrder.total_weight} kg` },
                        { label: 'Extra Cost', value: `৳${currentOrder.extra_cost_global || 0}` },
                        { label: 'Updated', value: new Date(currentOrder.updated_at).toLocaleString() }
                      ];
                    }
                    else if (step.key === 'completed' && isCompleted) {
                      stepData = [
                        { label: 'Status', value: 'Completed' },
                        { label: 'Completed', value: new Date(currentOrder.updated_at).toLocaleString() }
                      ];
                    }
                  }

                  return (
                    <div key={step.key} className="relative">
                      <div className="flex items-start gap-3">
                        {/* Icon and vertical line */}
                        <div className="flex flex-col items-center">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 flex-shrink-0 ${
                            isCompleted ? 'border-green-600 bg-green-600 text-white' :
                            isCurrent ? 'border-primary bg-primary text-primary-foreground' :
                            isActive ? 'border-primary bg-primary text-primary-foreground' :
                            'border-muted-foreground bg-background'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <Icon className="w-5 h-5" />
                            )}
                          </div>
                          {index < workflowSteps.length - 1 && (
                            <div className={`w-0.5 h-full min-h-[60px] mt-2 ${
                              isCompleted ? 'bg-green-600' :
                              isActive && !isCurrent ? 'bg-primary' :
                              'bg-muted-foreground/30'
                            }`} />
                          )}
                        </div>

                        {/* Step content */}
                        <div className="flex-1 pb-6">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className={`text-sm font-semibold ${
                              isActive ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                              {step.label}
                            </h4>
                            {isCurrent && (
                              <Badge variant="default" className="text-xs">Current</Badge>
                            )}
                          </div>

                          {/* Step details */}
                          {stepData.length > 0 && (
                            <div className="space-y-1">
                              {stepData.map((data, idx) => (
                                <div key={idx} className="text-xs">
                                  <span className="text-muted-foreground">{data.label}:</span>{' '}
                                  <span className="font-medium text-foreground">{data.value}</span>
                                </div>
                              ))}
                            </div>
                          )}
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
        <div className="lg:col-span-8">
          <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
          <CardDescription>
            Total Items: {currentOrder.items?.length || 0}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>RMB Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Subtotal (RMB)</TableHead>
                {(currentOrder.status === 'arrived_bd' || ['in_transit_bogura', 'received_hub', 'completed'].includes(currentOrder.status)) && (
                  <TableHead>Shipping Cost</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOrder.items?.map((item) => {
                const chinaPrice = parseFloat(item.china_price) || 0;
                const quantity = parseInt(item.quantity) || 0;
                const shippingCost = parseFloat(item.shipping_cost) || 0;

                return (
                  <TableRow key={item.id}>
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
                    <TableCell>¥{chinaPrice.toFixed(2)}</TableCell>
                    <TableCell>{quantity}</TableCell>
                    <TableCell>¥{(chinaPrice * quantity).toFixed(2)}</TableCell>
                    {(currentOrder.status === 'arrived_bd' || ['in_transit_bogura', 'received_hub', 'completed'].includes(currentOrder.status)) && (
                      <TableCell>${shippingCost.toFixed(2)}</TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
          </Card>
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
                        placeholder="15.00"
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
              Enter courier information
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
              Enter the lot number for this shipment
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
              Enter shipping method and cost
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
              Enter BD courier tracking information
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
                      <TableHead>Unit Weight (kg)</TableHead>
                      <TableHead>Extra Weight (kg)</TableHead>
                      <TableHead>Lost Qty</TableHead>
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
                            max={item.quantity}
                            placeholder="0"
                            value={item.lost_quantity}
                            onChange={(e) => updateReceiveItem(index, 'lost_quantity', e.target.value)}
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
                      {receiveStockItems.reduce((sum, item) => {
                        const unitWeight = parseFloat(item.unit_weight) || 0;
                        const extraWeight = parseFloat(item.extra_weight) || 0;
                        return sum + ((unitWeight + extraWeight) * item.quantity);
                      }, 0).toFixed(2)} kg
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Total Lost Items:</span>{' '}
                    <span>
                      {receiveStockItems.reduce((sum, item) => sum + (parseFloat(item.lost_quantity) || 0), 0)} pcs
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
    </div>
  );
}