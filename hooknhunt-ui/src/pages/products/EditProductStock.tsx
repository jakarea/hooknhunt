import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Package,
  ArrowLeft,
  Save,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import apiClient from '@/lib/apiClient';
import { API_URL } from '@/lib/config';

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
  retail_offer_discount_type?: 'flat' | 'percentage';
  retail_offer_discount_value?: number;
  wholesale_offer_discount_type?: 'flat' | 'percentage';
  wholesale_offer_discount_value?: number;
  daraz_offer_discount_type?: 'flat' | 'percentage';
  daraz_offer_discount_value?: number;
  retail_offer_start_date?: string;
  retail_offer_end_date?: string;
  wholesale_offer_start_date?: string;
  wholesale_offer_end_date?: string;
  daraz_offer_start_date?: string;
  daraz_offer_end_date?: string;
  status: string;
  product: {
    id: number;
    base_name: string;
    base_thumbnail_url?: string;
    video_url?: string;
    gallery_images?: string[];
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

export function EditProductStock() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductVariant | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [editForm, setEditForm] = useState({
    // Product fields
    sku: '',
    landed_cost: 0,
    retail_price: 0,
    wholesale_price: 0,
    daraz_price: 0,
    retail_name: '',
    wholesale_name: '',
    daraz_name: '',
    // Offer price fields (direct offer prices)
    retail_offer_price: 0,
    wholesale_offer_price: 0,
    daraz_offer_price: 0,
    retail_offer_start_date: '',
    retail_offer_end_date: '',
    wholesale_offer_start_date: '',
    wholesale_offer_end_date: '',
    daraz_offer_start_date: '',
    daraz_offer_end_date: '',
    // Inventory fields
    quantity: 0,
    reserved_quantity: 0,
    min_stock_level: 0,
    max_stock_level: 0,
    reorder_point: 0,
    location: '',
    // Media fields
    youtube_video_url: '',
    image_gallery: [] as string[], // Only store valid URLs
  });

  // Fetch product data on component mount
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        // Get stock summary data and find the specific product
        const response = await apiClient.get(`/admin/inventory/stock-summary`);
        const allProducts = response.data;
        const productData = allProducts.find((p: ProductVariant) => p.id.toString() === id);

        if (!productData) {
          setError('Product not found.');
          setLoading(false);
          return;
        }

        setProduct(productData);

        // Populate form with existing data
        // Calculate offer prices from discount data
        const calculateOfferPriceFromDiscount = (price: number, discountType: string, discountValue: number) => {
          if (!discountType || !discountValue) return 0;
          if (discountType === 'flat') return Math.max(0, price - discountValue);
          if (discountType === 'percentage') return Math.max(0, price - (price * discountValue / 100));
          return 0;
        };

        setEditForm({
          // Product fields
          sku: productData.sku || '',
          landed_cost: productData.landed_cost || 0,
          retail_price: productData.retail_price || 0,
          wholesale_price: productData.wholesale_price || 0,
          daraz_price: productData.daraz_price || 0,
          retail_name: productData.retail_name || '',
          wholesale_name: productData.wholesale_name || '',
          daraz_name: productData.daraz_name || '',
          // Offer price fields (calculated from discount data)
          retail_offer_price: calculateOfferPriceFromDiscount(
            productData.retail_price || 0,
            productData.retail_offer_discount_type || '',
            productData.retail_offer_discount_value || 0
          ),
          wholesale_offer_price: calculateOfferPriceFromDiscount(
            productData.wholesale_price || 0,
            productData.wholesale_offer_discount_type || '',
            productData.wholesale_offer_discount_value || 0
          ),
          daraz_offer_price: calculateOfferPriceFromDiscount(
            productData.daraz_price || 0,
            productData.daraz_offer_discount_type || '',
            productData.daraz_offer_discount_value || 0
          ),
          retail_offer_start_date: productData.retail_offer_start_date || '',
          retail_offer_end_date: productData.retail_offer_end_date || '',
          wholesale_offer_start_date: productData.wholesale_offer_start_date || '',
          wholesale_offer_end_date: productData.wholesale_offer_end_date || '',
          daraz_offer_start_date: productData.daraz_offer_start_date || '',
          daraz_offer_end_date: productData.daraz_offer_end_date || '',
          // Inventory fields
          quantity: productData.inventory?.quantity || 0,
          reserved_quantity: productData.inventory?.reserved_quantity || 0,
          min_stock_level: productData.inventory?.min_stock_level || 0,
          max_stock_level: productData.inventory?.max_stock_level || 0,
          reorder_point: productData.inventory?.reorder_point || 0,
          location: productData.inventory?.location || '',
          // Media fields from product
          youtube_video_url: productData.product?.video_url || '',
          image_gallery: productData.product?.gallery_images || [],
        });
      } catch (error: any) {
        console.error('Failed to fetch product:', error);
        setError('Failed to load product data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Calculate available quantity
  const getAvailableQuantity = () => {
    if (!product?.inventory) return 0;
    return product.inventory.quantity - product.inventory.reserved_quantity;
  };

  // Calculate profit margin
  const getRetailMargin = (price: number, cost: number): number => {
    if (!price || !cost) return 0;
    return ((price - cost) / cost) * 100;
  };

  // Check if an offer is currently active
  const isOfferActive = (startDate?: string, endDate?: string): boolean => {
    if (!startDate || !endDate) return false;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    return now >= start && now <= end;
  };

  // Get offer status
  const getOfferStatus = (startDate?: string, endDate?: string) => {
    if (!startDate || !endDate) return { status: 'none', label: 'No Offer', color: 'gray' };

    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (now < start) return { status: 'upcoming', label: 'Upcoming', color: 'blue' };
    if (now > end) return { status: 'expired', label: 'Expired', color: 'gray' };
    return { status: 'active', label: 'Active', color: 'green' };
  };

  // Calculate offer price from discount
  const calculateOfferPrice = (basePrice: number, discountType: 'flat' | 'percentage' | '', discountValue: number): number => {
    if (!discountType || discountValue === 0) return basePrice;

    if (discountType === 'flat') {
      return Math.max(0, basePrice - discountValue);
    } else if (discountType === 'percentage') {
      return Math.max(0, basePrice - (basePrice * discountValue / 100));
    }

    return basePrice;
  };

  // Get stock status
  const getStockStatus = () => {
    const available = getAvailableQuantity();
    const minStock = product?.inventory?.min_stock_level || 0;

    if (available === 0) return { status: 'out_of_stock', color: 'destructive', label: 'Out of Stock' };
    if (available <= minStock) return { status: 'low_stock', color: 'secondary', label: 'Low Stock' };
    return { status: 'in_stock', color: 'default', label: 'In Stock' };
  };

  // Convert relative storage path to full URL
  const getImageUrl = (imageSrc: string | null | undefined): string | undefined => {
    if (!imageSrc) return undefined;

    if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
      return imageSrc;
    }

    if (imageSrc.startsWith('/storage/')) {
      return `${API_URL}${imageSrc}`;
    }

    if (!imageSrc.startsWith('/')) {
      return `${API_URL}/storage/${imageSrc}`;
    }

    return `${API_URL}${imageSrc}`;
  };

  // Handle save changes
  const handleSaveChanges = async (inventoryOnly: boolean = false) => {
    if (!product?.inventory) return;

    setSaving(true);
    try {
      // Update inventory
      const inventoryPayload = {
        quantity: editForm.quantity,
        reserved_quantity: editForm.reserved_quantity,
        min_stock_level: editForm.min_stock_level,
        max_stock_level: editForm.max_stock_level || null,
        reorder_point: editForm.reorder_point,
        location: editForm.location,
      };

      await apiClient.put(`/admin/inventory/${product.inventory.id}`, inventoryPayload);

      let message = 'Inventory updated successfully!';

      // Update product variant if not inventory only
      if (!inventoryOnly) {
        // Convert offer prices to discount type/value for backend
        const convertOfferPriceToDiscount = (regularPrice: number, offerPrice: number) => {
          if (!offerPrice || offerPrice >= regularPrice) {
            return { type: null, value: null };
          }
          const discountAmount = regularPrice - offerPrice;
          const discountPercentage = (discountAmount / regularPrice) * 100;

          // Use flat if discount is a round number, otherwise percentage
          if (Number.isInteger(discountAmount)) {
            return { type: 'flat', value: discountAmount };
          } else {
            return { type: 'percentage', value: discountPercentage };
          }
        };

        const retailDiscount = convertOfferPriceToDiscount(editForm.retail_price, editForm.retail_offer_price);
        const wholesaleDiscount = convertOfferPriceToDiscount(editForm.wholesale_price, editForm.wholesale_offer_price);
        const darazDiscount = convertOfferPriceToDiscount(editForm.daraz_price, editForm.daraz_offer_price);

        const productPayload = {
          // sku is NOT updated here - managed through product edit only
          // landed_cost is NOT updated here - managed through purchase orders only
          retail_price: editForm.retail_price,
          wholesale_price: editForm.wholesale_price,
          daraz_price: editForm.daraz_price,
          retail_name: editForm.retail_name,
          wholesale_name: editForm.wholesale_name,
          daraz_name: editForm.daraz_name,
          // Offer discount fields (converted from offer prices)
          retail_offer_discount_type: retailDiscount.type,
          retail_offer_discount_value: retailDiscount.value,
          wholesale_offer_discount_type: wholesaleDiscount.type,
          wholesale_offer_discount_value: wholesaleDiscount.value,
          daraz_offer_discount_type: darazDiscount.type,
          daraz_offer_discount_value: darazDiscount.value,
          retail_offer_start_date: editForm.retail_offer_start_date || null,
          retail_offer_end_date: editForm.retail_offer_end_date || null,
          wholesale_offer_start_date: editForm.wholesale_offer_start_date || null,
          wholesale_offer_end_date: editForm.wholesale_offer_end_date || null,
          daraz_offer_start_date: editForm.daraz_offer_start_date || null,
          daraz_offer_end_date: editForm.daraz_offer_end_date || null,
        };

        console.log('Saving product variant:', productPayload);
        const variantResponse = await apiClient.put(`/admin/product-variants/${product.id}`, productPayload);
        console.log('Variant response:', variantResponse.data);

        // Filter gallery images to only include valid URLs (not Data URLs)
        const validGalleryImages = editForm.image_gallery.filter(img => img.startsWith('http'));

        // Update product media fields
        const productUpdatePayload = {
          base_thumbnail_url: product?.product?.base_thumbnail_url,
          video_url: editForm.youtube_video_url || null,
          gallery_images: JSON.stringify(validGalleryImages), // Send as JSON string
        };

        await apiClient.put(`/admin/products/${product.product.id}`, productUpdatePayload);

        message = 'Product and inventory updated successfully!';
      }

      // Refetch all product data from server to get fresh data
      const response = await apiClient.get(`/admin/inventory/stock-summary`);
      const allProducts = response.data;
      const updatedProduct = allProducts.find((p: ProductVariant) => p.id === parseInt(id!));
      if (updatedProduct) {
        console.log('Setting updated product:', updatedProduct);
        setProduct(updatedProduct);
      }

      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      console.error('Failed to save changes:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save changes. Please try again.';
      setError(errorMessage);
      setTimeout(() => setError(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-blue-500 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading product data...</p>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => navigate('/products/stock')} className="flex items-center gap-2 mx-auto">
            <ArrowLeft className="h-4 w-4" />
            Back to Stock Management
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg">
          <div className="flex items-center">
            <Package className="h-4 w-4 mr-2" />
            {successMessage}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            {error}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/products/stock')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Stock Management
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Product & Stock Information</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Summary Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {(() => {
                const thumbnailUrl = product?.product?.base_thumbnail_url;
                const imageUrl = getImageUrl(thumbnailUrl);
                return imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={product?.product?.base_name || 'Product'}
                    className="h-12 w-12 object-cover rounded border"
                  />
                ) : (
                  <div className="h-12 w-12 bg-gray-100 rounded border flex items-center justify-center">
                    <Package className="h-6 w-6 text-gray-400" />
                  </div>
                );
              })()}
              <div>
                <div className="text-sm font-normal text-gray-500">Product Summary</div>
                <div className="text-lg font-semibold">{product?.product?.base_name}</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-xs text-gray-500">SKU</Label>
                <p className="font-medium">{product?.sku}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Available Stock</Label>
                <p className="font-bold text-lg">{getAvailableQuantity()}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Stock Status</Label>
                <Badge variant={getStockStatus().color as any} className="text-xs">
                  {getStockStatus().label}
                </Badge>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Profit Margin</Label>
                <Badge variant={getRetailMargin(product?.retail_price || 0, product?.landed_cost || 0) < 0 ? "destructive" : "secondary"}>
                  {getRetailMargin(product?.retail_price || 0, product?.landed_cost || 0).toFixed(1)}%
                </Badge>
              </div>
            </div>

            {/* Offer Status Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
              <div>
                <Label className="text-xs text-gray-500">Retail Offer</Label>
                <Badge variant={getOfferStatus(product?.retail_offer_start_date, product?.retail_offer_end_date).color === 'green' ? 'default' : 'secondary'} className="text-xs">
                  {getOfferStatus(product?.retail_offer_start_date, product?.retail_offer_end_date).label}
                  {product?.retail_price && product.retail_offer_discount_value != null && product.retail_offer_discount_type && (
                    <span className="ml-1">
                      (৳{calculateOfferPrice(product.retail_price, product.retail_offer_discount_type, product.retail_offer_discount_value).toFixed(2)})
                    </span>
                  )}
                </Badge>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Wholesale Offer</Label>
                <Badge variant={getOfferStatus(product?.wholesale_offer_start_date, product?.wholesale_offer_end_date).color === 'green' ? 'default' : 'secondary'} className="text-xs">
                  {getOfferStatus(product?.wholesale_offer_start_date, product?.wholesale_offer_end_date).label}
                  {product?.wholesale_price && product.wholesale_offer_discount_value != null && product.wholesale_offer_discount_type && (
                    <span className="ml-1">
                      (৳{calculateOfferPrice(product.wholesale_price, product.wholesale_offer_discount_type, product.wholesale_offer_discount_value).toFixed(2)})
                    </span>
                  )}
                </Badge>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Daraz Offer</Label>
                <Badge variant={getOfferStatus(product?.daraz_offer_start_date, product?.daraz_offer_end_date).color === 'green' ? 'default' : 'secondary'} className="text-xs">
                  {getOfferStatus(product?.daraz_offer_start_date, product?.daraz_offer_end_date).label}
                  {product?.daraz_price && product.daraz_offer_discount_value != null && product.daraz_offer_discount_type && (
                    <span className="ml-1">
                      (৳{calculateOfferPrice(product.daraz_price, product.daraz_offer_discount_type, product.daraz_offer_discount_value).toFixed(2)})
                    </span>
                  )}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SKU and Landed Cost */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              Product Information
            </CardTitle>
            <CardDescription>
              Update basic product details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  type="text"
                  value={editForm.sku}
                  disabled
                  className="mt-1 bg-gray-50 cursor-not-allowed"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  SKU cannot be modified
                </p>
              </div>
              <div>
                <Label htmlFor="landed_cost">Landed Cost (৳)</Label>
                <Input
                  id="landed_cost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={editForm.landed_cost}
                  disabled
                  className="mt-1 bg-gray-50 cursor-not-allowed"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  Managed through purchase orders
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform-Specific Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Retail Channel */}
          <Card className="border-red-200">
            <CardHeader className="bg-red-50 border-b border-red-200">
              <CardTitle className="text-base flex items-center gap-2 text-red-700">
                <Package className="h-4 w-4" />
                Retail Channel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {/* Name */}
              <div>
                <Label htmlFor="retail_name" className="text-sm text-red-700">Display Name</Label>
                <Input
                  id="retail_name"
                  type="text"
                  value={editForm.retail_name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, retail_name: e.target.value }))}
                  placeholder="Product display name"
                  className="mt-1"
                />
              </div>

              {/* Price */}
              <div>
                <Label htmlFor="retail_price" className="text-sm text-red-700">Price (৳)</Label>
                <Input
                  id="retail_price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={editForm.retail_price}
                  onChange={(e) => setEditForm(prev => ({ ...prev, retail_price: parseFloat(e.target.value) || 0 }))}
                  className="mt-1"
                />
                {(editForm.retail_price && editForm.landed_cost) && (
                  <div className="mt-1 text-xs">
                    <span className="text-gray-600">Margin: </span>
                    <Badge variant={getRetailMargin(editForm.retail_price, editForm.landed_cost) < 0 ? "destructive" : "secondary"} className="text-xs">
                      {getRetailMargin(editForm.retail_price, editForm.landed_cost).toFixed(1)}%
                    </Badge>
                    <span className="text-gray-600 ml-1">(৳{((editForm.retail_price - editForm.landed_cost)).toFixed(2)})</span>
                  </div>
                )}
              </div>

              {/* Offer Section */}
              <div className="space-y-3 pt-3 border-t">
                <Label className="text-sm font-medium text-red-700">Offer Settings</Label>

                {/* Offer Price Input */}
                <div>
                  <Label htmlFor="retail_offer_price" className="text-xs">Offer Price (৳)</Label>
                  <Input
                    id="retail_offer_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={editForm.retail_offer_price || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, retail_offer_price: parseFloat(e.target.value) || 0 }))}
                    className="mt-1 h-8"
                    placeholder="Enter offer price"
                  />
                </div>

                {/* Offer Preview with Profit */}
                {editForm.retail_offer_price > 0 && (
                  <div className="p-2 bg-red-50 rounded text-xs border border-red-200">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-gray-600">Regular Price:</span>
                      <span className="font-medium">৳{editForm.retail_price.toFixed(2)}</span>
                      <span className="text-gray-600">Offer Price:</span>
                      <span className="font-medium text-green-600">
                        ৳{editForm.retail_offer_price.toFixed(2)}
                      </span>
                      <span className="text-gray-600">Profit:</span>
                      <span className={`font-medium ${editForm.retail_offer_price - editForm.landed_cost > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ৳{(editForm.retail_offer_price - editForm.landed_cost).toFixed(2)}
                        ({getRetailMargin(editForm.retail_offer_price, editForm.landed_cost).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="retail_offer_start" className="text-xs">Start Date</Label>
                    <DatePicker
                      value={editForm.retail_offer_start_date}
                      onChange={(date) => setEditForm(prev => ({ ...prev, retail_offer_start_date: date ? date.toISOString().split('T')[0] : '' }))}
                      placeholder="Select start date"
                    />
                  </div>
                  <div>
                    <Label htmlFor="retail_offer_end" className="text-xs">End Date</Label>
                    <DatePicker
                      value={editForm.retail_offer_end_date}
                      onChange={(date) => setEditForm(prev => ({ ...prev, retail_offer_end_date: date ? date.toISOString().split('T')[0] : '' }))}
                      placeholder="Select end date"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wholesale Channel */}
          <Card className="border-blue-200">
            <CardHeader className="bg-blue-50 border-b border-blue-200">
              <CardTitle className="text-base flex items-center gap-2 text-blue-700">
                <Package className="h-4 w-4" />
                Wholesale Channel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {/* Name */}
              <div>
                <Label htmlFor="wholesale_name" className="text-sm text-blue-700">Display Name</Label>
                <Input
                  id="wholesale_name"
                  type="text"
                  value={editForm.wholesale_name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, wholesale_name: e.target.value }))}
                  placeholder="Wholesale display name"
                  className="mt-1"
                />
              </div>

              {/* Price */}
              <div>
                <Label htmlFor="wholesale_price" className="text-sm text-blue-700">Price (৳)</Label>
                <Input
                  id="wholesale_price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={editForm.wholesale_price}
                  onChange={(e) => setEditForm(prev => ({ ...prev, wholesale_price: parseFloat(e.target.value) || 0 }))}
                  className="mt-1"
                />
                {(editForm.wholesale_price && editForm.landed_cost) && (
                  <div className="mt-1 text-xs">
                    <span className="text-gray-600">Margin: </span>
                    <Badge variant={getRetailMargin(editForm.wholesale_price, editForm.landed_cost) < 0 ? "destructive" : "secondary"} className="text-xs">
                      {getRetailMargin(editForm.wholesale_price, editForm.landed_cost).toFixed(1)}%
                    </Badge>
                    <span className="text-gray-600 ml-1">(৳{((editForm.wholesale_price - editForm.landed_cost)).toFixed(2)})</span>
                  </div>
                )}
              </div>

              {/* Offer Section */}
              <div className="space-y-3 pt-3 border-t">
                <Label className="text-sm font-medium text-blue-700">Offer Settings</Label>

                {/* Offer Price Input */}
                <div>
                  <Label htmlFor="wholesale_offer_price" className="text-xs">Offer Price (৳)</Label>
                  <Input
                    id="wholesale_offer_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={editForm.wholesale_offer_price || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, wholesale_offer_price: parseFloat(e.target.value) || 0 }))}
                    className="mt-1 h-8"
                    placeholder="Enter offer price"
                  />
                </div>

                {/* Offer Preview with Profit */}
                {editForm.wholesale_offer_price > 0 && (
                  <div className="p-2 bg-blue-50 rounded text-xs border border-blue-200">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-gray-600">Regular Price:</span>
                      <span className="font-medium">৳{editForm.wholesale_price.toFixed(2)}</span>
                      <span className="text-gray-600">Offer Price:</span>
                      <span className="font-medium text-green-600">
                        ৳{editForm.wholesale_offer_price.toFixed(2)}
                      </span>
                      <span className="text-gray-600">Profit:</span>
                      <span className={`font-medium ${editForm.wholesale_offer_price - editForm.landed_cost > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ৳{(editForm.wholesale_offer_price - editForm.landed_cost).toFixed(2)}
                        ({getRetailMargin(editForm.wholesale_offer_price, editForm.landed_cost).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="wholesale_offer_start" className="text-xs">Start Date</Label>
                    <DatePicker
                      value={editForm.wholesale_offer_start_date}
                      onChange={(date) => setEditForm(prev => ({ ...prev, wholesale_offer_start_date: date ? date.toISOString().split('T')[0] : '' }))}
                      placeholder="Select start date"
                    />
                  </div>
                  <div>
                    <Label htmlFor="wholesale_offer_end" className="text-xs">End Date</Label>
                    <DatePicker
                      value={editForm.wholesale_offer_end_date}
                      onChange={(date) => setEditForm(prev => ({ ...prev, wholesale_offer_end_date: date ? date.toISOString().split('T')[0] : '' }))}
                      placeholder="Select end date"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daraz Channel */}
          <Card className="border-orange-200">
            <CardHeader className="bg-orange-50 border-b border-orange-200">
              <CardTitle className="text-base flex items-center gap-2 text-orange-700">
                <Package className="h-4 w-4" />
                Daraz Channel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {/* Name */}
              <div>
                <Label htmlFor="daraz_name" className="text-sm text-orange-700">Display Name</Label>
                <Input
                  id="daraz_name"
                  type="text"
                  value={editForm.daraz_name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, daraz_name: e.target.value }))}
                  placeholder="Daraz display name"
                  className="mt-1"
                />
              </div>

              {/* Price */}
              <div>
                <Label htmlFor="daraz_price" className="text-sm text-orange-700">Price (৳)</Label>
                <Input
                  id="daraz_price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={editForm.daraz_price}
                  onChange={(e) => setEditForm(prev => ({ ...prev, daraz_price: parseFloat(e.target.value) || 0 }))}
                  className="mt-1"
                />
                {(editForm.daraz_price && editForm.landed_cost) && (
                  <div className="mt-1 text-xs">
                    <span className="text-gray-600">Margin: </span>
                    <Badge variant={getRetailMargin(editForm.daraz_price, editForm.landed_cost) < 0 ? "destructive" : "secondary"} className="text-xs">
                      {getRetailMargin(editForm.daraz_price, editForm.landed_cost).toFixed(1)}%
                    </Badge>
                    <span className="text-gray-600 ml-1">(৳{((editForm.daraz_price - editForm.landed_cost)).toFixed(2)})</span>
                  </div>
                )}
              </div>

              {/* Offer Section */}
              <div className="space-y-3 pt-3 border-t">
                <Label className="text-sm font-medium text-orange-700">Offer Settings</Label>

                {/* Offer Price Input */}
                <div>
                  <Label htmlFor="daraz_offer_price" className="text-xs">Offer Price (৳)</Label>
                  <Input
                    id="daraz_offer_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={editForm.daraz_offer_price || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, daraz_offer_price: parseFloat(e.target.value) || 0 }))}
                    className="mt-1 h-8"
                    placeholder="Enter offer price"
                  />
                </div>

                {/* Offer Preview with Profit */}
                {editForm.daraz_offer_price > 0 && (
                  <div className="p-2 bg-orange-50 rounded text-xs border border-orange-200">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-gray-600">Regular Price:</span>
                      <span className="font-medium">৳{editForm.daraz_price.toFixed(2)}</span>
                      <span className="text-gray-600">Offer Price:</span>
                      <span className="font-medium text-green-600">
                        ৳{editForm.daraz_offer_price.toFixed(2)}
                      </span>
                      <span className="text-gray-600">Profit:</span>
                      <span className={`font-medium ${editForm.daraz_offer_price - editForm.landed_cost > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ৳{(editForm.daraz_offer_price - editForm.landed_cost).toFixed(2)}
                        ({getRetailMargin(editForm.daraz_offer_price, editForm.landed_cost).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="daraz_offer_start" className="text-xs">Start Date</Label>
                    <DatePicker
                      value={editForm.daraz_offer_start_date}
                      onChange={(date) => setEditForm(prev => ({ ...prev, daraz_offer_start_date: date ? date.toISOString().split('T')[0] : '' }))}
                      placeholder="Select start date"
                    />
                  </div>
                  <div>
                    <Label htmlFor="daraz_offer_end" className="text-xs">End Date</Label>
                    <DatePicker
                      value={editForm.daraz_offer_end_date}
                      onChange={(date) => setEditForm(prev => ({ ...prev, daraz_offer_end_date: date ? date.toISOString().split('T')[0] : '' }))}
                      placeholder="Select end date"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

          {/* Inventory Management */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4 text-green-600" />
                Inventory Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="quantity" className="text-xs">Total Stock</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    value={editForm.quantity}
                    onChange={(e) => setEditForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                    className="mt-1 h-8 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="reserved_quantity" className="text-xs">Reserved Stock</Label>
                  <Input
                    id="reserved_quantity"
                    type="number"
                    min="0"
                    value={editForm.reserved_quantity}
                    onChange={(e) => setEditForm(prev => ({ ...prev, reserved_quantity: parseInt(e.target.value) || 0 }))}
                    className="mt-1 h-8 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="text-xs">Location</Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="Warehouse A"
                    value={editForm.location}
                    onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                    className="mt-1 h-8 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="min_stock_level" className="text-xs">Min Stock</Label>
                  <Input
                    id="min_stock_level"
                    type="number"
                    min="0"
                    value={editForm.min_stock_level}
                    onChange={(e) => setEditForm(prev => ({ ...prev, min_stock_level: parseInt(e.target.value) || 0 }))}
                    className="mt-1 h-8 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="reorder_point" className="text-xs">Reorder Point</Label>
                  <Input
                    id="reorder_point"
                    type="number"
                    min="0"
                    value={editForm.reorder_point}
                    onChange={(e) => setEditForm(prev => ({ ...prev, reorder_point: parseInt(e.target.value) || 0 }))}
                    className="mt-1 h-8 text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Actions */}
        <div className="flex justify-end gap-3 mt-8 bg-white p-4 rounded-lg shadow-lg border">
          <Button
            variant="secondary"
            onClick={() => handleSaveChanges(true)}
            disabled={saving}
          >
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Inventory Only
              </>
            )}
          </Button>
          <Button
            onClick={() => handleSaveChanges(false)}
            disabled={saving}
          >
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving All...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save All Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}