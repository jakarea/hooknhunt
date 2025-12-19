import { useNavigate } from 'react-router-dom';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { CategoryForm } from '@/components/forms/CategoryForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const CategoriesCreate = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/products/categories');
  };

  const handleCategoryCreated = (createdCategory: any) => {
    toast({
      title: "Category Created Successfully! 🎉",
      description: (
        <div>
          <p>"{createdCategory.name}" created successfully!</p>
        </div>
      ),
      duration: 3000,
    });

    // Navigate back to categories list
    setTimeout(() => {
      navigate('/products/categories');
    }, 1000);
  };

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
              <h1 className="text-xl font-semibold text-gray-900">Create New Category</h1>
              <p className="text-sm text-gray-600">Add a new product category to organize your products</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">New Category</span>
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
                Fill in the details below to create a new category. Categories help organize products for better navigation and filtering.
              </p>
            </div>

            <div className="p-6">
              <CategoryForm
                onClose={handleBack}
                onCategoryCreated={handleCategoryCreated}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesCreate;