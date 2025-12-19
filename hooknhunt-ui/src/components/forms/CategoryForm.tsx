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
import { X, Image as ImageIcon, Trash2 } from 'lucide-react';
import { MediaLibrary } from '@/components/media/MediaLibrary';

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
  const [imageSource, setImageSource] = useState<'media' | null>(
    initialData?.image_url ? 'media' : null
  );
  const [showMediaModal, setShowMediaModal] = useState(false);

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

  const removeImage = () => {
    setSelectedMediaFile(null);
    setImagePreview(null);
    setImageSource(null);
  };

  const handleMediaSelect = (files: any[]) => {
    const mediaFile = files[0]; // Take first file for single selection
    console.log('🖼️ CategoryForm: Media file selected:', mediaFile);
    console.log('🔗 CategoryForm: Media file URL:', mediaFile.url);

    setSelectedMediaFile(mediaFile);
    setImagePreview(mediaFile.url);
    setImageSource('media');

    console.log('✅ CategoryForm: Image preview updated to:', mediaFile.url);
    setShowMediaModal(false);
  };

  const onSubmit = async (values: CategoryFormData) => {
    try {
      const formData: CategoryFormData = {
        ...values,
      };

      // Handle image submission - only media library selection
      if (imageSource === 'media' && selectedMediaFile) {
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
        <div className="space-y-4">
          <label className="text-sm font-medium">Category Image (from Media Library)</label>

          <div className="flex items-start space-x-4">
            <div className="relative">
              {/* Thumbnail/placeholder container */}
              <div className="relative group">
                {imagePreview ? (
                  <>
                    {/* Image preview with click to open modal */}
                    <div
                      onClick={() => setShowMediaModal(true)}
                      className="cursor-pointer"
                    >
                      <img
                        src={imagePreview}
                        alt="Category preview"
                        className="w-24 h-24 object-cover rounded-md border border-gray-200 group-hover:border-blue-400 transition-colors"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ImageIcon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    {/* Remove image button - not nested */}
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-lg z-10"
                      onClick={removeImage}
                      title="Remove image"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </>
                ) : (
                  /* Empty placeholder with click to open modal */
                  <div
                    onClick={() => setShowMediaModal(true)}
                    className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50 hover:border-blue-400 hover:bg-blue-50 transition-colors group cursor-pointer"
                  >
                    <ImageIcon className="h-10 w-10 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs text-white bg-black bg-opacity-60 px-2 py-1 rounded">Click to select</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="text-sm">
                {imagePreview ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="text-sm text-green-700">
                      ✓ Image selected from media library
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeImage}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-700 font-medium mb-1">📷 Select Category Image</p>
                    <p className="text-xs text-blue-600">Click the image placeholder to open your media library</p>
                  </div>
                )}

                <div className="text-xs text-gray-500 space-y-1 mt-3">
                  <p>• Click the thumbnail to select an image from your media library</p>
                  <p>• Select an image in the modal and click "Select This Image"</p>
                  <p>• Click the X button or "Remove" to clear the selection</p>
                </div>
              </div>

            </div>
          </div>

          {/* Enhanced Media Library Modal */}
          {showMediaModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMediaModal(false)} />
              <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[85vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b bg-linear-to-r from-blue-50 to-indigo-50">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Select Category Image</h2>
                    <p className="text-sm text-gray-600 mt-1">Choose an image from your media library for this category</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMediaModal(false)}
                    className="hover:bg-gray-100"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Selected Image Info */}
                {selectedMediaFile && (
                  <div className="px-6 py-4 bg-blue-50 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={selectedMediaFile.thumbnail_url || selectedMediaFile.url}
                          alt={selectedMediaFile.original_filename}
                          className="w-16 h-16 object-cover rounded-lg border-2 border-blue-200"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{selectedMediaFile.original_filename}</p>
                          <p className="text-sm text-gray-600">
                            {Math.round(selectedMediaFile.size_bytes / 1024)} KB • {selectedMediaFile.mime_type}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          Selected
                        </Badge>
                        <Button
                          size="sm"
                          onClick={() => {
                            handleMediaSelect([selectedMediaFile]);
                            setShowMediaModal(false);
                          }}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Use This Image
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Media Library Content */}
                <div className="flex-1 overflow-hidden">
                  <div className="h-full px-6 py-4">
                    <div className="h-full border rounded-lg overflow-hidden">
                      <MediaLibrary
                        open={showMediaModal}
                        onOpenChange={(isOpen) => {
                          setShowMediaModal(isOpen);
                        }}
                        onSelect={(files) => {
                          if (files.length > 0) {
                            setSelectedMediaFile(files[0]);
                            setImagePreview(files[0].url);
                            setImageSource('media');
                            setShowMediaModal(false);
                          }
                        }}
                        maxSelections={1}
                        acceptedTypes={['image/*']}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-4 border-t bg-gray-50">
                  <div className="text-sm text-gray-600">
                    {selectedMediaFile ?
                      <span className="text-green-600">✓ 1 image selected</span> :
                      <span>Click an image to select it</span>
                    }
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setShowMediaModal(false)}>
                      Cancel
                    </Button>
                    <Button
                      disabled={!selectedMediaFile}
                      onClick={() => {
                        handleMediaSelect([selectedMediaFile]);
                        setShowMediaModal(false);
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Confirm Selection
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
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
