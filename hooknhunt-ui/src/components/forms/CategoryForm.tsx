// src/components/forms/CategoryForm.tsx
import { useEffect, useState } from 'react';
import { useForm, type ControllerRenderProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Category } from '@/types/category';
import { useCategoryStore, type CategoryFormData } from '@/stores/categoryStore';

interface MediaFile {
  id: number;
  filename: string;
  original_filename: string;
  mime_type: string;
  size_bytes: number;
  url: string;
  thumbnail_url?: string;
}

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast'; // Assuming you have Shadcn toast
import { X } from 'lucide-react';
import { ImageSelector } from '@/components/ImageSelector';

// Validation Schema
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  slug: z.string().min(2, { message: 'Slug must be at least 2 characters.' }),
  parent_id: z.union([z.number(), z.literal(null)]),
});

interface CategoryFormProps {
  initialData?: Category | null; // Pass category data for editing
  onClose: () => void; // Function to close the dialog
  onCategoryCreated?: (category: any) => void; // Callback for successful creation/update
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, onClose, onCategoryCreated }) => {
  const addCategory = useCategoryStore((state) => state.addCategory);
  const updateCategory = useCategoryStore((state) => state.updateCategory);
  const categories = useCategoryStore((state) => state.categories);

  const [selectedMediaFile, setSelectedMediaFile] = useState<MediaFile | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(formSchema) as any,
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
      const formData: CategoryFormData = {
        ...values,
      };

      // Handle image submission - only media library selection
      if (imagePreview && selectedMediaFile && selectedMediaFile.id !== 0) {
        formData.media_file_id = selectedMediaFile.id;
      } else if (!imagePreview && initialData?.image_url) {
        // Remove existing image
        formData.remove_image = true;
      }

      let result;
      if (initialData) {
        result = await updateCategory(initialData.id, formData);
        toast({ title: "Success", description: "Category updated!" });
      } else {
        result = await addCategory(formData);
        toast({ title: "Success", description: "Category created!" });
      }

      // Call the callback if provided
      if (onCategoryCreated && result) {
        onCategoryCreated(result);
      } else {
        onClose();
      }
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
              <FormControl><Input placeholder="Fishing Rod" {...field} /></FormControl>
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
              <FormControl><Input placeholder="fishing-rod" {...field} /></FormControl>
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
        {/* Image Selection Field */}
        <ImageSelector
          label="Category Image (from Media Library)"
          currentUrl={imagePreview}
          onImageChange={(file, url) => {
            setImagePreview(url);
            // Also update selectedMediaFile for form submission
            if (url) {
              setSelectedMediaFile({
                id: 0, // Will be set by actual media selection
                filename: '',
                original_filename: '',
                mime_type: 'image/jpeg',
                size_bytes: 0,
                url: url,
                thumbnail_url: url
              });
            } else {
              setSelectedMediaFile(null);
            }
          }}
          onRemoveImage={() => {
            setImagePreview(null);
            setSelectedMediaFile(null);
          }}
          disabled={isLoading}
          allowUpload={false}
          infoText="Select an image from your media library for this category. Recommended: Square format, clear representation of the category."
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
