import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Package, Search, Download, RefreshCw, TrendingUp, TrendingDown, AlertCircle, Edit, Plus, Minus } from 'lucide-react';
import apiClient from '@/lib/apiClient';

interface ProductVariant {
  id: number;
  sku: string;
  retail_name: string;
  wholesale_name: string;
  daraz_name: string;
  landed_cost: number;
  retail_price: number;
  wholesale_price: number;
  daraz_price: number;
  status: string;
  product: {
    id: number;
    base_name: string;
    base_thumbnail_url?: string;
  };
  inventory?: {
    id: number;
    quantity: number;
    reserved_quantity: number;
    min_stock_level: number;
    max_stock_level?: number;
    reorder_point?: number;
    location?: string;
  };
}

export function StockManagement() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<ProductVariant[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch products with inventory
  const fetchInventory = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('📦 Fetching inventory data...');

      // First try to get product variants with inventory
      const response = await apiClient.get('/admin/inventory/stock-summary');
      setProducts(response.data || []);
      setFilteredProducts(response.data || []);
    } catch (error: any) {
      console.error('❌ Failed to fetch inventory:', error);

      // Try fallback: get product variants directly
      try {
        console.log('🔄 Trying fallback: product variants...');
        const variantsResponse = await apiClient.get('/admin/product-variants?with_inventory=true');
        console.log('✅ Product variants loaded:', variantsResponse.data);
        setProducts(variantsResponse.data || []);
        setFilteredProducts(variantsResponse.data || []);
      } catch (fallbackError: any) {
        console.error('❌ Fallback also failed:', fallbackError);
        setError('Failed to load inventory data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchInventory();
  }, []);

  // Filter products based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.retail_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.product?.base_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  // Calculate available quantity
  const getAvailableQuantity = (product: ProductVariant) => {
    if (!product.inventory) return 0;
    return product.inventory.quantity - product.inventory.reserved_quantity;
  };

  // Calculate profit margin
  const getRetailMargin = (product: ProductVariant) => {
    if (!product.retail_price || !product.landed_cost) return 0;
    return ((product.retail_price - product.landed_cost) / product.landed_cost) * 100;
  };

  // Get stock status
  const getStockStatus = (product: ProductVariant) => {
    const available = getAvailableQuantity(product);
    const minStock = product.inventory?.min_stock_level || 0;

    if (available === 0) return { status: 'out_of_stock', color: 'destructive', label: 'Out of Stock' };
    if (available <= minStock) return { status: 'low_stock', color: 'secondary', label: 'Low Stock' };
    return { status: 'in_stock', color: 'default', label: 'In Stock' };
  };

  // Handle edit button click - navigate to edit page
  const handleEditClick = (product: ProductVariant) => {
    navigate(`/products/edit/${product.id}`);
  };

  // Handle stock adjustment (add/remove)
  const handleStockAdjustment = async (productId: number, adjustment: number, reason: string) => {
    try {
      await apiClient.post('/admin/inventory/add-stock', {
        items: [{
          product_variant_id: productId,
          quantity: Math.abs(adjustment),
          unit_cost: null, // We'll use the current average cost
          location: null,
        }]
      });

      // Refresh inventory data
      await fetchInventory();
    } catch (error: any) {
      console.error('Failed to adjust stock:', error);
    }
  };

  // Convert relative storage path to full URL
  const getImageUrl = (imageSrc: string | null | undefined): string | undefined => {
    if (!imageSrc) {
      return undefined;
    }

    // Check if it's a temporary file path (invalid)
    if (imageSrc.includes('/TemporaryItems/') || imageSrc.includes('/var/folders/')) {
      return undefined;
    }

    // If it's already a full URL (starts with http), return as is
    if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
      return imageSrc;
    }

    // If it's a storage path (starts with /storage/), convert to full URL
    if (imageSrc.startsWith('/storage/')) {
      return `http://localhost:8000${imageSrc}`;
    }

    // If it's a relative path without leading slash, add it
    if (!imageSrc.startsWith('/')) {
      return `http://localhost:8000/storage/${imageSrc}`;
    }

    // Otherwise, treat as a full relative path
    return `http://localhost:8000${imageSrc}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchInventory} className="flex items-center gap-2 mx-auto">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Stock Management</h1>
              <p className="text-sm text-gray-600">View and manage all product inventory levels</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button onClick={fetchInventory} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold">{products.length}</p>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Stock</p>
                  <p className="text-2xl font-bold text-green-600">
                    {products.reduce((sum, p) => sum + getAvailableQuantity(p), 0)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Reserved Stock</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {products.reduce((sum, p) => sum + (p.inventory?.reserved_quantity || 0), 0)}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Low Stock Items</p>
                  <p className="text-2xl font-bold text-red-600">
                    {products.filter(p => {
                      const status = getStockStatus(p);
                      return status.status === 'low_stock';
                    }).length}
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Product Inventory ({filteredProducts.length} items)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-2 text-left">Product</th>
                    <th className="px-4 py-2 text-left">SKU</th>
                    <th className="px-4 py-2 text-center">Total Stock</th>
                    <th className="px-4 py-2 text-center">Reserved</th>
                    <th className="px-4 py-2 text-center">Available</th>
                    <th className="px-4 py-2 text-left">Cost</th>
                    <th className="px-4 py-2 text-left">Retail Price</th>
                    <th className="px-4 py-2 text-center">Margin</th>
                    <th className="px-4 py-2 text-center">Status</th>
                    <th className="px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const available = getAvailableQuantity(product);
                    const status = getStockStatus(product);
                    const margin = getRetailMargin(product);

                    return (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {(() => {
                              const thumbnailUrl = product.product?.base_thumbnail_url;
                              const imageUrl = getImageUrl(thumbnailUrl);

                              return imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt={product.product?.base_name || 'Product'}
                                  className="h-10 w-10 object-cover rounded border"
                                />
                              ) : (
                                <div className="h-10 w-10 bg-gray-100 rounded border flex items-center justify-center">
                                  <Package className="h-5 w-5 text-gray-400" />
                                </div>
                              );
                            })()}
                            <div>
                              <p className="font-medium text-gray-900">{product.product?.base_name}</p>
                              <p className="text-xs text-gray-500">{product.retail_name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{product.sku}</td>
                        <td className="px-4 py-3 text-center font-medium">
                          {product.inventory?.quantity || 0}
                        </td>
                        <td className="px-4 py-3 text-center text-orange-600">
                          {product.inventory?.reserved_quantity || 0}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`font-bold ${available <= 0 ? 'text-red-600' : available <= (product.inventory?.min_stock_level || 0) ? 'text-orange-600' : 'text-green-600'}`}>
                            {available}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">৳{product.landed_cost?.toFixed(2)}</td>
                        <td className="px-4 py-3 text-gray-600">৳{product.retail_price?.toFixed(2)}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge
                            variant={margin < 0 ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {margin.toFixed(1)}%
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant={status.color as any} className="text-xs">
                            {status.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStockAdjustment(product.id, -1, 'Manual adjustment')}
                              className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Decrease Stock"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStockAdjustment(product.id, 1, 'Manual adjustment')}
                              className="h-7 w-7 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                              title="Increase Stock"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditClick(product)}
                              className="h-8 px-2 text-xs"
                              title="Edit Product & Stock"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {searchTerm ? 'No products found matching your search.' : 'No products in inventory.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        </div>
    </div>
  );
}