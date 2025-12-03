import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Edit,
  Package,
  BarChart3,
  Truck,
  ExternalLink,
  Calendar,
  Hash,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { ProductImage } from '@/components/ProductImage';
import { useProductStore } from '@/stores/productStore';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, isLoading, error, fetchProduct } = useProductStore();

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

  const handleEdit = () => {
    navigate(`/dashboard/products/${id}/edit`);
  };

  const handleBack = () => {
    navigate('/dashboard/products');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
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
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{product.base_name}</h1>
              <Badge variant={product.status === 'published' ? 'default' : 'secondary'}>
                {product.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mt-1">/{product.slug}</p>
          </div>
        </div>
        <RoleGuard allowedRoles={['super_admin', 'admin', 'store_keeper']}>
          <Button onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </RoleGuard>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Image & Basic Info */}
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Image */}
                <div className="flex justify-center items-start">
                  <ProductImage
                    src={product.base_thumbnail_url}
                    alt={product.base_name || 'Product'}
                    size="lg"
                    className="border rounded-lg"
                  />
                </div>

                {/* Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Description
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {product.meta_description || 'No description available.'}
                    </p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <Hash className="h-3 w-3" />
                        Product ID
                      </p>
                      <p className="text-sm font-medium">{product.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Created
                      </p>
                      <p className="text-sm font-medium">
                        {new Date(product.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {product.gallery_images && product.gallery_images.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                          <ImageIcon className="h-3 w-3" />
                          Gallery Images
                        </p>
                        <p className="text-sm font-medium">{product.gallery_images.length} image(s)</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Suppliers */}
          {product.suppliers && product.suppliers.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  Suppliers ({product.suppliers.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {product.suppliers.map((productSupplier, index) => (
                    <div
                      key={productSupplier.supplier_id}
                      className={`p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors ${
                        index !== product.suppliers!.length - 1 ? 'mb-2' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <button
                          onClick={() => navigate(`/dashboard/suppliers/${productSupplier.supplier_id}`)}
                          className="font-medium text-gray-900 hover:text-blue-600 transition-colors text-left text-sm"
                        >
                          {productSupplier.supplier?.name || 'Unknown Supplier'}
                        </button>
                        {productSupplier.supplier?.email && (
                          <Badge variant="outline" className="text-xs">
                            {productSupplier.supplier.email}
                          </Badge>
                        )}
                      </div>

                      {productSupplier.supplier?.shop_name && (
                        <p className="text-xs text-gray-600 mb-2">
                          {productSupplier.supplier.shop_name}
                        </p>
                      )}

                      {productSupplier.supplier_product_urls && productSupplier.supplier_product_urls.length > 0 && (
                        <div className="space-y-1 mt-2">
                          {productSupplier.supplier_product_urls.map((url, urlIndex) => (
                            <a
                              key={urlIndex}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              <ExternalLink className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{url}</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* SEO Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                SEO Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Meta Title</p>
                <p className="text-sm text-gray-900">{product.meta_title || 'Not set'}</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-gray-500 mb-1">Meta Description</p>
                <p className="text-sm text-gray-900">{product.meta_description || 'Not set'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Publication</span>
                <Badge variant={product.status === 'published' ? 'default' : 'secondary'}>
                  {product.status}
                </Badge>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Created</span>
                <span className="text-gray-900 text-xs">
                  {new Date(product.created_at).toLocaleDateString()}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Updated</span>
                <span className="text-gray-900 text-xs">
                  {new Date(product.updated_at).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Slug</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded block overflow-x-auto">
                  {product.slug}
                </code>
              </div>
              {product.base_thumbnail_url && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Thumbnail</p>
                    <a
                      href={product.base_thumbnail_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View Image
                    </a>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <RoleGuard allowedRoles={['super_admin', 'admin', 'store_keeper']}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Actions</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <Button onClick={handleEdit} className="w-full" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Product
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Truck className="h-4 w-4 mr-2" />
                  Manage Inventory
                </Button>
              </CardContent>
            </Card>
          </RoleGuard>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
