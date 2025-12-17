import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Package, Truck, Calendar, CheckCircle, Plus, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RoleGuard } from '@/components/guards/RoleGuard';
// import { toast } from '@/components/ui/use-toast';

import { usePurchaseStore } from '@/stores/purchaseStore';

interface PurchaseOrder {
  id: number;
  po_number?: string;
  supplier_id: number;
  supplier?: { shop_name?: string };
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
  }>;
}

export function PurchaseList() {
  return (
    <RoleGuard allowedRoles={['super_admin', 'admin', 'store_keeper', 'senior_staff']}>
      <PurchaseListContent />
    </RoleGuard>
  );
}

function PurchaseListContent() {
  const navigate = useNavigate();
  const { purchaseOrders, fetchPurchaseOrders, isLoading, error } = usePurchaseStore();

  useEffect(() => {
    console.log('[PurchaseList] Component mounted, fetching purchase orders...');
    fetchPurchaseOrders().catch(error => {
      console.error('[PurchaseList] Failed to fetch purchase orders:', error);
    });
  }, [fetchPurchaseOrders]);

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

  const getTotalAmount = (order: PurchaseOrder) => {
    if (!order.items) return 0;
    return order.items.reduce((total, item) => total + (item.china_price * item.quantity), 0);
  };

  const handleViewDetails = (orderId: number) => {
    navigate(`/purchase/${orderId}`);
  };

  const handleCreateNew = () => {
    navigate('/purchase/create-order');
  };

  // Calculate stats
  const stats = {
    total: purchaseOrders.length,
    pending: purchaseOrders.filter(order => ['draft', 'payment_confirmed'].includes(order.status)).length,
    inTransit: purchaseOrders.filter(order => ['supplier_dispatched', 'shipped_bd', 'arrived_bd', 'in_transit_bogura'].includes(order.status)).length,
    completed: purchaseOrders.filter(order => ['completed', 'completed_partially'].includes(order.status)).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <List className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Purchase Orders</h1>
            <p className="text-gray-600">View and manage all purchase orders and procurement requests</p>
          </div>
        </div>
        <RoleGuard allowedRoles={['super_admin', 'admin', 'store_keeper']}>
          <Button onClick={handleCreateNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Order
          </Button>
        </RoleGuard>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="text-red-600">⚠️</span>
            <span className="text-red-800 font-medium">Error: {error}</span>
          </div>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Truck className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.inTransit}</p>
                <p className="text-sm text-gray-600">In Transit</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Purchase Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders</CardTitle>
          <CardDescription>
            {isLoading ? 'Loading...' : `Showing ${purchaseOrders.length} order${purchaseOrders.length !== 1 ? 's' : ''}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total (RMB)</TableHead>
                <TableHead>Exchange Rate</TableHead>
                <TableHead>Shipping Cost</TableHead>
                <TableHead>Extra Cost</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="h-8 bg-gray-200 rounded w-20 animate-pulse ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : purchaseOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Package className="h-12 w-12 opacity-50" />
                      <p>No purchase orders found</p>
                      <RoleGuard allowedRoles={['super_admin', 'admin', 'store_keeper']}>
                        <Button onClick={handleCreateNew} variant="outline">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Your First Order
                        </Button>
                      </RoleGuard>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                purchaseOrders.map((order, idx) => (
                  <TableRow key={order.id} className={idx % 2 === 1 ? 'bg-muted/40' : ''}>
                    <TableCell className="font-mono">
                      {order.po_number || `PO-${order.id}`}
                      <br />
                      <small>{new Date(order.created_at).toLocaleDateString()}</small>
                    </TableCell>
                    <TableCell>{order.supplier?.shop_name || 'Unknown'}</TableCell>
                     <TableCell>{order.items?.length || 0}</TableCell>
                   
                   
                    <TableCell className="font-medium">
                      ¥{getTotalAmount(order).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {order.exchange_rate !== undefined && order.exchange_rate !== null ? `৳${Number(order.exchange_rate).toFixed(2)}` : '--'}
                    </TableCell>
                    
                    <TableCell>
                      {order.shipping_cost !== undefined && order.shipping_cost !== null ? `৳${Number(order.shipping_cost).toFixed(2)}` : '--'}
                       &nbsp;<small>{order.shipping_method ? (order.shipping_method === 'air' ? 'Air' : 'Sea') : '--'}</small>
                    </TableCell>
                    <TableCell>
                      {order.extra_cost_global !== undefined && order.extra_cost_global !== null ? `৳${Number(order.extra_cost_global).toFixed(2)}` : '--'}
                    </TableCell>
                    <TableCell>
                      {order.total_amount !== undefined && order.total_amount !== null ? `৳${Number(order.total_amount).toFixed(2)}` : '--'}
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusLabel(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <RoleGuard allowedRoles={['super_admin', 'admin', 'store_keeper', 'senior_staff']}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(order.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </RoleGuard>
                      </div>
                    </TableCell>
                    
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}