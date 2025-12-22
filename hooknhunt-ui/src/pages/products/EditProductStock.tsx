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
  Plus,
  Minus,
  TrendingUp,
  TrendingDown,
  AlertCircle
} from 'lucide-react';
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
  const [uploadingImages, setUploadingImages] = useState(false);

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
    // Offer discount fields
    retail_offer_discount_type: '' as 'flat' | 'percentage' | '',
    retail_offer_discount_value: 0,
    wholesale_offer_discount_type: '' as 'flat' | 'percentage' | '',
    wholesale_offer_discount_value: 0,
    daraz_offer_discount_type: '' as 'flat' | 'percentage' | '',
    daraz_offer_discount_value: 0,
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
          // Offer discount fields
          retail_offer_discount_type: productData.retail_offer_discount_type || '',
          retail_offer_discount_value: productData.retail_offer_discount_value || 0,
          wholesale_offer_discount_type: productData.wholesale_offer_discount_type || '',
          wholesale_offer_discount_value: productData.wholesale_offer_discount_value || 0,
          daraz_offer_discount_type: productData.daraz_offer_discount_type || '',
          daraz_offer_discount_value: productData.daraz_offer_discount_value || 0,
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
      return `http://localhost:8000${imageSrc}`;
    }

    if (!imageSrc.startsWith('/')) {
      return `http://localhost:8000/storage/${imageSrc}`;
    }

    return `http://localhost:8000${imageSrc}`;
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
        const productPayload = {
          sku: editForm.sku,
          landed_cost: editForm.landed_cost,
          retail_price: editForm.retail_price,
          wholesale_price: editForm.wholesale_price,
          daraz_price: editForm.daraz_price,
          retail_name: editForm.retail_name,
          wholesale_name: editForm.wholesale_name,
          daraz_name: editForm.daraz_name,
          // Offer discount fields
          retail_offer_discount_type: editForm.retail_offer_discount_type || null,
          retail_offer_discount_value: editForm.retail_offer_discount_value || null,
          wholesale_offer_discount_type: editForm.wholesale_offer_discount_type || null,
          wholesale_offer_discount_value: editForm.wholesale_offer_discount_value || null,
          daraz_offer_discount_type: editForm.daraz_offer_discount_type || null,
          daraz_offer_discount_value: editForm.daraz_offer_discount_value || null,
          retail_offer_start_date: editForm.retail_offer_start_date || null,
          retail_offer_end_date: editForm.retail_offer_end_date || null,
          wholesale_offer_start_date: editForm.wholesale_offer_start_date || null,
          wholesale_offer_end_date: editForm.wholesale_offer_end_date || null,
          daraz_offer_start_date: editForm.daraz_offer_start_date || null,
          daraz_offer_end_date: editForm.daraz_offer_end_date || null,
        };

        await apiClient.put(`/admin/product-variants/${product.id}`, productPayload);

        // Filter gallery images to only include valid URLs (not Data URLs)
        const validGalleryImages = editForm.image_gallery.filter(img => img.startsWith('http'));
        console.log('Form gallery images:', editForm.image_gallery);
        console.log('Valid gallery images:', validGalleryImages);

        // Update product media fields
        const productUpdatePayload = {
          base_thumbnail_url: product?.product?.base_thumbnail_url,
          video_url: editForm.youtube_video_url || null,
          gallery_images: validGalleryImages, // Always send the array, even if empty
        };

        await apiClient.put(`/admin/products/${product.product.id}`, productUpdatePayload);

        message = 'Product and inventory updated successfully!';

        // Update local product state with the valid gallery images
        setProduct(prev => prev ? {
          ...prev,
          ...productPayload,
          product: {
            ...prev.product,
            video_url: editForm.youtube_video_url,
            gallery_images: validGalleryImages,
          }
        } : null);
      }

      // Update local inventory state
      setProduct(prev => prev ? {
        ...prev,
        inventory: {
          ...prev.inventory!,
          ...inventoryPayload
        }
      } : null);

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

  // Handle stock adjustment
  const handleStockAdjustment = async (adjustment: number) => {
    if (!product) return;

    try {
      await apiClient.post('/admin/inventory/add-stock', {
        items: [{
          product_variant_id: product.id,
          quantity: Math.abs(adjustment),
          unit_cost: null,
          location: null,
        }]
      });

      // Refresh product data
      const response = await apiClient.get(`/admin/inventory/stock-summary`);
      const allProducts = response.data;
      const updatedProduct = allProducts.find((p: ProductVariant) => p.id === product.id);
      setProduct(updatedProduct || null);

      setEditForm(prev => ({
        ...prev,
        quantity: updatedProduct.inventory?.quantity || 0
      }));

      setSuccessMessage(`Stock ${adjustment > 0 ? 'increased' : 'decreased'} successfully!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      console.error('Failed to adjust stock:', error);
      setError('Failed to adjust stock. Please try again.');
      setTimeout(() => setError(null), 5000);
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
                <p className="text-sm text-gray-600">
                  {product?.product?.base_name} - {product?.retail_name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => handleStockAdjustment(-1)}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Minus className="h-4 w-4" />
                Decrease Stock
              </Button>
              <Button
                variant="outline"
                onClick={() => handleStockAdjustment(1)}
                className="flex items-center gap-2 text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <Plus className="h-4 w-4" />
                Increase Stock
              </Button>
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
              Product Summary
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
                  {product?.retail_price && product.retail_offer_discount_value && product.retail_offer_discount_type && (
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
                  {product?.wholesale_price && product.wholesale_offer_discount_value && product.wholesale_offer_discount_type && (
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
                  {product?.daraz_price && product.daraz_offer_discount_value && product.daraz_offer_discount_type && (
                    <span className="ml-1">
                      (৳{calculateOfferPrice(product.daraz_price, product.daraz_offer_discount_type, product.daraz_offer_discount_value).toFixed(2)})
                    </span>
                  )}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Thumbnail Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Product Media</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Thumbnail Display */}
              <div>
                <Label className="text-sm font-medium mb-3">Product Thumbnail</Label>
                <div className="border rounded-lg p-4 bg-gray-50">
                  {(() => {
                    const thumbnailUrl = product?.product?.base_thumbnail_url;
                    const imageUrl = getImageUrl(thumbnailUrl);

                    return imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product?.product?.base_name || 'Product'}
                        className="w-full h-48 object-cover rounded border bg-white"
                      />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-white">
                        <div className="text-center">
                          <Package className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">No thumbnail available</p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* YouTube Video */}
              <div>
                <Label className="text-sm font-medium mb-3">YouTube Video URL</Label>
                <Input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={editForm.youtube_video_url || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, youtube_video_url: e.target.value }))}
                  className="mb-2"
                />
                {editForm.youtube_video_url && (
                  <div className="mt-2 p-2 bg-gray-100 rounded">
                    <p className="text-xs text-gray-600">Preview:</p>
                    <iframe
                      width="100%"
                      height="150"
                      src={`https://www.youtube.com/embed/${editForm.youtube_video_url.split('v=')[1]?.split('&')[0] || ''}`}
                      title="Product Video"
                      className="rounded border"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Image Gallery */}
            <div className="mt-6">
              <Label className="text-sm font-medium mb-3">Image Gallery</Label>
              <div className="grid grid-cols-4 gap-3">
                {editForm.image_gallery && editForm.image_gallery.length > 0 ? (
                  editForm.image_gallery.map((image: string, index: number) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.startsWith('http') ? image : `http://localhost:8000/storage/${image}`}
                        alt={`Gallery Image ${index + 1}`}
                        className="w-full h-20 object-cover rounded border cursor-pointer hover:border-blue-500"
                        onClick={() => window.open(image.startsWith('http') ? image : `http://localhost:8000/storage/${image}`, '_blank')}
                      />
                      <button
                        onClick={() => {
                          const updatedGallery = editForm.image_gallery.filter((_, i) => i !== index);
                          setEditForm(prev => ({
                            ...prev,
                            image_gallery: updatedGallery
                          }));
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-4 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No images in gallery</p>
                  </div>
                )}

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files);
                      if (files.length === 0) return;

                      setUploadingImages(true);
                      setError(null);

                      // Upload each file immediately and get URLs
                      const uploadPromises = files.map(async (file) => {
                        const formData = new FormData();
                        formData.append('image', file);

                        try {
                          const response = await apiClient.post('/admin/products/upload-gallery-image', formData, {
                            headers: {
                              'Content-Type': 'multipart/form-data',
                            },
                          });
                          return response.data.url; // Backend should return the uploaded image URL
                        } catch (error) {
                          console.error('Failed to upload image:', error);
                          setError(`Failed to upload ${file.name}`);
                          return null;
                        }
                      });

                      const uploadedUrls = await Promise.all(uploadPromises);
                      const validUrls = uploadedUrls.filter(url => url !== null);

                      if (validUrls.length > 0) {
                        setEditForm(prev => ({
                          ...prev,
                          image_gallery: [...(prev.image_gallery || []), ...validUrls]
                        }));
                      }

                      setUploadingImages(false);
                    }}
                    className="hidden"
                    id="gallery-upload"
                  />
                  <label htmlFor="gallery-upload" className="cursor-pointer">
                    {uploadingImages ? (
                      <div className="flex flex-col items-center">
                        <RefreshCw className="h-6 w-6 text-blue-600 mx-auto mb-1 animate-spin" />
                        <p className="text-xs text-blue-600">Uploading images...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Package className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">Click to upload images</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Product Information
              </CardTitle>
              <CardDescription>
                Update basic product details and pricing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    type="text"
                    value={editForm.sku}
                    onChange={(e) => setEditForm(prev => ({ ...prev, sku: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="landed_cost">Landed Cost (৳)</Label>
                  <Input
                    id="landed_cost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={editForm.landed_cost}
                    onChange={(e) => setEditForm(prev => ({ ...prev, landed_cost: parseFloat(e.target.value) || 0 }))}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Channel Pricing */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Channel Pricing</Label>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="retail_price" className="text-sm text-red-700">Retail Price (৳)</Label>
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
                  <div>
                    <Label htmlFor="wholesale_price" className="text-sm text-blue-700">Wholesale Price (৳)</Label>
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
                  <div>
                    <Label htmlFor="daraz_price" className="text-sm text-orange-700">Daraz Price (৳)</Label>
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
                </div>
              </div>

              {/* Offer Pricing */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Offer Pricing & Dates</Label>
                <div className="space-y-3">
                  {/* Retail Offers */}
                  <div className="border rounded-lg p-3">
                    <h5 className="text-sm font-medium text-red-700 mb-2">
                      Retail Channel Offers
                      {editForm.retail_name && (
                        <span className="text-xs text-gray-600 ml-2">({editForm.retail_name})</span>
                      )}
                    </h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="retail_offer_discount_type" className="text-xs">Discount Type</Label>
                        <select
                          value={editForm.retail_offer_discount_type}
                          onChange={(e) => setEditForm(prev => ({ ...prev, retail_offer_discount_type: e.target.value as 'flat' | 'percentage' | '' }))}
                          className="mt-1 w-full h-8 px-2 border rounded text-xs"
                        >
                          <option value="">No Discount</option>
                          <option value="flat">Flat Amount (৳)</option>
                          <option value="percentage">Percentage (%)</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="retail_offer_discount_value" className="text-xs">Discount Value</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={editForm.retail_offer_discount_value || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, retail_offer_discount_value: parseFloat(e.target.value) || 0 }))}
                          className="mt-1 h-8"
                          placeholder={editForm.retail_offer_discount_type === 'percentage' ? 'e.g., 10 for 10%' : 'e.g., 100 for ৳100'}
                        />
                      </div>
                    </div>
                    {editForm.retail_offer_discount_type && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-gray-600">Regular Price:</span>
                          <span className="font-medium">৳{editForm.retail_price.toFixed(2)}</span>
                          <span className="text-gray-600">Offer Price:</span>
                          <span className="font-medium text-green-600">
                            ৳{calculateOfferPrice(editForm.retail_price, editForm.retail_offer_discount_type, editForm.retail_offer_discount_value).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3 mt-3">
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

                  {/* Wholesale Offers */}
                  <div className="border rounded-lg p-3">
                    <h5 className="text-sm font-medium text-blue-700 mb-2">
                      Wholesale Channel Offers
                      {editForm.wholesale_name && (
                        <span className="text-xs text-gray-600 ml-2">({editForm.wholesale_name})</span>
                      )}
                    </h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="wholesale_offer_discount_type" className="text-xs">Discount Type</Label>
                        <select
                          value={editForm.wholesale_offer_discount_type}
                          onChange={(e) => setEditForm(prev => ({ ...prev, wholesale_offer_discount_type: e.target.value as 'flat' | 'percentage' | '' }))}
                          className="mt-1 w-full h-8 px-2 border rounded text-xs"
                        >
                          <option value="">No Discount</option>
                          <option value="flat">Flat Amount (৳)</option>
                          <option value="percentage">Percentage (%)</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="wholesale_offer_discount_value" className="text-xs">Discount Value</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={editForm.wholesale_offer_discount_value || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, wholesale_offer_discount_value: parseFloat(e.target.value) || 0 }))}
                          className="mt-1 h-8"
                          placeholder={editForm.wholesale_offer_discount_type === 'percentage' ? 'e.g., 5 for 5%' : 'e.g., 50 for ৳50'}
                        />
                      </div>
                    </div>
                    {editForm.wholesale_offer_discount_type && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-gray-600">Regular Price:</span>
                          <span className="font-medium">৳{editForm.wholesale_price.toFixed(2)}</span>
                          <span className="text-gray-600">Offer Price:</span>
                          <span className="font-medium text-green-600">
                            ৳{calculateOfferPrice(editForm.wholesale_price, editForm.wholesale_offer_discount_type, editForm.wholesale_offer_discount_value).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3 mt-3">
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

                  {/* Daraz Offers */}
                  <div className="border rounded-lg p-3">
                    <h5 className="text-sm font-medium text-orange-700 mb-2">
                      Daraz Channel Offers
                      {editForm.daraz_name && (
                        <span className="text-xs text-gray-600 ml-2">({editForm.daraz_name})</span>
                      )}
                    </h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="daraz_offer_discount_type" className="text-xs">Discount Type</Label>
                        <select
                          value={editForm.daraz_offer_discount_type}
                          onChange={(e) => setEditForm(prev => ({ ...prev, daraz_offer_discount_type: e.target.value as 'flat' | 'percentage' | '' }))}
                          className="mt-1 w-full h-8 px-2 border rounded text-xs"
                        >
                          <option value="">No Discount</option>
                          <option value="flat">Flat Amount (৳)</option>
                          <option value="percentage">Percentage (%)</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="daraz_offer_discount_value" className="text-xs">Discount Value</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={editForm.daraz_offer_discount_value || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, daraz_offer_discount_value: parseFloat(e.target.value) || 0 }))}
                          className="mt-1 h-8"
                          placeholder={editForm.daraz_offer_discount_type === 'percentage' ? 'e.g., 15 for 15%' : 'e.g., 150 for ৳150'}
                        />
                      </div>
                    </div>
                    {editForm.daraz_offer_discount_type && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-gray-600">Regular Price:</span>
                          <span className="font-medium">৳{editForm.daraz_price.toFixed(2)}</span>
                          <span className="text-gray-600">Offer Price:</span>
                          <span className="font-medium text-green-600">
                            ৳{calculateOfferPrice(editForm.daraz_price, editForm.daraz_offer_discount_type, editForm.daraz_offer_discount_value).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3 mt-3">
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
                </div>
              </div>

              {/* Channel Names */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Channel Names</Label>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="retail_name" className="text-sm text-red-700">Retail Name</Label>
                    <Input
                      id="retail_name"
                      type="text"
                      value={editForm.retail_name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, retail_name: e.target.value }))}
                      placeholder="Product display name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="wholesale_name" className="text-sm text-blue-700">Wholesale Name</Label>
                    <Input
                      id="wholesale_name"
                      type="text"
                      value={editForm.wholesale_name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, wholesale_name: e.target.value }))}
                      placeholder="Wholesale display name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="daraz_name" className="text-sm text-orange-700">Daraz Name</Label>
                    <Input
                      id="daraz_name"
                      type="text"
                      value={editForm.daraz_name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, daraz_name: e.target.value }))}
                      placeholder="Daraz display name"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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

              {/* Quick Actions */}
              <div className="border-t pt-2">
                <Label className="text-xs font-medium">Quick Stock Adjustments</Label>
                <div className="flex gap-1 mt-1">
                  <Button
                    variant="outline"
                    onClick={() => handleStockAdjustment(-5)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 px-2 text-xs"
                  >
                    -5
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleStockAdjustment(-1)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 px-2 text-xs"
                  >
                    -1
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleStockAdjustment(1)}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50 h-7 px-2 text-xs"
                  >
                    +1
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleStockAdjustment(5)}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50 h-7 px-2 text-xs"
                  >
                    +5
                  </Button>
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