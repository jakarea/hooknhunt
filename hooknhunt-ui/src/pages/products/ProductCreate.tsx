import { useNavigate } from 'react-router-dom';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { ProductForm } from '@/components/forms/ProductForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package } from 'lucide-react';

const ProductCreate = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/dashboard/products');
  };

  const handleSuccess = () => {
    navigate('/dashboard/products');
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
                <p className="text-gray-600 mt-1">Add a new product to your catalog with pricing and details</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <RoleGuard allowedRoles={['super_admin', 'admin', 'store_keeper']}>
        <div className="container mx-auto px-6 py-8 max-w-4xl">
          <div className="space-y-6">
            {/* Instructions Card */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <Package className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Quick Guide</h3>
                  <p className="text-red-800 text-sm">
                    Fill in the required information below. Fields marked with <span className="text-red-500">*</span> are required.
                    Make sure to set appropriate pricing for different channels and add relevant tags for better searchability.
                    Products will be saved as draft by default.
                  </p>
                </div>
              </div>
            </div>

            {/* Product Form */}
            <ProductForm onClose={handleSuccess} />
          </div>
        </div>
      </RoleGuard>
    </div>
  );
};

export default ProductCreate;