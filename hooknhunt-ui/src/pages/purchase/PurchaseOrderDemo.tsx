import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import {
  ChevronRight,
  CheckCircle,
  Circle,
  Truck,
  Ship,
  Home,
  Package,
  DollarSign,
  ArrowLeft
} from 'lucide-react';

// Mock Data
const mockOrder = {
  id: 1,
  po_number: null,
  supplier: {
    id: 1,
    shop_name: 'Shanghai Electronics Co.',
    email: 'contact@shanghai-elec.com',
  },
  status: 'draft',
  exchange_rate: 17.50,
  courier_name: null,
  tracking_number: null,
  lot_number: null,
  bd_courier_tracking: null,
  total_weight: null,
  extra_cost_global: null,
  created_at: '2025-11-28T10:00:00Z',
  updated_at: '2025-11-28T10:00:00Z',
  items: [
    {
      id: 1,
      product: {
        id: 1,
        base_name: 'Wireless Mouse',
        base_thumbnail_url: null,
      },
      china_price: 45.00,
      quantity: 100,
      shipping_cost: 0,
      lost_quantity: 0,
    },
    {
      id: 2,
      product: {
        id: 2,
        base_name: 'USB Cable',
        base_thumbnail_url: null,
      },
      china_price: 12.50,
      quantity: 200,
      shipping_cost: 0,
      lost_quantity: 0,
    },
  ],
};

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

const receiveFormSchema = z.object({
  total_weight: z.string().optional(),
  extra_cost_global: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentFormSchema>;
type DispatchFormData = z.infer<typeof dispatchFormSchema>;
type ShippedFormData = z.infer<typeof shippedFormSchema>;
type TransitFormData = z.infer<typeof transitFormSchema>;
type ReceiveFormData = z.infer<typeof receiveFormSchema>;

export function PurchaseOrderDemo() {
  const [order, setOrder] = useState(mockOrder);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showDispatchDialog, setShowDispatchDialog] = useState(false);
  const [showShippedDialog, setShowShippedDialog] = useState(false);
  const [showTransitDialog, setShowTransitDialog] = useState(false);
  const [showReceiveDialog, setShowReceiveDialog] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Forms
  const paymentForm = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: { exchange_rate: '17.50' }
  });
  const dispatchForm = useForm<DispatchFormData>({ resolver: zodResolver(dispatchFormSchema) });
  const shippedForm = useForm<ShippedFormData>({ resolver: zodResolver(shippedFormSchema) });
  const transitForm = useForm<TransitFormData>({ resolver: zodResolver(transitFormSchema) });
  const receiveForm = useForm<ReceiveFormData>({ resolver: zodResolver(receiveFormSchema) });

  const currentStepIndex = workflowSteps.findIndex(step => step.key === order.status);

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
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getMainActionButton = () => {
    const actions: Record<string, { label: string; action: () => void; disabled: boolean }> = {
      draft: { label: 'Confirm Payment', action: () => setShowPaymentDialog(true), disabled: false },
      payment_confirmed: { label: 'Mark as Dispatched', action: () => setShowDispatchDialog(true), disabled: false },
      supplier_dispatched: { label: 'Mark as Shipped to BD', action: () => setShowShippedDialog(true), disabled: false },
      shipped_bd: { label: 'Mark as Arrived in BD', action: () => handleStatusUpdate('arrived_bd'), disabled: false },
      arrived_bd: { label: 'Mark as Transit to Bogura', action: () => setShowTransitDialog(true), disabled: false },
      in_transit_bogura: { label: 'Receive at Hub', action: () => setShowReceiveDialog(true), disabled: false },
      received_hub: { label: 'Mark as Completed', action: () => handleStatusUpdate('completed'), disabled: false },
      completed: { label: 'Order Completed', action: () => {}, disabled: true },
    };

    return actions[order.status] || { label: 'Unknown Status', action: () => {}, disabled: true };
  };

  const handleStatusUpdate = async (status: string, data?: any) => {
    setProcessing(true);

    // Simulate API call
    setTimeout(() => {
      const updatedOrder = { ...order, status, ...data };

      // Auto-generate PO number when payment confirmed
      if (status === 'payment_confirmed' && !updatedOrder.po_number) {
        const yearMonth = new Date().toISOString().slice(0, 7).replace('-', '');
        updatedOrder.po_number = `PO-${yearMonth}-${order.id}`;
        updatedOrder.updated_at = new Date().toISOString();
      }

      setOrder(updatedOrder);
      setProcessing(false);

      toast({
        title: 'Success',
        description: `Order status updated to ${status.replace('_', ' ')}`,
      });
    }, 1000);
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

  const handleReceiveSubmit = async (data: ReceiveFormData) => {
    await handleStatusUpdate('received_hub', {
      total_weight: data.total_weight ? parseFloat(data.total_weight) : null,
      extra_cost_global: data.extra_cost_global ? parseFloat(data.extra_cost_global) : null,
    });
    setShowReceiveDialog(false);
    receiveForm.reset();
  };

  const actionButton = getMainActionButton();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {order.po_number || 'Draft Purchase Order'}
            </h1>
            <p className="text-muted-foreground">
              Supplier: {order.supplier.shop_name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={getStatusColor(order.status)}>
            {order.status.replace('_', ' ').toUpperCase()}
          </Badge>
          <Button
            onClick={actionButton.action}
            disabled={actionButton.disabled || processing}
          >
            {processing ? 'Processing...' : actionButton.label}
          </Button>
        </div>
      </div>

      {/* Order Info */}
      <Card>
        <CardHeader>
          <CardTitle>Order Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">PO Number</div>
            <div className="font-medium">{order.po_number || 'Not Generated'}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Exchange Rate</div>
            <div className="font-medium">1 RMB = ৳{order.exchange_rate}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Created At</div>
            <div className="font-medium">{new Date(order.created_at).toLocaleDateString()}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Last Updated</div>
            <div className="font-medium">{new Date(order.updated_at).toLocaleDateString()}</div>
          </div>
          {order.courier_name && (
            <div>
              <div className="text-sm text-muted-foreground">International Courier</div>
              <div className="font-medium">{order.courier_name}</div>
            </div>
          )}
          {order.tracking_number && (
            <div>
              <div className="text-sm text-muted-foreground">Tracking Number</div>
              <div className="font-medium">{order.tracking_number}</div>
            </div>
          )}
          {order.lot_number && (
            <div>
              <div className="text-sm text-muted-foreground">Lot Number</div>
              <div className="font-medium">{order.lot_number}</div>
            </div>
          )}
          {order.bd_courier_tracking && (
            <div>
              <div className="text-sm text-muted-foreground">BD Courier Tracking</div>
              <div className="font-medium">{order.bd_courier_tracking}</div>
            </div>
          )}
        </CardContent>
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
            Total Items: {order.items.length}
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                        <Package className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="font-medium">{item.product.base_name}</div>
                    </div>
                  </TableCell>
                  <TableCell>¥{item.china_price.toFixed(2)}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>¥{(item.china_price * item.quantity).toFixed(2)}</TableCell>
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
              Enter the exchange rate to confirm payment
            </DialogDescription>
          </DialogHeader>
          <Form {...paymentForm}>
            <form onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)} className="space-y-4">
              <FormField
                control={paymentForm.control}
                name="exchange_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exchange Rate (1 RMB = ? BDT)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="17.50" {...field} />
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
                  {processing ? 'Confirming...' : 'Confirm Payment'}
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
            <DialogTitle>Supplier Dispatched</DialogTitle>
            <DialogDescription>
              Enter courier details for international shipping
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
                      <Input placeholder="DHL, FedEx, etc." {...field} />
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
                      <Input placeholder="Enter tracking number" {...field} />
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
                  {processing ? 'Saving...' : 'Save'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Shipped to BD Dialog */}
      <Dialog open={showShippedDialog} onOpenChange={setShowShippedDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Shipped to Bangladesh</DialogTitle>
            <DialogDescription>
              Enter lot number for Bangladesh shipment
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
                      <Input placeholder="Enter lot number" {...field} />
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
                  {processing ? 'Saving...' : 'Save'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Transit to Bogura Dialog */}
      <Dialog open={showTransitDialog} onOpenChange={setShowTransitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>In Transit to Bogura</DialogTitle>
            <DialogDescription>
              Enter Bangladesh courier tracking number
            </DialogDescription>
          </DialogHeader>
          <Form {...transitForm}>
            <form onSubmit={transitForm.handleSubmit(handleTransitSubmit)} className="space-y-4">
              <FormField
                control={transitForm.control}
                name="bd_courier_tracking"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>BD Courier Tracking Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter tracking number" {...field} />
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
                  {processing ? 'Saving...' : 'Save'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Receive at Hub Dialog */}
      <Dialog open={showReceiveDialog} onOpenChange={setShowReceiveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Receive at Bogura Hub</DialogTitle>
            <DialogDescription>
              Enter weight and additional costs
            </DialogDescription>
          </DialogHeader>
          <Form {...receiveForm}>
            <form onSubmit={receiveForm.handleSubmit(handleReceiveSubmit)} className="space-y-4">
              <FormField
                control={receiveForm.control}
                name="total_weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={receiveForm.control}
                name="extra_cost_global"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Extra Cost (BDT)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowReceiveDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing ? 'Saving...' : 'Receive Items'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
