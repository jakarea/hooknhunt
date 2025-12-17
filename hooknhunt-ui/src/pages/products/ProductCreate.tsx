import { useNavigate } from 'react-router-dom';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { ProductForm } from '@/components/forms/ProductForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, Info, Building } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const ProductCreate = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/inventory/products');
  };

  const handleProductCreated = (createdProduct: any) => {
    console.log('🔄 Redirecting to edit page for product:', createdProduct);

    toast({
      title: "Product Created Successfully! 🎉",
      description: (
        <div>
          <p>"{createdProduct.base_name}" created!</p>
          <p className="text-sm mt-1">Redirecting to add <span className="font-semibold">Suppliers</span>...</p>
        </div>
      ),
      duration: 3000,
    });

    // Immediate redirect with tab parameter to open Suppliers tab
    setTimeout(() => {
      navigate(`/inventory/products/${createdProduct.id}/edit?tab=suppliers`);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Compact Header */}
      <div className="border-b bg-white">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="h-8"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="h-4 w-px bg-border" />
            <Package className="h-5 w-5 text-primary" />
            <div>
              <h1 className="text-lg font-semibold">Create Product</h1>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            Draft Mode
          </Badge>
        </div>
      </div>

      {/* Info Banner */}
      <div className="border-b bg-blue-50">
        <div className="px-6 py-3">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-900">
              Fill in the required fields below. After creating the product, you'll be automatically redirected to the edit page with the <span className="font-semibold">Suppliers</span> tab open to start adding suppliers.
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <RoleGuard allowedRoles={['super_admin', 'admin', 'store_keeper']}>
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <ProductForm
              initialData={undefined}
              onProductCreated={handleProductCreated}
              onClose={() => {
                // Don't allow closing on create - user should go through the flow
                // But provide a way to cancel if needed
                if (window.confirm('Are you sure you want to discard this product creation?')) {
                  handleBack();
                }
              }}
            />
          </div>
        </div>
      </RoleGuard>
    </div>
  );
};

export default ProductCreate;