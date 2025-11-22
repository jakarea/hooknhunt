// src/pages/Categories.tsx
import { useEffect, useState } from 'react';
import { useCategoryStore } from '@/stores/categoryStore';
import { useAuthStore } from '@/stores/authStore'; // Import auth store
import type { Category } from '@/types/category';
import { CategoryForm } from '@/components/forms/CategoryForm';
import { RoleGuard } from '@/components/guards/RoleGuard'; // Assuming this exists from 7.2

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { MoreHorizontal } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Categories = () => {
  const { categories, isLoading, fetchCategories, deleteCategory } = useCategoryStore((state) => state);
  const userRole = useAuthStore((state) => state.user?.role); // Get user role
  
  // State for Add/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // State for Delete Alert
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // --- Modal Handlers ---
  const handleOpenModal = (category: Category | null) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    fetchCategories(); // Re-fetch categories after modal closes
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
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Categories</h1>
        <RoleGuard allowedRoles={['super_admin', 'admin']}>
          <Button onClick={() => handleOpenModal(null)}>
            Add New Category
          </Button>
        </RoleGuard>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <CategoryForm 
              initialData={editingCategory} 
              onClose={handleCloseModal} 
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Any child categories will become parent categories (orphaned).
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

      {/* Category Table */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Parent</TableHead>
              {/* Only show Actions column if user is admin */}
              {['super_admin', 'admin'].includes(userRole || '') && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.filter(Boolean).map((category: Category) => (
              <TableRow key={category.id}><TableCell>{category.name}</TableCell><TableCell>{category.slug}</TableCell><TableCell>{category.parent_id ? categories.filter(Boolean).find((c: Category) => c.id === category.parent_id)?.name : '—'}</TableCell>{['super_admin', 'admin'].includes(userRole || '') && (<TableCell className="text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => handleOpenModal(category)}>Edit</DropdownMenuItem><DropdownMenuItem onClick={() => openDeleteConfirm(category.id)}className="text-red-600 focus:text-red-600">Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell>)}</TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Categories;