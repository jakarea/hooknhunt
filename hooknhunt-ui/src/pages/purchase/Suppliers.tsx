// src/pages/purchase/Suppliers.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { RoleGuard } from '@/components/guards/RoleGuard';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Plus, QrCode, Eye, Edit, Trash2, User, Building, Mail, Phone } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { SupplierImage } from '@/components/SupplierImage';
import api from '@/lib/api';

const Suppliers = () => {
  const userRole = useAuthStore((state) => state.user?.role);
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for Delete Alert
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deletingSupplierId, setDeletingSupplierId] = useState<number | null>(null);

  // State for QR Code Preview
  const [qrPreview, setQrPreview] = useState<{ type: 'wechat' | 'alipay'; url: string } | null>(null);

  // Fetch suppliers from API
  const fetchSuppliers = async () => {
    try {
      setIsLoading(true);
      console.log('📡 Fetching suppliers from API...');
      const response = await api.get('/admin/suppliers');
      console.log('✅ Suppliers fetched:', response.data);

      // Handle Laravel pagination response
      const suppliersData = response.data.data || response.data;
      setSuppliers(Array.isArray(suppliersData) ? suppliersData : []);
    } catch (error: any) {
      console.error('❌ Error fetching suppliers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch suppliers. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // --- Navigation Handlers ---
  const handleCreateSupplier = () => {
    navigate('/dashboard/suppliers/create');
  };

  const handleEditSupplier = (supplier: Supplier) => {
    navigate(`/dashboard/suppliers/${supplier.id}/edit`);
  };

  // --- Delete Alert Handlers ---
  const openDeleteConfirm = (id: number) => {
    setDeletingSupplierId(id);
    setIsAlertOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (deletingSupplierId) {
      try {
        await api.delete(`/admin/suppliers/${deletingSupplierId}`);
        toast({ title: "Success", description: "Supplier deleted." });
        fetchSuppliers(); // Refresh the list
      } catch (error: unknown) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        toast({ title: "Error", description: errorMessage, variant: "destructive" });
      } finally {
        setIsAlertOpen(false);
        setDeletingSupplierId(null);
      }
    }
  };

  // --- QR Code Handlers ---
  const handleDeleteWechatQr = async (supplierId: number) => {
    try {
      await api.delete(`/admin/suppliers/${supplierId}/wechat-qr`);
      toast({ title: "Success", description: "WeChat QR code removed." });
      fetchSuppliers(); // Refresh the list
    } catch (error: unknown) {
      const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    }
  };

  const handleDeleteAlipayQr = async (supplierId: number) => {
    try {
      await api.delete(`/admin/suppliers/${supplierId}/alipay-qr`);
      toast({ title: "Success", description: "Alipay QR code removed." });
      fetchSuppliers(); // Refresh the list
    } catch (error: unknown) {
      const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Suppliers</h1>
              <p className="text-gray-600 mt-1">Manage your supplier contacts and payment information</p>
            </div>
            <RoleGuard allowedRoles={['super_admin', 'admin', 'store_keeper']}>
              <Button onClick={handleCreateSupplier}>
                <Plus className="h-4 w-4 mr-2" />
                Add Supplier
              </Button>
            </RoleGuard>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Card>
          <CardContent className="pt-6">

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
              <TableHead>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Shop Name
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Contact Person
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  WeChat
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  Alipay
                </div>
              </TableHead>
              {['super_admin', 'admin', 'store_keeper'].includes(userRole || '') && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.filter(Boolean).map((supplier: any) => (
              <TableRow key={supplier.id}>
                <TableCell className="font-medium">
                  {supplier.shop_name || '--'}
                </TableCell>
                <TableCell>{supplier.name || '--'}</TableCell>
                <TableCell>{supplier.email || '--'}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{supplier.wechat_id || '--'}</span>
                    {supplier.wechat_qr_url && (
                      <div className="flex items-center space-x-1">
                        <div
                          className="cursor-pointer hover:scale-110 transition-transform"
                          onClick={() => setQrPreview({ type: 'wechat', url: supplier.wechat_qr_url! })}
                        >
                          <SupplierImage
                            src={supplier.wechat_qr_url}
                            alt="WeChat QR"
                            size="sm"
                            className="w-8 h-8"
                          />
                        </div>
                        {['super_admin', 'admin', 'store_keeper'].includes(userRole || '') && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => setQrPreview({ type: 'wechat', url: supplier.wechat_qr_url! })}
                              >
                                View QR Code
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteWechatQr(supplier.id)}
                                className="text-red-600 focus:text-red-600"
                              >
                                Remove QR Code
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{supplier.alipay_id || '--'}</span>
                    {supplier.alipay_qr_url && (
                      <div className="flex items-center space-x-1">
                        <div
                          className="cursor-pointer hover:scale-110 transition-transform"
                          onClick={() => setQrPreview({ type: 'alipay', url: supplier.alipay_qr_url! })}
                        >
                          <SupplierImage
                            src={supplier.alipay_qr_url}
                            alt="Alipay QR"
                            size="sm"
                            className="w-8 h-8"
                          />
                        </div>
                        {['super_admin', 'admin', 'store_keeper'].includes(userRole || '') && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => setQrPreview({ type: 'alipay', url: supplier.alipay_qr_url! })}
                              >
                                View QR Code
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteAlipayQr(supplier.id)}
                                className="text-red-600 focus:text-red-600"
                              >
                                Remove QR Code
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    )}
                  </div>
                </TableCell>
                {['super_admin', 'admin', 'store_keeper'].includes(userRole || '') && (
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditSupplier(supplier)}>
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

      {/* QR Code Preview Dialog */}
      <Dialog open={!!qrPreview} onOpenChange={() => setQrPreview(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {qrPreview?.type === 'wechat' ? 'WeChat' : 'Alipay'} QR Code
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center p-4">
            {qrPreview && (
              <SupplierImage
                src={qrPreview.url}
                alt={`${qrPreview.type} QR Code`}
                size="lg"
                className="max-w-full h-auto rounded-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Suppliers;