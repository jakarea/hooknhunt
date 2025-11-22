// src/components/forms/SupplierForm.tsx
import { useForm, type ControllerRenderProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Supplier } from '@/types/supplier';
import { useSupplierStore, type SupplierFormData } from '@/stores/supplierStore';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // Assuming you have Shadcn Textarea
import { toast } from '@/components/ui/use-toast'; // Assuming you have Shadcn toast

// Validation Schema
const formSchema = z.object({
  name: z.string().min(2, { message: 'Contact person name must be at least 2 characters.' }),
  shop_name: z.string().nullable().optional(),
  email: z.string().email({ message: 'Invalid email address.' }).nullable().optional(),
  shop_url: z.string().url({ message: 'Invalid URL.' }).nullable().optional(),
  wechat_id: z.string().nullable().optional(),
  alipay_id: z.string().nullable().optional(),
  contact_info: z.string().nullable().optional(),
});

interface SupplierFormProps {
  initialData?: Supplier | null; // Pass supplier data for editing
  onClose: () => void; // Function to close the dialog
}

export const SupplierForm: React.FC<SupplierFormProps> = ({ initialData, onClose }) => {
  const addSupplier = useSupplierStore((state) => state.addSupplier);
  const updateSupplier = useSupplierStore((state) => state.updateSupplier);

  const form = useForm<SupplierFormData>({
    resolver: zodResolver<SupplierFormData, any, SupplierFormData>(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      shop_name: initialData?.shop_name || null,
      email: initialData?.email || null,
      shop_url: initialData?.shop_url || null,
      wechat_id: initialData?.wechat_id || null,
      alipay_id: initialData?.alipay_id || null,
      contact_info: initialData?.contact_info || null,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: SupplierFormData) => {
    try {
      if (initialData) {
        await updateSupplier(initialData.id, values);
        toast({ title: "Success", description: "Supplier updated!" });
      } else {
        await addSupplier(values);
        toast({ title: "Success", description: "Supplier created!" });
      }
      onClose();
    } catch (error: unknown) {
      const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred';
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <FormField
          control={form.control} name="name"
          render={({ field }: { field: ControllerRenderProps<SupplierFormData, "name"> }) => (
            <FormItem>
              <FormLabel>Contact Person Name</FormLabel>
              <FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Shop Name Field */}
        <FormField
          control={form.control} name="shop_name"
          render={({ field }: { field: ControllerRenderProps<SupplierFormData, "shop_name"> }) => (
            <FormItem>
              <FormLabel>Shop Name (Optional)</FormLabel>
              <FormControl><Input placeholder="e.g., ABC Supplies" {...field} value={field.value || ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Email Field */}
        <FormField
          control={form.control} name="email"
          render={({ field }: { field: ControllerRenderProps<SupplierFormData, "email"> }) => (
            <FormItem>
              <FormLabel>Email (Optional)</FormLabel>
              <FormControl><Input type="email" placeholder="e.g., contact@example.com" {...field} value={field.value || ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Shop URL Field */}
        <FormField
          control={form.control} name="shop_url"
          render={({ field }: { field: ControllerRenderProps<SupplierFormData, "shop_url"> }) => (
            <FormItem>
              <FormLabel>Shop URL (Optional)</FormLabel>
              <FormControl><Input type="url" placeholder="e.g., https://www.example.com" {...field} value={field.value || ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* WeChat ID Field */}
        <FormField
          control={form.control} name="wechat_id"
          render={({ field }: { field: ControllerRenderProps<SupplierFormData, "wechat_id"> }) => (
            <FormItem>
              <FormLabel>WeChat ID (Optional)</FormLabel>
              <FormControl><Input placeholder="e.g., WeChatID123" {...field} value={field.value || ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Alipay ID Field */}
        <FormField
          control={form.control} name="alipay_id"
          render={({ field }: { field: ControllerRenderProps<SupplierFormData, "alipay_id"> }) => (
            <FormItem>
              <FormLabel>Alipay ID (Optional)</FormLabel>
              <FormControl><Input placeholder="e.g., AlipayID123" {...field} value={field.value || ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Contact Info Field */}
        <FormField
          control={form.control} name="contact_info"
          render={({ field }: { field: ControllerRenderProps<SupplierFormData, "contact_info"> }) => (
            <FormItem>
              <FormLabel>Contact Info (Optional)</FormLabel>
              <FormControl><Textarea placeholder="Any additional contact information" {...field} value={field.value || ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : (initialData ? 'Save Changes' : 'Create Supplier')}
          </Button>
        </div>
      </form>
    </Form>
  );
};