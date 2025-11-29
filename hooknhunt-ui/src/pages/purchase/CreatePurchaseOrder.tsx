import { useState, useEffect } from 'react';
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
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { Plus, Trash2, Package, Calculator, ShoppingCart, Image as ImageIcon } from 'lucide-react';

import { useSupplierStore } from '@/stores/supplierStore';
import { usePurchaseStore } from '@/stores/purchaseStore';
import { useSettingStore } from '@/stores/settingStore';

// Types
interface Supplier {
  id: number;
  shop_name: string;
  email?: string;
}

interface Product {
  id: number;
  base_name: string;
  base_thumbnail_url?: string | null;
}

interface OrderItem {
  id: string;
  product_id: number;
  product: Product;
  selected: boolean;
  china_price: number;
  quantity: number;
  approx_bdt: number;
}

// Validation schema
const formSchema = z.object({
  supplier_id: z.string().min(1, 'Please select a supplier'),
});

type FormData = z.infer<typeof formSchema>;

export function CreatePurchaseOrder() {
  const { suppliers, fetchSuppliers, getSupplierProducts, supplierProducts, isLoading: supplierLoading } = useSupplierStore();
  const { createDraft, isLoading: purchaseLoading } = usePurchaseStore();
  const { fetchSettings, getSetting } = useSettingStore();

  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [exchangeRate, setExchangeRate] = useState(15); // Default exchange rate

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // Fetch suppliers and settings on mount
  useEffect(() => {
    fetchSuppliers();
    fetchSettings();
  }, [fetchSuppliers, fetchSettings]);

  // Update exchange rate when settings are loaded
  useEffect(() => {
    const rate = getSetting('exchange_rate');
    if (rate) {
      setExchangeRate(parseFloat(rate));
    }
  }, [getSetting]);

  // Fetch products when supplier is selected
  useEffect(() => {
    if (selectedSupplier) {
      console.log('[CreatePurchaseOrder] Fetching products for supplier:', selectedSupplier);
      getSupplierProducts(selectedSupplier).then(() => {
        console.log('[CreatePurchaseOrder] Products fetched successfully');
      }).catch((error) => {
        console.error('[CreatePurchaseOrder] Error fetching products:', error);
      });
    } else {
      console.log('[CreatePurchaseOrder] No supplier selected, clearing order items');
      setOrderItems([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSupplier]);

  const handleSupplierChange = async (value: string) => {
    const supplierId = parseInt(value);
    setSelectedSupplier(supplierId);
    form.setValue('supplier_id', value);
  };

  const toggleProductSelection = (productId: number) => {
    setOrderItems(items =>
      items.map(item =>
        item.product_id === productId
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };

  const updateOrderItem = (productId: number, field: 'china_price' | 'quantity', value: number) => {
    setOrderItems(items =>
      items.map(item => {
        if (item.product_id === productId) {
          const updatedItem = { ...item, [field]: value };
          // Recalculate approx BDT
          updatedItem.approx_bdt = updatedItem.china_price * updatedItem.quantity * exchangeRate;
          return updatedItem;
        }
        return item;
      })
    );
  };

  const calculateTotal = () => {
    return orderItems
      .filter(item => item.selected)
      .reduce((total, item) => total + item.approx_bdt, 0);
  };

  const calculateTotalQuantity = () => {
    return orderItems
      .filter(item => item.selected)
      .reduce((total, item) => total + item.quantity, 0);
  };

  const onSubmit = async (data: FormData) => {
    const selectedItems = orderItems.filter(item => item.selected);

    if (selectedItems.length === 0) {
      toast({
        title: 'No Items Selected',
        description: 'Please select at least one product to order',
        variant: 'destructive',
      });
      return;
    }

    // Validate that all selected items have valid price and quantity
    const invalidItems = selectedItems.filter(item =>
      item.china_price <= 0 || item.quantity <= 0
    );

    if (invalidItems.length > 0) {
      toast({
        title: 'Invalid Items',
        description: 'Please ensure all selected items have valid price and quantity',
        variant: 'destructive',
      });
      return;
    }

    try {
      const payload = {
        supplier_id: parseInt(data.supplier_id),
        items: selectedItems.map(item => ({
          product_id: item.product_id,
          product_variant_id: null, // Will be set during receiving stage
          china_price: item.china_price,
          quantity: item.quantity,
        })),
      };

      await createDraft(payload);

      toast({
        title: 'Success',
        description: 'Purchase order draft created successfully',
      });

    } catch (error: any) {
      console.error('Failed to create purchase order:', error);
      // Error handling is done in the store
    }
  };

  // Initialize order items when supplier products are loaded
  useEffect(() => {
    console.log('[CreatePurchaseOrder] supplierProducts changed:', {
      selectedSupplier,
      supplierProductsLength: supplierProducts.length,
      supplierProducts: supplierProducts
    });

    if (selectedSupplier && supplierProducts.length > 0) {
      console.log('[CreatePurchaseOrder] Mapping products to order items');
      const initialOrderItems: OrderItem[] = supplierProducts.map(product => {
        console.log('[CreatePurchaseOrder] Mapping product:', product);
        return {
          id: `${product.id}`,
          product_id: product.id,
          product: product,
          selected: false,
          china_price: 0,
          quantity: 1,
          approx_bdt: 0,
        };
      });
      console.log('[CreatePurchaseOrder] Setting order items:', initialOrderItems);
      setOrderItems(initialOrderItems);
    } else if (selectedSupplier) {
      console.log('[CreatePurchaseOrder] Supplier selected but no products available');
    }
  }, [supplierProducts, selectedSupplier]);

  const isLoading = supplierLoading || purchaseLoading;

  // Debug: Log current state
  console.log('[CreatePurchaseOrder] Current State:', {
    selectedSupplier,
    orderItems,
    orderItemsLength: orderItems.length,
    supplierProducts,
    supplierProductsLength: supplierProducts.length,
    isLoading,
    supplierLoading,
    purchaseLoading
  });

  if (isLoading && suppliers.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Create Purchase Order
            </CardTitle>
            <CardDescription>
              Create a new purchase order by selecting a supplier and adding products
            </CardDescription>
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Create Purchase Order
          </CardTitle>
          <CardDescription>
            Create a new purchase order by selecting a supplier and adding products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Supplier Selection */}
              <FormField
                control={form.control}
                name="supplier_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier</FormLabel>
                    <Select onValueChange={handleSupplierChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a supplier" />
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              {/* Order Items */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Invoice Items</h3>

                {!selectedSupplier ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center text-muted-foreground">
                        <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Please select a supplier to view available products</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]">Select</TableHead>
                            <TableHead>Image & Name</TableHead>
                            <TableHead>RMB Price</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Approx BDT</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {/* Loading State */}
                          {supplierLoading && (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-8">
                                <div className="flex items-center justify-center gap-2">
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                                  <span className="text-gray-500">Loading products...</span>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}

                          {/* Empty State */}
                          {!supplierLoading && orderItems.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-8">
                                <Package className="h-12 w-12 mx-auto mb-2 opacity-30" />
                                <p className="text-gray-500">
                                  No products found for this supplier.
                                  <br />
                                  <span className="text-xs">Products may not be linked to this supplier in the database.</span>
                                </p>
                              </TableCell>
                            </TableRow>
                          )}

                          {/* Data State - Render Products */}
                          {!supplierLoading && orderItems.length > 0 && orderItems.map((item, index) => (
                            <TableRow key={item.id || `item-${index}`}>
                              <TableCell>
                                <Checkbox
                                  checked={item.selected}
                                  onCheckedChange={() => toggleProductSelection(item.product_id)}
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  {item.product?.base_thumbnail_url ? (
                                    <img
                                      src={item.product.base_thumbnail_url}
                                      alt={item.product?.base_name || 'Product'}
                                      className="h-10 w-10 object-cover rounded border"
                                      onError={(e) => {
                                        console.error('[CreatePurchaseOrder] Image load error:', item.product.base_thumbnail_url);
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                  ) : (
                                    <div className="h-10 w-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                                      <ImageIcon className="h-4 w-4 text-gray-400" />
                                    </div>
                                  )}
                                  <span className="font-medium">{item.product?.base_name || 'Unknown Product'}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={item.china_price}
                                  onChange={(e) =>
                                    updateOrderItem(item.product_id, 'china_price', parseFloat(e.target.value) || 0)
                                  }
                                  className="w-24"
                                  placeholder="0.00"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    updateOrderItem(item.product_id, 'quantity', parseInt(e.target.value) || 1)
                                  }
                                  className="w-20"
                                />
                              </TableCell>
                              <TableCell className="font-medium">
                                ৳{item.approx_bdt.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      <Separator className="my-4" />

                      {/* Footer */}
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          Total Qty: {calculateTotalQuantity()} |
                          Exchange Rate: 1 RMB = {exchangeRate} BDT
                        </div>
                        <div className="text-lg font-semibold">
                          Total Est. BDT: ৳{calculateTotal().toFixed(2)}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mt-2">
                        * Select products with checkboxes and enter quantities to create the purchase order
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              <Separator />

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={purchaseLoading || !selectedSupplier || calculateTotalQuantity() === 0}
                  className="min-w-[120px]"
                >
                  {purchaseLoading ? 'Saving...' : 'Save Draft'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}