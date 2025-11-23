import { useNavigate } from 'react-router-dom';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { SupplierForm } from '@/components/forms/SupplierForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

const SuppliersCreate = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/dashboard/suppliers');
  };

  const handleSuccess = () => {
    navigate('/dashboard/suppliers');
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
                Back to Suppliers
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Create New Supplier</h1>
                <p className="text-gray-600 mt-1">Add a new supplier to your contact list</p>
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
            <Card>
              <CardHeader>
                <CardTitle>Supplier Information</CardTitle>
                <CardDescription>
                  Please fill in the required information. Fields marked with <span className="text-red-500">*</span> are required.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SupplierForm onClose={handleSuccess} />
              </CardContent>
            </Card>
          </div>
        </div>
      </RoleGuard>
    </div>
  );
};

export default SuppliersCreate;