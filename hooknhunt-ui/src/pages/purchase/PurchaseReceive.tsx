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

type StatusFilter = 'all' | 'arrived_bd' | 'received_hub' | 'in_transit_bogura';

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

      // Fetch all purchase orders with items
      const response = await api.get('/admin/purchase-orders?include=items,supplier');
      const allOrders = response.data.data || response.data || [];

      // Filter orders that have items ready to receive
      const readyStatuses = ['arrived_bd', 'received_hub', 'in_transit_bogura'];
      const ordersWithReadyItems = allOrders.filter((order: PurchaseOrder) =>
        readyStatuses.includes(order.status) && order.items
      );

      // Extract all items from ready orders
      const allItems: PurchaseOrderItem[] = [];
      const uniqueSuppliers = new Map();

      ordersWithReadyItems.forEach((order: PurchaseOrder) => {
        if (order.items) {
          order.items.forEach(item => {
            // Only include items that haven't been fully stocked
            if (item.stocked_quantity < item.quantity) {
              allItems.push({
                ...item,
                purchase_order: order,
                product: item.product,
                product_variant: item.product_variant
              });
            }
          });
        }

        // Collect unique suppliers
        if (order.supplier) {
          uniqueSuppliers.set(order.supplier.id, order.supplier);
        }
      });

      setPurchaseOrders(ordersWithReadyItems);
      setItems(allItems);
      setSuppliers(Array.from(uniqueSuppliers.values()));
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
      item.purchase_order?.status === statusFilter;

    const matchesSupplier =
      supplierFilter === 'all' ||
      item.purchase_order?.supplier?.id.toString() === supplierFilter;

    return matchesSearch && matchesStatus && matchesSupplier;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      arrived_bd: 'bg-purple-100 text-purple-800',
      in_transit_bogura: 'bg-indigo-100 text-indigo-800',
      received_hub: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getPendingQuantity = (item: PurchaseOrderItem) => {
    return item.quantity - item.stocked_quantity;
  };

  const getProgressPercentage = (item: PurchaseOrderItem) => {
    return Math.round((item.stocked_quantity / item.quantity) * 100);
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
    arrived_bd: purchaseOrders.filter(po => po.status === 'arrived_bd').length,
    in_transit_bogura: purchaseOrders.filter(po => po.status === 'in_transit_bogura').length,
    received_hub: purchaseOrders.filter(po => po.status === 'received_hub').length,
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
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{ordersByStatus.arrived_bd}</p>
                  <p className="text-sm text-gray-600">Arrived BD</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{ordersByStatus.in_transit_bogura}</p>
                  <p className="text-sm text-gray-600">In Transit</p>
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
                  <SelectItem value="arrived_bd">Arrived BD</SelectItem>
                  <SelectItem value="in_transit_bogura">In Transit Bogura</SelectItem>
                  <SelectItem value="received_hub">Received Hub</SelectItem>
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
              Products from purchase orders that are ready to be added to inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredItems.length === 0 ? (
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
                              className={`h-2 rounded-full ${
                                getProgressPercentage(item) === 100
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