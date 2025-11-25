import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { Package, Image, Upload } from 'lucide-react';
import api from '@/lib/api';
import { ProductImage } from '@/components/ProductImage';

// Inline type definition to avoid import issues
interface Product {
  id: number;
  base_name: string;
  slug: string;
  status: 'draft' | 'published';
  meta_title?: string;
  meta_description?: string;
  description?: string; // Legacy field for backward compatibility
  category_id?: number; // Legacy field for backward compatibility
  base_thumbnail_url?: string | null;
  gallery_images?: string[] | null;
  created_at: string;
  updated_at: string;
}

interface ProductFormData {
  base_name: string;
  description?: string;
  category_id?: string;
  status: 'draft' | 'published';
  thumbnail?: File;
  base_thumbnail_url?: string;
}

// Validation Schema
const formSchema = z.object({
  base_name: z.string().min(2, { message: 'Product name must be at least 2 characters.' }),
  description: z.string().optional(),
  category_id: z.string().optional(),
  status: z.enum(['draft', 'published'], {
    message: 'Please select a valid status.',
  }),
});

interface ProductFormProps {
  initialData?: Product;
  onClose: () => void;
  onProductCreated?: (product: any) => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, onClose, onProductCreated }) => {
  const isEdit = !!initialData;
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      base_name: initialData?.base_name || '',
      description: initialData?.description || initialData?.meta_description || '',
      category_id: initialData?.category_id?.toString() || '',
      status: initialData?.status || 'draft',
    },
  });

  const isLoading = form.formState.isSubmitting;

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
  ];

  const mockCategories = [
    { value: '1', label: 'Electronics' },
    { value: '2', label: 'Clothing' },
    { value: '3', label: 'Accessories' },
    { value: '4', label: 'Home & Garden' },
    { value: '5', label: 'Sports' },
  ];

  const validateImageFile = (file: File): boolean => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setThumbnailError('Please select a valid image file (PNG, JPG, GIF)');
      return false;
    }

    // Validate file size (300KB = 300 * 1024 bytes)
    const maxSizeKB = 300;
    const maxSizeBytes = maxSizeKB * 1024;

    if (file.size > maxSizeBytes) {
      setThumbnailError(`Image size must be less than ${maxSizeKB}KB. Current size: ${(file.size / 1024).toFixed(2)}KB`);
      return false;
    }

    setThumbnailError(null);
    return true;
  };

  const handleThumbnailChange = (file: File) => {
    if (validateImageFile(file)) {
      setThumbnail(file);
    } else {
      setThumbnail(null);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleThumbnailChange(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleThumbnailChange(e.dataTransfer.files[0]);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Clear any previous thumbnail errors when form is submitted
    if (thumbnailError) {
      setThumbnailError(null);
    }

    try {
      console.log('🔍 Form values:', values);
      console.log('🖼️ Thumbnail file:', thumbnail);

      const formData = new FormData();

      // Add form fields
      formData.append('base_name', values.base_name);
      if (values.description) {
        formData.append('description', values.description);
      }
      if (values.category_id) {
        formData.append('category_id', values.category_id);
      }
      formData.append('status', values.status);

      // Add thumbnail if selected
      if (thumbnail) {
        formData.append('thumbnail', thumbnail);
      }

      console.log('🔑 Authentication handled by axios interceptor');

      console.log('📡 Sending API request...');
      console.log('📦 FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value);
      }

      const response = await api.post('/admin/products', formData, {
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
        description: `Product ${isEdit ? 'updated' : 'created'} successfully!`
      });

      // Call onProductCreated callback for new products with suppliers data
      if (!isEdit && onProductCreated && result.data) {
        onProductCreated({
          ...result.data,
          suppliers: [], // Start with empty suppliers array
        });
      }

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

            if (errorData?.errors?.thumbnail) {
              const thumbnailErrors = Array.isArray(errorData.errors.thumbnail)
                ? errorData.errors.thumbnail[0]
                : errorData.errors.thumbnail;
              setThumbnailError(thumbnailErrors);
              errorMessage = `Image validation failed: ${thumbnailErrors}`;
            } else {
              errorMessage = errorData?.message || 'Validation failed';
            }
          } else if (axiosError.response?.status === 413) {
            setThumbnailError('Image file too large. Please upload an image smaller than 300KB.');
            errorMessage = 'Image file too large';
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Header Card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Package className="h-6 w-6 text-primary" />
              {isEdit ? 'Edit Product' : 'Create New Product'}
            </CardTitle>
            <CardDescription>
              {isEdit
                ? 'Update product information and pricing'
                : 'Add a new product to your catalog'
              }
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5 text-muted-foreground" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Essential product details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="base_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    Product Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Wireless Bluetooth Headphones"
                      {...field}
                      className="h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your product..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category <span className="text-red-500">*</span></FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status <span className="text-red-500">*</span></FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <span>{option.label}</span>
                              {option.value === 'published' && (
                                <Badge className="text-xs">Live</Badge>
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
          </CardContent>
        </Card>

        {/* Product Image */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Image className="h-5 w-5 text-muted-foreground" />
              Product Image
            </CardTitle>
            <CardDescription>
              Upload a product thumbnail image
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Image Requirements Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Image Requirements:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Maximum file size: <span className="font-semibold">300KB</span></li>
                  <li>• Recommended dimensions: <span className="font-semibold">800x600px</span> (4:3 ratio)</li>
                  <li>• Supported formats: <span className="font-semibold">PNG, JPG, JPEG, GIF</span></li>
                  <li>• Optimal quality: <span className="font-semibold">Medium compression</span></li>
                </ul>
              </div>

              {/* Error Display */}
              {thumbnailError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 mb-1">Image Error:</h4>
                  <p className="text-sm text-red-800">{thumbnailError}</p>
                </div>
              )}

              {/* Existing Image Display */}
              {isEdit && initialData?.base_thumbnail_url && !thumbnail && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-3">Current Product Image</h4>
                  <div className="flex items-center gap-4">
                    <ProductImage
                      src={initialData.base_thumbnail_url}
                      alt={initialData.base_name || 'Current product image'}
                      size="lg"
                      className="border-2 border-gray-200"
                    />
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">Existing image</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Upload a new image to replace this one
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Area */}
              <div className="flex items-center justify-center w-full">
                <label
                  className={`flex flex-col items-center justify-center w-full h-64 border-2 ${
                    thumbnailError
                      ? 'border-red-300 bg-red-50 hover:bg-red-100'
                      : thumbnail
                      ? 'border-green-300 bg-green-50'
                      : isDragging
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                  } border-dashed rounded-lg cursor-pointer transition-colors`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {thumbnail ? (
                      <div className="space-y-4">
                        <div className="relative">
                          <img
                            src={URL.createObjectURL(thumbnail)}
                            alt="Thumbnail preview"
                            className="h-32 w-32 object-cover rounded-lg border-2 border-green-200"
                          />
                          <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                            <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-green-800">{thumbnail.name}</p>
                          <p className="text-xs text-green-600">
                            {(thumbnail.size / 1024).toFixed(2)} KB • {thumbnail.type}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setThumbnail(null);
                            setThumbnailError(null);
                          }}
                          className="mt-2 px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        >
                          Remove Image
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className={`h-10 w-10 mb-3 ${
                          isDragging
                            ? 'text-blue-500 animate-bounce'
                            : thumbnailError
                            ? 'text-red-400'
                            : 'text-gray-400'
                        }`} />
                        <p className={`mb-2 text-sm ${
                          isDragging ? 'text-blue-600 font-semibold' : 'text-gray-500'
                        }`}>
                          {isDragging ? (
                            <>Drop your image here</>
                          ) : (
                            <>
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, JPEG, GIF up to 300KB</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/png,image/jpeg,image/jpg,image/gif"
                    onChange={handleFileInputChange}
                  />
                </label>
              </div>
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
                disabled={isLoading}
                className="px-6 h-11"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {isEdit ? 'Saving...' : 'Creating...'}
                  </div>
                ) : (
                  isEdit ? 'Save Changes' : 'Create Product'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};