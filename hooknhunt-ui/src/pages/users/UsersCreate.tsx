import { useNavigate } from 'react-router-dom';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { UserForm } from '@/components/forms/UserForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User } from 'lucide-react';

const UsersCreate = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/users');
  };

  const handleSuccess = () => {
    navigate('/users');
  };

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
                <h1 className="text-3xl font-bold text-gray-900">Create New User</h1>
                <p className="text-gray-600 mt-1">Add a new system user with appropriate role and permissions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <RoleGuard allowedRoles={['super_admin', 'admin']}>
        <div className="container mx-auto px-6 py-8 max-w-4xl">
          <div className="space-y-6">
            {/* Instructions Card */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">Quick Guide</h3>
                    <p className="text-blue-800 text-sm">
                      Fill in the required information below. Fields marked with <span className="text-red-500">*</span> are required.
                      The user will be able to login immediately after creation. Make sure to set a strong password and assign appropriate role permissions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Form */}
            <UserForm onClose={handleSuccess} />
          </div>
        </div>
      </RoleGuard>
    </div>
  );
};

export default UsersCreate;