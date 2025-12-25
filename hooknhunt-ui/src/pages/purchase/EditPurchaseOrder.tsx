import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { Plus, Trash2, Package, ShoppingCart, Image as ImageIcon, ArrowLeft } from 'lucide-react';

import { usePurchaseStore } from '@/stores/purchaseStore';
import { useSettingStore, useSetting } from '@/stores/settingStore';
import apiClient from '@/lib/apiClient';

// Types
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
  is_existing?: boolean; // To track existing items vs new items
  purchase_order_item_id?: number; // ID for existing items
}

const formSchema = z.object({
  supplier_id: z.string().min(1, 'Supplier is required'),
});

type FormData = z.infer<typeof formSchema>;

export function EditPurchaseOrder() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentOrder,
    fetchPurchaseOrder,
    updateOrder,
    isLoading: orderLoading
  } = usePurchaseStore();

  // State for all supplier products
  const [supplierProducts, setSupplierProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Fetch all products from the supplier
  const fetchSupplierProducts = async (supplierId: number) => {
    setLoadingProducts(true);
    try {
      const response = await apiClient.get(`/admin/suppliers/${supplierId}/products`);
      setSupplierProducts(response.data.products || []);
    } catch (error: any) {
      console.error('Failed to fetch supplier products:', error);
      toast({
        title: t('editPurchaseOrder.error'),
        description: t('editPurchaseOrder.failedToLoadProducts'),
        variant: 'destructive',
      });
    } finally {
      setLoadingProducts(false);
    }
  };
  const { fetchSettings } = useSettingStore();
  const exchangeRateSetting = useSetting('exchange_rate_rmb_bdt');

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [exchangeRate, setExchangeRate] = useState(15);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplier_id: '',
    },
  });

  // Fetch order details and settings on mount
  useEffect(() => {
    if (id) {
      loadOrderData(parseInt(id));
    }
    fetchSettings();
  }, [id, fetchSettings]);

  // Update exchange rate when settings are loaded
  useEffect(() => {
    if (exchangeRateSetting) {
      setExchangeRate(parseFloat(exchangeRateSetting));
    }
  }, [exchangeRateSetting]);

  // Load order data and populate form
  const loadOrderData = async (orderId: number) => {
    setIsLoading(true);
    try {
      await fetchPurchaseOrder(orderId);
    } catch (error) {
      console.error('Failed to load order:', error);
      toast({
        title: t('editPurchaseOrder.error'),
        description: t('editPurchaseOrder.failedToLoadOrder'),
        variant: 'destructive',
      });
      navigate('/purchase/list');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize order items when currentOrder is loaded
  useEffect(() => {
    if (currentOrder && currentOrder.items) {
      // Populate form with supplier info
      form.setValue('supplier_id', currentOrder.supplier_id.toString());

      // Fetch all products from the supplier
      fetchSupplierProducts(currentOrder.supplier_id);

      // Map existing order items for tracking
      const existingItems: OrderItem[] = currentOrder.items.map(item => ({
        id: `existing-${item.id}`,
        product_id: item.product_id,
        product: item.product || { id: item.product_id, base_name: t('editPurchaseOrder.unknownProduct') },
        selected: true,
        china_price: item.china_price,
        quantity: item.quantity,
        is_existing: true,
        purchase_order_item_id: item.id,
      }));

      setOrderItems(existingItems);
    }
  }, [currentOrder, form]);

  // Debug: Log the state to understand what's happening
  useEffect(() => {
    console.log('orderItems:', orderItems);
    console.log('supplierProducts:', supplierProducts);
    console.log('loadingProducts:', loadingProducts);
  }, [orderItems, supplierProducts, loadingProducts]);

  const toggleProductSelection = (productId: number) => {
    setOrderItems(items => {
      const existingItem = items.find(item => item.product_id === productId);

      if (existingItem) {
        // Toggle existing item
        return items.map(item =>
          item.product_id === productId
            ? { ...item, selected: !item.selected }
            : item
        );
      } else {
        // Add new item to the order
        const product = supplierProducts.find(p => p.id === productId);
        if (product) {
          return [...items, {
            id: `new-${productId}`,
            product_id: productId,
            product,
            selected: true,
            china_price: 0, // Default price
            quantity: 1, // Default quantity
            is_existing: false,
            purchase_order_item_id: undefined,
          }];
        }
      }

      return items;
    });
  };

  const updateOrderItem = (productId: number, field: 'china_price' | 'quantity', value: number) => {
    setOrderItems(items =>
      items.map(item => {
        if (item.product_id === productId) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const removeOrderItem = (productId: number) => {
    setOrderItems(items => {
      // Only allow removal of newly added items (not existing order items)
      const itemToRemove = items.find(item => item.product_id === productId);
      if (itemToRemove && !itemToRemove.is_existing) {
        return items.filter(item => item.product_id !== productId);
      }
      // For existing items, just uncheck them instead of removing
      return items.map(item =>
        item.product_id === productId ? { ...item, selected: false } : item
      );
    });
  };

  const calculateTotalRMB = () => {
    return orderItems
      .filter(item => item.selected)
      .reduce((total, item) => total + (item.china_price * item.quantity), 0);
  };

  const calculateTotalBDT = () => {
    return calculateTotalRMB() * exchangeRate;
  };

  const calculateTotalQuantity = () => {
    return orderItems
      .filter(item => item.selected)
      .reduce((total, item) => total + item.quantity, 0);
  };

  const onSubmit = async (data: FormData) => {
    if (!currentOrder || !id) return;

    const selectedItems = orderItems.filter(item => item.selected);

    if (selectedItems.length === 0) {
      toast({
        title: t('editPurchaseOrder.noItemsSelected'),
        description: t('editPurchaseOrder.noItemsSelectedDescription'),
        variant: 'destructive',
      });
      return;
    }

    const invalidItems = selectedItems.filter(item =>
      item.china_price <= 0 || item.quantity <= 0
    );

    if (invalidItems.length > 0) {
      toast({
        title: t('editPurchaseOrder.invalidItems'),
        description: t('editPurchaseOrder.invalidItemsDescription'),
        variant: 'destructive',
      });
      return;
    }

    try {
      // Prepare payload for updating order
      const payload: any = {
        supplier_id: parseInt(data.supplier_id),
        items: selectedItems.map(item => ({
          id: item.purchase_order_item_id, // Include ID for existing items
          product_id: item.product_id,
          china_price: item.china_price,
          quantity: item.quantity,
        })),
      };

      // Only include items_to_remove if there are items to remove
      const itemsToRemove = orderItems
        .filter(item => !item.selected && item.is_existing)
        .map(item => item.purchase_order_item_id);

      if (itemsToRemove.length > 0) {
        payload.items_to_remove = itemsToRemove;
      }

      // Update the order
      await updateOrder(parseInt(id), payload);

      toast({
        title: t('editPurchaseOrder.success'),
        description: t('editPurchaseOrder.successDescription'),
      });

      navigate('/purchase/list');
    } catch (error: any) {
      console.error('Failed to update purchase order:', error);
      // Error handling is done in the store
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              {t('editPurchaseOrder.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">{t('editPurchaseOrder.purchaseOrderNotFound')}</p>
              <Button onClick={() => navigate('/purchase/list')} className="mt-4">
                {t('editPurchaseOrder.backToOrders')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentOrder.status !== 'draft') {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                {t('editPurchaseOrder.onlyDraftsCanBeEdited', { status: currentOrder.status })}
              </p>
              <Button onClick={() => navigate('/purchase/list')} className="mt-4">
                {t('editPurchaseOrder.backToOrders')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/purchase/list')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('editPurchaseOrder.back')}
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t('editPurchaseOrder.title')} {currentOrder.po_number}
            </h1>
            <p className="text-gray-600">{t('editPurchaseOrder.description')}</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            {t('editPurchaseOrder.title')}
          </CardTitle>
          <CardDescription>
            {t('editPurchaseOrder.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Supplier Information */}
              <FormField
                control={form.control}
                name="supplier_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('editPurchaseOrder.supplier')}</FormLabel>
                    <Input
                      {...field}
                      value={currentOrder.supplier?.shop_name || t('editPurchaseOrder.unknownSupplier')}
                      disabled
                      className="bg-gray-50"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              {/* Order Items */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{t('editPurchaseOrder.orderItems')}</h3>
                  {(currentOrder.status as string) === 'completed' && (
                    <Button
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        // TODO: Navigate to add to stock page or open modal
                        toast({
                          title: 'Add to Stock',
                          description: 'Add to Stock functionality will be implemented',
                        });
                      }}
                    >
                      Add to Stock
                    </Button>
                  )}
                </div>

                <Card>
                  <CardContent className="pt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">
                            {currentOrder.status === 'draft' ? t('editPurchaseOrder.select') : ''}
                          </TableHead>
                          <TableHead>{t('editPurchaseOrder.imageAndName')}</TableHead>
                          <TableHead>{t('editPurchaseOrder.rmbPrice')}</TableHead>
                          <TableHead>{t('editPurchaseOrder.quantity')}</TableHead>
                          <TableHead className="text-right">{t('editPurchaseOrder.subtotal')}</TableHead>
                          {(currentOrder.status as string) === 'completed' && (
                            <TableHead className="w-[100px]">{t('editPurchaseOrder.actions')}</TableHead>
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loadingProducts ? (
                          <TableRow>
                            <TableCell
                              colSpan={(currentOrder.status as string) === 'completed' ? 5 : 5}
                              className="text-center py-8"
                            >
                              <div className="flex items-center justify-center gap-2">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
                                <span className="text-gray-500">{t('editPurchaseOrder.loadingSupplierProducts')}</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : currentOrder.status === 'draft' ? (
                          // Draft status - show all supplier products with checkboxes
                          supplierProducts.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-8">
                                <Package className="h-12 w-12 mx-auto mb-2 opacity-30" />
                                <p className="text-gray-500">{t('editPurchaseOrder.noProductsFound')}</p>
                              </TableCell>
                            </TableRow>
                          ) : (
                            supplierProducts.map((product) => {
                              const orderItem = orderItems.find(item => item.product_id === product.id);
                              const isSelected = orderItem?.selected || false;
                              const isNewItem = orderItem && !orderItem.is_existing;

                              return (
                                <TableRow key={product.id}>
                                  <TableCell>
                                    <Checkbox
                                      checked={isSelected}
                                      onCheckedChange={() => toggleProductSelection(product.id)}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-3">
                                      {product.base_thumbnail_url ? (
                                        <img
                                          src={product.base_thumbnail_url}
                                          alt={product.base_name || t('editPurchaseOrder.product')}
                                          className="h-10 w-10 object-cover rounded border"
                                          onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                          }}
                                        />
                                      ) : (
                                        <div className="h-10 w-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                                          <ImageIcon className="h-4 w-4 text-gray-400" />
                                        </div>
                                      )}
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium">{product.base_name || t('editPurchaseOrder.unknownProduct')}</span>
                                        {isNewItem && isSelected && (
                                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                                            {t('editPurchaseOrder.new')}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {isSelected ? (
                                      <Input
                                        type="number"
                                        step="0.5"
                                        min="0"
                                        value={orderItem?.china_price || 0}
                                        onChange={(e) =>
                                          updateOrderItem(product.id, 'china_price', parseFloat(e.target.value) || 0)
                                        }
                                        className="w-24"
                                        placeholder="0.00"
                                      />
                                    ) : (
                                      <div className="w-24 h-9 bg-gray-50 rounded border border-gray-200"></div>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {isSelected ? (
                                      <Input
                                        type="number"
                                        min="1"
                                        value={orderItem?.quantity || 1}
                                        onChange={(e) =>
                                          updateOrderItem(product.id, 'quantity', parseInt(e.target.value) || 1)
                                        }
                                        className="w-20"
                                      />
                                    ) : (
                                      <div className="w-20 h-9 bg-gray-50 rounded border border-gray-200"></div>
                                    )}
                                  </TableCell>
                                  <TableCell className="font-medium text-right">
                                    {isSelected ? (
                                      <div>
                                        ¥{((orderItem?.china_price || 0) * (orderItem?.quantity || 1)).toFixed(2)}
                                        <div className="text-xs text-gray-500 font-normal">
                                          ৳{(((orderItem?.china_price || 0) * (orderItem?.quantity || 1)) * exchangeRate).toFixed(0)}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="text-gray-400">—</div>
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })
                          )
                        ) : (
                          // Non-draft status - show only order items without checkboxes
                          currentOrder.items && currentOrder.items.length > 0 ? (
                            currentOrder.items.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell></TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    {item.product?.base_thumbnail_url ? (
                                      <img
                                        src={item.product.base_thumbnail_url}
                                        alt={item.product?.base_name || t('editPurchaseOrder.product')}
                                        className="h-10 w-10 object-cover rounded border"
                                        onError={(e) => {
                                          e.currentTarget.style.display = 'none';
                                        }}
                                      />
                                    ) : (
                                      <div className="h-10 w-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                                        <ImageIcon className="h-4 w-4 text-gray-400" />
                                      </div>
                                    )}
                                    <span className="font-medium">{item.product?.base_name || t('editPurchaseOrder.unknownProduct')}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="w-24 px-3 py-2 bg-gray-50 rounded border border-gray-200">
                                    ¥{item.china_price.toFixed(2)}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="w-20 px-3 py-2 bg-gray-50 rounded border border-gray-200">
                                    {item.quantity}
                                  </div>
                                </TableCell>
                                <TableCell className="font-medium text-right">
                                  <div>
                                    ¥{(item.china_price * item.quantity).toFixed(2)}
                                    <div className="text-xs text-gray-500 font-normal">
                                      ৳{((item.china_price * item.quantity) * exchangeRate).toFixed(0)}
                                    </div>
                                  </div>
                                </TableCell>
                                {(currentOrder.status as string) === 'completed' && (
                                  <TableCell>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        toast({
                                          title: 'Add to Stock',
                                          description: `Add ${item.product?.base_name} to stock`,
                                        });
                                      }}
                                    >
                                      Add to Stock
                                    </Button>
                                  </TableCell>
                                )}
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={currentOrder.status === 'completed' ? 6 : 5} className="text-center py-8">
                                <Package className="h-12 w-12 mx-auto mb-2 opacity-30" />
                                <p className="text-gray-500">No items in this order</p>
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>

                    <Separator className="my-4" />

                    {/* Footer */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          {t('editPurchaseOrder.totalQuantity', { quantity: calculateTotalQuantity() })}
                        </div>
                        <div className="text-lg font-semibold">
                          {t('editPurchaseOrder.total', { total: calculateTotalRMB().toFixed(2) })}
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t">
                        <div className="text-sm text-muted-foreground">
                          {t('editPurchaseOrder.totalExchangeRate', { exchangeRate })}
                        </div>
                        <div className="text-lg font-semibold text-green-600">
                          {t('editPurchaseOrder.approx', { total: calculateTotalBDT().toFixed(2) })}
                        </div>
                      </div>
                    </div>

                    {currentOrder.status === 'draft' && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {t('editPurchaseOrder.uncheckToRemove')}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {currentOrder.status === 'draft' && (
                <>
                  <Separator />

                  {/* Submit Buttons */}
                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/purchase/list')}
                    >
                      {t('editPurchaseOrder.cancel')}
                    </Button>
                    <Button
                      type="submit"
                      disabled={orderLoading || calculateTotalQuantity() === 0}
                      className="min-w-[120px]"
                    >
                      {orderLoading ? t('editPurchaseOrder.updating') : t('editPurchaseOrder.updateOrder')}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}