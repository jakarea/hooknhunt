import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { User, CreateUserData, UpdateUserData } from '@/types/user';
import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/authStore';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { Mail, Phone, MessageSquare, Shield, Lock, Key, User as UserIcon } from 'lucide-react';

// Validation Schema
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  phone_number: z.string().min(10, { message: 'Phone number must be at least 10 characters.' }),
  whatsapp_number: z.string().optional(),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }).optional(),
  password_confirmation: z.string().optional(),
  role: z.enum(['super_admin', 'admin', 'seller', 'store_keeper', 'marketer'], {
    message: 'Please select a valid role.',
  }),
}).refine((data, ctx) => {
  if (data.password && data.password !== data.password_confirmation) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords don't match",
      path: ['password_confirmation'],
    });
    return false;
  }
  return true;
});

interface UserFormProps {
  initialData?: User | null;
  onClose: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ initialData, onClose }) => {
  const addUser = useUserStore((state) => state.addUser);
  const updateUser = useUserStore((state) => state.updateUser);
  const currentUserRole = useAuthStore((state) => state.user?.role);

  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const isEdit = !!initialData;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone_number: initialData?.phone_number || '',
      whatsapp_number: initialData?.whatsapp_number || '',
      password: '',
      password_confirmation: '',
      role: initialData?.role || undefined,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const availableRoles = [
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'admin', label: 'Admin' },
    { value: 'seller', label: 'Seller' },
    { value: 'store_keeper', label: 'Store Keeper' },
    { value: 'marketer', label: 'Marketer' },
  ];

  // Filter roles based on current user role
  const filteredRoles = availableRoles.filter(role => {
    if (currentUserRole === 'super_admin') {
      return true; // Super admin can assign all roles
    }
    return role.value !== 'super_admin'; // Admin cannot assign super admin role
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData: CreateUserData | UpdateUserData = {
        name: values.name,
        email: values.email,
        phone_number: values.phone_number,
        whatsapp_number: values.whatsapp_number || undefined,
        role: values.role as any,
      };

      // Only include password if it's provided
      if (values.password) {
        (formData as CreateUserData).password = values.password;
        (formData as CreateUserData).password_confirmation = values.password_confirmation;
      }

      if (initialData) {
        await updateUser(initialData.id, formData);
        toast({ title: "Success", description: "User updated successfully!" });
      } else {
        await addUser(formData as CreateUserData);
        toast({ title: "Success", description: "User created successfully!" });
      }
      onClose();
    } catch (error: unknown) {
      const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    }
  };

  const watchPassword = form.watch('password');
  const watchPasswordConfirmation = form.watch('password_confirmation');

  // Check if passwords match when both are provided
  useEffect(() => {
    if (watchPassword && watchPasswordConfirmation) {
      if (watchPassword !== watchPasswordConfirmation) {
        setPasswordsMatch(false);
      } else {
        setPasswordsMatch(true);
      }
    } else {
      setPasswordsMatch(true);
    }
  }, [watchPassword, watchPasswordConfirmation]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Header Card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <UserIcon className="h-6 w-6 text-primary" />
              {isEdit ? 'Edit User' : 'Create New User'}
            </CardTitle>
            <CardDescription>
              {isEdit
                ? 'Update user information and permissions'
                : 'Add a new user to the system with appropriate access rights'
              }
            </CardDescription>
          </CardHeader>
        </Card>

        {/* User Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserIcon className="h-5 w-5 text-muted-foreground" />
              User Information
            </CardTitle>
            <CardDescription>
              Basic information about the user
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                      Full Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., John Doe"
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      Email Address <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="e.g., john@example.com"
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Phone className="h-5 w-5 text-muted-foreground" />
              Contact Information
            </CardTitle>
            <CardDescription>
              Phone and WhatsApp contact details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone Number Field */}
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      Phone Number <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 01712345678"
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* WhatsApp Number Field */}
              <FormField
                control={form.control}
                name="whatsapp_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      WhatsApp Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 01712345678"
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security & Access Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-muted-foreground" />
              Security & Access
            </CardTitle>
            <CardDescription>
              User role and authentication settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Role Selection */}
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      User Role <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredRoles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            <div className="flex items-center gap-2">
                              <span>{role.label}</span>
                              {role.value === 'super_admin' && (
                                <Badge variant="destructive" className="text-xs">Super Admin</Badge>
                              )}
                              {role.value === 'admin' && (
                                <Badge variant="default" className="text-xs">Admin</Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      Password {!isEdit && <span className="text-red-500">*</span>}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={isEdit ? "Leave empty to keep current password" : "Enter password"}
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Confirmation Field */}
              {(watchPassword || !isEdit) && (
                <FormField
                  control={form.control}
                  name="password_confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Key className="h-4 w-4 text-muted-foreground" />
                        Confirm Password {!isEdit && <span className="text-red-500">*</span>}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm password"
                          {...field}
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                      {!passwordsMatch && (
                        <div className="flex items-center gap-2 text-sm text-red-600 mt-1">
                          <Key className="h-4 w-4" />
                          Passwords do not match
                        </div>
                      )}
                    </FormItem>
                  )}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="px-6 h-11"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !passwordsMatch}
                className="px-6 h-11"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {isEdit ? 'Saving...' : 'Creating...'}
                  </div>
                ) : (
                  isEdit ? 'Save Changes' : 'Create User'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};