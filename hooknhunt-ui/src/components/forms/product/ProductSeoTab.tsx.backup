import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { FileText, Image, X, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import api from '@/lib/api';

interface Product {
  id: number;
  base_name: string;
  slug: string;
  meta_title?: string;
  meta_description?: string;
  base_thumbnail_url?: string | null;
  gallery_images?: string[] | null;
}

interface ProductSeoTabProps {
  product: Product;
  onSeoUpdated?: () => void;
}

const seoSchema = z.object({
  meta_title: z.string().min(1, 'Meta title is required').max(60, 'Meta title should be max 60 characters'),
  meta_description: z.string().min(1, 'Meta description is required').max(160, 'Meta description should be max 160 characters'),
});

export const ProductSeoTab: React.FC<ProductSeoTabProps> = ({ product, onSeoUpdated }) => {
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [existingGalleryImages, setExistingGalleryImages] = useState<string[]>(product.gallery_images || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const form = useForm<z.infer<typeof seoSchema>>({
    resolver: zodResolver(seoSchema),
    defaultValues: {
      meta_title: product.meta_title || product.base_name || '',
      meta_description: product.meta_description || '',
    },
  });

  const validateAndAddImages = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const maxSize = 500 * 1024; // 500KB

    const validFiles: File[] = [];
    const errors: string[] = [];

    fileArray.forEach(file => {
      if (!file.type.startsWith('image/')) {
        errors.push(`${file.name} is not an image`);
      } else if (file.size > maxSize) {
        errors.push(`${file.name} exceeds 500KB (${(file.size / 1024).toFixed(0)}KB)`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      toast({
        title: "Some files couldn't be added",
        description: errors.join(', '),
        variant: "destructive"
      });
    }

    if (validFiles.length > 0) {
      setGalleryImages(prev => [...prev, ...validFiles]);
      toast({
        title: "Images added",
        description: `${validFiles.length} image(s) ready to upload`,
      });
    }
  };

  const handleGalleryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddImages(e.target.files);
      e.target.value = ''; // Reset input
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddImages(e.dataTransfer.files);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: z.infer<typeof seoSchema>) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('meta_title', values.meta_title);
      formData.append('meta_description', values.meta_description);

      // Add existing gallery images that weren't removed
      if (existingGalleryImages.length > 0) {
        formData.append('existing_gallery_images', JSON.stringify(existingGalleryImages));
      }

      // Add new gallery images
      galleryImages.forEach((file, index) => {
        formData.append(`gallery_images[${index}]`, file);
      });

      const response = await api.post(`/admin/products/${product.id}?_method=PUT`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({
        title: "Success",
        description: "SEO information updated successfully!",
      });

      // Update existing gallery images from response
      if (response.data.gallery_images) {
        setExistingGalleryImages(response.data.gallery_images);
      }

      // Clear new gallery images
      setGalleryImages([]);

      if (onSeoUpdated) {
        onSeoUpdated();
      }
    } catch (error: any) {
      console.error('❌ Error updating SEO:', error);

      let errorMessage = 'Failed to update SEO information';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const metaTitleLength = form.watch('meta_title')?.length || 0;
  const metaDescLength = form.watch('meta_description')?.length || 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* SEO Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">SEO Metadata</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs">
                Search Engine Optimization
              </Badge>
            </div>
            <CardDescription>
              Improve your product's visibility in search engine results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="meta_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    <span>Meta Title <span className="text-red-500">*</span></span>
                    <Badge
                      variant={metaTitleLength > 60 ? 'destructive' : metaTitleLength > 50 ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {metaTitleLength}/60
                    </Badge>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Premium Wireless Headphones - Best Sound Quality"
                      {...field}
                      className="h-11"
                    />
                  </FormControl>
                  <FormDescription className="flex items-start gap-2">
                    <AlertCircle className="h-3 w-3 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs">This title appears in Google search results. Keep it under 60 characters for best display.</span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="meta_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    <span>Meta Description <span className="text-red-500">*</span></span>
                    <Badge
                      variant={metaDescLength > 160 ? 'destructive' : metaDescLength > 150 ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {metaDescLength}/160
                    </Badge>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write a compelling description that will appear in search results..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="flex items-start gap-2">
                    <AlertCircle className="h-3 w-3 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs">Describe your product clearly and include relevant keywords. Keep it under 160 characters.</span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Gallery Images */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Product Gallery</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs">
                {existingGalleryImages.length + galleryImages.length} total
              </Badge>
            </div>
            <CardDescription>
              Upload additional product images to showcase different angles and details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 transition-all ${
                isDragging
                  ? 'border-primary bg-primary/5 scale-[1.02]'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center text-center">
                <div className={`rounded-full p-4 mb-4 transition-colors ${
                  isDragging ? 'bg-primary/10' : 'bg-gray-100'
                }`}>
                  <Upload className={`h-8 w-8 transition-colors ${
                    isDragging ? 'text-primary' : 'text-gray-400'
                  }`} />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {isDragging ? 'Drop images here' : 'Upload Gallery Images'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Drag and drop images or click to browse
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary" className="text-xs">WEBP</Badge>
                  <Badge variant="secondary" className="text-xs">PNG</Badge>
                  <Badge variant="secondary" className="text-xs">JPG</Badge>
                  <span className="text-xs text-gray-500">• Max 500KB each</span>
                </div>
                <label htmlFor="gallery-upload">
                  <Button type="button" variant="outline" size="sm" asChild>
                    <span className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Files
                    </span>
                  </Button>
                </label>
                <input
                  id="gallery-upload"
                  type="file"
                  className="hidden"
                  accept="image/webp,image/png,image/jpeg,image/jpg"
                  multiple
                  onChange={handleGalleryImageChange}
                />
              </div>
            </div>

            {/* Existing Gallery Images */}
            {existingGalleryImages.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-gray-900">Current Gallery</h4>
                  <Badge variant="outline" className="text-xs">
                    {existingGalleryImages.length} saved
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingGalleryImages.map((imageUrl, index) => (
                    <div key={index} className="relative group rounded-lg overflow-hidden border-2 border-gray-200 hover:border-primary transition-colors">
                      <div className="aspect-square">
                        <img
                          src={imageUrl}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                        title="Remove image"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-xs font-medium">Saved #{index + 1}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Gallery Images Preview */}
            {galleryImages.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-gray-900">Ready to Upload</h4>
                  <Badge className="text-xs bg-green-500">
                    {galleryImages.length} new
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {galleryImages.map((file, index) => (
                    <div key={index} className="relative group rounded-lg overflow-hidden border-2 border-green-300 hover:border-green-500 transition-colors">
                      <div className="aspect-square">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`New ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                        title="Remove image"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <div className="flex items-center justify-between text-white text-xs">
                          <span className="font-medium truncate">{file.name}</span>
                          <Badge variant="secondary" className="text-xs ml-2">
                            {(file.size / 1024).toFixed(0)}KB
                          </Badge>
                        </div>
                      </div>
                      <div className="absolute top-2 left-2">
                        <Badge className="text-xs bg-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          New
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {existingGalleryImages.length === 0 && galleryImages.length === 0 && (
              <div className="text-center py-6">
                <Image className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No gallery images yet</p>
                <p className="text-xs text-gray-400 mt-1">Upload images to create a product gallery</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">Save your changes</p>
              <p className="text-xs text-gray-500">
                {galleryImages.length > 0
                  ? `${galleryImages.length} new image(s) will be uploaded`
                  : 'Update SEO metadata for better search visibility'}
              </p>
            </div>
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="px-8"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Saving...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Save SEO & Gallery
              </div>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
