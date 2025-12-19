import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Package, Eye, Plus, CheckCircle, Clock, AlertCircle, Search, Filter } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { ProductImage } from '@/components/ProductImage';
import api from '@/lib/api';

// Define interfaces
interface PurchaseOrderItem {
  id: number;
  product_id: number;
  quantity: number;
  received_quantity: number;
  stocked_quantity: number;
  china_price: number;
  purchase_order_id: number;
  created_at: string;
  updated_at: string;
  product?: {
    id: number;
    base_name: string;
    base_thumbnail_url?: string | null;
    status?: string;
  };
  product_variant?: {
    id: number;
    sku?: string;
    attributes?: Record<string, string>;
  };
  purchase_order?: {
    id: number;
    po_number?: string;
    status: string;
    created_at: string;
    supplier?: {
      id: number;
      shop_name?: string;
      name?: string;
    };
  };
}

interface PurchaseOrder {
  id: number;
  po_number?: string;
  supplier_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  supplier?: {
    id: number;
    name: string;
    shop_name?: string;
  };
  items?: PurchaseOrderItem[];
}

type StatusFilter = 'all' | 'completed' | 'completed_partially' | 'in_transit_bogura' | 'received_hub' | 'other';

export function PurchaseReceive() {
  const navigate = useNavigate();
  const [items, setItems] = useState<PurchaseOrderItem[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [supplierFilter, setSupplierFilter] = useState<string>('all');
  const [suppliers, setSuppliers] = useState<any[]>([]);

  // Fetch items ready to receive
  useEffect(() => {
    fetchItemsReadyToReceive();
  }, []);

  const fetchItemsReadyToReceive = async () => {
    try {
      setIsLoading(true);

      // Fetch items where received_quantity > stocked_quantity
      // These are items that have been received but not yet added to inventory
      const response = await api.get('/admin/purchase-order-items', {
        params: {
          ready_to_stock: true  // This tells backend to filter received_quantity > stocked_quantity
        }
      });

      const allItems = response.data.data || response.data || [];

      console.log('🔍 Fetched items ready to stock (received > stocked):', allItems.length);

      // Extract unique suppliers and orders
      const uniqueSuppliers = new Map();
      const uniqueOrders = new Map();

      const transformedItems: PurchaseOrderItem[] = allItems
        .filter((item: any) => {
          // Double-check on frontend: only show items where received_quantity > stocked_quantity
          const receivedQty = Number(item.received_quantity || 0);
          const stockedQty = Number(item.stocked_quantity || 0);
          const isReady = receivedQty > stockedQty;

          console.log(`📦 Item ${item.id} (${item.product?.base_name}): received=${receivedQty}, stocked=${stockedQty}, ready=${isReady}`);

          return isReady;
        })
        .map((item: any) => {
          // Collect unique suppliers
          if (item.purchase_order?.supplier) {
            uniqueSuppliers.set(item.purchase_order.supplier.id, item.purchase_order.supplier);
          }

          // Collect unique orders
          if (item.purchase_order) {
            uniqueOrders.set(item.purchase_order.id, item.purchase_order);
          }

          return {
            id: item.id,
            product_id: item.product_id,
            quantity: item.quantity,
            stocked_quantity: item.stocked_quantity || 0,
            received_quantity: item.received_quantity || 0,
            china_price: item.china_price,
            purchase_order_id: item.purchase_order_id,
            created_at: item.created_at,
            updated_at: item.updated_at,
            product: item.product,
            product_variant: item.product_variant,
            purchase_order: item.purchase_order,
          };
        });

      setPurchaseOrders(Array.from(uniqueOrders.values()));
      setItems(transformedItems);
      setSuppliers(Array.from(uniqueSuppliers.values()));

      console.log(`✅ Found ${transformedItems.length} items ready to stock`);

      if (transformedItems.length === 0) {
        console.log('⚠️ No items found with received_quantity > stocked_quantity');
      }
    } catch (error: any) {
      console.error('❌ Error fetching items ready to receive:', error);
      toast({
        title: "Error",
        description: "Failed to fetch items ready to receive. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter items based on search and filters
  const filteredItems = items.filter(item => {
    const matchesSearch =
      item.product?.base_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product_variant?.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.purchase_order?.po_number?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      item.purchase_order?.status === statusFilter ||
      (statusFilter === 'other' && !['completed', 'completed_partially', 'in_transit_bogura', 'received_hub'].includes(item.purchase_order?.status || ''));

    const matchesSupplier =
      supplierFilter === 'all' ||
      item.purchase_order?.supplier?.id.toString() === supplierFilter;

    return matchesSearch && matchesStatus && matchesSupplier;
  });

  // Debug logs
  console.log('🔢 Total items:', items.length);
  console.log('🔍 Search term:', searchTerm);
  console.log('📊 Status filter:', statusFilter);
  console.log('👥 Supplier filter:', supplierFilter);
  console.log('✅ Filtered items:', filteredItems.length);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      completed: 'bg-green-100 text-green-800',
      completed_partially: 'bg-amber-100 text-amber-800',
      in_transit_bogura: 'bg-indigo-100 text-indigo-800',
      received_hub: 'bg-blue-100 text-blue-800',
      draft: 'bg-gray-100 text-gray-800',
      payment_confirmed: 'bg-purple-100 text-purple-800',
      supplier_dispatched: 'bg-orange-100 text-orange-800',
      shipped_bd: 'bg-pink-100 text-pink-800',
      arrived_bd: 'bg-teal-100 text-teal-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getPendingQuantity = (item: PurchaseOrderItem) => {
    // Return the quantity that's been received but not yet stocked
    return item.received_quantity - item.stocked_quantity;
  };

  const getProgressPercentage = (item: PurchaseOrderItem) => {
    // Calculate progress based on stocked vs received (not total quantity)
    if (item.received_quantity === 0) return 0;
    return Math.round((item.stocked_quantity / item.received_quantity) * 100);
  };

  const handleViewItem = (item: PurchaseOrderItem) => {
    if (item.product_variant?.sku) {
      navigate(`/inventory/stock/receive/${item.id}`);
    } else {
      navigate(`/inventory/stock/receive/${item.id}`);
    }
  };

  const handleViewOrder = (orderId: number) => {
    navigate(`/purchase/${orderId}`);
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

        {/* Content */}
        <div className="container mx-auto px-6 py-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Table */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <Skeleton className="h-12 w-12 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Calculate summary statistics
  const totalItems = items.length;
  const totalReadyQuantity = items.reduce((sum, item) => sum + getPendingQuantity(item), 0);
  const totalOrders = purchaseOrders.length;
  const ordersByStatus = {
    completed: purchaseOrders.filter(po => po.status === 'completed').length,
    completed_partially: purchaseOrders.filter(po => po.status === 'completed_partially').length,
    in_transit_bogura: purchaseOrders.filter(po => po.status === 'in_transit_bogura').length,
    received_hub: purchaseOrders.filter(po => po.status === 'received_hub').length,
    other: purchaseOrders.filter(po => !['completed', 'completed_partially', 'in_transit_bogura', 'received_hub'].includes(po.status)).length,
  };

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
                onClick={() => navigate('/purchase')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Purchase Orders
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Receive Stock</h1>
                <p className="text-gray-600 mt-1">Items ready to add to inventory</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
                  <p className="text-sm text-gray-600">Ready Items</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Plus className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{totalReadyQuantity}</p>
                  <p className="text-sm text-gray-600">Total Quantity</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{totalReadyQuantity}</p>
                  <p className="text-sm text-gray-600">Ready to Stock</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Package className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                  <p className="text-sm text-gray-600">Purchase Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search products, SKUs, or PO numbers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={statusFilter} onValueChange={(value: StatusFilter) => setStatusFilter(value)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Order Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="completed_partially">Partially Completed</SelectItem>
                  <SelectItem value="received_hub">Received Hub</SelectItem>
                  <SelectItem value="in_transit_bogura">In Transit</SelectItem>
                  <SelectItem value="other">Other Status</SelectItem>
                </SelectContent>
              </Select>

              <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Suppliers</SelectItem>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id.toString()}>
                      {supplier.shop_name || supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Items Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Items Ready to Receive
              </div>
              <Badge variant="secondary">
                {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
              </Badge>
            </CardTitle>
            <CardDescription>
              Products that have been received but not yet added to inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              console.log('🎯 Rendering check - filteredItems.length:', filteredItems.length);
              console.log('🎯 Rendering check - isLoading:', isLoading);
              return filteredItems.length === 0;
            })() ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No items ready to receive</h3>
                <p className="text-gray-600">
                  {items.length === 0
                    ? "No items are currently ready to be received."
                    : "No items match your current filters."
                  }
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="w-[120px]">SKU</TableHead>
                    <TableHead className="w-[120px]">PO Number</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead className="w-[100px]">Quantity</TableHead>
                    <TableHead className="w-[100px]">Received</TableHead>
                    <TableHead className="w-[120px]">Progress</TableHead>
                    <TableHead className="w-[150px]">Supplier</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id} className="group">
                      <TableCell>
                        <ProductImage
                          src={item.product?.base_thumbnail_url}
                          alt={item.product?.base_name || 'Product'}
                          size="sm"
                          className="rounded border"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.product?.base_name}</div>
                          {item.product_variant?.attributes && (
                            <div className="text-xs text-gray-500 mt-1">
                              {Object.entries(item.product_variant.attributes).map(([key, value]) => (
                                <span key={key} className="mr-2">
                                  {key}: {value}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{item.product_variant?.sku || 'N/A'}</span>
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleViewOrder(item.purchase_order_id)}
                          className="text-blue-600 hover:text-blue-800 font-mono text-sm"
                        >
                          {item.purchase_order?.po_number || `PO-${item.purchase_order_id}`}
                        </button>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.purchase_order?.status || '')}>
                          {getStatusLabel(item.purchase_order?.status || '')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="font-medium">{item.quantity}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="font-medium">{item.stocked_quantity}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getProgressPercentage(item) === 100
                                ? 'bg-green-500'
                                : 'bg-blue-500'
                                }`}
                              style={{ width: `${getProgressPercentage(item)}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600 min-w-[40px]">
                            {getProgressPercentage(item)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{item.purchase_order?.supplier?.shop_name || item.purchase_order?.supplier?.name}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewItem(item)}
                          disabled={getPendingQuantity(item) === 0}
                        >
                          {getPendingQuantity(item) > 0 ? (
                            <>
                              <Plus className="h-3 w-3 mr-1" />
                              Receive
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Complete
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}