// src/components/forms/CategoryForm.tsx
import { useEffect } from 'react';
import { useForm, type ControllerRenderProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Category } from '@/types/category';
import { useCategoryStore, type CategoryFormData } from '@/stores/categoryStore';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast'; // Assuming you have Shadcn toast

// Validation Schema
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  slug: z.string().min(2, { message: 'Slug must be at least 2 characters.' }),
  parent_id: z.union([z.number(), z.literal(null)]),
});

interface CategoryFormProps {
  initialData?: Category | null; // Pass category data for editing
  onClose: () => void; // Function to close the dialog
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, onClose }) => {
  const addCategory = useCategoryStore((state) => state.addCategory);
  const updateCategory = useCategoryStore((state) => state.updateCategory);
  const categories = useCategoryStore((state) => state.categories);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver<CategoryFormData, any, CategoryFormData>(formSchema), // Explicitly type the resolver
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      parent_id: initialData?.parent_id || null,
    },
  });

  // Helper to generate slug
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric characters except spaces and hyphens
      .trim() // Trim leading/trailing whitespace
      .replace(/\s+/g, '-'); // Replace spaces with hyphens
  };

  // Effect to generate slug from name
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'name' && value.name) {
        form.setValue('slug', generateSlug(value.name), {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, form.setValue]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: CategoryFormData) => {
    try {
      if (initialData) {
        await updateCategory(initialData.id, values);
        toast({ title: "Success", description: "Category updated!" });
      } else {
        await addCategory(values);
        toast({ title: "Success", description: "Category created!" });
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
          render={({ field }: { field: ControllerRenderProps<CategoryFormData, "name"> }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl><Input placeholder="e.g., T-Shirts" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Slug Field */}
        <FormField
          control={form.control} name="slug"
          render={({ field }: { field: ControllerRenderProps<CategoryFormData, "slug"> }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl><Input placeholder="e.g., t-shirts" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Parent Category Select */}
        <FormField
          control={form.control} name="parent_id"
          render={({ field }: { field: ControllerRenderProps<CategoryFormData, "parent_id"> }) => (
            <FormItem>
              <FormLabel>Parent Category (Optional)</FormLabel>
              <Select onValueChange={(value: string) => field.onChange(value === 'none' ? null : Number(value))} defaultValue={field.value?.toString() || 'none'}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select a parent" /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {categories
                    .filter(Boolean) // Filter out any undefined or null categories
                    .filter((cat: Category) => cat.id !== initialData?.id) // Prevent self-referencing
                    .map((cat: Category) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : (initialData ? 'Save Changes' : 'Create')}
          </Button>
        </div>
      </form>
    </Form>
  );
};
