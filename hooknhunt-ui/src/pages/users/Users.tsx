import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/authStore';
import { RoleGuard } from '@/components/guards/RoleGuard';
import type { User } from '@/types/user';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { MoreHorizontal, Plus, Edit, Trash2, ShieldCheck, ShieldX } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

const Users = () => {
  const { users, isLoading, fetchUsers, deleteUser, verifyPhone, unverifyPhone, pagination } = useUserStore((state) => state);
  const userRole = useAuthStore((state) => state.user?.role);
  const navigate = useNavigate();

  // State for Delete Alert
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // --- Delete Alert Handlers ---
  const openDeleteConfirm = (user: User) => {
    setDeletingUser(user);
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingUser) {
      try {
        await deleteUser(deletingUser.id);
        toast({ title: "Success", description: "User deleted successfully." });
      } catch (error: unknown) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
        toast({ title: "Error", description: errorMessage, variant: "destructive" });
      } finally {
        setIsAlertOpen(false);
        setDeletingUser(null);
      }
    }
  };

  const handleEditUser = (user: User) => {
    navigate(`/users/${user.id}/edit`);
  };

  const handleCreateUser = () => {
    navigate('/users/create');
  };

  const handleVerifyUser = async (user: User) => {
    try {
      await verifyPhone(user.id);
      toast({
        title: "Success",
        description: `${user.name} has been verified successfully.`
      });
    } catch (error: unknown) {
      const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleUnverifyUser = async (user: User) => {
    try {
      await unverifyPhone(user.id);
      toast({
        title: "Success",
        description: `${user.name} has been unverified successfully.`
      });
    } catch (error: unknown) {
      const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'super_admin': return 'destructive';
      case 'admin': return 'default';
      case 'seller': return 'secondary';
      case 'store_keeper': return 'outline';
      case 'marketer': return 'default';
      default: return 'secondary';
    }
  };

  const formatRole = (role: string) => {
    return role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Users</h1>
              <p className="text-gray-600 mt-1">Manage system users and their roles</p>
            </div>
            <RoleGuard allowedRoles={['super_admin', 'admin']}>
              <Button onClick={handleCreateUser}>
                <Plus className="h-4 w-4 mr-2" />
                Add New User
              </Button>
            </RoleGuard>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    {['super_admin', 'admin'].includes(userRole || '') && (
                      <TableHead className="text-right">Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone_number}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {formatRole(user.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={user.phone_verified_at ? 'default' : 'secondary'}
                            className={user.phone_verified_at ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}
                          >
                            {user.phone_verified_at ? 'Verified' : 'Not Verified'}
                          </Badge>
                        </div>
                      </TableCell>
                      {['super_admin', 'admin'].includes(userRole || '') && (
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>

                              {/* Verification Options */}
                              {user.phone_verified_at ? (
                                <DropdownMenuItem
                                  onClick={() => handleUnverifyUser(user)}
                                  className="text-amber-600 focus:text-amber-600"
                                  disabled={user.role === 'super_admin'}
                                >
                                  <ShieldX className="h-4 w-4 mr-2" />
                                  Unverify User
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => handleVerifyUser(user)}
                                  className="text-green-600 focus:text-green-600"
                                >
                                  <ShieldCheck className="h-4 w-4 mr-2" />
                                  Verify User
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                onClick={() => openDeleteConfirm(user)}
                                className="text-red-600 focus:text-red-600"
                                disabled={user.role === 'super_admin' || user.id === Number(useAuthStore.getState().user?.id || '0')}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
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

            {!isLoading && users.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  No users found. Click "Add New User" to create the first user.
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.last_page > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {pagination.from} to {pagination.to} of {pagination.total} results
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchUsers(Math.max(1, pagination.current_page - 1))}
                    disabled={pagination.current_page <= 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-700">
                    Page {pagination.current_page} of {pagination.last_page}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchUsers(Math.min(pagination.last_page, pagination.current_page + 1))}
                    disabled={pagination.current_page >= pagination.last_page}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user "{deletingUser?.name}" and remove all their access to the system.
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

export default Users;