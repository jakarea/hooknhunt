// src/pages/Categories.tsx
import { useEffect, useState } from 'react';
import { useCategoryStore } from '@/stores/categoryStore';
import { useAuthStore } from '@/stores/authStore';
import type { Category } from '@/types/category';
import { CategoryForm } from '@/components/forms/CategoryForm';
import { RoleGuard } from '@/components/guards/RoleGuard';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Image as ImageIcon, Folder } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Categories = () => {
  const { categories, isLoading, fetchCategories, deleteCategory } = useCategoryStore((state) => state);
  const userRole = useAuthStore((state) => state.user?.role);

  // State for form visibility
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // State for Delete Alert
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // --- Form Handlers ---
  const handleOpenCreateForm = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleOpenEditForm = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(null);
    fetchCategories(); // Refresh categories after form closes
  };

  // --- Delete Alert Handlers ---
  const openDeleteConfirm = (id: number) => {
    setDeletingCategoryId(id);
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingCategoryId) {
      try {
        await deleteCategory(deletingCategoryId);
        toast({ title: "Success", description: "Category deleted." });
      } catch (error: unknown) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        toast({ title: "Error", description: errorMessage, variant: "destructive" });
      } finally {
        setIsAlertOpen(false);
        setDeletingCategoryId(null);
      }
    }
  };

  const formatImageUrl = (url: string | null | undefined) => {
    if (!url) return null;
    // If it's already a full URL, return as is
    if (url.startsWith('http')) return url;
    // Otherwise, prepend the storage URL
    return `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/storage/${url}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
              <p className="text-gray-600 mt-1">Manage your product categories and hierarchy</p>
            </div>
            <RoleGuard allowedRoles={['super_admin', 'admin']}>
              <Button onClick={handleOpenCreateForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </RoleGuard>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {showForm ? (
          /* Form Card */
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Folder className="h-5 w-5" />
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </CardTitle>
              <CardDescription>
                {editingCategory
                  ? `Edit "${editingCategory.name}" category details`
                  : 'Create a new product category'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryForm
                initialData={editingCategory}
                onClose={handleCloseForm}
              />
            </CardContent>
          </Card>
        ) : null}

        {/* Categories Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Folder className="h-5 w-5" />
                All Categories ({categories.length})
              </span>
              {!showForm && ['super_admin', 'admin'].includes(userRole || '') && (
                <Button variant="outline" onClick={handleOpenCreateForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Quick Add
                </Button>
              )}
            </CardTitle>
            <CardDescription>
              Manage your product category hierarchy and images
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead>Status</TableHead>
                    {['super_admin', 'admin'].includes(userRole || '') && (
                      <TableHead className="text-right">Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.filter(Boolean).map((category: Category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="w-12 h-12">
                          {category.image_url ? (
                            <img
                              src={formatImageUrl(category.image_url)}
                              alt={category.name}
                              className="w-12 h-12 object-cover rounded-md border border-gray-200"
                              onError={(e) => {
                                // Fallback to placeholder on error
                                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"%3E%3Crect width="48" height="48" fill="%23f3f4f6"/%3E%3Cpath d="M24 16c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8z" fill="%239ca3af"/%3E%3C/svg%3E';
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50">
                              <ImageIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {category.name}
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {category.slug}
                        </code>
                      </TableCell>
                      <TableCell>
                        {category.parent_id
                          ? categories.filter(Boolean).find((c: Category) => c.id === category.parent_id)?.name || 'Unknown'
                          : '—'
                        }
                      </TableCell>
                      <TableCell>
                        <Badge variant={category.parent_id ? 'secondary' : 'default'}>
                          {category.parent_id ? 'Subcategory' : 'Main Category'}
                        </Badge>
                      </TableCell>
                      {['super_admin', 'admin'].includes(userRole || '') && (
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenEditForm(category)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => openDeleteConfirm(category.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {!isLoading && categories.length === 0 && (
              <div className="text-center py-12">
                <Folder className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
                <p className="text-gray-500 mb-6">Get started by creating your first category</p>
                <RoleGuard allowedRoles={['super_admin', 'admin']}>
                  <Button onClick={handleOpenCreateForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Category
                  </Button>
                </RoleGuard>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category.
              {categories.filter(Boolean).find((c: Category) => c.id === deletingCategoryId)?.parent_id === null &&
                " Any subcategories will become parent categories (orphaned)."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Categories;