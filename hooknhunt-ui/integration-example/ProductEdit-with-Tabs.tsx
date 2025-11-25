// Example: Updated ProductEdit.tsx with Shadcn Tabs and ProductSuppliersTab integration

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { ProductForm } from '@/components/forms/ProductForm';
import { ProductSuppliersTab } from '@/components/forms/product/ProductSuppliersTab';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Package, FileText, Building } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useProductStore } from '@/stores/productStore';
import api from '@/lib/api';

// Inline type definition to avoid import issues
interface Product {
  id: number;
  base_name: string;
  slug: string;
  status: 'draft' | 'published';
  meta_title?: string;
  meta_description?: string;
  description?: string; // Legacy field for backward compatibility
  category_id?: number; // Legacy field for backward compatibility
  base_thumbnail_url?: string | null;
  gallery_images?: string[] | null;
  suppliers?: Array<{
    supplier_id: number;
    supplier_product_urls: string[];
    supplier?: {
      id: number;
      name: string;
      shop_name?: string;
      email?: string;
    };
  }>;
  created_at: string;
  updated_at: string;
}

const ProductEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchProduct } = useProductStore();

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        console.log('📡 Fetching product details for ID:', id);

        // Use productStore to fetch product with suppliers included
        await fetchProduct(parseInt(id));

        // Also fetch from API directly to get product data for form
        const response = await api.get(`/admin/products/${id}?include=suppliers`);
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
  }, [id, navigate, fetchProduct]);

  const handleBack = () => {
    navigate('/dashboard/products');
  };

  const handleSuccess = () => {
    navigate('/dashboard/products');
  };

  const handleSuppliersUpdated = () => {
    // Refresh product data when suppliers are updated
    if (product?.id) {
      fetchProduct(product.id).then(() => {
        // Re-fetch from API to get updated product with suppliers
        api.get(`/admin/products/${product.id}?include=suppliers`)
          .then(response => {
            setProduct(response.data);
          });
      });
    }
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

            {/* Tabs Skeleton */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <div className="flex space-x-8 px-6 pt-6">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
              <div className="p-8">
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2" />
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
                  Updating <span className="font-semibold text-primary">{product.base_name}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <RoleGuard allowedRoles={['super_admin', 'admin', 'store_keeper']}>
        <div className="container mx-auto px-6 py-8 max-w-6xl">
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

            {/* Tabs Container */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <Tabs defaultValue="details" className="w-full">
                {/* Tab Headers */}
                <div className="border-b border-gray-200">
                  <TabsList className="w-full justify-start rounded-none border-b-0 bg-transparent px-6">
                    <TabsTrigger
                      value="details"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Product Details
                    </TabsTrigger>
                    <TabsTrigger
                      value="suppliers"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none"
                    >
                      <Building className="h-4 w-4 mr-2" />
                      Suppliers ({product.suppliers?.length || 0})
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  <TabsContent value="details" className="mt-0">
                    <ProductForm initialData={product} onClose={handleSuccess} />
                  </TabsContent>

                  <TabsContent value="suppliers" className="mt-0">
                    <ProductSuppliersTab
                      product={product}
                      // The component will handle its own state management and updates
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </RoleGuard>
    </div>
  );
};

export default ProductEdit;