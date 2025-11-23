import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { ProductForm } from '@/components/forms/ProductForm';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Package } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import api from '@/lib/api';

const ProductEdit = () => {
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
        navigate('/dashboard/products');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  const handleBack = () => {
    navigate('/dashboard/products');
  };

  const handleSuccess = () => {
    navigate('/dashboard/products');
  };

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center">
              <Button variant="ghost" onClick={handleBack} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Button>
              <div>
                <Skeleton className="h-9 w-48 mb-2" />
                <Skeleton className="h-5 w-64" />
              </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="container mx-auto px-6 py-8 max-w-4xl">
          <div className="space-y-6">
            {/* Instructions Card Skeleton */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <Package className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>

            {/* Form Skeleton */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="space-y-8">
                {/* Basic Information Section */}
                <div className="space-y-6">
                  <Skeleton className="h-6 w-48" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton className="h-11 w-full" />
                    <Skeleton className="h-11 w-full" />
                  </div>
                </div>

                {/* Pricing Section */}
                <div className="space-y-6">
                  <Skeleton className="h-6 w-48" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Skeleton className="h-11 w-full" />
                    <Skeleton className="h-11 w-full" />
                    <Skeleton className="h-11 w-full" />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-8 border-t border-gray-200">
                  <Skeleton className="h-11 w-20" />
                  <Skeleton className="h-11 w-32" />
                </div>
              </div>
            </div>
          </div>
        </div>
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
              <Button
                variant="ghost"
                onClick={handleBack}
                className="mr-4 hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
                <p className="text-gray-600 mt-1">
                  Updating <span className="font-semibold text-primary">{product.base_name || product.name}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <RoleGuard allowedRoles={['super_admin', 'admin', 'store_keeper']}>
        <div className="container mx-auto px-6 py-8 max-w-4xl">
          <div className="space-y-6">
            {/* Product Info Card */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center gap-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <Package className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 mb-1">Editing Product</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-red-800">
                    <span className="flex items-center gap-1">
                      ID: {product.id}
                    </span>
                    <span className="flex items-center gap-1">
                      Slug: {product.slug}
                    </span>
                    <span className="flex items-center gap-1">
                      Status: {product.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Form */}
            <ProductForm initialData={product} onClose={handleSuccess} />
          </div>
        </div>
      </RoleGuard>
    </div>
  );
};

export default ProductEdit;