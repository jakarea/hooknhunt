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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Package,
  Search,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  MapPin,
  DollarSign,
  Archive
} from 'lucide-react';

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
    </div>
  );
};

export default InventoryList;
