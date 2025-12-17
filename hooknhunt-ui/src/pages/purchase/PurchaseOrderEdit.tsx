import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, Save, X, Plus, Trash2, Package, Calculator } from 'lucide-react';

import { useSupplierStore } from '@/stores/supplierStore';
import { usePurchaseStore } from '@/stores/purchaseStore';
import { useSettingStore, useSetting } from '@/stores/settingStore';
import { RoleGuard } from '@/components/guards/RoleGuard';

// Types
interface OrderItem {
  id: string;
  product_id: number;
  product: any;
  selected: boolean;
  china_price: number;
  quantity: number;
  approx_bdt: number;
}

interface Supplier {
  id: number;
  shop_name: string;
  email?: string;
}

// Validation schema
const formSchema = z.object({
  supplier_id: z.string().min(1, 'Please select a supplier'),
});

type FormData = z.infer<typeof formSchema>;

export function PurchaseOrderEdit() {
  return (
    <RoleGuard allowedRoles={['super_admin', 'admin', 'store_keeper']}>
      <PurchaseOrderEditContent />
    </RoleGuard>
  );
}

function PurchaseOrderEditContent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentOrder, fetchOrder, updateOrder, isLoading } = usePurchaseStore();
  const { suppliers, fetchSuppliers, getSupplierProducts, supplierProducts, isLoading: supplierLoading } = useSupplierStore();
  const { fetchSettings } = useSettingStore();
  const exchangeRateSetting = useSetting('exchange_rate_rmb_bdt');

  const [processing, setProcessing] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [exchangeRate, setExchangeRate] = useState(15); // Default exchange rate
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // Fetch data on mount
  useEffect(() => {
    if (id) {
      fetchOrder(parseInt(id));
    }
    fetchSuppliers();
    fetchSettings();
  }, [id, fetchOrder, fetchSuppliers, fetchSettings]);

  // Update exchange rate when settings are loaded
  useEffect(() => {
    if (exchangeRateSetting) {
      setExchangeRate(parseFloat(exchangeRateSetting));
    }
  }, [exchangeRateSetting]);

  // Initialize form and load existing data
  useEffect(() => {
    if (currentOrder && suppliers.length > 0) {
      // Set form values
      form.setValue('supplier_id', currentOrder.supplier_id?.toString() || '');
      setSelectedSupplierId(currentOrder.supplier_id);

      // Set order items
      if (currentOrder.items) {
        const items: OrderItem[] = currentOrder.items.map((item, index) => ({
          id: item.id.toString(),
          product_id: item.product_id,
          product: item.product,
          selected: true,
          china_price: Number(item.china_price) || 0,
          quantity: Number(item.quantity) || 1,
          approx_bdt: (Number(item.china_price) * Number(item.quantity) * exchangeRate) || 0,
        }));
        setOrderItems(items);
      }

      // Load supplier products for the current supplier
      if (currentOrder.supplier_id) {
        loadSupplierProducts(currentOrder.supplier_id);
      }
    }
  }, [currentOrder, suppliers, form, exchangeRate]);

  // Load supplier products
  const loadSupplierProducts = async (supplierId: number) => {
    try {
      await getSupplierProducts(supplierId);
      console.log('[PurchaseOrderEdit] Supplier products loaded for supplier:', supplierId);
    } catch (error) {
      console.error('[PurchaseOrderEdit] Error loading supplier products:', error);
      toast({
        title: 'Warning',
        description: 'Could not load supplier products',
        variant: 'destructive',
      });
    }
  };

  
  
  // Update order item
  const updateOrderItem = (index: number, field: 'china_price' | 'quantity', value: number) => {
    setOrderItems(items =>
      items.map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item, [field]: value };
          // Recalculate approx BDT
          updatedItem.approx_bdt = updatedItem.china_price * updatedItem.quantity * exchangeRate;
          return updatedItem;
        }
        return item;
      })
    );
  };

  
  // Calculate totals
  const calculateTotal = () => {
    return orderItems
      .reduce((total, item) => total + item.approx_bdt, 0);
  };

  const calculateTotalRMB = () => {
    return orderItems
      .reduce((total, item) => total + (item.china_price * item.quantity), 0);
  };

  const calculateTotalQuantity = () => {
    return orderItems
      .reduce((total, item) => total + item.quantity, 0);
  };

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    if (orderItems.length === 0) {
      toast({
        title: 'No Items in Order',
        description: 'Please select at least one product to update the order',
        variant: 'destructive',
      });
      return;
    }

    // Validate that all items have valid price and quantity
    const invalidItems = orderItems.filter(item =>
      item.china_price <= 0 || item.quantity <= 0
    );

    if (invalidItems.length > 0) {
      toast({
        title: 'Invalid Items',
        description: 'Please ensure all items have valid price and quantity',
        variant: 'destructive',
      });
      return;
    }

    try {
      setProcessing(true);

      const payload = {
        supplier_id: parseInt(data.supplier_id),
        items: orderItems.map((item) => ({
          id: item.id.startsWith('new-') ? null : parseInt(item.id),
          product_id: item.product_id,
          china_price: item.china_price,
          quantity: item.quantity,
        })),
      };

      // Update the order items
      await updateOrder(parseInt(id!), payload);

      toast({
        title: 'Success',
        description: 'Purchase order updated successfully',
      });

      navigate(`/purchase/${id}`);

    } catch (error: any) {
      console.error('Failed to update purchase order:', error);
      toast({
        title: 'Error',
        description: error?.response?.data?.message || error?.response?.data?.error || 'Failed to update purchase order',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Loading Purchase Order
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/purchase/${id}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Order
        </Button>
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Package className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Purchase Order</h1>
            <p className="text-sm text-gray-600">
              Order {currentOrder?.po_number || `#${id}`}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
          <CardDescription>
            Update supplier and items for this purchase order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Supplier Display (Disabled) */}
              <FormField
                control={form.control}
                name="supplier_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier</FormLabel>
                    <Select disabled value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-gray-50">
                          <SelectValue placeholder="Loading supplier..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id.toString()}>
                            {supplier.shop_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500 mt-1">Supplier cannot be changed for existing orders</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Order Items */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Order Items</h3>

                {selectedSupplierId && (
                  <Card>
                    <CardContent className="pt-6">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]">Include</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>RMB Price</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Approx BDT</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {/* All Supplier Products */}
                          {supplierProducts.map((product) => {
                            const existingItem = orderItems.find(item => item.product_id === product.id);
                            const index = orderItems.findIndex(item => item.product_id === product.id);
                            const isInOrder = existingItem !== undefined;

                            return (
                              <TableRow key={product.id}>
                                <TableCell>
                                  <Checkbox
                                    checked={isInOrder}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        // Add to order if not already there
                                        if (!isInOrder) {
                                          const newItem: OrderItem = {
                                            id: `new-${Date.now()}-${product.id}`,
                                            product_id: product.id,
                                            product: product,
                                            selected: true,
                                            china_price: 0,
                                            quantity: 1,
                                            approx_bdt: 0,
                                          };
                                          setOrderItems(prev => [...prev, newItem]);
                                        }
                                      } else {
                                        // Remove from order
                                        if (isInOrder && index !== -1) {
                                          setOrderItems(prev => prev.filter((_, i) => i !== index));
                                        }
                                      }
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    {product.base_thumbnail_url ? (
                                      <img
                                        src={product.base_thumbnail_url}
                                        alt={product.base_name}
                                        className="h-10 w-10 object-cover rounded border"
                                        onError={(e) => {
                                          e.currentTarget.style.display = 'none';
                                        }}
                                      />
                                    ) : (
                                      <div className="h-10 w-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                                        <Package className="h-4 w-4 text-gray-400" />
                                      </div>
                                    )}
                                    <span className="font-medium">{product.base_name}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {isInOrder ? (
                                    <Input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      value={existingItem.china_price}
                                      onChange={(e) =>
                                        updateOrderItem(index, 'china_price', parseFloat(e.target.value) || 0)
                                      }
                                      className="w-24"
                                      placeholder="0.00"
                                    />
                                  ) : (
                                    <div className="w-24 h-10 bg-gray-50 rounded border border-gray-200 flex items-center justify-center text-gray-400">
                                      0.00
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {isInOrder ? (
                                    <Input
                                      type="number"
                                      min="1"
                                      value={existingItem.quantity}
                                      onChange={(e) =>
                                        updateOrderItem(index, 'quantity', parseInt(e.target.value) || 1)
                                      }
                                      className="w-20"
                                    />
                                  ) : (
                                    <div className="w-20 h-10 bg-gray-50 rounded border border-gray-200 flex items-center justify-center text-gray-400">
                                      0
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell className="font-medium">
                                  {isInOrder ? (
                                    <div>
                                      ৳{existingItem.approx_bdt.toFixed(2)}
                                      <div className="text-xs text-muted-foreground">
                                        (¥{(existingItem.china_price * existingItem.quantity).toFixed(2)} RMB)
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-gray-400">
                                      <div>৳0.00</div>
                                      <div className="text-xs">(¥0.00 RMB)</div>
                                    </div>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Summary */}
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-muted-foreground">
                  Total Qty: {calculateTotalQuantity()} |
                  Exchange Rate: 1 RMB = {exchangeRate} BDT
                </div>
                <div className="text-lg font-semibold text-right">
                  <div>
                    Total Est. BDT: ৳{calculateTotal().toFixed(2)}
                  </div>
                  <div className="text-sm font-normal text-muted-foreground">
                    (¥{calculateTotalRMB().toFixed(2)} RMB)
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={processing || !selectedSupplierId || calculateTotalQuantity() === 0}
                  className="min-w-[120px]"
                >
                  {processing ? 'Saving...' : 'Update Order'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}