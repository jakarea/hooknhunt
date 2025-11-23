import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { UserForm } from '@/components/forms/UserForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, User as UserIcon, Mail, Phone, Shield } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import type { User } from '@/types/user';

const UsersEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchUser, isLoading } = useUserStore((state) => state);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await fetchUser(parseInt(id!));
        setUser(userData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load user",
          variant: "destructive",
        });
        navigate('/dashboard/users');
      }
    };

    if (id) {
      loadUser();
    }
  }, [id, fetchUser, navigate]);

  const handleBack = () => {
    navigate('/dashboard/users');
  };

  const handleSuccess = () => {
    navigate('/dashboard/users');
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center">
              <Button variant="ghost" onClick={handleBack} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Users
              </Button>
              <div>
                <Skeleton className="h-9 w-48 mb-2" />
                <Skeleton className="h-5 w-64" />
              </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="container mx-auto px-6 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="mb-8">
              <Skeleton className="h-7 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>

            {/* Form Skeleton */}
            <div className="space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <Skeleton className="h-6 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Skeleton className="h-11 w-full" />
                  <Skeleton className="h-11 w-full" />
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="space-y-6">
                <Skeleton className="h-6 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Skeleton className="h-11 w-full" />
                  <Skeleton className="h-11 w-full" />
                </div>
              </div>

              {/* Role Section */}
              <div className="space-y-6">
                <Skeleton className="h-6 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Skeleton className="h-11 w-full" />
                  <Skeleton className="h-11 w-full" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
                <Skeleton className="h-11 w-20" />
                <Skeleton className="h-11 w-32" />
              </div>
            </div>
          </div>
        </div>
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
                Back to Users
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
                <p className="text-gray-600 mt-1">
                  Updating <span className="font-semibold text-primary">{user.name}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <RoleGuard allowedRoles={['super_admin', 'admin']}>
        <div className="container mx-auto px-6 py-8 max-w-4xl">
          <div className="space-y-6">
            {/* User Info Card */}
            <Card className="bg-red-50 border-red-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="bg-red-100 p-3 rounded-full">
                    <UserIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-900 mb-1">Editing User Profile</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-red-800">
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {user.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {user.phone_number}
                      </span>
                      <span className="flex items-center gap-1">
                        <Shield className="h-4 w-4" />
                        {user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Form */}
            <UserForm initialData={user} onClose={handleSuccess} />
          </div>
        </div>
      </RoleGuard>
    </div>
  );
};

export default UsersEdit;