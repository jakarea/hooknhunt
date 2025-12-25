// src/pages/purchase/PurchaseReceiveList.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Plus, CheckCircle, Clock, AlertCircle, Box, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import apiClient from '@/lib/apiClient';

interface PurchaseOrder {
  id: number;
  po_number?: string;
  supplier?: {
    shop_name?: string;
  };
  status: string;
  total_amount?: number;
  created_at: string;
  items: PurchaseOrderItem[];
}

interface PurchaseOrderItem {
  id: number;
  product_id: number;
  quantity: number;
  received_quantity?: number;
  stocked_quantity?: number;
  china_price?: number;
  product?: {
    id: number;
    base_name: string;
    base_thumbnail_url?: string;
  };
}

export function PurchaseReceiveList() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCompletedOrders();
  }, []);

  const fetchCompletedOrders = async () => {
    try {
      setLoading(true);
      // Fetch all orders that are completed or completed_partially
      const response = await apiClient.get('/admin/purchase-orders?status=completed');
      const allOrders = response.data.data || response.data;

      // Filter orders that have items with remaining quantities (not fully stocked)
      const ordersWithRemainingItems = allOrders.filter((order: PurchaseOrder) => {
        return (order.items || []).some((item: PurchaseOrderItem) => {
          const remaining = (item.quantity || 0) - (item.stocked_quantity || 0);
          return remaining > 0; // Only show orders with items that need to be stocked
        });
      });

      setOrders(ordersWithRemainingItems);
    } catch (error) {
      console.error('Error fetching completed orders:', error);
      toast.error('Failed to load completed orders');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order =>
    (order.po_number?.toString() || order.id?.toString() || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.supplier?.shop_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.items || []).some(item =>
      (item.product?.base_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'completed_partially':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'completed_partially':
        return <Badge className="bg-yellow-100 text-yellow-800">Partially Completed</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800">{status}</Badge>;
    }
  };

  const calculateRemaining = (item: PurchaseOrderItem) => {
    return (item.quantity || 0) - (item.stocked_quantity || 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6 text-center">
            <Package className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600 font-medium">Loading Completed Orders...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Receive Stock
                </h1>
                <p className="text-sm text-gray-500">Items from completed orders that need stocking</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="search" className="text-sm font-medium text-gray-700">
                  Search Orders
                </Label>
                <Input
                  id="search"
                  type="text"
                  placeholder="Search by PO number, supplier, or product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button onClick={fetchCompletedOrders} variant="outline">
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="pt-12 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No matching orders found' : 'No orders need stocking'}
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? 'Try adjusting your search terms'
                  : 'All completed orders have been fully stocked. No items remaining to receive.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="border-0 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(order.status)}
                        <div>
                          <CardTitle className="text-lg">
                            PO #{order.po_number || order.id}
                          </CardTitle>
                          <CardDescription>
                            Supplier: {order.supplier?.shop_name || 'Unknown'} •
                            Created: {new Date(order.created_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Total Items</p>
                        <p className="text-xl font-bold text-gray-900">
                          {(order.items || []).filter(item => {
                            const remaining = (item.quantity || 0) - (item.stocked_quantity || 0);
                            return remaining > 0;
                          }).length}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Total Quantity</p>
                        <p className="text-xl font-bold text-gray-900">
                          {(order.items || []).reduce((sum, item) => {
                            const remaining = (item.quantity || 0) - (item.stocked_quantity || 0);
                            return sum + Math.max(0, remaining);
                          }, 0)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Total Value</p>
                        <p className="text-xl font-bold text-gray-900">
                          ৳{order.total_amount ? Number(order.total_amount).toFixed(2) : '0.00'}
                        </p>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 flex items-center gap-2">
                        <Box className="h-4 w-4" />
                        Items Pending Stock ({(order.items || []).filter(item => {
                          const remaining = (item.quantity || 0) - (item.stocked_quantity || 0);
                          return remaining > 0;
                        }).length})
                      </h4>
                      <div className="space-y-2">
                        {(order.items || [])
                          .filter((item) => {
                            const remaining = calculateRemaining(item);
                            return remaining > 0; // Only show items that need stocking
                          })
                          .map((item, index) => {
                            const remaining = calculateRemaining(item);

                            return (
                              <div
                                key={item.id}
                                className="p-4 border rounded-lg bg-orange-50 border-orange-200"
                              >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  {item.product?.base_thumbnail_url ? (
                                    <img
                                      src={item.product.base_thumbnail_url}
                                      alt={item.product.base_name}
                                      className="h-12 w-12 object-cover rounded border"
                                    />
                                  ) : (
                                    <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                                      <Package className="h-5 w-5 text-gray-400" />
                                    </div>
                                  )}
                                  <div>
                                    <h5 className="font-medium text-gray-900">
                                      {item.product?.base_name || 'Unknown Product'}
                                    </h5>
                                    <p className="text-sm text-gray-500">
                                      China Price: ¥{item.china_price || 0}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-6">
                                  <div className="text-right">
                                    <p className="text-sm text-gray-600">Stocked</p>
                                    <p className="font-medium">
                                      {item.stocked_quantity || 0} / {item.quantity || 0}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-gray-600">Remaining</p>
                                    <p className={`font-medium ${remaining > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                                      {remaining > 0 ? remaining : 0}
                                    </p>
                                  </div>
                                  <Link to={`/inventory/receive/${item.id}`}>
                                    <Button
                                      size="sm"
                                      disabled={remaining <= 0}
                                      className={remaining > 0 ? 'bg-blue-600 hover:bg-blue-700' : ''}
                                    >
                                      {remaining > 0 ? (
                                        <>
                                          <Plus className="h-4 w-4 mr-1" />
                                          Add to Stock
                                        </>
                                      ) : (
                                        <>
                                          <CheckCircle className="h-4 w-4 mr-1" />
                                          Completed
                                        </>
                                      )}
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}