import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  ArrowLeft,
  Edit,
  Package,
  Truck,
  Calendar,
  FileText,
  DollarSign,
  Tag,
  PackageOpen,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Star,
  Settings,
  Globe,
  Hash,
  Link,
  Image,
  Eye,
  Play
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { ProductImage } from '@/components/ProductImage';
import { useProductStore } from '@/stores/productStore';

// Helper function to extract YouTube video ID from URL
const getYouTubeVideoId = (url: string): string => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : '';
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, isLoading, error, fetchProduct } = useProductStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      try {
        await fetchProduct(Number(id));
      } catch (error: any) {
        console.error('❌ Error fetching product:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load product details.",
          variant: "destructive"
        });
      }
    };

    loadProduct();
  }, [id, fetchProduct]);

  // Debug: Log product data when it changes
  useEffect(() => {
    if (product) {
      console.log('📦 Product data loaded:', product);
      console.log('📦 Variants:', product.variants);
      console.log('📦 Categories:', product.categories);
      console.log('📦 Suppliers:', product.suppliers);
    }
  }, [product]);

  const handleEdit = () => {
    navigate(`/products/${id}/edit`);
  };

  const handleBack = () => {
    navigate('/products');
  };

  // Get all images (thumbnail + gallery)
  const getAllImages = () => {
    const images = [];
    if (product?.base_thumbnail_url) {
      images.push(product.base_thumbnail_url);
    }
    if (product?.gallery_images && product.gallery_images.length > 0) {
      images.push(...product.gallery_images);
    }
    return images;
  };

  const allImages = getAllImages();

  // Format currency
  const formatCurrency = (amount?: number | string) => {
    if (!amount) return '৳0';
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return '৳0';
    return `৳${numAmount.toLocaleString('en-BD', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;
  };

  // Get stock status with icon and color
  const getStockStatus = (stock?: number | string, isLowStock?: boolean) => {
    const stockNum = typeof stock === 'string' ? parseInt(stock) : (stock || 0);
    if (!stockNum || stockNum === 0) {
      return {
        icon: XCircle,
        text: 'Out of Stock',
        color: 'text-red-600',
        bgColor: 'bg-red-50'
      };
    }
    if (isLowStock) {
      return {
        icon: AlertCircle,
        text: 'Low Stock',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50'
      };
    }
    return {
      icon: CheckCircle,
        text: 'In Stock',
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      };
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card><CardContent className="p-6"><Skeleton className="h-32 w-full" /></CardContent></Card>
            <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
          </div>
          <div className="space-y-4">
            <Card><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
            <Card><CardContent className="p-6"><Skeleton className="h-32 w-full" /></CardContent></Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Not Found</h3>
            <p className="text-gray-600 mb-4">{error || "The product you're looking for doesn't exist."}</p>
            <Button onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleBack} className="h-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="h-4 w-px bg-border" />
            <Package className="h-5 w-5 text-primary" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold">{product.base_name}</h1>
                <Badge variant={product.status === 'published' ? 'default' : 'secondary'} className="text-xs">
                  {product.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">ID: #{product.id}</p>
            </div>
          </div>
          <RoleGuard allowedRoles={['super_admin', 'admin', 'store_keeper', 'marketer']}>
            <Button onClick={handleEdit} size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Product
            </Button>
          </RoleGuard>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="specs">Specs</TabsTrigger>
              <TabsTrigger value="variants">Variants</TabsTrigger>
              <TabsTrigger value="relations">Relations</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Product Info Card with Stats */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">{product.base_name}</h3>
                          <Badge variant={product.status === 'published' ? 'default' : 'secondary'}>
                            {product.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600">{product.description || 'No description available'}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">{product.variants?.length || 0}</p>
                            <p className="text-xs text-gray-500">Variants</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{allImages.length}</p>
                            <p className="text-xs text-gray-500">Images</p>
                          </div>
                          <RoleGuard allowedRoles={['super_admin', 'admin', 'store_keeper']} hide>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-orange-600">{product.suppliers?.length || 0}</p>
                              <p className="text-xs text-gray-500">Suppliers</p>
                            </div>
                          </RoleGuard>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-purple-600">
                              {product.variants?.reduce((sum, v) => sum + (v.available_stock || 0), 0) || 0}
                            </p>
                            <p className="text-xs text-gray-500">Total Stock</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

{/* Quick Actions - Horizontal */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">Product Thumbnail</CardTitle>
                  </CardHeader>
                  <CardContent>
                   {product.base_thumbnail_url && (
                    <div>
                      
                      <div className="rounded-lg overflow-hidden border-2 border-gray-200">
                        <ProductImage
                          src={product.base_thumbnail_url}
                          alt={`${product.base_name} thumbnail`}
                          size="lg"
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    </div>
                  )}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                
              </div>
<div className="space-y">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => navigate(`/products/${product.id}/edit`)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Product
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => window.open(`/products/${product.slug}`, '_blank')}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View in Store
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => window.open(`/products/${product.id}/gallery`, '_blank')}
                      >
                        <Image className="h-4 w-4 mr-2" />
                        Manage Gallery
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              {/* Media Display */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Product Media</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Product Thumbnail */}
                  

                  {/* Product Video */}
                  {product.video_url && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Play className="h-4 w-4 text-primary" />
                        <h4 className="text-sm font-medium text-gray-900">Product Video</h4>
                      </div>
                      <div className="rounded-lg overflow-hidden border-2 border-gray-200">
                        {product.video_url.includes('youtube.com') || product.video_url.includes('youtu.be') ? (
                          // YouTube Video Embed
                          <div className="relative w-full h-48 bg-gray-100">
                            <iframe
                              src={`https://www.youtube.com/embed/${getYouTubeVideoId(product.video_url)}`}
                              title={`${product.base_name} video`}
                              className="absolute top-0 left-0 w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        ) : (
                          // Regular Video
                          <video
                            src={product.video_url}
                            title={`${product.base_name} video`}
                            className="w-full h-48 object-cover"
                            controls
                            preload="metadata"
                          >
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </div>
                      <div className="mt-2">
                        <a
                          href={product.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          Open video in new tab
                        </a>
                      </div>
                    </div>
                  )}

                  {/* No Media Message */}
                  {!product.base_thumbnail_url && !product.video_url && (
                    <div className="text-center py-6">
                      <Image className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">No media available for this product</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Basic Product Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Product Name</p>
                        <p className="font-medium">{product.base_name || 'Not set'}</p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Slug</p>
                        <p className="font-mono text-sm">{product.slug || 'Not set'}</p>
                      </div>

                      {product.sku && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">SKU</p>
                          <p className="font-mono text-sm">{product.sku}</p>
                        </div>
                      )}

                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Status</p>
                        <div className="flex items-center gap-2">
                          <Badge variant={product.status === 'published' ? 'default' : 'secondary'}>
                            {product.status}
                          </Badge>
                          {product.is_featured && (
                            <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Description</p>
                        <p className="text-sm leading-relaxed max-h-32 overflow-y-auto">
                          {product.description || 'No description available'}
                        </p>
                      </div>

                      {product.short_description && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Short Description</p>
                          <p className="text-sm leading-relaxed">{product.short_description}</p>
                        </div>
                      )}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Created Date
                        </p>
                        <p className="text-sm">
                          {new Date(product.created_at).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(product.created_at).toLocaleTimeString('en-US')}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Last Updated
                        </p>
                        <p className="text-sm">
                          {new Date(product.updated_at).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(product.updated_at).toLocaleTimeString('en-US')}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <Hash className="h-3 w-3" />
                          Product ID
                        </p>
                        <p className="font-mono text-sm">#{product.id}</p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <Settings className="h-3 w-3" />
                          Physical Attributes
                        </p>
                        <div className="text-sm space-y-1">
                          {product.weight && (
                            <p><span className="text-muted-foreground">Weight:</span> {product.weight}g</p>
                          )}
                          {product.dimensions && (
                            <p><span className="text-muted-foreground">Dimensions:</span> {product.dimensions}</p>
                          )}
                          {!product.weight && !product.dimensions && (
                            <p className="text-muted-foreground">Not specified</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          Tags
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {product.tags && Array.isArray(product.tags) && product.tags.length > 0 ? (
                            product.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))
                          ) : product.tags && typeof product.tags === 'string' ? (
                            // Handle case where tags come as a comma-separated string
                            product.tags.split(',').map((tag: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag.trim()}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">No tags</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SEO Tab */}
            <TabsContent value="seo" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    SEO Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Meta Title</p>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="font-medium">
                        {product.meta_title || product.base_name || 'No meta title set'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Character count: {(product.meta_title || product.base_name || '').length}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Meta Description</p>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-sm leading-relaxed">
                        {product.meta_description || 'No meta description set'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Character count: {(product.meta_description || '').length}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Meta Keywords</p>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      {product.meta_keywords && typeof product.meta_keywords === 'string' ? (
                        <div className="flex flex-wrap gap-1">
                          {product.meta_keywords.split(',').map((keyword: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {keyword.trim()}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No meta keywords set</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-2">URL Slug</p>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="font-mono text-sm">{product.slug || 'No slug set'}</p>
                    </div>
                  </div>

                  {/* SEO Preview */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Google Search Preview</p>
                    <div className="border rounded-lg p-4 bg-white">
                      <div className="text-sm">
                        <p className="text-blue-600 text-base font-medium hover:underline cursor-pointer mb-1">
                          {((product.meta_title || product.base_name || 'Product Title')).substring(0, 70)}{((product.meta_title || product.base_name || 'Product Title').length > 70) ? '...' : ''}
                        </p>
                        <p className="text-green-600 text-xs mb-2">
                          https://yourstore.com/products/{product.slug || 'product-url'}
                        </p>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {((product.meta_description || product.description || 'No description available')).substring(0, 160)}{((product.meta_description || product.description || 'No description available').length > 160) ? '...' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Gallery Tab */}
            <TabsContent value="gallery" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Product Gallery ({allImages.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Main Image Display */}
                    <div className="flex justify-center">
                      <div className="aspect-square w-full max-w-md rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
                        <ProductImage
                          src={allImages[selectedImageIndex]}
                          alt={`Product image ${selectedImageIndex + 1}`}
                          size="xl"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Thumbnail Gallery */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-4">
                        Click on any image to view full size
                      </p>
                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                        {allImages.map((image, index) => (
                          <div
                            key={index}
                            className={`aspect-square cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                              index === selectedImageIndex
                                ? 'border-blue-500 shadow-lg scale-105'
                                : 'border-gray-200 hover:border-gray-400 hover:scale-105'
                            }`}
                            onClick={() => setSelectedImageIndex(index)}
                          >
                            <ProductImage
                              src={image}
                              alt={`Product image ${index + 1}`}
                              size="sm"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Gallery Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Gallery Management</h4>
                      <p className="text-sm text-blue-800">
                        This product has {allImages.length} image{allImages.length !== 1 ? 's' : ''} in the gallery.
                        The first image is used as the product thumbnail.
                        To manage gallery images, edit the product in the admin panel.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Specifications Tab */}
            <TabsContent value="specs" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Product Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {product.specifications && typeof product.specifications === 'object' && Object.keys(product.specifications).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="border-b pb-3">
                          <div className="flex justify-between items-start">
                            <p className="text-sm font-medium capitalize">{key.replace(/_/g, ' ')}</p>
                            <p className="text-sm text-gray-600 text-right max-w-xs">
                              {typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value || '')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Settings className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Specifications</h3>
                      <p className="text-gray-600">This product doesn't have any specifications defined.</p>
                    </div>
                  )}

                  {/* Raw JSON View */}
                  {product.specifications && (
                    <div className="mt-6">
                      <p className="text-xs text-muted-foreground mb-2">Raw Specifications (JSON)</p>
                      <div className="p-3 bg-gray-50 rounded-lg border max-h-64 overflow-y-auto">
                        <pre className="text-xs font-mono">
                          {JSON.stringify(product.specifications, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Variants & Pricing Tab */}
            <TabsContent value="variants" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Product Variants & Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {product.variants && product.variants.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>SKU</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead className="text-right">Retail</TableHead>
                          <TableHead className="text-right">Wholesale</TableHead>
                          <TableHead className="text-right">Daraz</TableHead>
                          <TableHead className="text-right">Landed Cost</TableHead>
                          <TableHead className="text-right">Retail Margin</TableHead>
                          <TableHead>Stock</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {product.variants.map((variant) => {
                          const stockStatus = getStockStatus(variant.available_stock, variant.is_low_stock);
                          const StockIcon = stockStatus.icon;

                          return (
                            <TableRow key={variant.id}>
                              <TableCell className="font-mono text-xs">{variant.sku}</TableCell>
                              <TableCell>
                                <div>
                                  <p className="font-medium text-sm">{variant.retail_name || variant.sku}</p>
                                  {variant.wholesale_name && variant.wholesale_name !== variant.retail_name && (
                                    <p className="text-xs text-muted-foreground">WS: {variant.wholesale_name}</p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <span className="text-blue-600 font-medium">
                                  {formatCurrency(variant.retail_price)}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <span className="text-green-600 font-medium">
                                  {formatCurrency(variant.wholesale_price)}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <span className="text-orange-600 font-medium">
                                  {formatCurrency(variant.daraz_price)}
                                </span>
                              </TableCell>
                              <TableCell className="text-right text-muted-foreground">
                                {formatCurrency(variant.landed_cost)}
                              </TableCell>
                              <TableCell className="text-right">
                                <div>
                                  <p className="text-sm font-medium text-green-600">
                                    {formatCurrency(variant.retail_margin)}
                                  </p>
                                  {variant.retail_margin_percentage && (
                                    <p className="text-xs text-muted-foreground">
                                      {variant.retail_margin_percentage.toFixed(1)}%
                                    </p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${stockStatus.bgColor}`}>
                                  <StockIcon className={`h-3 w-3 ${stockStatus.color}`} />
                                  <span className={`text-xs font-medium ${stockStatus.color}`}>
                                    {variant.available_stock || 0}
                                  </span>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Variants</h3>
                      <p className="text-gray-600">This product doesn't have any variants yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Variants Summary */}
              {product.variants && product.variants.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Package className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{product.variants.length}</p>
                      <p className="text-sm text-muted-foreground">Total Variants</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold">
                        {formatCurrency(product.variants.reduce((sum, v) => sum + (v.retail_price || 0), 0))}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Retail Value</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <PackageOpen className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold">
                        {product.variants.reduce((sum, v) => sum + (v.available_stock || 0), 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Stock</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold">
                        {product.variants.filter(v => v.is_low_stock).length}
                      </p>
                      <p className="text-sm text-muted-foreground">Low Stock Items</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* Inventory Tab */}
            <TabsContent value="inventory" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <PackageOpen className="h-4 w-4" />
                    Inventory Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {product.variants && product.variants.length > 0 ? (
                    <div className="space-y-4">
                      {product.variants.map((variant) => {
                        const stockStatus = getStockStatus(variant.available_stock, variant.is_low_stock);
                        const StockIcon = stockStatus.icon;

                        return (
                          <div key={variant.id} className="p-4 border rounded-lg">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-semibold">{variant.retail_name || variant.sku}</h4>
                                <p className="text-sm text-muted-foreground">SKU: {variant.sku}</p>
                              </div>
                              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${stockStatus.bgColor}`}>
                                <StockIcon className={`h-4 w-4 ${stockStatus.color}`} />
                                <span className={`text-sm font-medium ${stockStatus.color}`}>
                                  {stockStatus.text}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-xs text-muted-foreground">Available</p>
                                <p className="font-medium text-green-600">{variant.available_stock || 0}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Reserved</p>
                                <p className="font-medium text-orange-600">
                                  {variant.current_stock && variant.available_stock ?
                                    variant.current_stock - variant.available_stock : 0
                                  }
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Total Stock</p>
                                <p className="font-medium">{variant.current_stock || 0}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Reorder Level</p>
                                <p className="font-medium">
                                  {variant.inventory && Array.isArray(variant.inventory) && variant.inventory.length > 0
                                    ? variant.inventory[0].reorder_level
                                    : 'Not set'
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <PackageOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Inventory Data</h3>
                      <p className="text-gray-600">This product doesn't have inventory tracking enabled.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Relations Tab */}
            <TabsContent value="relations" className="space-y-4">
              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Categories ({product.categories?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {product.categories && product.categories.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {product.categories.map((category) => (
                        <Badge key={category.id} variant="outline" className="text-sm">
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No categories assigned</p>
                  )}
                </CardContent>
              </Card>

              {/* Suppliers - Hidden from marketers */}
              <RoleGuard allowedRoles={['super_admin', 'admin', 'store_keeper']} hide>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Suppliers ({product.suppliers?.length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {product.suppliers && product.suppliers.length > 0 ? (
                      <div className="p-6 pt-0 flex gap-3">
                        {product.suppliers.map((supplierItem) => (
                        <div
                          key={supplierItem.supplier_id || supplierItem.supplier?.id}
                          className="p-3 border rounded-lg"
                        >
                          <div className="flex items-center justify-between gap-4">
                            {/* LEFT */}
                            <div className="min-w-0">
                              <Button
                                variant="link"
                                className="p-0 h-auto font-semibold text-left truncate"
                                onClick={() => navigate(`/suppliers/${supplierItem.supplier?.id}`)}
                              >
                                {supplierItem.supplier?.name}
                              </Button>

                              {supplierItem.supplier?.shop_name && (
                                <p className="text-sm text-muted-foreground truncate">
                                  {supplierItem.supplier.shop_name}
                                </p>
                              )}
                            </div>

                            {/* RIGHT */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {supplierItem.supplier?.email && (
                                <Badge variant="outline" className="text-xs whitespace-nowrap">
                                  {supplierItem.supplier.email}
                                </Badge>
                              )}

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/suppliers/${supplierItem.supplier?.id}`)}
                              >
                                View Profile
                              </Button>
                            </div>
                          </div>
                        </div>
                        ))}
                      </div>

                    ) : (
                      <p className="text-sm text-muted-foreground">No suppliers assigned</p>
                    )}
                  </CardContent>
                </Card>
              </RoleGuard>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;