import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Calendar, Building, Eye, Truck, Package, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import api from '@/lib/api';

// Define the PurchaseOrder interface
interface PurchaseOrder {
  id: number;
  po_number?: string;
  supplier_id: number;
  status: string;
  exchange_rate?: number;
  shipping_method?: 'air' | 'sea';
  shipping_cost?: number;
  extra_cost_global?: number;
  total_amount?: number;
  created_at: string;
  updated_at: string;
  items?: Array<{
    id: number;
    china_price: number;
    quantity: number;
    product?: {
      base_name: string;
    };
  }>;
}

export function SupplierPurchaseHistory() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [supplier, setSupplier] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch supplier purchase orders
  useEffect(() => {
    if (id) {
      fetchSupplierPurchaseHistory();
    }
  }, [id]);

  const fetchSupplierPurchaseHistory = async () => {
    if (!id) return;

    try {
      setIsLoading(true);

      // Fetch supplier details for header
      const supplierResponse = await api.get(`/admin/suppliers/${id}`);
      setSupplier(supplierResponse.data);

      // Fetch all purchase orders and filter by supplier
      const purchaseResponse = await api.get('/admin/purchase-orders');
      const allOrders = purchaseResponse.data.data || purchaseResponse.data || [];
      const supplierOrders = Array.isArray(allOrders)
        ? allOrders.filter(order => order.supplier_id === parseInt(id))
        : [];
      setPurchaseOrders(supplierOrders);
    } catch (error: any) {
      console.error('❌ Error fetching supplier purchase history:', error);
      toast({
        title: "Error",
        description: "Failed to fetch supplier purchase history. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewPurchaseOrder = (poId: number) => {
    navigate(`/purchase/${poId}`);
  };

  // Helper functions for summary calculations
  const getCompletedOrdersCount = () => {
    return purchaseOrders.filter(order =>
      order.status === 'completed' || order.status === 'completed_partially'
    ).length;
  };

  const getActiveOrdersCount = () => {
    return purchaseOrders.filter(order =>
      ['draft', 'payment_confirmed', 'supplier_dispatched', 'shipped_bd', 'arrived_bd', 'in_transit_bogura', 'received_hub'].includes(order.status)
    ).length;
  };

  const getAverageOrderValue = () => {
    if (purchaseOrders.length === 0) return 0;
    const total = getTotalAmount();
    return total / purchaseOrders.length;
  };

  const getMostRecentOrderDate = () => {
    if (purchaseOrders.length === 0) return null;
    return new Date(Math.max(...purchaseOrders.map(order => new Date(order.created_at).getTime())));
  };

  const getOrdersThisMonth = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return purchaseOrders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    }).length;
  };

  const getTotalItemsOrdered = () => {
    return purchaseOrders.reduce((total, order) => {
      if (!order.items) return total;
      return total + order.items.reduce((itemTotal, item) => itemTotal + (item.quantity || 0), 0);
    }, 0);
  };

  const getTotalChinaValueAll = () => {
    return purchaseOrders.reduce((total, order) => {
      if (!order.items) return total;
      return total + order.items.reduce((itemTotal, item) => {
        return itemTotal + ((item.china_price || 0) * (item.quantity || 0));
      }, 0);
    }, 0);
  };

  const getTotalAmount = () => {
    return purchaseOrders.reduce((total, order) => {
      const amount = parseFloat(order.total_amount?.toString() || '0');
      return total + (isNaN(amount) ? 0 : amount);
    }, 0);
  };

  // Helper functions for purchase order display
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
      completed_partially: 'bg-amber-500 text-white',
      lost: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getTotalItems = (order: PurchaseOrder) => {
    if (!order.items) return 0;
    return order.items.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const getTotalChinaValue = (order: PurchaseOrder) => {
    if (!order.items) return 0;
    return order.items.reduce((total, item) => total + ((item.china_price || 0) * (item.quantity || 0)), 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10" />
              <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </div>
        </div>

        {/* Purchase History Summary Skeleton */}
        <div className="container mx-auto px-6 py-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="text-center p-4 bg-gray-50 rounded-lg">
                    <Skeleton className="h-8 w-16 mx-auto mb-2" />
                    <Skeleton className="h-4 w-20 mx-auto" />
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="text-center p-4 bg-gray-50 rounded-lg">
                    <Skeleton className="h-8 w-16 mx-auto mb-2" />
                    <Skeleton className="h-4 w-20 mx-auto" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Purchase History Table Skeleton */}
        <div className="container mx-auto px-6 py-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="grid grid-cols-9 gap-4 p-4 border rounded-lg">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/purchase/suppliers/${id}`)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Profile
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {supplier?.shop_name || supplier?.name || 'Supplier'} - Purchase History
                </h1>
                <p className="text-gray-600 mt-1">All purchase orders and invoices from this supplier</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {purchaseOrders.length} order{purchaseOrders.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </div>
      </div>

      {/* Purchase History Summary */}
      <div className="container mx-auto px-6 py-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Purchase History Summary
            </CardTitle>
            <CardDescription>
              Overview of purchase orders and financial summary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{purchaseOrders.length}</div>
                <div className="text-sm text-gray-600">Total Orders</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{getCompletedOrdersCount()}</div>
                <div className="text-sm text-green-600">Completed</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{getTotalItemsOrdered()}</div>
                <div className="text-sm text-blue-600">Total Items</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">¥{getTotalChinaValueAll().toFixed(0)}</div>
                <div className="text-sm text-purple-600">China Value</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-center gap-1">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="text-2xl font-bold text-orange-600">{getActiveOrdersCount()}</span>
                </div>
                <div className="text-sm text-orange-600">Active Orders</div>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <div className="flex items-center justify-center gap-1">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  <span className="text-2xl font-bold text-emerald-600">৳{getAverageOrderValue().toFixed(0)}</span>
                </div>
                <div className="text-sm text-emerald-600">Avg Order Value</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{getOrdersThisMonth()}</div>
                <div className="text-sm text-red-600">This Month</div>
              </div>
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <div className="flex items-center justify-center gap-1">
                  <CheckCircle className="h-4 w-4 text-indigo-600" />
                  <span className="text-2xl font-bold text-indigo-600">৳{getTotalAmount().toFixed(0)}</span>
                </div>
                <div className="text-sm text-indigo-600">Total Amount (BDT)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Purchase History Table */}
      <div className="container mx-auto px-6 py-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Purchase Orders
            </CardTitle>
            <CardDescription>
              Complete purchase history including invoices and payment details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {purchaseOrders.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No purchase history found</h3>
                <p className="text-gray-600">No purchase orders have been created for this supplier yet.</p>
                <Button
                  className="mt-4"
                  onClick={() => navigate(`/purchase/suppliers/${id}`)}
                >
                  Return to Supplier Profile
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Order #</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead className="w-[100px]">Items</TableHead>
                    <TableHead className="w-[120px]">China Value</TableHead>
                    <TableHead className="w-[120px]">Exchange Rate</TableHead>
                    <TableHead className="w-[120px]">Shipping</TableHead>
                    <TableHead className="w-[120px]">Total Amount</TableHead>
                    <TableHead className="w-[120px]">Order Date</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseOrders.map((order) => (
                    <TableRow key={order.id} className="group">
                      <TableCell className="font-mono">
                        {order.po_number || `PO-${order.id}`}
                        <br />
                        <small className="text-muted-foreground">ID: {order.id}</small>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <span className="font-medium">{getTotalItems(order)}</span>
                          {order.items && order.items.length > 0 && (
                            <small className="text-muted-foreground block">
                              {order.items.length} types
                            </small>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <span className="font-medium">¥{getTotalChinaValue(order).toFixed(2)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {order.exchange_rate !== undefined && order.exchange_rate !== null ? (
                          <div className="text-center">
                            <span className="font-medium">৳{parseFloat(order.exchange_rate.toString()).toFixed(2)}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-center block">--</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {order.shipping_cost !== undefined && order.shipping_cost !== null ? (
                          <div className="text-center">
                            <span className="font-medium">৳{parseFloat(order.shipping_cost.toString()).toFixed(2)}</span>
                            {order.shipping_method && (
                              <small className="text-muted-foreground block capitalize">
                                {order.shipping_method}
                              </small>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-center block">--</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {order.total_amount !== undefined && order.total_amount !== null ? (
                          <div className="text-center">
                            <span className="font-medium">৳{parseFloat(order.total_amount.toString()).toFixed(2)}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-center block">--</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">
                            {new Date(order.created_at).toLocaleDateString()}
                          </div>
                          <small className="text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </small>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewPurchaseOrder(order.id)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {purchaseOrders.reduce((total, order) => total + getTotalItems(order), 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total Items Ordered</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Truck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    ¥{getTotalChinaValueAll().toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">Total China Value</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    ৳{purchaseOrders.reduce((total, order) => {
                      const amount = parseFloat(order.total_amount?.toString() || '0');
                      return total + (isNaN(amount) ? 0 : amount);
                    }, 0).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">Total Amount (BDT)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}