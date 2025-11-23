import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  Edit,
  Package,
  Tag,
  DollarSign,
  BarChart3,
  Truck,
  Box,
  Eye,
  Share2
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import api from '@/lib/api';
import { ProductImage } from '@/components/ProductImage';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        console.log('📡 Fetching product details for ID:', id);

        const response = await api.get(`/admin/products/${id}`);
        console.log('✅ Product details fetched:', response.data);

        setProduct(response.data);
      } catch (error: any) {
        console.error('❌ Error fetching product:', error);
        toast({
          title: "Error",
          description: "Failed to load product details.",
          variant: "destructive"
        });
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  const handleEdit = () => {
    navigate(`/dashboard/products/${id}/edit`);
  };

  const handleBack = () => {
    navigate('/dashboard/products');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Button variant="ghost" onClick={handleBack} className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Products
                </Button>
                <div>
                  <Skeleton className="h-9 w-64 mb-2" />
                  <Skeleton className="h-5 w-48" />
                </div>
              </div>
              <Skeleton className="h-11 w-24" />
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-24" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Not Found</h3>
              <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
              <Button onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" onClick={handleBack} className="mr-4 hover:bg-gray-100">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{product.base_name || product.name}</h1>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-gray-600">Slug: {product.slug}</span>
                  <Badge variant={product.status === 'published' ? 'default' : 'secondary'}>
                    {product.status === 'published' ? 'Published' : 'Draft'}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <RoleGuard allowedRoles={['super_admin', 'admin', 'store_keeper']}>
                <Button onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </RoleGuard>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Product Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  Product Image
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ProductImage
                  src={product.base_thumbnail_url}
                  alt={product.base_name || product.name || 'Product'}
                  size="lg"
                  className="border-2 border-gray-200"
                />
              </CardContent>
            </Card>

            {/* Product Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  Product Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-gray-600 leading-relaxed">
                    {product.meta_description || 'No description available.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <h4 className="font-medium text-gray-500">Product ID</h4>
                    <p className="text-gray-900">{product.id}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-500">Status</h4>
                    <Badge variant={product.status === 'published' ? 'default' : 'secondary'}>
                      {product.status === 'published' ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-500">Slug</h4>
                    <p className="text-gray-900 font-mono text-sm">{product.slug}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-500">Created</h4>
                    <p className="text-gray-900">
                      {product.created_at ? new Date(product.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  {product.base_thumbnail_url && (
                    <div className="md:col-span-2">
                      <h4 className="font-medium text-gray-500">Thumbnail URL</h4>
                      <p className="text-gray-900 text-sm break-all">{product.base_thumbnail_url}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            {(product.gallery_images && Array.isArray(product.gallery_images) && product.gallery_images.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    Gallery Images
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">
                    {product.gallery_images.length} image(s) in gallery
                  </div>
                </CardContent>
              </Card>
            )}

            {/* SEO Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  SEO Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-500">Meta Title</h4>
                  <p className="text-gray-900">{product.meta_title}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-500">Meta Description</h4>
                  <p className="text-gray-900">{product.meta_description}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Pricing & Actions */}
          <div className="space-y-6">
            {/* Product Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  Product Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Status</span>
                  <Badge variant={product.status === 'published' ? 'default' : 'secondary'}>
                    {product.status === 'published' ? 'Published' : 'Draft'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="font-medium">Created</span>
                  <span className="text-sm text-gray-600">
                    {product.created_at ? new Date(product.created_at).toLocaleString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="font-medium">Last Updated</span>
                  <span className="text-sm text-gray-600">
                    {product.updated_at ? new Date(product.updated_at).toLocaleString() : 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-muted-foreground" />
                  Product Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Status</span>
                  <Badge variant={product.status === 'published' ? 'default' : 'secondary'}>
                    {product.status === 'published' ? 'Live' : 'Draft'}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Last Updated</span>
                  <span className="text-sm text-gray-600">
                    {new Date(product.updated_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Created</span>
                  <span className="text-sm text-gray-600">
                    {new Date(product.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <RoleGuard allowedRoles={['super_admin', 'admin', 'store_keeper']}>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={handleEdit} className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Product
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Truck className="h-4 w-4 mr-2" />
                    Manage Inventory
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Box className="h-4 w-4 mr-2" />
                    View Orders
                  </Button>
                </CardContent>
              </Card>
            </RoleGuard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;