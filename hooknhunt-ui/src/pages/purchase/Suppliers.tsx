// src/pages/purchase/Suppliers.tsx
import { useEffect, useState } from 'react';
import { useSupplierStore } from '@/stores/supplierStore';
import { useAuthStore } from '@/stores/authStore';
import type { Supplier } from '@/types/supplier';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { SupplierForm } from '@/components/forms/SupplierForm'; // Import SupplierForm

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'; // Dialog components
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'; // Dropdown components
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'; // Alert dialog components
import { MoreHorizontal } from 'lucide-react'; // Icon for dropdown
import { toast } from '@/components/ui/use-toast'; // Toast notifications

const Suppliers = () => {
  const { suppliers, isLoading, fetchSuppliers, deleteSupplier } = useSupplierStore((state) => state);
  const userRole = useAuthStore((state) => state.user?.role);

  // State for Add/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  // State for Delete Alert
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deletingSupplierId, setDeletingSupplierId] = useState<number | null>(null);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  // --- Modal Handlers ---
  const handleOpenModal = (supplier: Supplier | null) => {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSupplier(null);
    fetchSuppliers(); // Re-fetch suppliers after modal closes
  };

  // --- Delete Alert Handlers ---
  const openDeleteConfirm = (id: number) => {
    setDeletingSupplierId(id);
    setIsAlertOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (deletingSupplierId) {
      try {
        await deleteSupplier(deletingSupplierId);
        toast({ title: "Success", description: "Supplier deleted." });
      } catch (error: unknown) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        toast({ title: "Error", description: errorMessage, variant: "destructive" });
      } finally {
        setIsAlertOpen(false);
        setDeletingSupplierId(null);
      }
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <RoleGuard allowedRoles={['super_admin', 'admin', 'store_keeper']}>
          <Button onClick={() => handleOpenModal(null)}>
            Add New Supplier
          </Button>
        </RoleGuard>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingSupplier ? 'Edit Supplier' : 'Create New Supplier'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <SupplierForm 
              initialData={editingSupplier} 
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
              This action cannot be undone. This will permanently delete the supplier.
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

      {/* Supplier Table */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shop Name</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              {['super_admin', 'admin', 'store_keeper'].includes(userRole || '') && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.filter(Boolean).map((supplier: Supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>{supplier.shop_name ? supplier.shop_name : '--'}</TableCell><TableCell>{supplier.name ? supplier.name : '--'}</TableCell><TableCell>{supplier.email ? supplier.email : '--'}</TableCell><TableCell>{supplier.contact_info ? supplier.contact_info : '--'}</TableCell>
                {['super_admin', 'admin', 'store_keeper'].includes(userRole || '') && (
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenModal(supplier)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => openDeleteConfirm(supplier.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Suppliers;