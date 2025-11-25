import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { ProductForm } from '@/components/forms/ProductForm';
import { ProductSuppliersTab } from '@/components/forms/product/ProductSuppliersTab';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Package, Building, Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import api from '@/lib/api';

// Define Product interface inline to avoid import issues
interface Product {
  id: number;
  base_name: string;
  slug: string;
  status: 'draft' | 'published';
  meta_title?: string;
  meta_description?: string;
  description?: string;
  category_id?: number;
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

const ProductCreate = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize a temporary product with empty suppliers for creation
  useEffect(() => {
    setProduct({
      id: 0, // temporary ID
      base_name: '',
      slug: '',
      status: 'draft',
      suppliers: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Product);
  }, []);

  const handleBack = () => {
    navigate('/dashboard/products');
  };

  const handleSuccess = () => {
    // Refresh the product data to show updated suppliers
    if (product) {
      // We'll need to fetch the actual product after creation
      // For now, just navigate
    }
    navigate('/dashboard/products');
  };

  const handleProductCreated = (createdProduct: any) => {
    // Update the product state with the created product data
    setProduct({
      ...createdProduct,
      suppliers: createdProduct.suppliers || [],
    });

    // Show success toast
    toast({
      title: "Product Created",
      description: `"${createdProduct.base_name}" has been created successfully! You can now add suppliers.`,
    });
  };

  const handleSuppliersUpdated = () => {
    // Refresh product data when suppliers are updated
    if (product && product.id > 0) {
      api.get(`/admin/products/${product.id}?include=suppliers`)
        .then(response => {
          // Handle both nested and direct response structures
          const productData = response.data.data || response.data;
          setProduct({
            ...product,
            suppliers: productData.suppliers || [],
          });
        })
        .catch(error => {
          console.error('Failed to refresh suppliers:', error);
        });
    }
  };

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
                <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
                <p className="text-gray-600 mt-1">Add a new product to your catalog with suppliers and details</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - 2 Column Layout */}
      <RoleGuard allowedRoles={['super_admin', 'admin', 'store_keeper']}>
        <div className="container mx-auto px-6 py-8">
          {/* Instructions Card */}
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <Package className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Create New Product & Add Suppliers</h3>
                  <p className="text-red-800 text-sm">
                    <strong>Step 1:</strong> Fill in the required product details and create the product.<br/>
                    <strong>Step 2:</strong> Add suppliers and their product URLs in the right column.<br/>
                    Fields marked with <span className="text-red-500">*</span> are required.
                    Products will be saved as draft by default.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Two Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
            {/* Left Column - Product Form (6/12) */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Information</h2>
                <ProductForm
                  initialData={undefined}
                  onProductCreated={handleProductCreated}
                  onClose={handleSuccess}
                />
              </div>
            </div>

            {/* Right Column - Suppliers (6/12) */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    Suppliers
                  </h2>
                  <div className="flex items-center gap-2">
                    {product?.id && product?.id > 0 ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                        Product Created
                      </span>
                    ) : (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                        Step 1: Create Product
                      </span>
                    )}
                    <div className="text-sm text-gray-600">
                      {product?.suppliers?.length || 0} supplier{(product?.suppliers?.length || 0) !== 1 ? 's' : ''} added
                    </div>
                  </div>
                </div>

                {product?.id && product?.id > 0 ? (
                  <ProductSuppliersTab
                    product={product}
                    onSuppliersUpdated={handleSuppliersUpdated}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Building className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium mb-2">Create Product First</p>
                    <p className="text-gray-400 text-sm max-w-xs">
                      Fill in the product details on the left and click "Create Product" to enable supplier management.
                    </p>
                  </div>
                )}
              </div>

              {/* Add More Suppliers Button - Note: This is already in ProductSuppliersTab */}
              {/* The "Add more button" functionality is built into the ProductSuppliersTab component */}
            </div>
          </div>
        </div>
      </RoleGuard>
    </div>
  );
};

export default ProductCreate;