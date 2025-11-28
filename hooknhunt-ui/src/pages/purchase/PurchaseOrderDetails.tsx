import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { Plus, Trash2, Package, ChevronRight, CheckCircle, Circle, Truck, Ship, Home, Clock, DollarSign } from 'lucide-react';

import { usePurchaseStore } from '@/stores/purchaseStore';
import { useSettingStore } from '@/stores/settingStore';

// Types
interface ProductVariant {
  id: number;
  sku?: string;
  retail_name?: string;
  wholesale_name?: string;
}

interface OrderItemWithVariants {
  po_item_id: number;
  product_id: number;
  product: any;
  china_price: number;
  quantity: number;
  shipping_cost: number;
  lost_quantity: number;
  received_variants: Array<{
    variant_id: number;
    quantity: number;
    variant?: ProductVariant;
  }>;
}

// Form types - using type inference from Zod schema

// Workflow steps
const workflowSteps = [
  { key: 'draft', label: 'Draft', icon: Circle },
  { key: 'payment_confirmed', label: 'Payment', icon: DollarSign },
  { key: 'supplier_dispatched', label: 'Dispatched', icon: Truck },
  { key: 'shipped_bd', label: 'Shipped BD', icon: Ship },
  { key: 'arrived_bd', label: 'Arrived BD', icon: Home },
  { key: 'in_transit_bogura', label: 'Transit Bogura', icon: Truck },
  { key: 'received_hub', label: 'Received', icon: Package },
  { key: 'completed', label: 'Completed', icon: CheckCircle },
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

const transitFormSchema = z.object({
  bd_courier_tracking: z.string().min(1, 'BD courier tracking is required'),
});

const receiveStockFormSchema = z.object({
  total_weight: z.string().optional(),
  extra_cost_global: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentFormSchema>;
type DispatchFormData = z.infer<typeof dispatchFormSchema>;
type ShippedFormData = z.infer<typeof shippedFormSchema>;
type TransitFormData = z.infer<typeof transitFormSchema>;
type ReceiveStockFormData = z.infer<typeof receiveStockFormSchema>;

export function PurchaseOrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentOrder, fetchOrder, updateStatus, receiveItems, isLoading } = usePurchaseStore();
  const { settings } = useSettingStore();

  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showDispatchDialog, setShowDispatchDialog] = useState(false);
  const [showShippedDialog, setShowShippedDialog] = useState(false);
  const [showTransitDialog, setShowTransitDialog] = useState(false);
  const [showReceiveStockDialog, setShowReceiveStockDialog] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Forms
  const paymentForm = useForm<PaymentFormData>({ resolver: zodResolver(paymentFormSchema) });
  const dispatchForm = useForm<DispatchFormData>({ resolver: zodResolver(dispatchFormSchema) });
  const shippedForm = useForm<ShippedFormData>({ resolver: zodResolver(shippedFormSchema) });
  const transitForm = useForm<TransitFormData>({ resolver: zodResolver(transitFormSchema) });
  const receiveStockForm = useForm<ReceiveStockFormData>({ resolver: zodResolver(receiveStockFormSchema) });

  // Receive stock form state
  const [receiveStockItems, setReceiveStockItems] = useState<OrderItemWithVariants[]>([]);

  useEffect(() => {
    if (id) {
      fetchOrder(parseInt(id));
    }
  }, [id, fetchOrder]);

  useEffect(() => {
    if (currentOrder?.items) {
      const initialItems: OrderItemWithVariants[] = currentOrder.items.map(item => ({
        po_item_id: item.id,
        product_id: item.product_id,
        product: item.product,
        china_price: item.china_price,
        quantity: item.quantity,
        shipping_cost: item.shipping_cost || 0,
        lost_quantity: 0,
        received_variants: [],
      }));
      setReceiveStockItems(initialItems);
    }
  }, [currentOrder]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      payment_confirmed: 'bg-blue-100 text-blue-800',
      supplier_dispatched: 'bg-yellow-100 text-yellow-800',
      shipped_bd: 'bg-orange-100 text-orange-800',
      arrived_bd: 'bg-purple-100 text-purple-800',
      in_transit_bogura: 'bg-indigo-100 text-indigo-800',
      received_hub: 'bg-green-100 text-green-800',
      completed: 'bg-green-600 text-white',
      lost: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getMainActionButton = () => {
    if (!currentOrder) return null;

    const actions: Record<string, { label: string; action: () => void; disabled: boolean }> = {
      draft: { label: 'Confirm Payment', action: () => setShowPaymentDialog(true), disabled: false },
      payment_confirmed: { label: 'Mark as Dispatched', action: () => setShowDispatchDialog(true), disabled: false },
      supplier_dispatched: { label: 'Mark as Shipped BD', action: () => setShowShippedDialog(true), disabled: false },
      shipped_bd: { label: 'Mark as Arrived BD', action: () => handleStatusUpdate('arrived_bd'), disabled: false },
      arrived_bd: { label: 'Mark as Transit Bogura', action: () => setShowTransitDialog(true), disabled: false },
      in_transit_bogura: { label: 'Receive Stock', action: () => setShowReceiveStockDialog(true), disabled: false },
      received_hub: { label: 'Mark as Completed', action: () => handleStatusUpdate('completed'), disabled: false },
      completed: { label: 'Order Completed', action: () => {}, disabled: true },
      lost: { label: 'Order Lost', action: () => {}, disabled: true },
    };

    return actions[currentOrder.status] || { label: 'Unknown Status', action: () => {}, disabled: true };
  };

  const handleStatusUpdate = async (status: string, data?: any) => {
    if (!currentOrder) return;

    setProcessing(true);
    try {
      await updateStatus(currentOrder.id, status, data);
      toast({
        title: 'Success',
        description: `Order status updated to ${status.replace('_', ' ')}`,
      });
    } catch (error: any) {
      console.error('Failed to update status:', error);
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

  const handleTransitSubmit = async (data: TransitFormData) => {
    await handleStatusUpdate('in_transit_bogura', {
      bd_courier_tracking: data.bd_courier_tracking,
    });
    setShowTransitDialog(false);
    transitForm.reset();
  };

  const addVariantRow = (itemIndex: number) => {
    setReceiveStockItems(items =>
      items.map((item, index) =>
        index === itemIndex
          ? {
              ...item,
              received_variants: [...item.received_variants, { variant_id: 0, quantity: 1 }],
            }
          : item
      )
    );
  };

  const updateVariantRow = (itemIndex: number, variantIndex: number, field: 'variant_id' | 'quantity', value: any) => {
    setReceiveStockItems(items =>
      items.map((item, i) =>
        i === itemIndex
          ? {
              ...item,
              received_variants: item.received_variants.map((variant, vi) =>
                vi === variantIndex
                  ? { ...variant, [field]: field === 'quantity' ? parseInt(value) || 0 : value }
                  : variant
              ),
            }
          : item
      )
    );
  };

  const removeVariantRow = (itemIndex: number, variantIndex: number) => {
    setReceiveStockItems(items =>
      items.map((item, index) =>
        index === itemIndex
          ? {
              ...item,
              received_variants: item.received_variants.filter((_, vi) => vi !== variantIndex),
            }
          : item
      )
    );
  };

  const updateLostQuantity = (itemIndex: number, value: number) => {
    setReceiveStockItems(items =>
      items.map((item, index) =>
        index === itemIndex ? { ...item, lost_quantity: Math.max(0, value) } : item
      )
    );
  };

  const updateShippingCost = (itemIndex: number, value: number) => {
    setReceiveStockItems(items =>
      items.map((item, index) =>
        index === itemIndex ? { ...item, shipping_cost: Math.max(0, value) } : item
      )
    );
  };

  const validateReceiveStock = () => {
    let isValid = true;
    const errors: string[] = [];

    for (const item of receiveStockItems) {
      const totalVariantQuantity = item.received_variants.reduce((sum, v) => sum + v.quantity, 0);
      const totalQuantity = totalVariantQuantity + item.lost_quantity;

      if (totalQuantity !== item.quantity) {
        isValid = false;
        errors.push(`Item "${item.product?.base_name}" quantities don't add up`);
      }

      if (item.received_variants.length > 0) {
        for (const variant of item.received_variants) {
          if (variant.variant_id === 0) {
            isValid = false;
            errors.push(`Please select a variant for all rows`);
            break;
          }
        }
      }
    }

    return { isValid, errors };
  };

  const handleReceiveStockSubmit = async (data: ReceiveStockFormData) => {
    if (!currentOrder) return;

    const validation = validateReceiveStock();
    if (!validation.isValid) {
      toast({
        title: 'Validation Error',
        description: validation.errors.join(', '),
        variant: 'destructive',
      });
      return;
    }

    setProcessing(true);
    try {
      const payload = {
        total_weight: data.total_weight ? parseFloat(data.total_weight) : undefined,
        extra_cost_global: data.extra_cost_global ? parseFloat(data.extra_cost_global) : undefined,
        items: receiveStockItems.map(item => ({
          po_item_id: item.po_item_id,
          shipping_cost: item.shipping_cost,
          lost_quantity: item.lost_quantity,
          received_variants: item.received_variants.map(v => ({
            variant_id: v.variant_id,
            quantity: v.quantity,
          })),
        })),
      };

      await receiveItems(currentOrder.id, payload);
      toast({
        title: 'Success',
        description: 'Stock received and inventory updated successfully',
      });
      setShowReceiveStockDialog(false);
      receiveStockForm.reset();
    } catch (error: any) {
      console.error('Failed to receive items:', error);
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
                  {currentOrder.order_number || `PO-${currentOrder.id}`}
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

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Order Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={step.key} className="flex items-center">
                  <div className={`flex flex-col items-center ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      isActive ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium mt-1 whitespace-nowrap">{step.label}</span>
                  </div>
                  {index < workflowSteps.length - 1 && (
                    <ChevronRight className={`w-4 h-4 mx-2 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
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
              {currentOrder.items?.map((item) => (
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
                        <div className="font-medium">{item.product?.base_name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>¥{item.china_price.toFixed(2)}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>¥{(item.china_price * item.quantity).toFixed(2)}</TableCell>
                  {(currentOrder.status === 'arrived_bd' || ['in_transit_bogura', 'received_hub', 'completed'].includes(currentOrder.status)) && (
                    <TableCell>${(item.shipping_cost || 0).toFixed(2)}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Receive Stock</DialogTitle>
            <DialogDescription>
              Split products into variants and add to inventory
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {receiveStockItems.map((item, itemIndex) => (
              <Card key={item.po_item_id}>
                <CardHeader>
                  <CardTitle className="text-lg">{item.product?.base_name}</CardTitle>
                  <CardDescription>
                    Ordered: {item.quantity} pcs | RMB Price: ¥{item.china_price.toFixed(2)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Shipping Cost */}
                  <div>
                    <label className="text-sm font-medium">Shipping Cost (USD)</label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.shipping_cost}
                      onChange={(e) => updateShippingCost(itemIndex, parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>

                  {/* Lost Quantity */}
                  <div>
                    <label className="text-sm font-medium">Lost Quantity</label>
                    <Input
                      type="number"
                      min="0"
                      max={item.quantity}
                      value={item.lost_quantity}
                      onChange={(e) => updateLostQuantity(itemIndex, parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>

                  {/* Variant Rows */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">Received Variants</label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addVariantRow(itemIndex)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Variant
                      </Button>
                    </div>

                    {item.received_variants.map((variant, variantIndex) => (
                      <div key={variantIndex} className="flex gap-2 items-center">
                        <Select
                          value={variant.variant_id.toString()}
                          onValueChange={(value) => updateVariantRow(itemIndex, variantIndex, 'variant_id', parseInt(value))}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select variant" />
                          </SelectTrigger>
                          <SelectContent>
                            {/* This would need to be populated with actual variants */}
                            <SelectItem value="1">Red-M</SelectItem>
                            <SelectItem value="2">Red-L</SelectItem>
                            <SelectItem value="3">Blue-M</SelectItem>
                            <SelectItem value="4">Blue-L</SelectItem>
                          </SelectContent>
                        </Select>

                        <Input
                          type="number"
                          min="1"
                          value={variant.quantity}
                          onChange={(e) => updateVariantRow(itemIndex, variantIndex, 'quantity', parseInt(e.target.value) || 0)}
                          placeholder="Qty"
                          className="w-20"
                        />

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeVariantRow(itemIndex, variantIndex)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Validation Summary */}
                  <div className="text-sm text-muted-foreground">
                    Total: {item.received_variants.reduce((sum, v) => sum + v.quantity, 0)} pcs + {item.lost_quantity} pcs lost = {(item.received_variants.reduce((sum, v) => sum + v.quantity, 0) + item.lost_quantity)} pcs (Expected: {item.quantity} pcs)
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Global fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Total Weight (kg)</label>
                <Input type="number" step="0.01" min="0" placeholder="0.00" />
              </div>
              <div>
                <label className="text-sm font-medium">Extra Cost (BDT)</label>
                <Input type="number" step="0.01" min="0" placeholder="0.00" />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowReceiveStockDialog(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={receiveStockForm.handleSubmit(handleReceiveStockSubmit)} disabled={processing}>
              {processing ? 'Processing...' : 'Finalize & Add to Inventory'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}