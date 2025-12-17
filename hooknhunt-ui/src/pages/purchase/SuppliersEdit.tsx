import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { SupplierForm } from '@/components/forms/SupplierForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import api from '@/lib/api';

const SuppliersEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSupplier = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        console.log('📡 Fetching supplier details for ID:', id);

        const response = await api.get(`/admin/suppliers/${id}`);
        console.log('✅ Supplier details fetched:', response.data);

        setSupplier(response.data);
      } catch (error: any) {
        console.error('❌ Error fetching supplier:', error);
        toast({
          title: "Error",
          description: "Failed to load supplier details.",
          variant: "destructive"
        });
        setSupplier(null);
        navigate('/purchase/suppliers');
      } finally {
        setIsLoading(false);
      }
    };

    loadSupplier();
  }, [id, navigate]);

  const handleBack = () => {
    navigate('/purchase/suppliers');
  };

  const handleSuccess = () => {
    navigate('/purchase/suppliers');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center">
              <Button variant="ghost" onClick={handleBack} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Suppliers
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
                  <Skeleton className="h-5 w-5" />
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

                {/* Payment Methods Section */}
                <div className="space-y-6">
                  <Skeleton className="h-6 w-48" />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

  if (!supplier) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <Skeleton className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Supplier Not Found</h3>
              <p className="text-gray-600 mb-4">The supplier you're looking for doesn't exist.</p>
              <Button onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Suppliers
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
              <Button
                variant="ghost"
                onClick={handleBack}
                className="mr-4 hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Suppliers
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Supplier</h1>
                <p className="text-gray-600 mt-1">
                  Updating <span className="font-semibold text-primary">{supplier.name}</span>
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
            {/* Supplier Info Card */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center gap-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <Skeleton className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 mb-1">Editing Supplier</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-red-800">
                    <span className="flex items-center gap-1">
                      ID: {supplier.id}
                    </span>
                    <span className="flex items-center gap-1">
                      Shop: {supplier.shop_name || 'N/A'}
                    </span>
                    <span className="flex items-center gap-1">
                      Email: {supplier.email || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Supplier Form */}
            <SupplierForm initialData={supplier} onClose={handleSuccess} />
          </div>
        </div>
      </RoleGuard>
    </div>
  );
};

export default SuppliersEdit;