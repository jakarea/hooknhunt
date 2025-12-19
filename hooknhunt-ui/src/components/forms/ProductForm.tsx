import { useState, useEffect, useRef } from 'react';
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
import { Package, Image, Loader2, Search, X, FolderOpen } from 'lucide-react';
import api from '@/lib/api';
import { ProductImage } from '@/components/ProductImage';
import { MediaGallery } from '@/components/media/MediaGallery';
import { MediaLibrary } from '@/components/media/MediaLibrary';
import { useCategoryStore } from '@/stores/categoryStore';

// MediaFile interface for MediaLibrary
interface MediaFile {
  id: number;
  filename: string;
  original_filename: string;
  mime_type: string;
  size_bytes: number;
  width?: number;
  height?: number;
  url: string;
  thumbnail_url?: string;
}

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
  category_ids?: string[];
  status: 'draft' | 'published';
  thumbnail?: File;
  base_thumbnail_url?: string;
  media_file_id?: number;
}

// Validation Schema
const formSchema = z.object({
  base_name: z.string().min(2, { message: 'Product name must be at least 2 characters.' }),
  description: z.string().optional(),
  category_ids: z.array(z.string()).optional(),
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
  const [selectedMediaFile, setSelectedMediaFile] = useState<MediaFile | null>(null);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.base_thumbnail_url || null);
  const [imageSource, setImageSource] = useState<'media' | null>(
    initialData?.base_thumbnail_url ? 'media' : null
  );
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  // Gallery images state
  const [galleryImages, setGalleryImages] = useState<Array<{ url: string; alt_text?: string }>>(
    initialData?.gallery_images?.map((url: string) => ({ url, alt_text: '' })) || []
  );

  // Get categories from store
  const { categories, isLoading: categoriesLoading, fetchCategories } = useCategoryStore();

  // Search state for categories
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      base_name: initialData?.base_name || '',
      description: initialData?.description || initialData?.meta_description || '',
      category_ids: [], // Initialize as empty array for multi-select
      status: initialData?.status || 'draft',
    },
  });

  const isLoading = form.formState.isSubmitting;

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
  ];

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter categories based on search term
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
  );

  // Get selected categories for display
  const selectedCategoryIds = form.watch('category_ids') || [];
  const selectedCategories = categories.filter(cat =>
    selectedCategoryIds.includes(cat.id.toString())
  );

  const handleMediaSelect = (mediaFile: any) => {
    setSelectedMediaFile(mediaFile);
    setImagePreview(mediaFile.url);
    setImageSource('media');
    setThumbnailError(null);
  };

  const clearThumbnail = () => {
    setSelectedMediaFile(null);
    setImagePreview(null);
    setImageSource(null);
    setThumbnailError(null);
  };

  // Handle gallery image changes from MediaGallery component
  const handleGalleryChange = (images: Array<{ url: string; alt_text?: string }>) => {
    setGalleryImages(images);
  };

  // Handle gallery selection from MediaLibrary
  const handleGallerySelect = (files: MediaFile[]) => {
    const newImages = files.map(file => ({
      url: file.url,
      alt_text: file.original_filename,
    }));

    const updatedImages = [...galleryImages, ...newImages];
    setGalleryImages(updatedImages);
    setShowGalleryModal(false);

    // Show success message
    if (newImages.length > 0) {
      toast({
        title: "Gallery Images Added",
        description: `${newImages.length} image${newImages.length > 1 ? 's' : ''} added to product gallery`,
      });
    }
  };

  // Remove gallery image
  const removeGalleryImage = (index: number) => {
    const updatedImages = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(updatedImages);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Clear any previous thumbnail errors when form is submitted
    if (thumbnailError) {
      setThumbnailError(null);
    }

    try {

      const formData = new FormData();

      // Add form fields
      formData.append('base_name', values.base_name);
      if (values.description) {
        formData.append('description', values.description);
      }
      if (values.category_ids && values.category_ids.length > 0) {
        values.category_ids.forEach((categoryId) => {
          formData.append('category_ids[]', categoryId);
        });
      }
      formData.append('status', values.status);

      // Add thumbnail if selected from media library
      if (selectedMediaFile) {
        formData.append('media_file_id', selectedMediaFile.id.toString());
      }

      // Add gallery images as JSON array of URLs
      if (galleryImages.length > 0) {
        const galleryUrls = galleryImages.map(img => img.url);
        formData.append('gallery_images', JSON.stringify(galleryUrls));
      }

      
      // Use PUT for edit, POST for create
      const response = isEdit
        ? await api.post(`/admin/products/${initialData!.id}?_method=PUT`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
        : await api.post('/admin/products', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

      const result = response.data;

      toast({
        title: "Success",
        description: `Product ${isEdit ? 'updated' : 'created'} successfully!`
      });

      // Call onProductCreated callback for new products
      if (!isEdit && onProductCreated) {
        // Handle different API response structures
        const createdProduct = result.data || result;

        if (createdProduct && createdProduct.id) {
          onProductCreated({
            ...createdProduct,
            suppliers: [], // Start with empty suppliers array
          });
        } else {
          console.error('❌ No product ID found in response');
          toast({
            title: "Error",
            description: "Product was created but unable to redirect. Please go to products list.",
            variant: "destructive"
          });
        }
      }

      // For edit mode, just close the form
      if (isEdit) {
        onClose();
      }
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        {/* Basic Information */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="base_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Product Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Wireless Bluetooth Headphones"
                      {...field}
                      className="h-9"
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your product..."
                      className="min-h-[80px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category_ids"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categories</FormLabel>
                    <div ref={categoryDropdownRef} className="relative">
                      <FormControl>
                        <div
                          className="flex h-auto min-h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                          onClick={() => !categoriesLoading && setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                        >
                          {categoriesLoading ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Loading categories...
                            </div>
                          ) : selectedCategories.length > 0 ? (
                            <div className="flex flex-wrap gap-1 w-full">
                              {selectedCategories.map((category) => (
                                <div
                                  key={category.id}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-md"
                                >
                                  {category.name}
                                  <X
                                    className="h-3 w-3 cursor-pointer hover:text-background"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const newIds = selectedCategoryIds.filter(id => id !== category.id.toString());
                                      field.onChange(newIds);
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center text-muted-foreground">
                              <Search className="h-4 w-4 mr-2" />
                              Select categories...
                            </div>
                          )}
                        </div>
                      </FormControl>

                      {isCategoryDropdownOpen && !categoriesLoading && (
                        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
                          <div className="p-2">
                            <div className="relative">
                              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Type to search..."
                                value={categorySearchTerm}
                                onChange={(e) => setCategorySearchTerm(e.target.value)}
                                className="pl-8 h-8"
                                autoFocus
                              />
                            </div>
                          </div>
                          <div className="max-h-48 overflow-y-auto p-1">
                            {filteredCategories.length === 0 ? (
                              <div className="py-2 px-2 text-sm text-muted-foreground">
                                {categorySearchTerm ? 'No categories found' : 'No categories available'}
                              </div>
                            ) : (
                              filteredCategories.map((category) => {
                                const isSelected = selectedCategoryIds.includes(category.id.toString());
                                return (
                                  <div
                                    key={category.id}
                                    className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
                                      isSelected ? 'bg-accent text-accent-foreground' : ''
                                    }`}
                                    onClick={() => {
                                      if (isSelected) {
                                        // Remove from selection
                                        const newIds = selectedCategoryIds.filter(id => id !== category.id.toString());
                                        field.onChange(newIds);
                                      } else {
                                        // Add to selection
                                        const newIds = [...selectedCategoryIds, category.id.toString()];
                                        field.onChange(newIds);
                                      }
                                    }}
                                  >
                                    <div className="flex items-center gap-2 flex-1">
                                      <div className={`flex h-4 w-4 items-center justify-center rounded border ${
                                        isSelected
                                          ? 'border-primary bg-primary text-primary-foreground'
                                          : 'border-input'
                                      }`}>
                                        {isSelected && (
                                          <svg
                                            className="h-3 w-3"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              fillRule="evenodd"
                                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                              clipRule="evenodd"
                                            />
                                          </svg>
                                        )}
                                      </div>
                                      <span className="truncate">{category.name}</span>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      )}
                    </div>
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
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
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
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Product Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Error Display */}
              {thumbnailError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-900">{thumbnailError}</p>
                </div>
              )}

              {/* Existing Image Display */}
              {isEdit && initialData?.base_thumbnail_url && !selectedMediaFile && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                  <ProductImage
                    src={initialData.base_thumbnail_url}
                    alt={initialData.base_name || 'Current image'}
                    size="md"
                    className="border"
                  />
                  <div className="flex-1 text-sm">
                    <p className="font-medium text-gray-900">Current Image</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Upload new image to replace
                    </p>
                  </div>
                </div>
              )}

              {/* Product Thumbnail (from Media Library) */}
              <div className="space-y-4">
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
                              alt="Product preview"
                              className="w-24 h-24 object-cover rounded-md border border-gray-200 group-hover:border-blue-400 transition-colors"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Image className="h-6 w-6 text-white" />
                            </div>
                          </div>
                          {/* Remove image button - not nested */}
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-lg z-10"
                            onClick={clearThumbnail}
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
                          <Image className="h-10 w-10 text-gray-400 group-hover:text-blue-500 transition-colors" />
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
                            ✓ Product thumbnail selected from media library
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={clearThumbnail}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 px-2 text-xs"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium text-gray-900">Product Thumbnail</p>
                          <p className="text-xs text-muted-foreground">Select a product thumbnail from your media library</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Media Library Modal */}
                {showMediaModal && (
                  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMediaModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[85vh] flex flex-col overflow-hidden">
                      {/* Header */}
                      <div className="flex items-center justify-between p-6 border-b bg-linear-to-r from-blue-50 to-indigo-50">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">Select Product Thumbnail</h2>
                          <p className="text-sm text-gray-600 mt-1">Choose an image from your media library for this product</p>
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
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Gallery (from Media Library) */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle className="text-lg font-semibold">Product Gallery</CardTitle>
                <CardDescription className="text-sm text-gray-600 mt-1">
                  Add images to showcase your product from different angles
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setShowGalleryModal(true)}
                  className="shadow-sm"
                  disabled={galleryImages.length >= 8}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Select Images
                </Button>
              </div>
            </div>

            {/* Gallery Status */}
            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">
                    {galleryImages.length} / 8 Images
                  </span>
                </div>
                {galleryImages.length > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                    <Package className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-900">
                      Gallery has {galleryImages.length} image{galleryImages.length > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-500">
                Select up to 8 images for your product gallery
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Gallery Preview */}
            <div className="space-y-4">
              {galleryImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {galleryImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url}
                        alt={image.alt_text || `Gallery image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeGalleryImage(index)}
                            className="h-8 px-2"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center py-12">
                  <div className="text-center">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Gallery Images</h3>
                    <p className="text-gray-500 mb-4">Add images to showcase your product from different angles</p>
                    <Button
                      onClick={() => setShowGalleryModal(true)}
                      variant="outline"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Add Gallery Images
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Gallery Images Modal */}
        {showGalleryModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowGalleryModal(false)} />
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[85vh] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b bg-linear-to-r from-blue-50 to-indigo-50">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Select Gallery Images</h2>
                  <p className="text-sm text-gray-600 mt-1">Choose images from your media library for the product gallery</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowGalleryModal(false)}
                  className="hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Gallery Selection Content */}
              <div className="flex-1 overflow-hidden">
                <div className="h-full px-6 py-4">
                  <div className="h-full border rounded-lg overflow-hidden">
                    <MediaLibrary
                      open={showGalleryModal}
                      onOpenChange={(isOpen) => {
                        setShowGalleryModal(isOpen);
                      }}
                      onSelect={handleGallerySelect}
                      multiple={true}
                      maxSelections={8 - galleryImages.length}
                      acceptedTypes={['image/*']}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            size="sm"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            size="sm"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {isEdit ? 'Saving...' : 'Creating...'}
              </div>
            ) : (
              isEdit ? 'Save Changes' : 'Create Product'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};