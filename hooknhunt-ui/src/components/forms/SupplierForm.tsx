// src/components/forms/SupplierForm.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { QRCodeUpload } from './QRCodeUpload';
import { toast } from '@/components/ui/use-toast';
import api from '@/lib/api';

// Validation Schema
const formSchema = z.object({
  name: z.string().min(2, { message: 'Contact person name must be at least 2 characters.' }),
  shop_name: z.string().optional(),
  email: z.string().email({ message: 'Invalid email address.' }).optional().or(z.literal('')),
  shop_url: z.string().url({ message: 'Invalid URL.' }).optional().or(z.literal('')),
  wechat_id: z.string().optional(),
  alipay_id: z.string().optional(),
  contact_info: z.string().optional(),
});

interface SupplierFormProps {
  initialData?: any;
  onClose: () => void;
}

export const SupplierForm: React.FC<SupplierFormProps> = ({ initialData, onClose }) => {
  const isEdit = !!initialData;
  const [wechatQrFile, setWechatQrFile] = useState<File | null>(null);
  const [alipayQrFile, setAlipayQrFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      shop_name: initialData?.shop_name || '',
      email: initialData?.email || '',
      shop_url: initialData?.shop_url || '',
      wechat_id: initialData?.wechat_id || '',
      alipay_id: initialData?.alipay_id || '',
      contact_info: initialData?.contact_info || '',
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log('🔍 Form values:', values);
      console.log('🖼️ QR Code files:', { wechatQrFile, alipayQrFile });

      const formData = new FormData();

      // Add form fields
      formData.append('name', values.name);
      if (values.shop_name) {
        formData.append('shop_name', values.shop_name);
      }
      if (values.email) {
        formData.append('email', values.email);
      }
      if (values.shop_url) {
        formData.append('shop_url', values.shop_url);
      }
      if (values.wechat_id) {
        formData.append('wechat_id', values.wechat_id);
      }
      if (values.alipay_id) {
        formData.append('alipay_id', values.alipay_id);
      }
      if (values.contact_info) {
        formData.append('contact_info', values.contact_info);
      }

      // Add QR code files if selected
      if (wechatQrFile) {
        formData.append('wechat_qr_file', wechatQrFile);
      }
      if (alipayQrFile) {
        formData.append('alipay_qr_file', alipayQrFile);
      }

      console.log('🔑 Authentication handled by axios interceptor');
      console.log('📡 Sending API request...');

      const response = isEdit
        ? await api.post(`/admin/suppliers/${initialData.id}?_method=PUT`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
        : await api.post('/admin/suppliers', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response data:', response.data);

      const result = response.data;
      console.log('✅ API Success:', result);

      toast({
        title: "Success",
        description: `Supplier ${isEdit ? 'updated' : 'created'} successfully!`
      });
      onClose();
    } catch (error: unknown) {
      console.error('❌ Form submission error:', error);

      let errorMessage = 'An unknown error occurred';

      if (error instanceof Error) {
        // Handle specific axios error response
        if ('response' in error) {
          const axiosError = error as any;

          if (axiosError.response?.status === 422) {
            // Laravel validation error
            const errorData = axiosError.response.data;

            if (errorData?.errors?.wechat_qr_file) {
              const qrErrors = Array.isArray(errorData.errors.wechat_qr_file)
                ? errorData.errors.wechat_qr_file[0]
                : errorData.errors.wechat_qr_file;
              errorMessage = `WeChat QR Code validation failed: ${qrErrors}`;
            } else if (errorData?.errors?.alipay_qr_file) {
              const qrErrors = Array.isArray(errorData.errors.alipay_qr_file)
                ? errorData.errors.alipay_qr_file[0]
                : errorData.errors.alipay_qr_file;
              errorMessage = `Alipay QR Code validation failed: ${qrErrors}`;
            } else {
              errorMessage = errorData?.message || 'Validation failed';
            }
          } else if (axiosError.response?.status === 413) {
            errorMessage = 'QR Code file too large. Please upload files smaller than 100KB.';
          } else {
            errorMessage = axiosError.response?.data?.message || axiosError.message;
          }
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information Section */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person Name <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John Doe" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Shop Name Field */}
              <FormField
                control={form.control}
                name="shop_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shop Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., ABC Supplies" {...field} className="h-11" />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="e.g., contact@example.com" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Shop URL Field */}
              <FormField
                control={form.control}
                name="shop_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shop URL</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="e.g., https://www.example.com" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Payment Methods Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Payment Methods
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* WeChat Section */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="wechat_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WeChat ID</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., WeChatID123" {...field} className="h-11" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* WeChat QR Code Upload */}
                <QRCodeUpload
                  label="WeChat QR Code"
                  currentUrl={initialData?.wechat_qr_url}
                  onFileChange={setWechatQrFile}
                  onRemoveImage={() => {
                    if (initialData) {
                      // TODO: Call API to remove QR code
                    }
                  }}
                />
              </div>

              {/* Alipay Section */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="alipay_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alipay ID</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., AlipayID123" {...field} className="h-11" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Alipay QR Code Upload */}
                <QRCodeUpload
                  label="Alipay QR Code"
                  currentUrl={initialData?.alipay_qr_url}
                  onFileChange={setAlipayQrFile}
                  onRemoveImage={() => {
                    if (initialData) {
                      // TODO: Call API to remove QR code
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Additional Information
            </h3>
            <div className="max-w-2xl">
              <FormField
                control={form.control}
                name="contact_info"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Information</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional contact information, notes, or special requirements"
                        rows={4}
                        {...field}
                        className="resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
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
            disabled={isLoading}
            className="px-6 h-11"
          >
            {isLoading ? 'Saving...' : (initialData ? 'Save Changes' : 'Create Supplier')}
          </Button>
        </div>
      </form>
    </Form>
  );
};