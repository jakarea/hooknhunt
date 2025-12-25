import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { CategoryForm } from '@/components/forms/CategoryForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import api from '@/lib/api';
import type { Category } from '@/types/category';

const CategoriesEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    navigate('/products/categories');
  };

  const handleCategoryUpdated = (updatedCategory: any) => {
    toast({
      title: "Category Updated Successfully! ✅",
      description: (
        <div>
          <p>"{updatedCategory.name}" updated successfully!</p>
        </div>
      ),
    });

    // Navigate back to categories list
    setTimeout(() => {
      navigate('/products/categories');
    }, 1000);
  };

  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) {
        setError('Category ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await api.get(`/admin/categories/${id}`);
        setCategory(response.data);
      } catch (err: any) {
        console.error('Failed to fetch category:', err);
        setError(err.response?.data?.message || 'Failed to load category');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
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
                Back to Categories
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Edit Category</h1>
                <p className="text-sm text-gray-600">Loading category details...</p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 text-blue-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Loading category...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
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
                Back to Categories
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Edit Category</h1>
                <p className="text-sm text-gray-600">Error loading category</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-900 font-medium">Error: {error}</p>
              <Button
                onClick={() => navigate('/products/categories')}
                className="mt-4"
                variant="outline"
              >
                Back to Categories
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
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
              Back to Categories
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Edit Category</h1>
              <p className="text-sm text-gray-600">Update category information and settings</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Edit className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-600">Editing: {category?.name}</span>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Category Information</h2>
              <p className="text-sm text-gray-600 mt-1">
                Update the details below. Changes will be saved and applied immediately to all products in this category.
              </p>
            </div>

            <div className="p-6">
              <CategoryForm
                initialData={category}
                onClose={handleBack}
                onCategoryCreated={handleCategoryUpdated}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesEdit;