import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { ProductForm } from '@/components/forms/ProductForm';
import { ProductSuppliersTab } from '@/components/forms/product/ProductSuppliersTab';
import { ProductSeoTab } from '@/components/forms/product/ProductSeoTab';
import { ProductGalleryTab } from '@/components/forms/product/ProductGalleryTab';
import { ProductSpecsTab } from '@/components/forms/product/ProductSpecsTab';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { SimpleTabs as Tabs, SimpleTabsContent as TabsContent, SimpleTabsList as TabsList, SimpleTabsTrigger as TabsTrigger } from '@/components/ui/simple-tabs';
import { ArrowLeft, Package, FileText, Building, Search, Image, Settings } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useProductStore } from '@/stores/productStore';
import { useAuthStore } from '@/stores/authStore';
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
  category_ids?: number[] | string[];
  base_thumbnail_url?: string | null;
  gallery_images?: string[] | null;
  specifications?: Record<string, any> | null;
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
  const [searchParams] = useSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchProduct } = useProductStore();
  const user = useAuthStore((state) => state.user);

  // Debug: Log when component mounts
  useEffect(() => {
    console.log('🚀 ProductEdit component mounted');
    console.log('📋 Product ID from URL:', id);
    console.log('🔍 URL params:', Object.fromEntries(searchParams.entries()));
  }, [id, searchParams]);

  // Get the tab from URL parameters, default to 'details', but prioritize 'suppliers' when coming from create
  // Marketers default to 'details' if tab is 'suppliers' since they can't access suppliers
  const urlTab = searchParams.get('tab');
  const activeTab = (urlTab === 'suppliers' && user?.role === 'marketer') ? 'details' : (urlTab || 'details');

  // Check if we came from create page and handle tab activation
  useEffect(() => {
    // If URL has tab=suppliers, we're coming from create workflow
    if (urlTab === 'suppliers') {
      console.log('📋 Coming from create workflow, activating suppliers tab');
      // Optional: Set a session flag for additional tracking if needed
      sessionStorage.setItem('cameFromCreateProduct', 'true');
      // Clear it immediately since we already have the URL parameter
      setTimeout(() => {
        sessionStorage.removeItem('cameFromCreateProduct');
      }, 100);
    }
  }, [urlTab]);

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
        console.log('📡 Initial Load API Response:', response);
        console.log('📦 Initial Load Response data:', response.data);

        // Handle both nested and direct response structures
        const productData = response.data.data || response.data;
        console.log('🏷️ Initial Load Final product data:', productData);
        console.log('👥 Initial Load Suppliers in product:', productData.suppliers);

        setProduct(productData);
      } catch (error: any) {
        console.error('❌ Error fetching product:', error);
        toast({
          title: "Error",
          description: "Failed to load product details.",
          variant: "destructive"
        });
        setProduct(null);
        navigate('/inventory/products');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate, fetchProduct]);

  const handleBack = () => {
    navigate('/products');
  };

  const handleSuccess = () => {
    navigate('/products');
  };

  const handleProductUpdated = () => {
    // Refresh product data when main product form is updated
    if (product?.id) {
      console.log('🔄 handleProductUpdated called for product:', product.id);
      fetchProduct(product.id).then(() => {
        // Re-fetch from API to get updated product data (including gallery_images)
        api.get(`/admin/products/${product.id}?include=suppliers`)
          .then(response => {
            console.log('📡 Product Updated API Response:', response);

            // Handle both nested and direct response structures
            const productData = response.data.data || response.data;
            console.log('🏷️ Updated product data:', productData);
            console.log('🖼️ Gallery images in updated product:', productData.gallery_images);

            setProduct(productData);
          })
          .catch(error => {
            console.error('❌ Error fetching updated product:', error);
          });
      });
    }
  };

  const handleSuppliersUpdated = () => {
    // Refresh product data when suppliers are updated
    if (product?.id) {
      console.log('🔄 handleSuppliersUpdated called for product:', product.id);
      fetchProduct(product.id).then(() => {
        // Re-fetch from API to get updated product with suppliers
        api.get(`/admin/products/${product.id}?include=suppliers`)
          .then(response => {
            console.log('📡 API Response:', response);
            console.log('📦 Response data:', response.data);

            // Handle both nested and direct response structures
            const productData = response.data.data || response.data;
            console.log('🏷️ Final product data:', productData);
            console.log('👥 Suppliers in product:', productData.suppliers);

            setProduct(productData);
          })
          .catch(error => {
            console.error('❌ Error fetching updated product:', error);
          });
      });
    }
  };

  if (isLoading || !product) {
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
              <Skeleton className="h-6 w-48" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="max-w-5xl mx-auto px-6 py-6">
            <div className="bg-white rounded-lg border p-6">
              <Skeleton className="h-8 w-32 mb-4" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
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
                <h1 className="text-lg font-semibold">Edit Product</h1>
                <Badge variant={product.status === 'published' ? 'default' : 'secondary'} className="text-xs">
                  {product.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <RoleGuard allowedRoles={['super_admin', 'admin', 'store_keeper', 'marketer']}>
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="max-w-5xl mx-auto px-6 py-6">
            {/* Tabs Container */}
            <div className="bg-white rounded-lg border">
              <Tabs defaultValue={activeTab} className="w-full">
                {/* Tab Headers */}
                <div className="border-b px-6 pt-4">
                  <TabsList className="w-full justify-start rounded-none border-b-0 bg-transparent h-auto p-0">
                    <TabsTrigger
                      value="details"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Details
                    </TabsTrigger>
                    <RoleGuard allowedRoles={['super_admin', 'admin', 'store_keeper']} hide>
                      <TabsTrigger
                        value="suppliers"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                      >
                        <Building className="h-4 w-4 mr-2" />
                        Suppliers ({product.suppliers?.length || 0})
                      </TabsTrigger>
                    </RoleGuard>
                    <TabsTrigger
                      value="gallery"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                    >
                      <Image className="h-4 w-4 mr-2" />
                      Gallery
                    </TabsTrigger>
                    <TabsTrigger
                      value="specs"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Specs
                    </TabsTrigger>
                    <TabsTrigger
                      value="seo"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      SEO
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  <TabsContent value="details" className="mt-0">
                    <ProductForm
                      initialData={product}
                      onClose={handleSuccess}
                      onProductUpdated={handleProductUpdated}
                    />
                  </TabsContent>

                  <RoleGuard allowedRoles={['super_admin', 'admin', 'store_keeper']} hide>
                    <TabsContent value="suppliers" className="mt-0">
                      <ProductSuppliersTab product={product as any} onSuppliersUpdated={handleSuppliersUpdated} />
                    </TabsContent>
                  </RoleGuard>

                  <TabsContent value="gallery" className="mt-0">
                    <ProductGalleryTab product={product} onGalleryUpdated={handleProductUpdated} />
                  </TabsContent>

                  <TabsContent value="specs" className="mt-0">
                    <ProductSpecsTab product={product} onSpecsUpdated={handleProductUpdated} />
                  </TabsContent>

                  <TabsContent value="seo" className="mt-0">
                    <ProductSeoTab product={product} onSeoUpdated={handleSuppliersUpdated} />
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