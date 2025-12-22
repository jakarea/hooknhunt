// src/pages/Categories.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategoryStore } from '@/stores/categoryStore';
import { useAuthStore } from '@/stores/authStore';
import type { Category } from '@/types/category';
import { RoleGuard } from '@/components/guards/RoleGuard';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2, Image as ImageIcon, Folder, Search, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Categories = () => {
  const navigate = useNavigate();
  const { categories, isLoading, fetchCategories, deleteCategory } = useCategoryStore((state) => state);
  const userRole = useAuthStore((state) => state.user?.role);

  // State for Delete Alert
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null);

  // State for Search
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms debounce delay

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  // Filter categories based on search term
  const filteredCategories = categories.filter((category: Category) => {
    if (!debouncedSearchTerm) return true;

    const searchLower = debouncedSearchTerm.toLowerCase();
    return (
      category.name.toLowerCase().includes(searchLower) ||
      category.slug.toLowerCase().includes(searchLower) ||
      (category.parent_id
        ? categories.filter(Boolean).find((c: Category) => c.id === category.parent_id)?.name?.toLowerCase().includes(searchLower)
        : false
      )
    );
  });

  // --- Navigation Handlers ---
  const handleOpenCreatePage = () => {
    navigate('/products/categories/create');
  };

  const handleOpenEditPage = (category: Category) => {
    navigate(`/products/categories/${category.id}/edit`);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Categories Table */}
        <Card>
          <CardHeader className="pb-4">
          {/* Main Header Section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Folder className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {debouncedSearchTerm
                    ? `Search Results (${filteredCategories.length})`
                    : `All Categories (${categories.length})`
                  }
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 mt-0.5">
                  {debouncedSearchTerm
                    ? `Categories matching "${debouncedSearchTerm}"`
                    : 'Manage your product category hierarchy and images'
                  }
                </CardDescription>
              </div>
            </div>

            <RoleGuard allowedRoles={['super_admin', 'admin']}>
              <Button onClick={handleOpenCreatePage} className="shadow-sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </RoleGuard>
          </div>

          {/* Search and Results Section */}
          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search categories by name or slug..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10 h-10 w-80 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {debouncedSearchTerm && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
                  <Search className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    {filteredCategories.length} {filteredCategories.length === 1 ? 'result' : 'results'}
                  </span>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">
                  {categories.length} Total
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">
                  {categories.filter(c => c && !c.parent_id).length} Main Categories
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-600">
                  {categories.filter(c => c && c.parent_id).length} Subcategories
                </span>
              </div>
            </div>
          </div>
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
                  {filteredCategories.filter(Boolean).map((category: Category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="w-12 h-12">
                          {category.image_url ? (
                            <img
                              src={category.image_url}
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
                              onClick={() => handleOpenEditPage(category)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                            className=" text-white"
                              variant="destructive"
                              size="sm"
                              onClick={() => openDeleteConfirm(category.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1 text-white" />
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

            {!isLoading && filteredCategories.length === 0 && (
              <div className="text-center py-12">
                <Folder className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {debouncedSearchTerm ? 'No categories found' : 'No categories found'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {debouncedSearchTerm
                    ? `No categories match your search for "${debouncedSearchTerm}"`
                    : 'Get started by creating your first category'
                  }
                </p>
                {debouncedSearchTerm ? (
                  <Button onClick={() => setSearchTerm('')} variant="outline">
                    <X className="h-4 w-4 mr-2" />
                    Clear Search
                  </Button>
                ) : (
                  <RoleGuard allowedRoles={['super_admin', 'admin']}>
                    <Button onClick={handleOpenCreatePage}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Category
                    </Button>
                  </RoleGuard>
                )}
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