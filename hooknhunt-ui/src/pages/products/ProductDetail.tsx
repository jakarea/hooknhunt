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
    navigate(`/inventory/products/${id}/edit`);
  };

  const handleBack = () => {
    navigate('/inventory/products');
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
    <div className="flex flex-col h-full">
      {/* Compact Header */}
      <div className="border-b bg-white">
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
            </div>
          </div>
          <RoleGuard allowedRoles={['super_admin', 'admin', 'store_keeper']}>
            <Button onClick={handleEdit} size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </RoleGuard>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 py-6 space-y-4">
          {/* Product Image & Description */}
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-6">
                {/* Image */}
                <div className="flex-shrink-0">
                  <ProductImage
                    src={product.base_thumbnail_url}
                    alt={product.base_name || 'Product'}
                    size="lg"
                    className="border rounded-lg"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {product.meta_description || 'No description available.'}
                    </p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Product ID</p>
                      <p className="font-medium">#{product.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Created</p>
                      <p className="font-medium">
                        {new Date(product.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    {product.gallery_images && product.gallery_images.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Gallery Images</p>
                        <p className="font-medium">{product.gallery_images.length} image(s)</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Suppliers */}
          {product.suppliers && product.suppliers.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  Suppliers ({product.suppliers.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {product.suppliers.map((productSupplier) => (
                    <div
                      key={productSupplier.supplier_id}
                      className="p-3 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <button
                          onClick={() => navigate(`/purchase/suppliers/${productSupplier.supplier_id}`)}
                          className="font-medium text-sm hover:text-primary transition-colors text-left"
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
                        <p className="text-xs text-muted-foreground mb-2">
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
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                SEO Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Meta Title</p>
                  <p className="font-medium">{product.meta_title || 'Not set'}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Meta Description</p>
                  <p className="font-medium">{product.meta_description || 'Not set'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
