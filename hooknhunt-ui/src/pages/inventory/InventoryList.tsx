// src/pages/inventory/InventoryList.tsx
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { useInventoryStore } from '@/stores/inventoryStore';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Package,
  Search,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  MapPin,
  DollarSign,
  Archive,
  Edit,
  Save,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import apiClient from '@/lib/apiClient';

const InventoryList = () => {
  const { t } = useTranslation('inventory'); // Instantiate useTranslation
  const {
    inventoryItems,
    stats,
    isLoading,
    pagination,
    fetchInventory,
    fetchStats
  } = useInventoryStore();

  const user = useAuthStore((state) => state.user);
  const canViewCost = user?.role === 'super_admin' || user?.role === 'admin';

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [stockStatusFilter, setStockStatusFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Edit stock modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editQuantity, setEditQuantity] = useState('');
  const [editReserved, setEditReserved] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    const filters: any = {};

    if (searchTerm) filters.search = searchTerm;
    if (stockStatusFilter && stockStatusFilter !== 'all') filters.stock_status = stockStatusFilter;
    if (locationFilter) filters.location = locationFilter;

    fetchInventory(currentPage, filters);
  }, [fetchInventory, currentPage, searchTerm, stockStatusFilter, locationFilter]);

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const getStockStatusBadge = (status: string, isLowStock: boolean, shouldReorder: boolean) => {
    if (status === 'out_of_stock') {
      return <Badge variant="destructive">{t('inventory.status.outOfStock')}</Badge>;
    }
    if (isLowStock) {
      return <Badge variant="destructive" className="bg-orange-500">{t('inventory.status.lowStock')}</Badge>;
    }
    if (shouldReorder) {
      return <Badge variant="outline" className="border-yellow-500 text-yellow-600">{t('inventory.status.reorderNeeded')}</Badge>;
    }
    if (status === 'overstocked') {
      return <Badge variant="outline" className="border-blue-500 text-blue-600">{t('inventory.status.overstocked')}</Badge>;
    }
    return <Badge variant="outline" className="border-green-500 text-green-600">{t('inventory.status.inStock')}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getAttributesDisplay = (attributeOptions: any[] | undefined) => {
    if (!attributeOptions || attributeOptions.length === 0) return t('inventory.noVariants');

    return attributeOptions
      .map((opt) => `${opt.attribute?.name}: ${opt.value}`)
      .join(', ');
  };

  const handleEditStock = (item: any) => {
    setEditingItem(item);
    setEditQuantity(item.quantity.toString());
    setEditReserved(item.reserved_quantity.toString());
    setEditModalOpen(true);
  };

  const handleSaveStock = async () => {
    if (!editingItem) return;

    const newQuantity = parseInt(editQuantity);
    const newReserved = parseInt(editReserved);

    if (isNaN(newQuantity) || newQuantity < 0) {
      toast.error('Quantity must be a valid number');
      return;
    }

    if (isNaN(newReserved) || newReserved < 0) {
      toast.error('Reserved quantity must be a valid number');
      return;
    }

    if (newReserved > newQuantity) {
      toast.error('Reserved quantity cannot be greater than total quantity');
      return;
    }

    setEditLoading(true);

    try {
      await apiClient.put(`/admin/inventory/${editingItem.id}`, {
        quantity: newQuantity,
        reserved_quantity: newReserved,
      });

      toast.success('Stock updated successfully');
      setEditModalOpen(false);
      // Refresh inventory list
      fetchInventory(currentPage, {
        search: searchTerm,
        stock_status: stockStatusFilter !== 'all' ? stockStatusFilter : undefined,
        location: locationFilter,
      });
      fetchStats();
    } catch (error: any) {
      console.error('Failed to update stock:', error);
      toast.error(error.response?.data?.message || 'Failed to update stock');
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('inventory.title')}</h1>
              <p className="text-gray-600 mt-1">{t('inventory.subtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="container mx-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{t('inventory.stats.totalItems')}</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total_items}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{t('inventory.stats.totalQuantity')}</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total_quantity.toLocaleString()}</p>
                  </div>
                  <Archive className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            {canViewCost && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{t('inventory.stats.totalValue')}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(stats.total_value)}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{t('inventory.stats.alerts')}</p>
                    <p className="text-2xl font-bold text-red-600">
                      {stats.out_of_stock + stats.low_stock}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {t('inventory.stats.alertsDetail', { out: stats.out_of_stock, low: stats.low_stock })}
                    </p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="container mx-auto px-6 pb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('inventory.filters.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex gap-2">
                <Input
                  placeholder={t('inventory.filters.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <Select value={stockStatusFilter} onValueChange={setStockStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t('inventory.filters.stockStatusPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('inventory.filters.allStatus')}</SelectItem>
                  <SelectItem value="in_stock">{t('inventory.status.inStock')}</SelectItem>
                  <SelectItem value="low_stock">{t('inventory.status.lowStock')}</SelectItem>
                  <SelectItem value="out_of_stock">{t('inventory.status.outOfStock')}</SelectItem>
                  <SelectItem value="reorder_needed">{t('inventory.status.reorderNeeded')}</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder={t('inventory.filters.locationPlaceholder')}
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setStockStatusFilter('all');
                  setLocationFilter('');
                  setCurrentPage(1);
                }}
              >
                {t('inventory.filters.clear')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {t('inventory.currentStock.title')}
            </CardTitle>
            <CardDescription>
              {pagination && t('inventory.currentStock.showing', { from: pagination.from, to: pagination.to, total: pagination.total })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : inventoryItems.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">{t('inventory.noItems')}</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('inventory.table.product')}</TableHead>
                        <TableHead>{t('inventory.table.variant')}</TableHead>
                        <TableHead>{t('inventory.table.sku')}</TableHead>
                        {canViewCost && <TableHead>{t('inventory.table.landedCost')}</TableHead>}
                        <TableHead>{t('inventory.table.retailPrice')}</TableHead>
                        <TableHead className="text-center">{t('inventory.table.quantity')}</TableHead>
                        <TableHead className="text-center">{t('inventory.table.reserved')}</TableHead>
                        <TableHead className="text-center">{t('inventory.table.available')}</TableHead>
                        {canViewCost && <TableHead className="text-right">{t('inventory.table.stockValue')}</TableHead>}
                        <TableHead>{t('inventory.table.status')}</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventoryItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {item.product_variant?.product?.base_thumbnail_url ? (
                                <img
                                  src={item.product_variant.product.base_thumbnail_url}
                                  alt={item.product_variant.product.base_name}
                                  className="h-10 w-10 rounded object-cover"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
                                  <Package className="h-5 w-5 text-gray-400" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-sm">
                                  {item.product_variant?.product?.base_name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {item.product_variant?.product?.category?.name}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">
                              {item.product_variant?.retail_name || getAttributesDisplay(item.product_variant?.attribute_options)}
                            </p>
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {item.product_variant?.sku}
                            </code>
                          </TableCell>
                          {canViewCost && (
                            <TableCell>
                              {item.product_variant?.landed_cost
                                ? formatCurrency(item.product_variant.landed_cost)
                                : '-'}
                            </TableCell>
                          )}
                          <TableCell>
                            {item.product_variant?.retail_price
                              ? formatCurrency(item.product_variant.retail_price)
                              : '-'}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className={`font-semibold ${item.quantity === 0 ? 'text-red-600' : ''}`}>
                              {item.quantity}
                            </span>
                          </TableCell>
                          <TableCell className="text-center text-gray-600">
                            {item.reserved_quantity}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className={`font-medium ${item.available_quantity === 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {item.available_quantity}
                            </span>
                          </TableCell>
                          {canViewCost && (
                            <TableCell className="text-right font-medium">
                              {formatCurrency(item.total_value)}
                            </TableCell>
                          )}
                          
                          <TableCell>
                            {getStockStatusBadge(item.stock_status, item.is_low_stock, item.should_reorder)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditStock(item)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {pagination && pagination.last_page > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-gray-600">
                      {t('inventory.pagination.page', { current: pagination.current_page, last: pagination.last_page })}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        {t('inventory.pagination.previous')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === pagination.last_page}
                      >
                        {t('inventory.pagination.next')}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Stock Dialog */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Stock</DialogTitle>
            <DialogDescription>
              Update stock quantity for {editingItem?.product_variant?.product?.base_name} - {editingItem?.product_variant?.retail_name}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="quantity">Total Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={editQuantity}
                onChange={(e) => setEditQuantity(e.target.value)}
                min="0"
                className="col-span-3"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reserved">Reserved Quantity</Label>
              <Input
                id="reserved"
                type="number"
                value={editReserved}
                onChange={(e) => setEditReserved(e.target.value)}
                min="0"
                className="col-span-3"
              />
              <p className="text-xs text-gray-500">
                Available: {Math.max(0, parseInt(editQuantity || '0') - parseInt(editReserved || '0'))}
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium">Product Info:</p>
              <p className="text-sm text-gray-600">SKU: {editingItem?.product_variant?.sku}</p>
              <p className="text-sm text-gray-600">Current Available: {editingItem?.available_quantity}</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditModalOpen(false)}
              disabled={editLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSaveStock} disabled={editLoading}>
              {editLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryList;
